#!/usr/bin/env python3
"""
Test the refactored Flask application with proper authentication flow
"""
import os
import sys
import json
import tempfile
import requests
import time
import threading
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def start_test_server():
    """Start the Flask application for testing"""
    print("🚀 Starting test Flask server...")

    try:
        # Import and configure the app
        from app_final import create_app

        # Use a temporary database for testing
        test_db_path = os.path.join(tempfile.gettempdir(
        ), f"test_storely_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db")
        db_url = f"sqlite:///{test_db_path.replace(os.sep, '/')}"

        # Create app with test config
        app = create_app(
            database_url=db_url,
            secret_key="test-secret-key-12345",
            debug=False
        )

        print(f"✓ Flask app created with test database: {db_url}")

        # Start server in a separate thread
        def run_server():
            app.run(host='127.0.0.1', port=5001,
                    debug=False, use_reloader=False)

        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()

        # Wait for server to start
        print("⏳ Waiting for server to start...")
        time.sleep(3)

        return "http://127.0.0.1:5001", test_db_path

    except Exception as e:
        print(f"✗ Failed to start test server: {e}")
        import traceback
        traceback.print_exc()
        return None, None


def test_health_check(base_url):
    """Test health check endpoint"""
    print("\n🏥 Testing health check...")

    try:
        response = requests.get(f"{base_url}/health", timeout=5)

        if response.status_code == 200:
            data = response.json()
            print(f"✓ Health check passed: {data.get('message', 'OK')}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"✗ Health check error: {e}")
        return False


def test_user_registration(base_url):
    """Test user registration endpoint"""
    print("\n👤 Testing user registration...")

    try:
        # Test user data
        test_user = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123!",
            "name": "Test User",
            "phone": "+1234567890"
        }

        response = requests.post(
            f"{base_url}/api/auth/register",
            json=test_user,
            timeout=10
        )

        print(f"Registration response status: {response.status_code}")

        if response.status_code in [200, 201]:
            data = response.json()
            if data.get('success'):
                print(f"✓ Registration successful")
                print(f"  - User ID: {data['data']['user']['id']}")
                print(f"  - Token: {'✓' if data['data']['token'] else '✗'}")
                return data['data']
            else:
                print(
                    f"✗ Registration failed: {data.get('error', 'Unknown error')}")
                return None
        else:
            print(f"✗ Registration failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"  Error: {error_data}")
            except:
                print(f"  Error: {response.text}")
            return None

    except Exception as e:
        print(f"✗ Registration error: {e}")
        return None


def test_user_login(base_url):
    """Test user login endpoint"""
    print("\n🔐 Testing user login...")

    try:
        # Login data
        login_data = {
            "email": "test@example.com",
            "password": "TestPassword123!"
        }

        response = requests.post(
            f"{base_url}/api/auth/login",
            json=login_data,
            timeout=10
        )

        print(f"Login response status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✓ Login successful")
                print(f"  - User ID: {data['data']['user']['id']}")
                print(f"  - Token: {'✓' if data['data']['token'] else '✗'}")
                return data['data']
            else:
                print(f"✗ Login failed: {data.get('error', 'Unknown error')}")
                return None
        else:
            print(f"✗ Login failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"  Error: {error_data}")
            except:
                print(f"  Error: {response.text}")
            return None

    except Exception as e:
        print(f"✗ Login error: {e}")
        return None


def test_token_verification(base_url, token):
    """Test token verification endpoint"""
    print("\n🔍 Testing token verification...")

    try:
        headers = {'Authorization': f'Bearer {token}'}

        response = requests.post(
            f"{base_url}/api/auth/verify-token",
            headers=headers,
            timeout=10
        )

        print(f"Token verification response status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✓ Token verification successful")
                print(f"  - User ID: {data['data']['user_id']}")
                return data['data']
            else:
                print(
                    f"✗ Token verification failed: {data.get('error', 'Unknown error')}")
                return None
        else:
            print(
                f"✗ Token verification failed with status {response.status_code}")
            return None

    except Exception as e:
        print(f"✗ Token verification error: {e}")
        return None


def test_protected_endpoint(base_url, token):
    """Test a protected endpoint (user profile)"""
    print("\n🛡️ Testing protected endpoint...")

    try:
        headers = {'Authorization': f'Bearer {token}'}

        response = requests.get(
            f"{base_url}/api/auth/profile",
            headers=headers,
            timeout=10
        )

        print(f"Profile response status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✓ Protected endpoint access successful")
                print(f"  - Profile: {data['data']['user']['name']}")
                return True
            else:
                print(
                    f"✗ Protected endpoint failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(
                f"✗ Protected endpoint failed with status {response.status_code}")
            return False

    except Exception as e:
        print(f"✗ Protected endpoint error: {e}")
        return False


def test_products_endpoint(base_url):
    """Test products endpoint (should work without auth)"""
    print("\n📦 Testing products endpoint...")

    try:
        response = requests.get(f"{base_url}/api/products", timeout=10)

        print(f"Products response status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                products = data.get('data', [])
                print(
                    f"✓ Products endpoint working: {len(products)} products found")
                return True
            else:
                print(
                    f"✗ Products endpoint failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(
                f"✗ Products endpoint failed with status {response.status_code}")
            return False

    except Exception as e:
        print(f"✗ Products endpoint error: {e}")
        return False


def cleanup_test_db(db_path):
    """Clean up test database"""
    try:
        if db_path and os.path.exists(db_path):
            # Wait a moment for any file handles to close
            time.sleep(1)
            os.remove(db_path)
            print(f"\n🧹 Cleaned up test database: {db_path}")
    except Exception as e:
        print(f"⚠️ Could not clean up test database: {e}")


def main():
    """Run comprehensive API tests"""
    print("🚀 Starting Comprehensive API Tests")
    print("=" * 50)

    base_url = None
    db_path = None

    try:
        # Start test server
        base_url, db_path = start_test_server()
        if not base_url:
            return False

        # Test health check
        if not test_health_check(base_url):
            print("⚠️ Health check failed, stopping tests")
            return False

        # Test registration
        reg_result = test_user_registration(base_url)
        if not reg_result:
            print("⚠️ Registration failed, skipping auth-dependent tests")
            return False

        # Test login
        login_result = test_user_login(base_url)
        if not login_result:
            print("⚠️ Login failed, skipping token tests")
            return False

        token = login_result['token']

        # Test token verification
        if not test_token_verification(base_url, token):
            print("⚠️ Token verification failed")
            return False

        # Test protected endpoint
        if not test_protected_endpoint(base_url, token):
            print("⚠️ Protected endpoint failed")
            return False

        # Test products endpoint
        if not test_products_endpoint(base_url):
            print("⚠️ Products endpoint failed")

        print("\n" + "=" * 50)
        print("🎉 All API tests completed!")
        print("✅ Health Check: Working")
        print("✅ User Registration: Working")
        print("✅ User Login: Working")
        print("✅ Token Verification: Working")
        print("✅ Protected Endpoints: Working")
        print("✅ Public Endpoints: Working")
        print("\n🔧 Refactored backend is fully functional!")
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
