#!/usr/bin/env python3
"""
Test the fixed authentication via HTTP endpoints
"""
import sys
import os
import requests
import threading
import time
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def start_server():
    """Start the Flask server in a separate thread"""
    print("🚀 Starting Flask server...")
    
    # Set environment variable
    os.environ['SECRET_KEY'] = 'test-secret-key-123'
    
    try:
        from app_final import create_app
        app = create_app()
        
        # Run server
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=False,
            use_reloader=False,
            threaded=True
        )
    except Exception as e:
        print(f"❌ Server error: {e}")

def test_http_endpoints():
    """Test HTTP endpoints"""
    print("🌐 Testing HTTP endpoints...")
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    try:
        # Test health check
        print("Testing health check...")
        response = requests.get('http://localhost:5000/health', timeout=5)
        print(f"Health check: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Server is running!")
        else:
            print("❌ Server health check failed")
            return False
        
        # Test signup
        print("Testing signup endpoint...")
        signup_data = {
            'name': 'HTTPTestUser',
            'email': 'httptest@example.com',
            'password': 'TestPassword123!',
            'confirmPassword': 'TestPassword123!'
        }
        
        response = requests.post(
            'http://localhost:5000/api/auth/signup',
            json=signup_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Signup response: {response.status_code}")
        
        if response.status_code in [200, 201]:
            data = response.json()
            if data.get('success'):
                print("✅ HTTP signup successful!")
                print(f"   User: {data['data']['user']['username']}")
                print(f"   Token: {data['data']['token'][:30]}...")
                return True
            else:
                print(f"❌ HTTP signup failed: {data.get('error', 'Unknown')}")
                return False
        else:
            print(f"❌ HTTP signup failed with status {response.status_code}")
            try:
                print(f"   Response: {response.json()}")
            except:
                print(f"   Response text: {response.text}")
            return False
            
    except requests.ConnectionError:
        print("❌ Could not connect to server")
        return False
    except Exception as e:
        print(f"❌ HTTP test error: {e}")
        return False

def main():
    """Run HTTP test"""
    print("=" * 50)
    print("🌐 HTTP AUTHENTICATION TEST")
    print("=" * 50)
    
    # Start server in background thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Test endpoints
    success = test_http_endpoints()
    
    print("\n" + "=" * 50)
    print("📊 HTTP TEST RESULT")
    print("=" * 50)
    
    if success:
        print("🎉 HTTP AUTHENTICATION TEST PASSED!")
        print("✅ The signup endpoint is working correctly!")
        print("✅ Users can now register through the frontend!")
    else:
        print("❌ HTTP test failed")
    
    return success

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🚀 You can now test the frontend at http://localhost:8080")
        print("💡 The authentication issue has been resolved!")
        
        # Keep server running for a bit
        print("\n⏳ Keeping server running for 30 seconds for testing...")
        time.sleep(30)
        
    sys.exit(0 if success else 1)
