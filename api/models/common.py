"""
Common utilities and helper functions
"""
import re
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from models.interfaces import ValidationError, APIResponse
from models.constants import ErrorMessages, MIN_PASSWORD_LENGTH


def generate_uuid() -> str:
    """Generate a new UUID string"""
    return str(uuid.uuid4())


def generate_session_id() -> str:
    """Generate a session ID"""
    return f"session_{generate_uuid()}"


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> bool:
    """Validate password strength"""
    if len(password) < MIN_PASSWORD_LENGTH:
        return False
    return True


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """Sanitize user input"""
    if not text:
        return ""

    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', text)

    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]

    return sanitized.strip()


def create_success_response(data: Any = None, message: str = None) -> Dict[str, Any]:
    """Create a standardized success response"""
    response = APIResponse(
        success=True,
        data=data,
        message=message,
        timestamp=datetime.utcnow()
    )

    return {
        'success': response.success,
        'data': response.data,
        'message': response.message,
        'timestamp': response.timestamp.isoformat()
    }


def create_error_response(error: str, message: str = None, status_code: int = 400) -> Dict[str, Any]:
    """Create a standardized error response"""
    response = APIResponse(
        success=False,
        error=error,
        message=message or getattr(ErrorMessages, error, 'Unknown error'),
        timestamp=datetime.utcnow()
    )

    return {
        'success': response.success,
        'error': response.error,
        'message': response.message,
        'timestamp': response.timestamp.isoformat()
    }


def hash_password(password: str) -> str:
    """Hash a password using SHA-256 (for demo - use bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()


def format_currency(amount: float) -> str:
    """Format amount as currency"""
    return f"${amount:.2f}"


def parse_filters(request_args: Dict[str, Any]) -> Dict[str, Any]:
    """Parse and validate filter parameters"""
    filters = {}

    # Category filter
    if 'category' in request_args:
        filters['category'] = sanitize_input(request_args['category'])

    # Price range filters
    if 'min_price' in request_args:
        try:
            filters['min_price'] = float(request_args['min_price'])
        except (ValueError, TypeError):
            raise ValidationError("Invalid min_price format", "min_price")

    if 'max_price' in request_args:
        try:
            filters['max_price'] = float(request_args['max_price'])
        except (ValueError, TypeError):
            raise ValidationError("Invalid max_price format", "max_price")

    # Pagination
    try:
        filters['limit'] = min(int(request_args.get('limit', 10)), 100)
        filters['offset'] = max(int(request_args.get('offset', 0)), 0)
    except (ValueError, TypeError):
        filters['limit'] = 10
        filters['offset'] = 0

    # Search query
    if 'q' in request_args:
        filters['search_query'] = sanitize_input(request_args['q'])

    return filters


def get_client_ip(request) -> str:
    """Get client IP address from request"""
    # Check for forwarded IP first (for reverse proxies)
    forwarded_ip = request.headers.get('X-Forwarded-For')
    if forwarded_ip:
        return forwarded_ip.split(',')[0].strip()

    # Check for real IP (some proxies use this)
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip

    # Fall back to remote address
    return request.remote_addr or 'unknown'


def log_request(request, user_id: str = None) -> Dict[str, Any]:
    """Create a log entry for a request"""
    return {
        'timestamp': datetime.utcnow().isoformat(),
        'method': request.method,
        'path': request.path,
        'ip': get_client_ip(request),
        'user_agent': request.headers.get('User-Agent', 'unknown'),
        'user_id': user_id
    }
