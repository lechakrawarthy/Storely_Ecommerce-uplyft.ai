"""
Authentication business logic and services - Simplified for global session pattern
"""
from typing import Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import bcrypt
import jwt
import secrets
import random
import string
from models.interfaces import (
    UserResponse, UserRegistrationRequest, UserLoginRequest, AuthenticationError,
    ValidationError, OTPSession
)
from db.base import get_db_session
from db.users import UserRepository
from models.constants import ErrorMessages, JWT_ALGORITHM


class AuthService:
    """Handles authentication business logic"""

    def __init__(self):
        self.jwt_algorithm = JWT_ALGORITHM
        self.jwt_expiry_hours = 24
        self.otp_expiry_minutes = 10
        self.max_login_attempts = 5
        self.lockout_duration_minutes = 30

    def _get_user_repo(self):
        """Get user repository with current session"""
        session = get_db_session()
        return UserRepository(session)

    def _get_secret_key(self):
        """Get secret key from Flask app config or environment"""
        try:
            from flask import current_app
            return current_app.config['SECRET_KEY']
        except RuntimeError:
            # Fallback to environment variable if no Flask context
            import os
            return os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def _verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
        except Exception:
            return False

    def _generate_jwt_token(self, user_id: str, email: str) -> str:
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=self.jwt_expiry_hours),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self._get_secret_key(), algorithm=self.jwt_algorithm)

    def register_user(self, request: UserRegistrationRequest) -> UserResponse:
        """Register a new user"""
        try:
            user_repo = self._get_user_repo()

            # Check if user already exists
            existing_user = user_repo.get_user_by_email(request.email)
            if existing_user:
                raise ValidationError("Email already registered")

            if user_repo.get_user_by_username(request.username):
                raise ValidationError("Username already taken")

            # Hash password and create user
            hashed_password = self._hash_password(request.password)

            # Create user data object for repository
            user_data = UserRegistrationRequest(
                username=request.username,
                email=request.email,
                password=hashed_password,
                name=request.name,
                phone=request.phone
            )

            user = user_repo.create_user(user_data)

            # Generate token
            token = self._generate_jwt_token(str(user.id), user.email)

            return UserResponse(
                id=str(user.id),
                username=user.username,
                email=user.email,
                name=user.name,
                created_at=user.created_at,
                is_active=user.is_active,
                role=getattr(user, 'role', 'user'),
                token=token,
                message="Registration successful",
                user=user
            )

        except ValidationError:
            raise
        except Exception as e:
            raise AuthenticationError(f"Registration failed: {str(e)}")

    def login_user(self, request: UserLoginRequest) -> UserResponse:
        """Authenticate user login"""
        try:
            user_repo = self._get_user_repo()
            user = user_repo.get_user_by_email(request.email)

            if not user:
                raise AuthenticationError("Invalid credentials")

            # Verify password
            if not self._verify_password(request.password, user.password_hash):
                raise AuthenticationError("Invalid credentials")

            # Generate token
            token = self._generate_jwt_token(str(user.id), user.email)
            user_repo.update_last_login(user.id)

            return UserResponse(
                id=str(user.id),
                username=user.username,
                email=user.email,
                name=user.name,
                created_at=user.created_at,
                is_active=user.is_active,
                role=getattr(user, 'role', 'user'),
                token=token,
                message="Login successful",
                user=user
            )

        except AuthenticationError:
            raise
        except Exception as e:
            raise AuthenticationError(f"Login failed: {str(e)}")

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, self._get_secret_key(),
                                 algorithms=[self.jwt_algorithm])

            # Check if user still exists
            user_repo = self._get_user_repo()
            user = user_repo.get_user_by_id(payload['user_id'])
            if not user:
                raise AuthenticationError("User not found")

            return {
                'user_id': payload['user_id'],
                'email': payload['email'],
                'user': user
            }

        except jwt.ExpiredSignatureError:
            raise AuthenticationError("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationError("Invalid token")
        except Exception as e:
            raise AuthenticationError(f"Token verification failed: {str(e)}")

    def generate_otp_code(self) -> str:
        """Generate 6-digit OTP code"""
        return ''.join(random.choices(string.digits, k=6))

    def send_password_reset_otp(self, email: str) -> Dict[str, Any]:
        """Send password reset OTP to email"""
        try:
            user_repo = self._get_user_repo()
            user = user_repo.get_user_by_email(email)

            if not user:
                # Don't reveal if email exists or not
                return {
                    'success': True,
                    'message': 'If this email is registered, you will receive an OTP'
                }

            # Generate OTP
            otp_code = self.generate_otp_code()

            # TODO: Implement actual email sending
            # For now, just return the OTP (in production, this should be sent via email)

            return {
                'success': True,
                'message': 'OTP sent successfully',
                'otp': otp_code  # Remove this in production
            }

        except Exception as e:
            raise AuthenticationError(f"Failed to send OTP: {str(e)}")

    def reset_password_with_otp(self, email: str, otp: str, new_password: str) -> Dict[str, Any]:
        """Reset password using OTP"""
        try:
            user_repo = self._get_user_repo()
            user = user_repo.get_user_by_email(email)

            if not user:
                raise AuthenticationError("Invalid request")

            # TODO: Verify OTP against stored session
            # For now, we'll accept any 6-digit OTP (implement proper OTP verification in production)
            if not otp or len(otp) != 6 or not otp.isdigit():
                raise AuthenticationError("Invalid OTP")

            # Hash new password and update
            hashed_password = self._hash_password(new_password)
            user_repo.update_password(user.id, hashed_password)

            return {
                'success': True,
                'message': 'Password reset successfully'
            }

        except Exception as e:
            raise AuthenticationError(f"Password reset failed: {str(e)}")
