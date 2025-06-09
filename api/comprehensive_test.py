#!/usr/bin/env python3
"""
Comprehensive API Test Suite for Refactored Backend
"""
import sys
import os
import time
import json
import subprocess
import threading
import requests
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

API_BASE = "http://127.0.0.1:5000"
server_process = None


def log(message):
    """Log with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")


def start_server():
    """Start the Flask server in a subprocess"""
    global server_process
    log("🚀 Starting Flask server...")

    try:
        server_process = subprocess.Popen(
            [sys.executable, "start_server.py"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Wait for server to start
        log("⏳ Waiting for server to initialize...")
        time.sleep(5)

        return True
    except Exception as e:
        log(f"❌ Failed to start server: {e}")
        return False


def stop_server():
    """Stop the Flask server"""
    global server_process
    if server_process:
        log("🛑 Stopping server...")
        server_process.terminate()
        server_process.wait()


def test_health_check():
    """Test the health check endpoint"""
    log("🩺 Testing health check...")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            log(f"✅ Health check passed: {data.get('message', 'OK')}")
            return True
        else:
            log(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        log(f"❌ Health check error: {e}")
        return False


def test_auth_registration():
    """Test user registration"""
    log("👤 Testing user registration...")
    try:
        user_data = {
            "email": "test@example.com",
            "password": "TestPass123!",
            "username": "testuser",
            "name": "Test User",
            "phone": "+1234567890"
        }

        response = requests.post(
            f"{API_BASE}/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )

        log(f"Registration response: {response.status_code}")
        if response.status_code in [200, 201]:
            data = response.json()
            if data.get('success'):
                log(f"✅ Registration successful: {data.get('message')}")
                return data.get('data', {}).get('token')
            else:
                log(f"⚠️  Registration failed: {data.get('error')}")
                return None
        else:
            log(f"❌ Registration failed: {response.status_code} - {response.text}")
            return None

    except Exception as e:
        log(f"❌ Registration error: {e}")
        return None


def test_auth_login():
    """Test user login"""
    log("🔐 Testing user login...")
    try:
        login_data = {
            "email": "test@example.com",
            "password": "TestPass123!"
        }

        response = requests.post(
            f"{API_BASE}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )

        log(f"Login response: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                log(f"✅ Login successful: {data.get('message')}")
                return data.get('data', {}).get('token')
            else:
                log(f"⚠️  Login failed: {data.get('error')}")
                return None
        else:
            log(f"❌ Login failed: {response.status_code} - {response.text}")
            return None

    except Exception as e:
        log(f"❌ Login error: {e}")
        return None


def test_products():
    """Test products endpoints"""
    log("🛍️  Testing products...")
    try:
        response = requests.get(f"{API_BASE}/api/products", timeout=10)
        log(f"Products response: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            log(f"✅ Products endpoint working: {len(data.get('data', []))} products")
            return True
        else:
            log(
                f"⚠️  Products endpoint issue: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        log(f"❌ Products error: {e}")
        return False


def test_chat():
    """Test chat endpoints"""
    log("💬 Testing chat...")
    try:
        chat_data = {
            "message": "Hello, can you help me find a product?",
            "session_id": "test-session-123"
        }

        response = requests.post(
            f"{API_BASE}/api/chat/send",
            json=chat_data,
            headers={"Content-Type": "application/json"},
            timeout=15
        )

        log(f"Chat response: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ Chat endpoint working: {data.get('message', 'OK')}")
            return True
        else:
            log(f"⚠️  Chat endpoint issue: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        log(f"❌ Chat error: {e}")
        return False


def main():
    """Run all tests"""
    log("🧪 Starting Comprehensive API Tests")
    log("=" * 50)

    # Start server
    if not start_server():
        log("❌ Failed to start server, aborting tests")
        return False

    try:
        # Run tests
        results = {}

        # Basic connectivity
        results['health'] = test_health_check()

        if results['health']:
            # Authentication tests
            token = test_auth_registration()
            if not token:
                # Try to login if registration failed (user might already exist)
                token = test_auth_login()

            results['auth'] = token is not None

            # Feature tests
            results['products'] = test_products()
            results['chat'] = test_chat()
        else:
            log("❌ Health check failed, skipping other tests")
            results.update({'auth': False, 'products': False, 'chat': False})

        # Summary
        log("\n" + "=" * 50)
        log("📊 TEST RESULTS SUMMARY")
        log("=" * 50)

        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result)

        for test_name, passed in results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            log(f"{test_name.capitalize():<12}: {status}")

        log(f"\nOverall: {passed_tests}/{total_tests} tests passed")

        if passed_tests == total_tests:
            log("🎉 ALL TESTS PASSED! The refactored backend is working!")
        elif passed_tests > 0:
            log("⚠️  Some tests passed, but there are issues to fix")
        else:
            log("❌ All tests failed, backend needs debugging")

        return passed_tests == total_tests

    finally:
        stop_server()


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
