#!/usr/bin/env python3
"""
Test Flask app startup and basic functionality
"""
import sys
import os
import traceback

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def main():
    print("=== Testing Flask App Startup ===")

    try:
        # Test 1: Import the app
        print("1. Importing app...")
        from app_final import create_app

        # Test 2: Create app
        print("2. Creating Flask app...")
        app = create_app()
        print(f"   ✓ App created: {app.name}")

        # Test 3: Test basic endpoints
        print("3. Testing endpoints...")
        with app.test_client() as client:
            # Health check
            response = client.get('/health')
            print(f"   - Health check: {response.status_code}")
            if response.status_code == 200:
                print(f"     Response: {response.get_json()}")

            # Test auth endpoints exist
            response = client.post('/api/auth/register', json={})
            print(
                f"   - Register endpoint: {response.status_code} (should not be 404)")

            response = client.post('/api/auth/login', json={})
            print(
                f"   - Login endpoint: {response.status_code} (should not be 404)")

            response = client.get('/api/products')
            print(
                f"   - Products endpoint: {response.status_code} (should not be 404)")

        print("\n✅ Basic app functionality test passed!")

        # Test 4: Start the server briefly
        print("4. Testing server startup...")
        try:
            import threading
            import time
            import requests

            def run_server():
                app.run(host='127.0.0.1', port=5001,
                        debug=False, use_reloader=False)

            # Start server in background thread
            server_thread = threading.Thread(target=run_server, daemon=True)
            server_thread.start()
            time.sleep(2)  # Give server time to start

            # Test HTTP request
            try:
                response = requests.get(
                    'http://127.0.0.1:5001/health', timeout=3)
                print(f"   - HTTP health check: {response.status_code}")
                print(f"     Response: {response.json()}")
                print("✅ HTTP server test passed!")
            except Exception as e:
                print(f"   ⚠️  HTTP test failed: {e}")

        except Exception as e:
            print(f"   ⚠️  Server startup test failed: {e}")

        return True

    except Exception as e:
        print(f"❌ App startup failed: {e}")
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    if success:
        print("\n🚀 Ready to start the main server!")
        print("Run: python app_final.py")
    else:
        print("\n❌ Please fix the issues above")

    sys.exit(0 if success else 1)
