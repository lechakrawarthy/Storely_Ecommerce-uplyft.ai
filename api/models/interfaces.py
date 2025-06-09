"""
Data classes and type definitions for the application
"""
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums for constants


class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"


class ChatMessageType(Enum):
    TEXT = "text"
    PRODUCT = "product"
    SUGGESTION = "suggestion"
    ERROR = "error"


class ChatIntent(Enum):
    PRODUCT_SEARCH = "product_search"
    PRODUCT_INQUIRY = "product_inquiry"
    ORDER_HELP = "order_help"
    SUPPORT = "support"
    GENERAL = "general"


class ProductCategory(Enum):
    FICTION = "Fiction"
    SCIENCE = "Science"
    HISTORY = "History"
    BIOGRAPHY = "Biography"
    TECHNOLOGY = "Technology"
    BUSINESS = "Business"
    ARTS = "Arts"
    HEALTH = "Health"

# Request/Response Data Classes


@dataclass
class ProductRequest:
    """Product request parameters"""
    category: Optional[str] = None
    limit: int = 10
    offset: int = 0
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    search_query: Optional[str] = None


@dataclass
class Product:
    """Product data model"""
    id: str
    name: str
    category: str
    price: float
    stock: int
    description: str
    image_url: str
    badge: Optional[str] = None
    rating: float = 4.5
    reviews: int = 100

    @property
    def in_stock(self) -> bool:
        """Check if product is in stock"""
        return self.stock > 0


@dataclass
class ProductResponse:
    """Product response data"""
    id: str
    title: str
    name: str
    category: str
    price: float
    stock: int
    in_stock: bool
    description: str
    image_url: str
    badge: Optional[str] = None
    rating: float = 4.5
    reviews: int = 100


@dataclass
class UserRegistrationRequest:
    """User registration request data"""
    username: str
    email: str
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None


@dataclass
class UserLoginRequest:
    """User login request data"""
    email: str
    password: str


@dataclass
class UserResponse:
    """User response data (without sensitive info)"""
    id: str
    username: str
    email: str
    name: Optional[str]
    created_at: datetime
    is_active: bool
    role: str = "user"
    token: Optional[str] = None
    message: Optional[str] = None
    user: Optional[Any] = None

    def to_dict(self):
        """Convert to dictionary format"""
        result = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            'is_active': self.is_active,
            'role': self.role
        }
        if self.user and hasattr(self.user, 'to_dict'):
            result.update(self.user.to_dict())
        return result


@dataclass
class ChatRequest:
    """Chat request data"""
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None


@dataclass
class ChatResponse:
    """Chat response data"""
    message: str
    type: ChatMessageType
    products: Optional[List[ProductResponse]] = None
    suggestions: Optional[List[str]] = None
    session_id: Optional[str] = None
    learned_preferences: Optional[Dict[str, Any]] = None


@dataclass
class ChatMessage:
    """Chat message data"""
    id: str
    session_id: str
    message: str
    is_user: bool
    timestamp: datetime
    message_type: ChatMessageType = ChatMessageType.TEXT
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ChatSessionResponse:
    """Chat session response data"""
    id: str
    created_at: datetime
    updated_at: datetime
    message_count: int
    last_message: Optional[str] = None
    last_message_timestamp: Optional[datetime] = None


@dataclass
class APIResponse:
    """Generic API response wrapper"""
    success: bool
    data: Any = None
    error: Optional[str] = None
    message: Optional[str] = None
    timestamp: datetime = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()


@dataclass
class DatabaseConfig:
    """Database configuration"""
    url: str
    echo: bool = False
    pool_size: int = 5
    max_overflow: int = 10


@dataclass
class JWTConfig:
    """JWT configuration"""
    secret_key: str
    expiration_hours: int = 24
    algorithm: str = "HS256"


@dataclass
class OTPSession:
    """OTP session data"""
    id: str
    user_id: Optional[str]
    phone: str
    otp_code: str
    purpose: str  # 'login', 'signup', 'verification'
    is_used: bool = False
    attempts: int = 0
    max_attempts: int = 3
    expires_at: datetime = None
    created_at: datetime = None

    def is_expired(self) -> bool:
        """Check if OTP session is expired"""
        if self.expires_at:
            return datetime.utcnow() > self.expires_at
        return False

    def is_valid(self, otp_code: str) -> bool:
        """Check if OTP code is valid"""
        return self.otp_code == otp_code and not self.is_expired() and not self.is_used

# Validation Error Classes


class ValidationError(Exception):
    """Custom validation error"""

    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(self.message)


class AuthenticationError(Exception):
    """Custom authentication error"""
    pass


class AuthorizationError(Exception):
    """Custom authorization error"""
    pass
