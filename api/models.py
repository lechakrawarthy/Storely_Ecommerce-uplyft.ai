from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import os
import json

# Create SQLite database
db_path = os.path.join(os.path.dirname(__file__), 'bookbuddy.db')
engine = create_engine(f'sqlite:///{db_path}', echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    image = Column(String)
    category = Column(String)
    color = Column(String)
    rating = Column(Float)
    reviews = Column(Integer)
    badge = Column(String)
    discount = Column(Float)
    in_stock = Column(Boolean, default=True)
    description = Column(Text)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "originalPrice": self.original_price,
            "image": self.image,
            "category": self.category,
            "color": self.color,
            "rating": self.rating,
            "reviews": self.reviews,
            "badge": self.badge,
            "discount": self.discount,
            "inStock": self.in_stock,
            "description": self.description
        }

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    preferences_json = Column(Text)  # JSON string of user preferences
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    sessions = relationship("ChatSession", back_populates="user")
    
    def to_dict(self):
        preferences = {}
        if self.preferences_json:
            try:
                preferences = json.loads(self.preferences_json)
            except:
                preferences = {}
        
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "preferences": preferences,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "is_active": self.is_active
        }

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
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
