"""
Auth validation utilities
"""
import re
from typing import Dict, Any, Optional
from models.interfaces import UserRegistrationRequest, UserLoginRequest
from models.common import ValidationError


def sanitize_input(value: str) -> str:
    """Sanitize user input"""
    if not value:
        return ""
    return value.strip()


class AuthValidator:
    """Validates authentication-related requests"""

    @staticmethod
    def validate_email(email: str) -> Optional[str]:
        """Validate email format"""
        if not email:
            return "Email is required"

        email = email.strip().lower()
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        if not re.match(email_pattern, email):
            return "Invalid email format"

        if len(email) > 254:
            return "Email too long"

        return None

    @staticmethod
    def validate_password(password: str) -> Optional[str]:
        """Validate password strength"""
        if not password:
            return "Password is required"

        if len(password) < 8:
            return "Password must be at least 8 characters long"

        if not re.search(r'[A-Z]', password):
            return "Password must contain at least one uppercase letter"

        if not re.search(r'[a-z]', password):
            return "Password must contain at least one lowercase letter"

        if not re.search(r'\d', password):
            return "Password must contain at least one digit"

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return "Password must contain at least one special character"

        return None

    @staticmethod
    def validate_username(username: str) -> Optional[str]:
        """Validate username format"""
        if not username:
            return "Username is required"

        username = username.strip()

        if len(username) < 3:
            return "Username must be at least 3 characters long"

        if len(username) > 50:
            return "Username too long"

        # Allow letters, numbers, underscores, hyphens, and spaces
        if not re.match(r'^[a-zA-Z0-9_\- ]+$', username):
            return "Username can only contain letters, numbers, underscores, hyphens, and spaces"

        return None

    @staticmethod
    def validate_phone(phone: str) -> Optional[str]:
        """Validate phone number format"""
        if not phone:
            return None  # Phone is optional

        phone = phone.strip()
        
        # Remove common formatting characters
        clean_phone = re.sub(r'[^\d+]', '', phone)
        
        if len(clean_phone) < 10:
            return "Phone number too short"
        
        if len(clean_phone) > 15:
            return "Phone number too long"
        
        return None

    @staticmethod
    def validate_register_request(data: Dict[str, Any]) -> UserRegistrationRequest:
        """Validate registration request data"""
        errors = []

        # Extract and sanitize fields
        email = sanitize_input(data.get('email', ''))
        password = data.get('password', '')  # Don't sanitize password
        # Accept either 'username' or 'name' field from frontend
        username = sanitize_input(data.get('username', '') or data.get('name', ''))
        phone = sanitize_input(data.get('phone')) if data.get('phone') else None

        # Validate each field
        email_error = AuthValidator.validate_email(email)
        if email_error:
            errors.append(email_error)

        password_error = AuthValidator.validate_password(password)
        if password_error:
            errors.append(password_error)

        username_error = AuthValidator.validate_username(username)
        if username_error:
            errors.append(username_error)

        phone_error = AuthValidator.validate_phone(phone)
        if phone_error:
            errors.append(phone_error)

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return UserRegistrationRequest(
            email=email,
            password=password,
            username=username,  # Use name field as username
            name=username,      # Also set name field for consistency
            phone=phone
        )

    @staticmethod
    def validate_login_request(data: Dict[str, Any]) -> UserLoginRequest:
        """Validate login request data"""
        errors = []

        # Extract fields
        email = sanitize_input(data.get('email', ''))
        password = data.get('password', '')  # Don't sanitize password

        # Validate email
        email_error = AuthValidator.validate_email(email)
        if email_error:
            errors.append(email_error)

        # Validate password exists
        if not password:
            errors.append("Password is required")

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return UserLoginRequest(
            email=email,
            password=password
        )
