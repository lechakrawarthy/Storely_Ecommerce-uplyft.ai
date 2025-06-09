#!/usr/bin/env python3
"""
Direct test of Flask app startup with error handling
"""
import sys
import os
import traceback

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)


def test_flask_startup():
    """Test Flask application startup with detailed error reporting"""
    print("=== Flask App Startup Test ===")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python executable: {sys.executable}")
    print(f"Python version: {sys.version}")

    try:
        print("\n1. Testing imports...")

        # Test database import
        print("   - Importing database module...")
        from db.base import init_database
        print("   ✓ Database module imported")

        # Test models import
        print("   - Importing models...")
        from models.interfaces import UserResponse
        print("   ✓ Models imported")

        # Test auth import
        print("   - Importing auth service...")
        from models.auth.compute import AuthService
        print("   ✓ Auth service imported")

        # Test controller import
        print("   - Importing API controller...")
        from services.controller import APIController
        print("   ✓ API controller imported")

        print("\n2. Creating Flask application...")
        from app_final import create_app
        app = create_app()
        print("   ✓ Flask app created successfully")

        print(f"\n3. App details:")
        print(f"   - App name: {app.name}")
        print(f"   - Debug mode: {app.debug}")
        # First 10 config keys
        print(f"   - Config keys: {list(app.config.keys())[:10]}...")

        print("\n4. Testing routes...")
        with app.test_client() as client:
            # Test health endpoint
            response = client.get('/health')
            print(f"   - Health endpoint: {response.status_code}")
            if response.status_code == 200:
                print(f"   - Health response: {response.get_json()}")

            # Test auth endpoint structure
            response = client.post('/api/auth/register', json={})
            print(
                f"   - Register endpoint accessible: {response.status_code != 404}")

            # Test products endpoint structure
            response = client.get('/api/products')
            print(
                f"   - Products endpoint accessible: {response.status_code != 404}")

        print("\n✅ All startup tests passed!")
        return True

    except Exception as e:
        print(f"\n❌ Startup test failed: {e}")
        print("\nFull traceback:")
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_flask_startup()
    if success:
        print("\n🚀 Flask app is ready to run!")
        print("You can now start the server with: python app_final.py")
    else:
        print("\n⚠️  Please fix the issues above before starting the server.")

    sys.exit(0 if success else 1)
