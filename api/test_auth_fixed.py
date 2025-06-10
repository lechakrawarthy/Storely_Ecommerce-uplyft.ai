#!/usr/bin/env python3
"""
Test the fixed authentication system
"""
import sys
import os
import requests
import json

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set SECRET_KEY environment variable
os.environ['SECRET_KEY'] = 'test-secret-key-123'

def test_auth_service_directly():
    """Test AuthService directly"""
    print("🔐 Testing AuthService directly...")
    
    try:
        from db.base import init_database
        from models.auth.main import AuthController
        
        # Initialize database
        init_database('sqlite:///store.db')
        
        # Create auth controller
        auth_controller = AuthController()
        print("✓ AuthController created successfully")
        
        # Test registration
        test_data = {
            'name': 'DirectTestUser',
            'email': 'directtest@example.com',
            'password': 'TestPassword123!',
            'confirmPassword': 'TestPassword123!'
        }
        
        print("Testing registration...")
        result = auth_controller.register(test_data)
        
        if result['success']:
            print("✅ Direct registration successful!")
            print(f"   User ID: {result['data']['user']['id']}")
            print(f"   Username: {result['data']['user']['username']}")
            print(f"   Email: {result['data']['user']['email']}")
            print(f"   Token: {result['data']['token'][:30]}...")
            return True
        else:
            print(f"❌ Direct registration failed: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Direct test error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_server_startup():
    """Test if we can start the server"""
    print("\n🚀 Testing server startup...")
    
    try:
        from app_final import create_app
        
        # Set environment variable for secret key
        os.environ['SECRET_KEY'] = 'test-secret-key-123'
        
        # Create Flask app
        app = create_app()
        print("✓ Flask app created successfully")
        
        # Test with test client
        with app.test_client() as client:
            # Test health endpoint
            response = client.get('/health')
            print(f"✓ Health check: {response.status_code}")
            
            # Test signup endpoint
            signup_data = {
                'name': 'TestClientUser',
                'email': 'testclient@example.com',
                'password': 'TestPassword123!',
                'confirmPassword': 'TestPassword123!'
            }
            
            response = client.post(
                '/api/auth/signup',
                json=signup_data,
                content_type='application/json'
            )
            
            print(f"✓ Signup endpoint: {response.status_code}")
            
            if response.status_code in [200, 201]:
                data = response.get_json()
                if data.get('success'):
                    print("✅ Test client signup successful!")
                    return True
                else:
                    print(f"❌ Test client signup failed: {data.get('error', 'Unknown')}")
                    print(f"   Response: {data}")
                    return False
            else:
                print(f"❌ Test client signup failed with status {response.status_code}")
                try:
                    print(f"   Response: {response.get_json()}")
                except:
                    print(f"   Response text: {response.get_data()}")
                return False
                
    except Exception as e:
        print(f"❌ Server test error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("🧪 AUTHENTICATION FIX VERIFICATION")
    print("=" * 50)
    
    # Test 1: Direct AuthService test
    direct_success = test_auth_service_directly()
    
    # Test 2: Server startup and signup test
    server_success = test_server_startup()
    
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Direct AuthService test: {'✅ PASS' if direct_success else '❌ FAIL'}")
    print(f"Server startup test: {'✅ PASS' if server_success else '❌ FAIL'}")
    
    if direct_success and server_success:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Authentication system is fixed and working!")
        print("\n📝 Summary of the fix:")
        print("   - Fixed Flask application context issue in AuthService")
        print("   - Added fallback to environment variables for SECRET_KEY")
        print("   - User registration now works correctly")
        print("   - JWT token generation is functional")
        return True
    else:
        print("\n❌ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
