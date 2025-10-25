from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import feedparser

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MySQL connection
MYSQL_URL = os.environ.get('MYSQL_URL', 'mysql+pymysql://root:password@localhost:3306/nzuri_tv')
engine = create_engine(MYSQL_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'nzuritv-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# ============ DATABASE MODELS ============

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="editor")
    created_at = Column(DateTime, default=datetime.utcnow)

class ChannelDB(Base):
    __tablename__ = "channels"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True)
    description = Column(Text)
    default_embed_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProgramDB(Base):
    __tablename__ = "programs"
    
    id = Column(String(36), primary_key=True)
    channel_id = Column(String(36), ForeignKey('channels.id'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    tags = Column(String(255))
    content_type = Column(String(50), default="video")
    youtube_link = Column(String(1024))
    uploaded_media_path = Column(String(1024))
    duration_seconds = Column(Integer)
    created_by = Column(String(36))
    created_at = Column(DateTime, default=datetime.utcnow)

class ScheduleItemDB(Base):
    __tablename__ = "schedule_items"
    
    id = Column(String(36), primary_key=True)
    program_id = Column(String(36), ForeignKey('programs.id'))
    channel_id = Column(String(36), ForeignKey('channels.id'))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_live = Column(Boolean, default=False)
    status = Column(String(50), default="scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TickerDB(Base):
    __tablename__ = "tickers"
    
    id = Column(String(36), primary_key=True)
    text = Column(Text, nullable=False)
    priority = Column(Integer, default=5)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AdDB(Base):
    __tablename__ = "ads"
    
    id = Column(String(36), primary_key=True)
    title = Column(String(255))
    image_url = Column(String(1024))
    click_url = Column(String(1024))
    priority = Column(Integer, default=10)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# ============ PYDANTIC MODELS ============

class User(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str = "editor"
    created_at: datetime

    class Config:
        from_attributes = True

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
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    default_embed_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ChannelCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    default_embed_url: Optional[str] = None

class Program(BaseModel):
    id: str
    channel_id: str
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None
    content_type: str = "video"
    youtube_link: Optional[str] = None
    uploaded_media_path: Optional[str] = None
    duration_seconds: Optional[int] = None
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProgramCreate(BaseModel):
    channel_id: str
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None
    content_type: str = "video"
    youtube_link: Optional[str] = None
    duration_seconds: Optional[int] = None

class ScheduleItem(BaseModel):
    id: str
    program_id: str
    channel_id: str
    start_time: datetime
    end_time: datetime
    is_live: bool = False
    status: str = "scheduled"
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

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
    id: str
    text: str
    priority: int = 5
    active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class TickerCreate(BaseModel):
    text: str
    priority: int = 5
    active: bool = True

class Ad(BaseModel):
    id: str
    title: str
    image_url: str
    click_url: Optional[str] = None
    priority: int = 10
    active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

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

# ============ DATABASE DEPENDENCY ============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============ AUTH HELPERS ============

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=User)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    import uuid
    user = UserDB(
        id=str(uuid.uuid4()),
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@api_router.post("/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=User.from_orm(user))

# ============ CHANNEL ROUTES ============

@api_router.post("/channels", response_model=Channel)
def create_channel(channel_data: ChannelCreate, db: Session = Depends(get_db)):
    import uuid
    channel = ChannelDB(id=str(uuid.uuid4()), **channel_data.dict())
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel

@api_router.get("/channels", response_model=List[Channel])
def get_channels(db: Session = Depends(get_db)):
    return db.query(ChannelDB).all()

@api_router.get("/channels/{channel_id}", response_model=Channel)
def get_channel(channel_id: str, db: Session = Depends(get_db)):
    channel = db.query(ChannelDB).filter(ChannelDB.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel

# ============ PROGRAM ROUTES ============

@api_router.post("/programs", response_model=Program)
def create_program(program_data: ProgramCreate, db: Session = Depends(get_db)):
    import uuid
    program = ProgramDB(
        id=str(uuid.uuid4()),
        **program_data.dict(),
        created_by="system"
    )
    db.add(program)
    db.commit()
    db.refresh(program)
    return program

@api_router.get("/programs", response_model=List[Program])
def get_programs(channel_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ProgramDB)
    if channel_id:
        query = query.filter(ProgramDB.channel_id == channel_id)
    return query.all()

@api_router.get("/programs/{program_id}", response_model=Program)
def get_program(program_id: str, db: Session = Depends(get_db)):
    program = db.query(ProgramDB).filter(ProgramDB.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

@api_router.delete("/programs/{program_id}")
def delete_program(program_id: str, db: Session = Depends(get_db)):
    program = db.query(ProgramDB).filter(ProgramDB.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    db.delete(program)
    db.commit()
    return {"message": "Program deleted"}

# ============ SCHEDULE ROUTES ============

@api_router.post("/schedule", response_model=ScheduleItem)
def create_schedule_item(schedule_data: ScheduleItemCreate, db: Session = Depends(get_db)):
    # Check for conflicts
    conflicts = db.query(ScheduleItemDB).filter(
        ScheduleItemDB.channel_id == schedule_data.channel_id,
        ScheduleItemDB.status.in_(["scheduled", "running"]),
        ScheduleItemDB.start_time < schedule_data.end_time,
        ScheduleItemDB.end_time > schedule_data.start_time
    ).all()
    
    if conflicts:
        raise HTTPException(status_code=409, detail="Schedule conflict detected")
    
    import uuid
    schedule_item = ScheduleItemDB(id=str(uuid.uuid4()), **schedule_data.dict())
    db.add(schedule_item)
    db.commit()
    db.refresh(schedule_item)
    return schedule_item

@api_router.get("/schedule", response_model=List[ScheduleItem])
def get_schedule(channel_id: Optional[str] = None, date: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ScheduleItemDB)
    if channel_id:
        query = query.filter(ScheduleItemDB.channel_id == channel_id)
    return query.order_by(ScheduleItemDB.start_time).all()

@api_router.put("/schedule/{schedule_id}", response_model=ScheduleItem)
def update_schedule_item(schedule_id: str, update_data: ScheduleItemUpdate, db: Session = Depends(get_db)):
    schedule = db.query(ScheduleItemDB).filter(ScheduleItemDB.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(schedule, key, value)
    
    schedule.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(schedule)
    return schedule

@api_router.delete("/schedule/{schedule_id}")
def delete_schedule_item(schedule_id: str, db: Session = Depends(get_db)):
    schedule = db.query(ScheduleItemDB).filter(ScheduleItemDB.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule item deleted"}

@api_router.get("/schedule/now-playing", response_model=NowPlaying)
def get_now_playing(channel_id: str, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    
    current = db.query(ScheduleItemDB).filter(
        ScheduleItemDB.channel_id == channel_id,
        ScheduleItemDB.start_time <= now,
        ScheduleItemDB.end_time > now,
        ScheduleItemDB.status.in_(["scheduled", "running"])
    ).first()
    
    result = NowPlaying()
    
    if current:
        result.schedule_item = ScheduleItem.from_orm(current)
        program = db.query(ProgramDB).filter(ProgramDB.id == current.program_id).first()
        if program:
            result.program = Program.from_orm(program)
    
    next_item = db.query(ScheduleItemDB).filter(
        ScheduleItemDB.channel_id == channel_id,
        ScheduleItemDB.start_time > now,
        ScheduleItemDB.status == "scheduled"
    ).order_by(ScheduleItemDB.start_time).first()
    
    if next_item:
        result.next_start_time = next_item.start_time
        next_program = db.query(ProgramDB).filter(ProgramDB.id == next_item.program_id).first()
        if next_program:
            result.next_program = Program.from_orm(next_program)
    
    return result

# ============ TICKER ROUTES ============

@api_router.post("/ticker", response_model=Ticker)
def create_ticker(ticker_data: TickerCreate, db: Session = Depends(get_db)):
    import uuid
    ticker = TickerDB(id=str(uuid.uuid4()), **ticker_data.dict())
    db.add(ticker)
    db.commit()
    db.refresh(ticker)
    return ticker

@api_router.get("/ticker", response_model=List[Ticker])
def get_tickers(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(TickerDB)
    if active_only:
        query = query.filter(TickerDB.active == True)
    return query.order_by(TickerDB.priority).all()

@api_router.put("/ticker/{ticker_id}", response_model=Ticker)
def update_ticker(ticker_id: str, ticker_data: TickerCreate, db: Session = Depends(get_db)):
    ticker = db.query(TickerDB).filter(TickerDB.id == ticker_id).first()
    if not ticker:
        raise HTTPException(status_code=404, detail="Ticker not found")
    
    for key, value in ticker_data.dict().items():
        setattr(ticker, key, value)
    
    db.commit()
    db.refresh(ticker)
    return ticker

@api_router.delete("/ticker/{ticker_id}")
def delete_ticker(ticker_id: str, db: Session = Depends(get_db)):
    ticker = db.query(TickerDB).filter(TickerDB.id == ticker_id).first()
    if not ticker:
        raise HTTPException(status_code=404, detail="Ticker not found")
    db.delete(ticker)
    db.commit()
    return {"message": "Ticker deleted"}

# ============ AD ROUTES ============

@api_router.post("/ads", response_model=Ad)
def create_ad(ad_data: AdCreate, db: Session = Depends(get_db)):
    import uuid
    ad = AdDB(id=str(uuid.uuid4()), **ad_data.dict())
    db.add(ad)
    db.commit()
    db.refresh(ad)
    return ad

@api_router.get("/ads", response_model=List[Ad])
def get_ads(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(AdDB)
    if active_only:
        query = query.filter(AdDB.active == True)
    return query.order_by(AdDB.priority).all()

# ============ MINING NEWS RSS FEED ============

@api_router.get("/mining-news")
def get_mining_news():
    news_items = []
    feeds = [
        "https://www.mining.com/feed/",
        "https://www.miningweekly.com/rss-feeds/sections/africa",
    ]
    
    try:
        for feed_url in feeds:
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries[:5]:
                    news_items.append({
                        "title": entry.get('title', 'Mining News Update'),
                        "text": entry.get('title', 'Mining News Update'),
                        "link": entry.get('link', ''),
                        "published": entry.get('published', '')
                    })
            except:
                pass
                
        if not news_items:
            news_items = [
                {"text": "Zimbabwe mining sector reports steady growth in Q4", "title": "Mining Update"},
                {"text": "Gold production reaches new milestone", "title": "Gold News"},
                {"text": "Green energy initiatives boost mining efficiency", "title": "Energy Update"}
            ]
            
        return news_items[:15]
    except:
        return [{"text": "Mining news updates coming soon", "title": "Update"}]

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize default data
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Create default channel
        if db.query(ChannelDB).count() == 0:
            import uuid
            channel = ChannelDB(
                id=str(uuid.uuid4()),
                name="Nzuri Digital TV",
                slug="nzuri-tv",
                description="Zimbabwe's leading digital television station"
            )
            db.add(channel)
            db.commit()
            logger.info("Default channel created")
    finally:
        db.close()
