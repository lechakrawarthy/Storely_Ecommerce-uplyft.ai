#!/usr/bin/env python3
"""
Test the refactored authentication system
"""
import os
import sys
import json
import tempfile
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Test functions


def test_database_initialization():
    """Test database initialization"""
    print("🗄️ Testing database initialization...")

    try:
        from db.base import init_database
        # Use a temporary database for testing
        test_db_path = os.path.join(tempfile.gettempdir(
        ), f"test_storely_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db")

        # Format as proper SQLite URL for Windows
        db_url = f"sqlite:///{test_db_path.replace(os.sep, '/')}"
        # Initialize database
        init_database(db_url, echo=False)
        print(f"✓ Database initialized at {db_url}")

        return test_db_path

    except Exception as e:
        print(f"✗ Database initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_controller_creation():
    """Test APIController creation"""
    print("\n🎛️ Testing APIController creation...")

    try:
        from services.controller import APIController

        controller = APIController("test-secret-key")
        print("✓ APIController created successfully")

        return controller

    except Exception as e:
        print(f"✗ APIController creation failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_auth_registration(controller):
    """Test user registration"""
    print("\n👤 Testing user registration...")

    try:
        # Mock request data
        test_user = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123!",
            "name": "Test User",
            "phone": "+1234567890"
        }

        # We need to simulate the Flask request context
        from unittest.mock import Mock, patch

        with patch('flask.request') as mock_request:
            mock_request.get_json.return_value = test_user
            result = controller.auth_controller.register(test_user)

        print(f"✓ Registration result: {result['success']}")
        if result['success']:
            print(f"  - User ID: {result['data']['user']['id']}")
            print(f"  - Token generated: {bool(result['data']['token'])}")
            return result['data']
        else:
            print(f"  - Error: {result.get('error', 'Unknown error')}")
            return None

    except Exception as e:
        print(f"✗ Registration failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_auth_login(controller):
    """Test user login"""
    print("\n🔐 Testing user login...")

    try:
        # Mock request data
        login_data = {
            "email": "test@example.com",
            "password": "TestPassword123!"
        }

        # We need to simulate the Flask request context
        from unittest.mock import Mock, patch

        with patch('flask.request') as mock_request:
            mock_request.get_json.return_value = login_data
            result = controller.auth_controller.login(login_data)

        print(f"✓ Login result: {result['success']}")
        if result['success']:
            print(f"  - User ID: {result['data']['user']['id']}")
            print(f"  - Token generated: {bool(result['data']['token'])}")
            return result['data']
        else:
            print(f"  - Error: {result.get('error', 'Unknown error')}")
            return None

    except Exception as e:
        print(f"✗ Login failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_token_verification(controller, token):
    """Test token verification"""
    print("\n🔍 Testing token verification...")

    try:
        result = controller.auth_controller.verify_token(token)

        print(f"✓ Token verification result: {result['success']}")
        if result['success']:
            print(f"  - User ID: {result['data']['user_id']}")
            print(f"  - Email: {result['data']['email']}")
            return result['data']
        else:
            print(f"  - Error: {result.get('error', 'Unknown error')}")
            return None

    except Exception as e:
        print(f"✗ Token verification failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def cleanup_test_db(db_path):
    """Clean up test database"""
    try:
        if db_path and os.path.exists(db_path):
            os.remove(db_path)
            print(f"\n🧹 Cleaned up test database: {db_path}")
    except Exception as e:
        print(f"⚠️ Could not clean up test database: {e}")


def main():
    """Run authentication tests"""
    print("🚀 Starting Authentication Flow Tests")
    print("=" * 50)

    db_path = None

    try:
        # Initialize database
        db_path = test_database_initialization()
        if not db_path:
            return False

        # Create controller
        controller = test_controller_creation()
        if not controller:
            return False

        # Test registration
        reg_result = test_auth_registration(controller)
        if not reg_result:
            print("⚠️ Registration failed, skipping login test")
            return False

        # Test login
        login_result = test_auth_login(controller)
        if not login_result:
            print("⚠️ Login failed, skipping token verification")
            return False

        # Test token verification
        token = login_result['token']
        verify_result = test_token_verification(controller, token)
        if not verify_result:
            print("⚠️ Token verification failed")
            return False

        print("\n" + "=" * 50)
        print("🎉 All authentication tests passed!")
        print("✅ Registration: Working")
        print("✅ Login: Working")
        print("✅ Token Verification: Working")
        return True

    except Exception as e:
        print(f"\n💥 Test suite failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        cleanup_test_db(db_path)


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
