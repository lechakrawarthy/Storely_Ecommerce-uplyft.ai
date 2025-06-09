"""
Main API controller - routes requests to appropriate service modules
"""
from typing import Dict, Any, Optional, Callable
from functools import wraps
import jwt
from datetime import datetime
from flask import request, jsonify
from models.auth.main import AuthController
from models.products.main import ProductController
from models.chat.main import ChatController
from models.analytics.main import AnalyticsController
from models.interfaces import AuthenticationError
from db.base import DatabaseManager
from db.users import UserRepository
from db.products import ProductRepository


class APIController:
    """Main API controller that coordinates all service modules"""

    def __init__(self, secret_key: str):
        self.secret_key = secret_key

        # Initialize repositories (they will use global database session)
        self.user_repo = UserRepository()
        self.product_repo = ProductRepository()

        # Initialize service controllers (using simplified constructors)
        self.auth_controller = AuthController()
        self.product_controller = ProductController()
        self.chat_controller = ChatController()
        self.analytics_controller = AnalyticsController()

    def _require_auth_impl(self, f: Callable) -> Callable:
        """Internal authentication implementation"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Get token from Authorization header
                auth_header = request.headers.get('Authorization')
                if not auth_header or not auth_header.startswith('Bearer '):
                    return jsonify({
                        'success': False,
                        'error': 'Missing or invalid authorization header',
                        'message': 'Authentication required'
                    }), 401

                token = auth_header.split(' ')[1]

                # Verify token
                result = self.auth_controller.verify_token(token)
                if not result['success']:
                    return jsonify({
                        'success': False,
                        'error': result['error'],
                        'message': 'Invalid or expired token'
                    }), 401

                # Add user info to kwargs
                kwargs['current_user'] = result['data']
                return f(*args, **kwargs)

            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': 'Authentication failed',
                    'message': 'Unable to verify authentication'
                }), 401

        return decorated_function

    @staticmethod
    def require_auth(f: Callable) -> Callable:
        """Decorator to require authentication for endpoints"""
        @wraps(f)
        def decorated_function(self, *args, **kwargs):
            # Apply the authentication logic
            return self._require_auth_impl(f)(self, *args, **kwargs)

        return decorated_function

    def _optional_auth_impl(self, f: Callable) -> Callable:
        """Internal optional authentication implementation"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Get token from Authorization header
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
                    result = self.auth_controller.verify_token(token)
                    if result['success']:
                        kwargs['current_user'] = result['data']
                    else:
                        kwargs['current_user'] = None
                else:
                    kwargs['current_user'] = None

                return f(*args, **kwargs)

            except Exception:
                kwargs['current_user'] = None
                return f(*args, **kwargs)

        return decorated_function

    @staticmethod
    def optional_auth(f: Callable) -> Callable:
        """Decorator for optional authentication"""
        @wraps(f)
        # Apply the optional authentication logic
        def decorated_function(self, *args, **kwargs):
            return self._optional_auth_impl(f)(self, *args, **kwargs)

        return decorated_function

    # Authentication endpoints
    def register(self) -> Dict[str, Any]:
        """Handle user registration"""
        try:
            data = request.get_json() or {}
            result = self.auth_controller.register(data)

            status_code = 201 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Registration failed due to server error'
            }), 500

    def login(self) -> Dict[str, Any]:
        """Handle user login"""
        try:
            data = request.get_json() or {}
            result = self.auth_controller.login(data)

            status_code = 200 if result['success'] else 401
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Login failed due to server error'
            }), 500

    def verify_token_endpoint(self) -> Dict[str, Any]:
        """Verify authentication token"""
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return jsonify({
                    'success': False,
                    'error': 'Invalid authorization header'
                }), 401

            token = auth_header.split(' ')[1]
            result = self.auth_controller.verify_token(token)

            status_code = 200 if result['success'] else 401
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Token verification failed'
            }), 500

    def request_password_reset(self) -> Dict[str, Any]:
        """Handle password reset request"""
        try:
            data = request.get_json() or {}
            result = self.auth_controller.request_password_reset(
                data.get('email', ''))

            # Always return 200 for security (don't reveal if email exists)
            return jsonify(result), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Password reset failed due to server error'
            }), 500

    def change_password(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Handle password change"""
        try:
            data = request.get_json() or {}
            result = self.auth_controller.change_password(
                current_user['user_id'], data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Password change failed due to server error'
            }), 500

    def get_profile(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get user profile"""
        try:
            result = self.auth_controller.get_profile(current_user['user_id'])

            status_code = 200 if result['success'] else 404
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get profile'
            }), 500

    def update_profile(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile"""
        try:
            data = request.get_json() or {}
            result = self.auth_controller.update_profile(
                current_user['user_id'], data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Profile update failed due to server error'
            }), 500

    def logout(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Handle user logout"""
        try:
            # Get token from header
            auth_header = request.headers.get('Authorization', '')
            token = auth_header.split(
                ' ')[1] if auth_header.startswith('Bearer ') else ''

            result = self.auth_controller.logout(token)
            return jsonify(result), 200        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Logout failed due to server error'
            }), 500

    # Product endpoints
    def get_products(self, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get all products with optional filtering"""
        try:
            # Get query parameters
            category = request.args.get('category')
            search = request.args.get('search')
            limit = request.args.get('limit', type=int)
            offset = request.args.get('offset', type=int, default=0)

            # Create request data dictionary that ProductController expects
            request_data = {
                'category': category,
                'search': search,
                'limit': limit,
                'offset': offset
            }

            result = self.product_controller.get_products(request_data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to retrieve products'
            }), 500    def get_product(self, product_id: str, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get single product by ID"""
        try:
            # Convert string product_id to integer
            try:
                product_id_int = int(product_id)
            except (ValueError, TypeError):
                return jsonify({
                    'success': False,
                    'error': 'Invalid product ID',
                    'message': 'Product ID must be a valid number'
                }), 400

            result = self.product_controller.get_product_by_id(product_id_int)

            status_code = 200 if result['success'] else 404
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to retrieve product'
            }), 500

    def search_products(self, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Search products with advanced filtering"""
        try:
            data = request.get_json() or {}
            result = self.product_controller.search_products(data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Product search failed'
            }), 500

    def get_categories(self, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get all product categories"""
        try:
            result = self.product_controller.get_categories()

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to retrieve categories'
            }), 500

    # Chat endpoints
    def send_message(self, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Send chat message"""
        try:
            data = request.get_json() or {}
            result = self.chat_controller.send_message(data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to send message'
            }), 500

    def get_chat_history(self, session_id: str, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get chat history for session"""
        try:
            result = self.chat_controller.get_chat_history(session_id)

            status_code = 200 if result['success'] else 404
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to retrieve chat history'
            }), 500

    # Analytics endpoints
    def get_analytics(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get analytics data"""
        try:
            data = request.get_json() or {}
            result = self.analytics_controller.get_analytics(data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to retrieve analytics'
            }), 500

    def track_event(self, current_user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Track analytics event"""
        try:
            data = request.get_json() or {}
            result = self.analytics_controller.track_event(data)

            status_code = 200 if result['success'] else 400
            return jsonify(result), status_code

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to track event'
            }), 500

    # Health check endpoint
    def health_check(self) -> Dict[str, Any]:
        """Health check endpoint"""
        try:
            return jsonify({
                'success': True,
                'message': 'API is healthy',
                'timestamp': str(datetime.utcnow())
            }), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Health check failed'
            }), 500
