#!/usr/bin/env python3
"""
Simple Signup Test
Test the signup endpoint with minimal data
"""
import requests
import json

def test_signup_simple():
    """Test signup with valid data"""
    try:
        # Test basic server connectivity first
        health_response = requests.get('http://localhost:5000/health', timeout=5)
        print(f"✅ Health check: {health_response.status_code}")
        
        # Test signup endpoint
        signup_data = {
            'name': 'John Doe',
            'email': 'john.doe@example.com',
            'password': 'TestPass123!',
            'confirmPassword': 'TestPass123!'
        }
        
        print(f"📤 Testing signup with: {signup_data}")
        
        response = requests.post(
            'http://localhost:5000/api/auth/signup',
            json=signup_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📨 Signup Response Status: {response.status_code}")
        print(f"📋 Response Text: {response.text}")
        
        if response.headers.get('Content-Type', '').startswith('application/json'):
            try:
                data = response.json()
                print(f"📄 Response JSON: {json.dumps(data, indent=2)}")
            except:
                print("❌ Invalid JSON response")
        
        return response.status_code == 200 or response.status_code == 201
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Simple Signup Test")
    print("=" * 30)
    success = test_signup_simple()
    print(f"\n{'✅ SUCCESS' if success else '❌ FAILED'}")
