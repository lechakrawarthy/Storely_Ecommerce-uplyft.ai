#!/usr/bin/env python3
"""
Storely E-commerce - Refactored Flask Application
Clean, layered architecture replacing the monolithic app.py

This is the final refactored version that uses:
- Modular controllers (Auth, Products, Chat, Analytics)
- Repository pattern for data access
- Service layer for business logic
- Clean separation of concerns
"""
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

# Import refactored components
from db.base import init_database
from services.controller import APIController
from configs.production import ProductionConfig
from configs.development import DevelopmentConfig

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)

    # Load configuration
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    # Initialize CORS
    CORS(app,
         origins=["http://localhost:3000", "http://localhost:5173",
                  "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Initialize database
    database_url = app.config.get('DATABASE_URL', 'sqlite:///store.db')
    init_database(database_url)
    logger.info(f"Database initialized: {database_url}")

    # Initialize API controller
    secret_key = app.config.get(
        'SECRET_KEY', 'dev-secret-key-change-in-production')
    api = APIController(secret_key)
    logger.info("API Controller initialized")

    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled exception: {e}", exc_info=True)

        if isinstance(e, HTTPException):
            return jsonify({
                'success': False,
                'error': e.name,
                'message': e.description
            }), e.code

        return jsonify({
            'success': False,
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred'
        }), 500

    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'success': True,
            'message': 'Storely E-commerce API is running',
            'version': '2.0.0-refactored',
            'environment': env
        }), 200

    # Authentication endpoints
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        """User registration"""
        return api.register()

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        """User login"""
        return api.login()

    @app.route('/api/auth/logout', methods=['POST'])
    def logout():
        """User logout"""
        return api.logout()

    @app.route('/api/auth/profile', methods=['GET'])
    def get_profile():
        """Get user profile"""
        return api.get_profile()

    @app.route('/api/auth/profile', methods=['PUT'])
    def update_profile():
        """Update user profile"""
        return api.update_profile()

    @app.route('/api/auth/change-password', methods=['POST'])
    def change_password():
        """Change user password"""
        return api.change_password()

    @app.route('/api/auth/forgot-password', methods=['POST'])
    def forgot_password():
        """Forgot password"""
        return api.forgot_password()

    @app.route('/api/auth/reset-password', methods=['POST'])
    def reset_password():
        """Reset password"""
        return api.reset_password()

    # Product endpoints
    @app.route('/api/products', methods=['GET'])
    def get_products():
        """Get all products"""
        return api.get_products()

    @app.route('/api/products/<int:product_id>', methods=['GET'])
    def get_product(product_id):
        """Get single product"""
        return api.get_product(product_id)

    @app.route('/api/products/search', methods=['GET'])
    def search_products():
        """Search products"""
        return api.search_products()

    @app.route('/api/products/category/<category>', methods=['GET'])
    def get_products_by_category(category):
        """Get products by category"""
        return api.get_products_by_category(category)

    @app.route('/api/products', methods=['POST'])
    def create_product():
        """Create new product (admin only)"""
        return api.create_product()

    @app.route('/api/products/<int:product_id>', methods=['PUT'])
    def update_product(product_id):
        """Update product (admin only)"""
        return api.update_product(product_id)

    @app.route('/api/products/<int:product_id>', methods=['DELETE'])
    def delete_product(product_id):
        """Delete product (admin only)"""
        return api.delete_product(product_id)

    # Chat endpoints
    @app.route('/api/chat', methods=['POST'])
    def chat():
        """Chat with AI assistant"""
        return api.chat()

    @app.route('/api/chat/history', methods=['GET'])
    def get_chat_history():
        """Get chat history"""
        return api.get_chat_history()

    @app.route('/api/chat/clear', methods=['POST'])
    def clear_chat_history():
        """Clear chat history"""
        return api.clear_chat_history()

    # Analytics endpoints
    @app.route('/api/analytics/dashboard', methods=['GET'])
    def get_analytics_dashboard():
        """Get analytics dashboard data"""
        return api.get_analytics_dashboard()

    @app.route('/api/analytics/products', methods=['GET'])
    def get_product_analytics():
        """Get product analytics"""
        return api.get_product_analytics()

    @app.route('/api/analytics/users', methods=['GET'])
    def get_user_analytics():
        """Get user analytics"""
        return api.get_user_analytics()

    @app.route('/api/analytics/sales', methods=['GET'])
    def get_sales_analytics():
        """Get sales analytics"""
        return api.get_sales_analytics()

    # Admin endpoints
    @app.route('/api/admin/users', methods=['GET'])
    def get_all_users():
        """Get all users (admin only)"""
        return api.get_all_users()

    @app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
    def delete_user(user_id):
        """Delete user (admin only)"""
        return api.delete_user(user_id)

    # Cart endpoints (if implemented)
    @app.route('/api/cart', methods=['GET'])
    def get_cart():
        """Get user cart"""
        return api.get_cart()

    @app.route('/api/cart/add', methods=['POST'])
    def add_to_cart():
        """Add item to cart"""
        return api.add_to_cart()

    @app.route('/api/cart/remove', methods=['POST'])
    def remove_from_cart():
        """Remove item from cart"""
        return api.remove_from_cart()

    @app.route('/api/cart/clear', methods=['POST'])
    def clear_cart():
        """Clear cart"""
        return api.clear_cart()

    logger.info("All routes registered successfully")
    return app


# Create the application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'

    logger.info(f"Starting Storely E-commerce API on port {port}")
    logger.info(f"Debug mode: {debug}")
    logger.info("🚀 Refactored architecture loaded successfully!")

    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )
