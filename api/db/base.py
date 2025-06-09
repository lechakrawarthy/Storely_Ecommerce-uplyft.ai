"""
Database base configuration and connections
"""
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Database models (extracted from original models.py)
Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)
    price = Column(Float, nullable=False)
    stock = Column(Integer)
    description = Column(Text)
    image_url = Column(String)
    badge = Column(String)

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.name,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "inStock": self.stock > 0 if self.stock is not None else True,
            "description": self.description,
            "image": self.image_url,
            "imageUrl": self.image_url,
            "badge": self.badge,
            "rating": 4.5,
            "reviews": 100,
            "originalPrice": None,
            "discount": None,
            "color": None
        }


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    role = Column(String, default='user')

    def to_dict(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "phone": self.phone,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "is_active": self.is_active,
            "role": self.role
        }


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    messages = relationship(
        "ChatMessage", back_populates="session", cascade="all, delete-orphan")
    user = relationship("User")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, ForeignKey('chat_sessions.id'), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text)
    intent = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_user_message = Column(Boolean, default=True)

    session = relationship("ChatSession", back_populates="messages")


class DatabaseManager:
    """Database connection and session management"""

    def __init__(self, database_url: str, echo: bool = False):
        self.database_url = database_url
        self.engine = None
        self.SessionLocal = None
        self.echo = echo
        self._initialize()

    def _initialize(self):
        """Initialize database connection"""
        try:
            self.engine = create_engine(self.database_url, echo=self.echo)
            self.SessionLocal = sessionmaker(
                autocommit=False, autoflush=False, bind=self.engine)
            logger.info(f"Database initialized: {self.database_url}")
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
            raise

    def create_tables(self):
        """Create all tables"""
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Failed to create tables: {e}")
            raise

    def get_session(self):
        """Get a database session"""
        if not self.SessionLocal:
            raise RuntimeError("Database not initialized")
        return self.SessionLocal()

    def close(self):
        """Close database connection"""
        if self.engine:
            self.engine.dispose()
            logger.info("Database connection closed")


# Global database manager instance
db_manager = None


def init_database(database_url: str, echo: bool = False):
    """Initialize the global database manager"""
    global db_manager
    db_manager = DatabaseManager(database_url, echo)
    db_manager.create_tables()
    return db_manager


def get_db_session():
    """Get a database session from the global manager"""
    if not db_manager:
        raise RuntimeError(
            "Database not initialized. Call init_database() first.")
    return db_manager.get_session()


def close_database():
    """Close the global database connection"""
    global db_manager
    if db_manager:
        db_manager.close()
        db_manager = None
