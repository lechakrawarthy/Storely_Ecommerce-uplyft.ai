"""
Authentication request validation
"""
from typing import Optional, Dict, Any
from datetime import datetime
import re
from models.interfaces import UserRegistrationRequest, UserLoginRequest, UserResponse, ValidationError
from models.common import sanitize_input


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

        if len(password) > 128:
            return "Password too long"

        # Check for at least one uppercase, lowercase, digit, and special character
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

        # Allow alphanumeric, underscore, and hyphen
        if not re.match(r'^[a-zA-Z0-9_-]+$', username):
            return "Username can only contain letters, numbers, underscores, and hyphens"

        return None

    @staticmethod
    def validate_phone(phone: Optional[str]) -> Optional[str]:
        """Validate phone number format (optional field)"""
        if not phone:
            return None  # Phone is optional

        phone = phone.strip()
        # Remove common formatting characters
        phone_clean = re.sub(r'[\s\-\(\)\+]', '', phone)

        # Check if it's a valid phone number (10-15 digits)
        if not re.match(r'^\d{10,15}$', phone_clean):
            return "Invalid phone number format"

        return None

    @staticmethod
    def validate_register_request(data: Dict[str, Any]) -> UserRegistrationRequest:
        """Validate registration request data"""
        errors = []

        # Extract and sanitize fields
        email = sanitize_input(data.get('email', ''))
        password = data.get('password', '')  # Don't sanitize password
        username = sanitize_input(data.get('username', ''))
        phone = sanitize_input(
            data.get('phone')) if data.get('phone') else None

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
            username=username,
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

        # Check password presence (don't validate strength for login)
        if not password:
            errors.append("Password is required")

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return UserLoginRequest(email=email, password=password)

    @staticmethod
    def validate_otp_code(otp_code: str) -> Optional[str]:
        """Validate OTP code format"""
        if not otp_code:
            return "OTP code is required"

        otp_code = otp_code.strip()

        # OTP should be 6 digits
        if not re.match(r'^\d{6}$', otp_code):
            return "OTP code must be 6 digits"

        return None

    @staticmethod
    def validate_reset_password_request(data: Dict[str, Any]) -> Dict[str, str]:
        """Validate password reset request"""
        errors = []

        email = sanitize_input(data.get('email', ''))
        new_password = data.get('new_password', '')
        otp_code = sanitize_input(data.get('otp_code', ''))

        # Validate fields
        email_error = AuthValidator.validate_email(email)
        if email_error:
            errors.append(email_error)

        password_error = AuthValidator.validate_password(new_password)
        if password_error:
            errors.append(password_error)

        otp_error = AuthValidator.validate_otp_code(otp_code)
        if otp_error:
            errors.append(otp_error)

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return {
            'email': email,
            'new_password': new_password,
            'otp_code': otp_code
        }
