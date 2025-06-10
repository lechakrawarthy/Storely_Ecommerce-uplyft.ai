#!/usr/bin/env python3
"""
Quick Authentication Test
"""
import sys
import os
sys.path.append('api')

def test_auth():
    """Test authentication and create a test user"""
    try:
        print("🔍 Testing Authentication")
        print("=" * 40)
        
        # Test database connection
        from db.base import init_database, get_db_session
        init_database('sqlite:///api/store.db')
        session = get_db_session()
        
        from db.base import User
        
        # Check existing users
        existing_users = session.query(User).all()
        print(f"📊 Existing users in database: {len(existing_users)}")
        
        if existing_users:
            for user in existing_users[:3]:
                print(f"   • {user.username} ({user.email})")
        
        # Test signup API
        print(f"\n🔐 Testing Signup API...")
        import requests
        
        signup_data = {
            "username": "testuser",
            "email": "test@example.com", 
            "password": "TestPassword123!",
            "name": "Test User"
        }
        
        try:
            response = requests.post('http://localhost:5000/api/auth/signup', json=signup_data)
            print(f"Signup Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Signup Success: {data.get('success', False)}")
                print(f"Message: {data.get('message', 'N/A')}")
            else:
                print(f"Signup Error: {response.text}")
        except Exception as e:
            print(f"Signup API Error: {e}")
            
        # Test login API
        print(f"\n🔑 Testing Login API...")
        login_data = {
            "email": "test@example.com",
            "password": "TestPassword123!"
        }
        
        try:
            response = requests.post('http://localhost:5000/api/auth/login', json=login_data)
            print(f"Login Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Login Success: {data.get('success', False)}")
                print(f"Token received: {'Yes' if data.get('token') else 'No'}")
            else:
                print(f"Login Error: {response.text}")
        except Exception as e:
            print(f"Login API Error: {e}")
            
        session.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_auth()