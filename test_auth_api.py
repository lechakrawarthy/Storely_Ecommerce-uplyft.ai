#!/usr/bin/env python3

import requests
import json

# Test the authentication API
API_BASE = "http://localhost:5000/api"


def test_health():
    """Test if API is running"""
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False


def test_signup():
    """Test signup endpoint"""
    signup_data = {
        "type": "email",
        "name": "Test User",
        "email": "test123@example.com",
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }

    try:
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.text}")

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Signup failed with status {response.status_code}")
            return None

    except Exception as e:
        print(f"Signup test failed: {e}")
        return None


def test_login():
    """Test login endpoint"""
    login_data = {
        "type": "email",
        "email": "test123@example.com",
        "password": "testpass123"
    }

    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Login failed with status {response.status_code}")
            return None

    except Exception as e:
        print(f"Login test failed: {e}")
        return None


if __name__ == "__main__":
    print("=== Testing Authentication API ===")

    # Test health
    print("\n1. Testing Health Endpoint:")
    if not test_health():
        print("API is not running. Exiting.")
        exit(1)

    # Test signup
    print("\n2. Testing Signup:")
    signup_result = test_signup()

    # Test login
    print("\n3. Testing Login:")
    login_result = test_login()

    print("\n=== Test Complete ===")
