from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MySQL connection
mysql_host = os.environ.get('MYSQL_HOST', 'localhost')
mysql_port = os.environ.get('MYSQL_PORT', '3306')
mysql_user = os.environ.get('MYSQL_USER', 'root')
mysql_password = os.environ.get('MYSQL_PASSWORD', '')
mysql_database = os.environ.get('MYSQL_DATABASE', 'sai_sports')

# Create MySQL connection string
DATABASE_URL = f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_database}"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class StatusCheckDB(Base):
    __tablename__ = 'status_checks'
    
    id = Column(String(36), primary_key=True)
    client_name = Column(String(255), nullable=False)
    timestamp = Column(DateTime, nullable=False)

class ContactMessageDB(Base):
    __tablename__ = 'contact_messages'
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logging.info("Database tables created successfully")
except Exception as e:
    logging.error(f"Error creating tables: {str(e)}")

# Database dependency
@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models for API
class StatusCheck(BaseModel):
    id: str
    client_name: str
    timestamp: datetime

    class Config:
        from_attributes = True

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactMessage(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

# API Routes
@api_router.get("/")
async def root():
    return {"message": "SAI Sports API - MySQL"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    with get_db() as db:
        status_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc)
        
        db_status = StatusCheckDB(
            id=status_id,
            client_name=input.client_name,
            timestamp=timestamp
        )
        
        db.add(db_status)
        db.commit()
        db.refresh(db_status)
        
        return StatusCheck(
            id=db_status.id,
            client_name=db_status.client_name,
            timestamp=db_status.timestamp
        )

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    with get_db() as db:
        status_checks = db.query(StatusCheckDB).all()
        return [StatusCheck(
            id=check.id,
            client_name=check.client_name,
            timestamp=check.timestamp
        ) for check in status_checks]

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    """Store contact form submissions"""
    try:
        with get_db() as db:
            message_id = str(uuid.uuid4())
            timestamp = datetime.now(timezone.utc)
            
            db_message = ContactMessageDB(
                id=message_id,
                name=input.name,
                email=input.email,
                phone=input.phone,
                message=input.message,
                timestamp=timestamp
            )
            
            db.add(db_message)
            db.commit()
            db.refresh(db_message)
            
            logger.info(f"Contact message received from {input.email}")
            
            return ContactMessage(
                id=db_message.id,
                name=db_message.name,
                email=db_message.email,
                phone=db_message.phone,
                message=db_message.message,
                timestamp=db_message.timestamp
            )
    except Exception as e:
        logger.error(f"Error saving contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process contact form")

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    """Get all contact messages"""
    with get_db() as db:
        messages = db.query(ContactMessageDB).all()
        return [ContactMessage(
            id=msg.id,
            name=msg.name,
            email=msg.email,
            phone=msg.phone,
            message=msg.message,
            timestamp=msg.timestamp
        ) for msg in messages]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db():
    engine.dispose()
    logger.info("Database connection closed")