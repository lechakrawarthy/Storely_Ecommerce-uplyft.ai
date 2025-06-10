#!/usr/bin/env python3
"""
Simple test of the 3 core functionalities: Auth, Products, Chatbot
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"✅ Health Check: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
        return False

def test_products():
    """Test products endpoints"""
    print("\n🛍️  TESTING PRODUCTS")
    
    # Test get all products
    try:
        response = requests.get(f"{BASE_URL}/api/products", timeout=5)
        print(f"✅ Get Products: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if 'success' in data:
                print(f"   Success: {data['success']}")
                if data['success'] and 'data' in data:
                    products = data['data'].get('products', [])
                    print(f"   Found {len(products)} products")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Get Products Failed: {e}")
    
    # Test get categories
    try:
        response = requests.get(f"{BASE_URL}/api/categories", timeout=5)
        print(f"✅ Get Categories: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Categories: {data}")
    except Exception as e:
        print(f"❌ Get Categories Failed: {e}")
    
    # Test get single product
    try:
        response = requests.get(f"{BASE_URL}/api/products/1", timeout=5)
        print(f"✅ Get Product by ID: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if 'success' in data:
                print(f"   Success: {data['success']}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Get Product by ID Failed: {e}")

def test_auth():
    """Test authentication endpoints"""
    print("\n🔐 TESTING AUTHENTICATION")
    
    # Test registration
    try:
        user_data = {
            "email": "testuser@example.com",
            "password": "testpass123",
            "name": "Test User"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data, timeout=5)
        print(f"✅ User Registration: {response.status_code}")
        if response.status_code in [200, 201, 400]:  # 400 might be "user exists"
            data = response.json()
            print(f"   Response: {data}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Registration Failed: {e}")
    
    # Test login
    try:
        login_data = {
            "email": "testuser@example.com",
            "password": "testpass123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=5)
        print(f"✅ User Login: {response.status_code}")
        if response.status_code in [200, 401]:
            data = response.json()
            print(f"   Success: {data.get('success', False)}")
            if data.get('success') and 'data' in data:
                token = data['data'].get('token')
                if token:
                    print(f"   Token received: {token[:20]}...")
                    return token
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Login Failed: {e}")
    
    return None

def test_chatbot():
    """Test chatbot endpoints"""
    print("\n💬 TESTING CHATBOT")
    
    # Test send message
    try:
        message_data = {
            "message": "Hello, I need help finding books",
            "session_id": "test_session_123"
        }
        response = requests.post(f"{BASE_URL}/api/chat/send", json=message_data, timeout=5)
        print(f"✅ Send Chat Message: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Chat Send Failed: {e}")
    
    # Test get chat history
    try:
        response = requests.get(f"{BASE_URL}/api/chat/history/test_session_123", timeout=5)
        print(f"✅ Get Chat History: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   History: {data}")
    except Exception as e:
        print(f"❌ Chat History Failed: {e}")

def main():
    print("🚀 TESTING 3 CORE BACKEND FEATURES")
    print("=" * 50)
    
    # Test server is running
    if not test_health():
        print("❌ Server is not running. Please start the server first.")
        return
    
    # Test the 3 core features
    test_products()
    test_auth()
    test_chatbot()
    
    print("\n" + "=" * 50)
    print("🎯 CORE BACKEND TEST COMPLETE")
    print("The backend should now be working for:")
    print("  • 🛍️  Products (list, get by ID, categories)")
    print("  • 🔐 Authentication (register, login)")
    print("  • 💬 Chatbot (send message, get history)")

if __name__ == "__main__":
    main()
