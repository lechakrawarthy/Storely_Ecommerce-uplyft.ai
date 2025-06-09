#!/usr/bin/env python3
"""
Simple HTTP test for the refactored API
"""
import requests
import json
import time
import sys
import subprocess
import threading
import os

# API base URL
BASE_URL = "http://127.0.0.1:5000"


def start_server():
    """Start the Flask server in a subprocess"""
    print("Starting Flask server...")
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Start the server
    process = subprocess.Popen(
        [sys.executable, "app_final.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Wait a bit for server to start
    time.sleep(3)
    return process


def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


def test_user_registration():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    try:
        user_data = {
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        }

        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )

        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code in [200, 201]
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        return False


def test_user_login():
    """Test user login"""
    print("\n=== Testing User Login ===")
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }

        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )

        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return False


def test_products():
    """Test products endpoint"""
    print("\n=== Testing Products ===")
    try:
        response = requests.get(f"{BASE_URL}/api/products", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Products test failed: {e}")
        return False


def main():
    """Run all tests"""
    print("🧪 Starting API Tests...")

    # Start server
    server_process = start_server()

    try:
        # Wait for server to be ready
        print("Waiting for server to start...")
        time.sleep(5)

        # Run tests
        results = []
        results.append(test_health_check())
        results.append(test_user_registration())
        results.append(test_user_login())
        results.append(test_products())

        # Summary
        passed = sum(results)
        total = len(results)
        print(f"\n=== Test Results ===")
        print(f"Passed: {passed}/{total}")

        if passed == total:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed!")

    finally:
        # Cleanup
        if server_process:
            server_process.terminate()
            server_process.wait()

    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
