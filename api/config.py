import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get(
        'SECRET_KEY') or 'dev-secret-key-change-in-production'
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///bookbuddy.db'

    # API Configuration
    API_TITLE = "Enhanced E-commerce Chatbot API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Comprehensive e-commerce chatbot with AI-powered recommendations"

    # CORS Configuration
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

    # Server Configuration
    HOST = os.environ.get('HOST') or '0.0.0.0'
    PORT = int(os.environ.get('PORT') or 5000)
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FILE = os.environ.get('LOG_FILE') or 'api.log'

    # Chatbot Configuration
    MAX_CHAT_HISTORY = int(os.environ.get('MAX_CHAT_HISTORY') or 50)
    MAX_PRODUCTS_PER_RESPONSE = int(
        os.environ.get('MAX_PRODUCTS_PER_RESPONSE') or 6)
    MAX_SUGGESTIONS_PER_RESPONSE = int(
        os.environ.get('MAX_SUGGESTIONS_PER_RESPONSE') or 6)

    # Rate Limiting
    RATE_LIMIT_ENABLED = os.environ.get(
        'RATE_LIMIT_ENABLED', 'True').lower() == 'true'
    RATE_LIMIT_PER_MINUTE = int(os.environ.get('RATE_LIMIT_PER_MINUTE') or 60)

    # NLP Configuration
    NLTK_DATA_PATH = os.environ.get('NLTK_DATA_PATH') or './nltk_data'

    # Cache Configuration
    CACHE_TYPE = os.environ.get('CACHE_TYPE') or 'simple'
    CACHE_TIMEOUT = int(os.environ.get('CACHE_TIMEOUT') or 300)  # 5 minutes


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    DATABASE_URL = 'sqlite:///bookbuddy_dev.db'


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    DATABASE_URL = 'sqlite:///:memory:'  # In-memory database for tests
    RATE_LIMIT_ENABLED = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DATABASE_URL = os.environ.get('DATABASE_URL')
    LOG_LEVEL = 'WARNING'

    # Production CORS origins
    CORS_ORIGINS = [
        os.environ.get('FRONTEND_URL'),
        "https://yourdomain.com"
    ]

    # Enhanced security for production
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'


# Configuration mapping
config_map = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config_map.get(env, config_map['default'])


# Export commonly used config values for backward compatibility
config = get_config()
SECRET_KEY = config.SECRET_KEY
CORS_ORIGINS = config.CORS_ORIGINS
HOST = config.HOST
PORT = config.PORT
DEBUG = config.DEBUG
