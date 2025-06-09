from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime, timedelta
import os
import json
import uuid

# Create SQLite database
db_path = os.path.join(os.path.dirname(__file__), 'store.db')
engine = create_engine(f'sqlite:///{db_path}', echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
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
            "title": self.name,  # Map name to title for frontend compatibility
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "inStock": self.stock > 0 if self.stock is not None else True,
            "description": self.description,
            "image": self.image_url,  # Map image_url to image for frontend compatibility
            "imageUrl": self.image_url,
            "badge": self.badge,
            "rating": 4.5,  # Default rating since not in DB
            "reviews": 100,  # Default reviews since not in DB
            "originalPrice": None,
            "discount": None,
            "color": None
        }


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)  # Full name
    username = Column(String, unique=True, nullable=True)  # Optional username
    # Email can be null for phone-only users
    email = Column(String, unique=True, nullable=True)
    # Phone can be null for email-only users
    phone = Column(String, unique=True, nullable=True)
    # Password can be null for OTP-only users
    password_hash = Column(String, nullable=True)
    avatar = Column(String, nullable=True)  # Profile picture URL
    is_phone_verified = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    preferences_json = Column(Text)  # JSON string of user preferences
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)

    # Relationships
    sessions = relationship("ChatSession", back_populates="user")
    otp_sessions = relationship("OTPSession", back_populates="user")

    def to_dict(self):
        preferences = {}
        if self.preferences_json:
            try:
                preferences = json.loads(self.preferences_json)
            except:
                preferences = {}

        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "avatar": self.avatar,
            "is_phone_verified": self.is_phone_verified,
            "is_email_verified": self.is_email_verified,
            "preferences": preferences,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "is_active": self.is_active
        }


class OTPSession(Base):
    __tablename__ = "otp_sessions"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"),
                     nullable=True)  # Can be null for signup
    phone = Column(String, nullable=False)
    otp_code = Column(String, nullable=False)
    # 'login', 'signup', 'verification'
    purpose = Column(String, nullable=False)
    is_used = Column(Boolean, default=False)
    attempts = Column(Integer, default=0)
    max_attempts = Column(Integer, default=3)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="otp_sessions")

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

    def is_valid(self, otp_code):
        return (
            not self.is_used and
            not self.is_expired() and
            self.otp_code == otp_code and
            self.attempts < self.max_attempts
        )


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    messages = relationship("ChatMessage", back_populates="session")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "messages": [message.to_dict() for message in self.messages]
        }


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"))
    sender = Column(String, nullable=False)  # 'user' or 'bot'
    message = Column(Text)
    products_json = Column(Text)  # JSON string of product recommendations
    suggestions_json = Column(Text)  # JSON string of suggestions
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "sender": self.sender,
            "message": self.message,
            "products_json": self.products_json,
            "suggestions_json": self.suggestions_json,
            "timestamp": self.timestamp.isoformat()
        }


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables created.")
