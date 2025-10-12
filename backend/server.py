from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import asyncio
import json
from collections.abc import AsyncGenerator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'nzuritv-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    role: str = "editor"  # admin or editor
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "editor"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Channel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: Optional[str] = None
    default_embed_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChannelCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    default_embed_url: Optional[str] = None

class Program(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    channel_id: str
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None
    content_type: str = "video"  # video, live, playlist
    youtube_link: Optional[str] = None
    uploaded_media_path: Optional[str] = None
    duration_seconds: Optional[int] = None
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgramCreate(BaseModel):
    channel_id: str
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None
    content_type: str = "video"
    youtube_link: Optional[str] = None
    duration_seconds: Optional[int] = None

class ScheduleItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    program_id: str
    channel_id: str
    start_time: datetime
    end_time: datetime
    is_live: bool = False
    status: str = "scheduled"  # scheduled, running, completed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ScheduleItemCreate(BaseModel):
    program_id: str
    channel_id: str
    start_time: datetime
    end_time: datetime
    is_live: bool = False

class ScheduleItemUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None

class Ticker(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    priority: int = 5
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TickerCreate(BaseModel):
    text: str
    priority: int = 5
    active: bool = True

class Ad(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    image_url: str
    click_url: Optional[str] = None
    priority: int = 10
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdCreate(BaseModel):
    title: str
    image_url: str
    click_url: Optional[str] = None
    priority: int = 10

class NowPlaying(BaseModel):
    schedule_item: Optional[ScheduleItem] = None
    program: Optional[Program] = None
    next_program: Optional[Program] = None
    next_start_time: Optional[datetime] = None

# ============ AUTH HELPERS ============

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user_doc is None:
            raise HTTPException(status_code=401, detail="User not found")
        if isinstance(user_doc.get('created_at'), str):
            user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
        return User(**user_doc)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        name=user_data.name,
        email=user_data.email,
        role=user_data.role
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password_hash'] = get_password_hash(user_data.password)
    
    await db.users.insert_one(doc)
    return user

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user_doc = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_data.password, user_doc.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

# ============ CHANNEL ROUTES ============

@api_router.post("/channels", response_model=Channel)
async def create_channel(channel_data: ChannelCreate):
    channel = Channel(**channel_data.model_dump())
    doc = channel.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.channels.insert_one(doc)
    return channel

@api_router.get("/channels", response_model=List[Channel])
async def get_channels():
    channels = await db.channels.find({}, {"_id": 0}).to_list(100)
    for ch in channels:
        if isinstance(ch.get('created_at'), str):
            ch['created_at'] = datetime.fromisoformat(ch['created_at'])
    return channels

@api_router.get("/channels/{channel_id}", response_model=Channel)
async def get_channel(channel_id: str):
    channel = await db.channels.find_one({"id": channel_id}, {"_id": 0})
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    if isinstance(channel.get('created_at'), str):
        channel['created_at'] = datetime.fromisoformat(channel['created_at'])
    return Channel(**channel)

# ============ PROGRAM ROUTES ============

@api_router.post("/programs", response_model=Program)
async def create_program(program_data: ProgramCreate, user_id: str = "system"):
    program = Program(**program_data.model_dump(), created_by=user_id)
    doc = program.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.programs.insert_one(doc)
    return program

@api_router.get("/programs", response_model=List[Program])
async def get_programs(channel_id: Optional[str] = None):
    query = {"channel_id": channel_id} if channel_id else {}
    programs = await db.programs.find(query, {"_id": 0}).to_list(1000)
    for prog in programs:
        if isinstance(prog.get('created_at'), str):
            prog['created_at'] = datetime.fromisoformat(prog['created_at'])
    return programs

@api_router.get("/programs/{program_id}", response_model=Program)
async def get_program(program_id: str):
    program = await db.programs.find_one({"id": program_id}, {"_id": 0})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    if isinstance(program.get('created_at'), str):
        program['created_at'] = datetime.fromisoformat(program['created_at'])
    return Program(**program)

@api_router.delete("/programs/{program_id}")
async def delete_program(program_id: str):
    result = await db.programs.delete_one({"id": program_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    return {"message": "Program deleted"}

# ============ SCHEDULE ROUTES ============

@api_router.post("/schedule", response_model=ScheduleItem)
async def create_schedule_item(schedule_data: ScheduleItemCreate):
    # Check for conflicts
    conflicts = await db.schedule_items.find({
        "channel_id": schedule_data.channel_id,
        "status": {"$in": ["scheduled", "running"]},
        "$or": [
            {
                "start_time": {"$lt": schedule_data.end_time.isoformat()},
                "end_time": {"$gt": schedule_data.start_time.isoformat()}
            }
        ]
    }).to_list(10)
    
    if conflicts:
        raise HTTPException(status_code=409, detail="Schedule conflict detected")
    
    schedule_item = ScheduleItem(**schedule_data.model_dump())
    doc = schedule_item.model_dump()
    doc['start_time'] = doc['start_time'].isoformat()
    doc['end_time'] = doc['end_time'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.schedule_items.insert_one(doc)
    return schedule_item

@api_router.get("/schedule", response_model=List[ScheduleItem])
async def get_schedule(channel_id: Optional[str] = None, date: Optional[str] = None):
    query = {}
    if channel_id:
        query["channel_id"] = channel_id
    if date:
        start_date = datetime.fromisoformat(date)
        end_date = start_date + timedelta(days=1)
        query["start_time"] = {
            "$gte": start_date.isoformat(),
            "$lt": end_date.isoformat()
        }
    
    items = await db.schedule_items.find(query, {"_id": 0}).sort("start_time", 1).to_list(1000)
    for item in items:
        if isinstance(item.get('start_time'), str):
            item['start_time'] = datetime.fromisoformat(item['start_time'])
        if isinstance(item.get('end_time'), str):
            item['end_time'] = datetime.fromisoformat(item['end_time'])
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
        if isinstance(item.get('updated_at'), str):
            item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return items

@api_router.put("/schedule/{schedule_id}", response_model=ScheduleItem)
async def update_schedule_item(schedule_id: str, update_data: ScheduleItemUpdate):
    existing = await db.schedule_items.find_one({"id": schedule_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        if 'start_time' in update_dict:
            update_dict['start_time'] = update_dict['start_time'].isoformat()
        if 'end_time' in update_dict:
            update_dict['end_time'] = update_dict['end_time'].isoformat()
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.schedule_items.update_one({"id": schedule_id}, {"$set": update_dict})
    
    updated = await db.schedule_items.find_one({"id": schedule_id}, {"_id": 0})
    if isinstance(updated.get('start_time'), str):
        updated['start_time'] = datetime.fromisoformat(updated['start_time'])
    if isinstance(updated.get('end_time'), str):
        updated['end_time'] = datetime.fromisoformat(updated['end_time'])
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return ScheduleItem(**updated)

@api_router.delete("/schedule/{schedule_id}")
async def delete_schedule_item(schedule_id: str):
    result = await db.schedule_items.delete_one({"id": schedule_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    return {"message": "Schedule item deleted"}

@api_router.get("/schedule/now-playing", response_model=NowPlaying)
async def get_now_playing(channel_id: str):
    now = datetime.now(timezone.utc).isoformat()
    
    # Find currently running item
    current = await db.schedule_items.find_one({
        "channel_id": channel_id,
        "start_time": {"$lte": now},
        "end_time": {"$gt": now},
        "status": {"$in": ["scheduled", "running"]}
    }, {"_id": 0})
    
    result = NowPlaying()
    
    if current:
        if isinstance(current.get('start_time'), str):
            current['start_time'] = datetime.fromisoformat(current['start_time'])
        if isinstance(current.get('end_time'), str):
            current['end_time'] = datetime.fromisoformat(current['end_time'])
        if isinstance(current.get('created_at'), str):
            current['created_at'] = datetime.fromisoformat(current['created_at'])
        if isinstance(current.get('updated_at'), str):
            current['updated_at'] = datetime.fromisoformat(current['updated_at'])
        result.schedule_item = ScheduleItem(**current)
        
        # Get program details
        program = await db.programs.find_one({"id": current['program_id']}, {"_id": 0})
        if program:
            if isinstance(program.get('created_at'), str):
                program['created_at'] = datetime.fromisoformat(program['created_at'])
            result.program = Program(**program)
    
    # Find next program
    next_item = await db.schedule_items.find_one({
        "channel_id": channel_id,
        "start_time": {"$gt": now},
        "status": "scheduled"
    }, {"_id": 0}, sort=[("start_time", 1)])
    
    if next_item:
        if isinstance(next_item.get('start_time'), str):
            next_item['start_time'] = datetime.fromisoformat(next_item['start_time'])
        result.next_start_time = next_item['start_time']
        
        next_program = await db.programs.find_one({"id": next_item['program_id']}, {"_id": 0})
        if next_program:
            if isinstance(next_program.get('created_at'), str):
                next_program['created_at'] = datetime.fromisoformat(next_program['created_at'])
            result.next_program = Program(**next_program)
    
    return result

# ============ TICKER ROUTES ============

@api_router.post("/ticker", response_model=Ticker)
async def create_ticker(ticker_data: TickerCreate):
    ticker = Ticker(**ticker_data.model_dump())
    doc = ticker.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.tickers.insert_one(doc)
    return ticker

@api_router.get("/ticker", response_model=List[Ticker])
async def get_tickers(active_only: bool = True):
    query = {"active": True} if active_only else {}
    tickers = await db.tickers.find(query, {"_id": 0}).sort("priority", 1).to_list(100)
    for ticker in tickers:
        if isinstance(ticker.get('created_at'), str):
            ticker['created_at'] = datetime.fromisoformat(ticker['created_at'])
    return tickers

@api_router.put("/ticker/{ticker_id}", response_model=Ticker)
async def update_ticker(ticker_id: str, ticker_data: TickerCreate):
    update_dict = ticker_data.model_dump()
    result = await db.tickers.update_one({"id": ticker_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticker not found")
    
    updated = await db.tickers.find_one({"id": ticker_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return Ticker(**updated)

@api_router.delete("/ticker/{ticker_id}")
async def delete_ticker(ticker_id: str):
    result = await db.tickers.delete_one({"id": ticker_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ticker not found")
    return {"message": "Ticker deleted"}

# ============ AD ROUTES ============

@api_router.post("/ads", response_model=Ad)
async def create_ad(ad_data: AdCreate):
    ad = Ad(**ad_data.model_dump())
    doc = ad.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.ads.insert_one(doc)
    return ad

@api_router.get("/ads", response_model=List[Ad])
async def get_ads(active_only: bool = True):
    query = {"active": True} if active_only else {}
    ads = await db.ads.find(query, {"_id": 0}).sort("priority", 1).to_list(100)
    for ad in ads:
        if isinstance(ad.get('created_at'), str):
            ad['created_at'] = datetime.fromisoformat(ad['created_at'])
    return ads

# ============ SCHEDULER ENGINE ============

async def scheduler_engine():
    """Background task that updates schedule status"""
    while True:
        try:
            now = datetime.now(timezone.utc).isoformat()
            
            # Mark items as running
            await db.schedule_items.update_many(
                {
                    "start_time": {"$lte": now},
                    "end_time": {"$gt": now},
                    "status": "scheduled"
                },
                {"$set": {"status": "running", "updated_at": now}}
            )
            
            # Mark items as completed
            await db.schedule_items.update_many(
                {
                    "end_time": {"$lte": now},
                    "status": "running"
                },
                {"$set": {"status": "completed", "updated_at": now}}
            )
            
        except Exception as e:
            logger.error(f"Scheduler engine error: {e}")
        
        await asyncio.sleep(10)  # Check every 10 seconds

# ============ SERVER-SENT EVENTS FOR REAL-TIME UPDATES ============

async def event_generator(channel_id: str) -> AsyncGenerator[str, None]:
    """Generate server-sent events for now-playing updates"""
    last_program_id = None
    
    while True:
        try:
            now = datetime.now(timezone.utc).isoformat()
            
            current = await db.schedule_items.find_one({
                "channel_id": channel_id,
                "start_time": {"$lte": now},
                "end_time": {"$gt": now},
                "status": {"$in": ["scheduled", "running"]}
            }, {"_id": 0})
            
            if current:
                current_program_id = current.get('program_id')
                if current_program_id != last_program_id:
                    program = await db.programs.find_one({"id": current_program_id}, {"_id": 0})
                    if program:
                        data = {
                            "type": "now_playing",
                            "program": program,
                            "schedule": current
                        }
                        yield f"data: {json.dumps(data, default=str)}\n\n"
                        last_program_id = current_program_id
            
            # Get ticker updates
            tickers = await db.tickers.find({"active": True}, {"_id": 0}).sort("priority", 1).to_list(50)
            if tickers:
                ticker_data = {"type": "ticker", "items": tickers}
                yield f"data: {json.dumps(ticker_data, default=str)}\n\n"
            
        except Exception as e:
            logger.error(f"Event generator error: {e}")
        
        await asyncio.sleep(5)

@api_router.get("/stream/updates")
async def stream_updates(channel_id: str):
    """Server-sent events endpoint for real-time updates"""
    return StreamingResponse(
        event_generator(channel_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

# ============ STARTUP EVENTS ============

@app.on_event("startup")
async def startup_event():
    # Start scheduler engine
    asyncio.create_task(scheduler_engine())
    logger.info("Scheduler engine started")
    
    # Create default channel if none exists
    channel_count = await db.channels.count_documents({})
    if channel_count == 0:
        default_channel = Channel(
            name="Nzuri TV",
            slug="nzuri-tv",
            description="Local and international news covering economy, sports, mining, green energy, music and entertainment",
            default_embed_url="https://www.youtube.com/embed/live_stream?channel=UCYfdidRxbB8Qhf0Nx7ioOYw"
        )
        doc = default_channel.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.channels.insert_one(doc)
        logger.info("Default channel created")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
