"""
Application constants
"""

# API Constants
API_VERSION = "v1"
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100

# Authentication Constants
MIN_PASSWORD_LENGTH = 6
MAX_PASSWORD_LENGTH = 128
TOKEN_EXPIRY_HOURS = 24
REFRESH_TOKEN_EXPIRY_DAYS = 7

# Product Constants
MAX_PRODUCTS_PER_REQUEST = 500  # Increased to support frontend requests
DEFAULT_PRODUCTS_LIMIT = 10

# Chat Constants
MAX_CHAT_MESSAGE_LENGTH = 1000
MAX_CHAT_HISTORY = 50
DEFAULT_CHAT_SUGGESTIONS = 5

# Rate Limiting Constants
DEFAULT_RATE_LIMIT = 60  # requests per minute
STRICT_RATE_LIMIT = 30   # for sensitive endpoints

# Database Constants
DB_TIMEOUT = 30  # seconds
DB_RETRY_ATTEMPTS = 3

# Cache Constants
CACHE_TTL = 300  # 5 minutes
PRODUCT_CACHE_TTL = 600  # 10 minutes

# Error Messages


class ErrorMessages:
    """Standard error messages"""
    INVALID_EMAIL = "Invalid email format"
    INVALID_PASSWORD = "Password does not meet requirements"
    WEAK_PASSWORD = "Password is too weak"
    USER_EXISTS = "User already exists"
    USER_NOT_FOUND = "User not found"
    INVALID_CREDENTIALS = "Invalid email or password"
    ACCOUNT_LOCKED = "Account temporarily locked due to too many failed attempts"
    TOKEN_EXPIRED = "Authentication token has expired"
    TOKEN_INVALID = "Invalid authentication token"
    UNAUTHORIZED = "Authentication required"
    FORBIDDEN = "Access denied"
    VALIDATION_ERROR = "Invalid input data"
    SERVER_ERROR = "Internal server error"
    PRODUCT_NOT_FOUND = "Product not found"
    CHAT_ERROR = "Chat service error"
    ANALYTICS_ERROR = "Analytics service error"


# JWT Constants
JWT_ALGORITHM = "HS256"

# HTTP Status Codes


class HTTPStatus:
    """HTTP status codes"""
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    CONFLICT = 409
    INTERNAL_SERVER_ERROR = 500


# Product Categories
PRODUCT_CATEGORIES = [
    "Books",
    "Electronics", 
    "Clothing"
]

# Chat Intents
CHAT_INTENTS = [
    "product_search",
    "product_inquiry",
    "order_help",
    "support",
    "general"
]

# API Constants Class


class APIConstants:
    """API-related constants"""
    VERSION = API_VERSION
    PAGE_SIZE = DEFAULT_PAGE_SIZE
    MAX_PAGE_SIZE = MAX_PAGE_SIZE
    RATE_LIMIT = DEFAULT_RATE_LIMIT
