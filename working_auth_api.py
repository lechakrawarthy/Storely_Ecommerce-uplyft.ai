#!/usr/bin/env python3
"""
Working minimal Flask API for authentication
"""

import os
import sys
import uuid
import json
import pickle
from datetime import datetime, timedelta
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS

# Simple configuration


class Config:
    SECRET_KEY = 'dev-secret-key-change-in-production'
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080"
    ]


app = Flask(__name__)
app.config['SECRET_KEY'] = Config.SECRET_KEY

# Enable CORS
CORS(app, origins=Config.CORS_ORIGINS)

# User database with persistence
DB_FILE = "users_db.pickle"

# Try to load existing database if it exists
users_db = {}
try:
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'rb') as f:
            users_db = pickle.load(f)
        print(f"👤 Loaded {len(users_db)} users from database")
    else:
        users_db = {}
        print("📝 Created new users database")
except Exception as e:
    print(f"⚠️ Error loading database: {e}")
    users_db = {}


def save_users_db():
    """Save the users database to disk"""
    try:
        with open(DB_FILE, 'wb') as f:
            pickle.dump(users_db, f)
        print(f"💾 Saved {len(users_db)} users to database")
        return True
    except Exception as e:
        print(f"❌ Error saving database: {e}")
        return False


def hash_password(password):
    """Simple password hashing (use bcrypt in production)"""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed):
    """Verify password"""
    return hash_password(password) == hashed


def generate_token(user_id):
    """Simple token generation (use JWT in production)"""
    return f"token_{user_id}_{int(datetime.now().timestamp())}"


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Working API is running',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/auth/signup', methods=['POST'])
def signup_user():
    """User signup endpoint"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')

        # Validation
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
        if email in users_db:
            # Create new user
            return jsonify({'error': 'Email already registered'}), 409
        user_id = str(uuid.uuid4())
        user_data = {
            'id': user_id,
            'name': name,
            'email': email,
            'password_hash': hash_password(password),
            'created_at': datetime.now().isoformat(),
            'is_active': True
        }

        users_db[email] = user_data

        # Save database to disk
        if not save_users_db():
            return jsonify({'error': 'Failed to save user data'}), 500

        # Generate token
        token = generate_token(user_id)

        # Return user data without password
        user_response = user_data.copy()
        del user_response['password_hash']

        print(f"✨ New user created: {email}")
        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'user': user_response
        }), 201

    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login_user():
    """User login endpoint"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        if not password:
            # Find user by email
            return jsonify({'error': 'Password is required'}), 400
        if email not in users_db:
            print(f"❌ Login failed: User not found - {email}")
            return jsonify({'error': 'User not found'}), 404

        user_data = users_db[email]

        # Verify password
        if not verify_password(password, user_data['password_hash']):
            print(f"❌ Login failed: Invalid password for {email}")
            return jsonify({'error': 'Invalid password'}), 401

        # Generate token
        # Return user data without password
        token = generate_token(user_data['id'])
        user_response = user_data.copy()
        del user_response['password_hash']

        # Update last login time
        last_login = datetime.now().isoformat()
        user_response['last_login'] = last_login
        user_data['last_login'] = last_login

        # Save the updated user data
        save_users_db()

        print(f"🔓 User logged in: {email}")
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user_response
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/debug/users', methods=['GET'])
def debug_get_users():
    """Debug endpoint to list all users"""
    try:
        users_list = []
        for email, user_data in users_db.items():
            user_copy = user_data.copy()
            del user_copy['password_hash']  # Don't expose password hashes
            users_list.append(user_copy)

        # Sort users by creation date (newest first)
        users_list.sort(key=lambda x: x.get('created_at', ''), reverse=True)

        # Get database stats
        db_stats = {
            'file_path': os.path.abspath(DB_FILE),
            'file_size': f"{os.path.getsize(DB_FILE) / 1024:.2f} KB" if os.path.exists(DB_FILE) else "Not found",
            'last_modified': datetime.fromtimestamp(os.path.getmtime(DB_FILE)).isoformat() if os.path.exists(DB_FILE) else None,
            'active_users': len([u for u in users_list if u.get('is_active')])
        }

        return jsonify({
            'count': len(users_list),
            'users': users_list,
            'database': db_stats,
            'server_time': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"Debug error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


# Serve the admin dashboard as static file
@app.route('/api/admin', methods=['GET'])
def admin_dashboard():
    """Admin dashboard to view and manage users"""
    try:
        # Read the HTML file
        with open('admin_dashboard.html', 'r') as file:
            html_content = file.read()

        return html_content, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        print(f"Error serving admin dashboard: {e}")
        return jsonify({'error': 'Admin dashboard not available'}), 500


# Add test user if it doesn't exist already
if 'test@example.com' not in users_db:
    users_db['test@example.com'] = {
        'id': str(uuid.uuid4()),
        'name': 'Test User',
        'email': 'test@example.com',
        'password_hash': hash_password('testpass123'),
        'created_at': datetime.now().isoformat(),
        'is_active': True
    }
    save_users_db()
    print("📝 Added test user: test@example.com / testpass123")

if __name__ == '__main__':
    print("🚀 Starting Working Authentication API Server...")
    print("📍 Available endpoints:")
    print("   GET  /api/health - Health check")
    print("   POST /api/auth/signup - User signup")
    print("   POST /api/auth/login - User login")
    print("   GET  /api/debug/users - List users (debug)")
    print("   GET  /api/admin - User Database Admin Dashboard")
    print(f"🌐 Server starting on http://localhost:5000")
    print(f"👨‍💼 Admin dashboard: http://localhost:5000/api/admin")
    print("📝 Test user: test@example.com / testpass123")
    print("💾 Database location: " + os.path.abspath(DB_FILE))
    print("=" * 50)

    app.run(host='127.0.0.1', port=5000, debug=True)
