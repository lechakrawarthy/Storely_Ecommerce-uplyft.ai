"""
Production Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()


class ProductionConfig:
    """Production configuration class"""

    # Flask Settings
    SECRET_KEY = os.environ.get(
        'SECRET_KEY') or 'production-secret-key-change-this'
    DEBUG = False
    TESTING = False

    # Database Configuration
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///store.db'

    # Server Configuration
    HOST = os.environ.get('HOST') or '0.0.0.0'
    PORT = int(os.environ.get('PORT') or 5000)

    # CORS Configuration
    CORS_ORIGINS = [
        "https://yourdomain.com",
        "https://www.yourdomain.com",
        "http://localhost:8080",  # For local development
        "http://127.0.0.1:8080"
    ]

    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get(
        'JWT_SECRET_KEY') or 'jwt-secret-change-in-production'
    JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS') or 24)

    # API Configuration
    API_TITLE = "Storely E-commerce API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Production e-commerce API with chatbot functionality"

    # Rate Limiting
    RATE_LIMIT_ENABLED = True
    RATE_LIMIT_PER_MINUTE = int(os.environ.get('RATE_LIMIT_PER_MINUTE') or 60)

    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FILE = os.environ.get('LOG_FILE') or 'api.log'

    # Chat Configuration
    MAX_CHAT_HISTORY = int(os.environ.get('MAX_CHAT_HISTORY') or 50)
    MAX_PRODUCTS_PER_RESPONSE = int(
        os.environ.get('MAX_PRODUCTS_PER_RESPONSE') or 6)

    # Feature Flags
    ENABLE_CHAT = os.environ.get('ENABLE_CHAT', 'True').lower() == 'true'
    ENABLE_ANALYTICS = os.environ.get(
        'ENABLE_ANALYTICS', 'True').lower() == 'true'
    ENABLE_ADMIN = os.environ.get('ENABLE_ADMIN', 'False').lower() == 'true'
