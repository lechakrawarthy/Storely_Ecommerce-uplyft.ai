#!/usr/bin/env python3
"""
Minimal Flask app for testing authentication
"""

import jwt
import bcrypt
from models import SessionLocal, User
import config
from flask_cors import CORS
from flask import Flask, request, jsonify
import os
import sys
import uuid
import json
from datetime import datetime, timedelta

# Add the api directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))


app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY

# Enable CORS
CORS(app, origins=config.CORS_ORIGINS)

# JWT Configuration
JWT_SECRET_KEY = os.environ.get(
    'JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_EXPIRATION_DELTA = timedelta(days=7)


def generate_jwt_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + JWT_EXPIRATION_DELTA,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')


def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password, hashed):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Minimal API is running'}), 200


@app.route('/api/auth/signup', methods=['POST'])
def signup_user():
    """Simple user signup"""
    db = SessionLocal()
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        if not password:
            return jsonify({'error': 'Password is required'}), 400

        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        # Check if email already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409

        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(password)

        new_user = User(
            id=user_id,
            name=name,
            email=email,
            password_hash=hashed_password,
            is_email_verified=False
        )

        db.add(new_user)
        db.commit()

        # Generate JWT token
        token = generate_jwt_token(user_id)

        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'user': new_user.to_dict(),
            'requires_verification': False
        }), 201

    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.close()


@app.route('/api/auth/login', methods=['POST'])
def login_user():
    """Simple user login"""
    db = SessionLocal()
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        if not password:
            return jsonify({'error': 'Password is required'}), 400

        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Verify password
        if not verify_password(password, user.password_hash):
            return jsonify({'error': 'Invalid password'}), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()

        # Generate JWT token
        token = generate_jwt_token(user.id)

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.close()


@app.route('/api/debug/users', methods=['GET'])
def debug_get_users():
    """Debug endpoint to list all users"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        return jsonify({
            'count': len(users),
            'users': [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        print(f"Debug error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.close()


if __name__ == '__main__':
    print("Starting minimal authentication API server...")
    print("Available endpoints:")
    print("  GET  /api/health")
    print("  POST /api/auth/signup")
    print("  POST /api/auth/login")
    print("  GET  /api/debug/users")
    print(f"Starting server on http://localhost:5000")

    app.run(host='127.0.0.1', port=5000, debug=True)
