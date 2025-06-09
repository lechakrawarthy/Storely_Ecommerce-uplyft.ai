#!/usr/bin/env python3
"""
Debug script to test the refactored Flask application step by step
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def main():
    print("=== Storely E-commerce Backend Debug ===")
    print(f"Python version: {sys.version}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Python path: {sys.path[:3]}")  # Show first 3 paths

    # Test 1: Database module
    print("\n1. Testing database module...")
    try:
        from db.base import init_database, get_db_session
        print("   ✓ Database module imported successfully")
    except Exception as e:
        print(f"   ❌ Database import failed: {e}")
        return False

    # Test 2: Models and interfaces
    print("\n2. Testing models and interfaces...")
    try:
        from models.interfaces import UserResponse, UserLoginRequest
        print("   ✓ Models imported successfully")
    except Exception as e:
        print(f"   ❌ Models import failed: {e}")
        return False

    # Test 3: Authentication module
    print("\n3. Testing authentication module...")
    try:
        from models.auth.compute import AuthService
        print("   ✓ Auth service imported successfully")
    except Exception as e:
        print(f"   ❌ Auth service import failed: {e}")
        return False

    # Test 4: Controller module
    print("\n4. Testing controller module...")
    try:
        from services.controller import APIController
        print("   ✓ Controller imported successfully")
    except Exception as e:
        print(f"   ❌ Controller import failed: {e}")
        return False

    # Test 5: App creation
    print("\n5. Testing Flask app creation...")
    try:
        from app_final import create_app
        app = create_app()
        print("   ✓ Flask app created successfully")
        print(f"   App name: {app.name}")
        print(f"   Debug mode: {app.debug}")
    except Exception as e:
        print(f"   ❌ App creation failed: {e}")
        return False

    # Test 6: Start server
    print("\n6. Starting server...")
    try:
        with app.app_context():
            print("   ✓ App context active")

        print("   🚀 Starting Flask development server...")
        app.run(host='127.0.0.1', port=5000, debug=True, use_reloader=False)

    except Exception as e:
        print(f"   ❌ Server start failed: {e}")
        return False

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
