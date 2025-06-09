"""
Development Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()


class DevelopmentConfig:
    """Development configuration class"""

    # Flask Settings
    SECRET_KEY = os.environ.get(
        'SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = True
    TESTING = False

    # Database Configuration
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///store.db'

    # Server Configuration
    HOST = os.environ.get('HOST') or '127.0.0.1'
    PORT = int(os.environ.get('PORT') or 5000)

    # CORS Configuration - More permissive for development
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8082",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8082"
    ]

    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret'
    JWT_EXPIRATION_HOURS = int(os.environ.get(
        'JWT_EXPIRATION_HOURS') or 168)  # 7 days for dev

    # API Configuration
    API_TITLE = "Storely E-commerce API (Development)"
    API_VERSION = "1.0.0-dev"
    API_DESCRIPTION = "Development e-commerce API with chatbot functionality"

    # Rate Limiting - More lenient for development
    RATE_LIMIT_ENABLED = False
    RATE_LIMIT_PER_MINUTE = int(os.environ.get('RATE_LIMIT_PER_MINUTE') or 200)

    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'DEBUG'
    LOG_FILE = os.environ.get('LOG_FILE') or 'api_dev.log'

    # Chat Configuration
    MAX_CHAT_HISTORY = int(os.environ.get('MAX_CHAT_HISTORY') or 100)
    MAX_PRODUCTS_PER_RESPONSE = int(
        os.environ.get('MAX_PRODUCTS_PER_RESPONSE') or 10)

    # Feature Flags - All enabled for development
    ENABLE_CHAT = True
    ENABLE_ANALYTICS = True
    ENABLE_ADMIN = True
    ENABLE_DEBUG_ENDPOINTS = True
