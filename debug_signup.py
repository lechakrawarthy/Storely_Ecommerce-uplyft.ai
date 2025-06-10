#!/usr/bin/env python3
"""
Debug Signup Issue
Test the signup endpoint to see what's causing the internal server error
"""
import requests
import json

def test_signup():
    """Test signup endpoint"""
    try:
        print("🔍 Testing Signup Endpoint")
        print("=" * 40)
        
        # Test data with valid format
        signup_data = {
            'name': 'Test User',
            'email': 'test@example.com', 
            'password': 'TestPass123!',
            'confirmPassword': 'TestPass123!'
        }
        
        print(f"📤 Sending signup request with data: {signup_data}")
        
        response = requests.post(
            'http://localhost:5000/api/auth/signup',
            json=signup_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📨 Response Status: {response.status_code}")
        print(f"📄 Response Headers: {dict(response.headers)}")
        print(f"📋 Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Signup successful: {data}")
        else:
            print(f"❌ Signup failed with status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server - is it running on port 5000?")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_health():
    """Test health endpoint first"""
    try:
        response = requests.get('http://localhost:5000/health')
        print(f"🌐 Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Server is running: {response.json()}")
        return response.status_code == 200
    except:
        print("❌ Server not responding")
        return False

if __name__ == "__main__":
    print("🔍 Signup Debug Test")
    print("=" * 40)
    
    if test_health():
        test_signup()
    else:
        print("⚠️ Server is not running - start the server first")
