import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Flask Configuration
DEBUG = os.getenv('DEBUG', 'True') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key_for_development')
PORT = int(os.getenv('PORT', 5000))

# Database Configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///bookbuddy.db')

# Chatbot Configuration
MAX_CHAT_HISTORY = int(os.getenv('MAX_CHAT_HISTORY', 50))
SESSION_TIMEOUT_HOURS = int(os.getenv('SESSION_TIMEOUT_HOURS', 24))

# API Configuration
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
API_VERSION = os.getenv('API_VERSION', 'v1')
