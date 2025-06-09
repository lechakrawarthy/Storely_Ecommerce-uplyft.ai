"""
Authentication controller - main entry point for auth operations
"""
from typing import Dict, Any, Optional
from models.auth.validate import AuthValidator
from models.auth.compute import AuthService
from db.users import UserRepository
from models.interfaces import UserResponse, AuthenticationError, ValidationError


class AuthController:
    """Main controller for authentication operations"""

    def __init__(self):
        self.validator = AuthValidator()
        self.service = AuthService()

    def register(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle user registration"""
        try:
            # Validate request
            register_request = self.validator.validate_register_request(
                request_data)

            # Process registration
            user_response = self.service.register_user(register_request)

            return {
                'success': True,
                'data': {
                    'user': user_response.to_dict(),
                    'token': user_response.token
                },
                'message': 'User registered successfully'
            }

        except (AuthenticationError, ValidationError) as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Registration failed'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Registration failed due to server error'
            }

    def login(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle user login"""
        try:
            # Validate request
            login_request = self.validator.validate_login_request(request_data)

            # Process login
            user_response = self.service.login_user(login_request)

            return {
                'success': True,
                'data': {
                    'user': user_response.to_dict(),
                    'token': user_response.token
                },
                'message': 'Login successful'
            }

        except (AuthenticationError, ValidationError) as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Login failed'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Login failed due to server error'
            }

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token"""
        try:
            payload = self.service.verify_jwt_token(token)

            return {
                'success': True,
                'data': payload,
                'message': 'Token is valid'
            }

        except AuthenticationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Token verification failed'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Token verification failed'
            }

    def forgot_password(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle forgot password request"""
        try:
            email = request_data.get('email', '').strip().lower()

            # Validate email
            email_error = self.validator.validate_email(email)
            if email_error:
                raise ValidationError(email_error)

            # Send OTP
            success = self.service.send_password_reset_otp(email)

            return {
                'success': True,
                'message': 'If the email exists, an OTP has been sent'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid email format'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to process password reset request'
            }

    def reset_password(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle password reset with OTP"""
        try:
            # Validate request
            validated_data = self.validator.validate_reset_password_request(
                request_data)

            # Reset password
            success = self.service.reset_password(
                email=validated_data['email'],
                otp_code=validated_data['otp_code'],
                new_password=validated_data['new_password']
            )

            return {
                'success': True,
                'message': 'Password reset successfully'
            }

        except (AuthenticationError, ValidationError) as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Password reset failed'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Password reset failed due to server error'
            }

    def change_password(self, user_id: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle password change"""
        try:
            current_password = request_data.get('current_password', '')
            new_password = request_data.get('new_password', '')

            # Validate passwords
            if not current_password:
                raise ValidationError("Current password is required")

            password_error = self.validator.validate_password(new_password)
            if password_error:
                raise ValidationError(password_error)

            # Change password
            success = self.service.change_password(
                user_id, current_password, new_password)

            return {
                'success': True,
                'message': 'Password changed successfully'
            }

        except (AuthenticationError, ValidationError) as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Password change failed'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Password change failed due to server error'
            }

    def get_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user profile"""
        try:
            user_response = self.service.get_user_profile(user_id)

            return {
                'success': True,
                'data': user_response.to_dict(),
                'message': 'Profile retrieved successfully'
            }

        except AuthenticationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to get profile'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get profile due to server error'
            }

    def update_profile(self, user_id: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile"""
        try:
            username = request_data.get('username')
            phone = request_data.get('phone')

            # Validate username if provided
            if username is not None:
                username_error = self.validator.validate_username(username)
                if username_error:
                    raise ValidationError(username_error)

            # Validate phone if provided
            if phone is not None:
                phone_error = self.validator.validate_phone(phone)
                if phone_error:
                    raise ValidationError(phone_error)

            # Update profile
            user_response = self.service.update_user_profile(
                user_id=user_id,
                username=username,
                phone=phone
            )

            return {
                'success': True,
                'data': user_response.to_dict(),
                'message': 'Profile updated successfully'
            }

        except (AuthenticationError, ValidationError) as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Profile update failed'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Profile update failed due to server error'
            }

    def logout(self, token: str) -> Dict[str, Any]:
        """Handle user logout"""
        try:
            success = self.service.logout_user(token)

            return {
                'success': True,
                'message': 'Logged out successfully'
            }

        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Logout failed'
            }
