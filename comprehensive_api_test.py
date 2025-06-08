#!/usr/bin/env python3
"""
Comprehensive API test script to verify the chatbot backend is working correctly
"""

import requests
import json
import time

API_BASE = "http://localhost:5000"


def test_health():
    """Test the health endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Health check passed")
            return True
        else:
            print("   ❌ Health check failed")
            return False
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
        return False


def test_cors():
    """Test CORS preflight"""
    print("🌐 Testing CORS configuration...")
    try:
        headers = {
            'Origin': 'http://localhost:8082',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{API_BASE}/api/chat", headers=headers)
        print(f"   CORS preflight status: {response.status_code}")

        cors_headers = {k: v for k, v in response.headers.items()
                        if 'access-control' in k.lower()}
        print("   CORS headers:")
        for k, v in cors_headers.items():
            print(f"     {k}: {v}")

        if response.status_code == 200 and 'http://localhost:8082' in response.headers.get('Access-Control-Allow-Origin', ''):
            print("   ✅ CORS configuration correct")
            return True
        else:
            print("   ❌ CORS configuration issue")
            return False
    except Exception as e:
        print(f"   ❌ CORS test error: {e}")
        return False


def test_chat_api():
    """Test the chat API endpoint"""
    print("💬 Testing chat API...")
    try:
        data = {
            "message": "Hello, can you help me find books?",
            "session_id": "test_session_123",
            "user_id": None,
            "preferences": {
                "preferredCategories": [],
                "budgetRange": {"min": 0, "max": 2000},
                "lastSearches": []
            },
            "timestamp": "2025-06-08T11:30:00.000Z"
        }

        headers = {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8082'
        }

        response = requests.post(
            f"{API_BASE}/api/chat", json=data, headers=headers)
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(
                f"   Response message: {result['response']['message'][:100]}...")
            print(f"   Session ID: {result.get('session_id', 'N/A')}")
            print("   ✅ Chat API working correctly")
            return True
        else:
            print(f"   ❌ Chat API error: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Chat API test error: {e}")
        return False


def test_session_api():
    """Test the session API endpoint"""
    print("📝 Testing session API...")
    try:
        response = requests.get(f"{API_BASE}/api/sessions/test_session_123")
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(
                f"   Session found with {len(result.get('session', {}).get('messages', []))} messages")
            print("   ✅ Session API working correctly")
            return True
        elif response.status_code == 404:
            print("   ✅ Session API working (404 for new session is expected)")
            return True
        else:
            print(f"   ❌ Session API error: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Session API test error: {e}")
        return False


def test_debug_endpoint():
    """Test the debug endpoint"""
    print("🔍 Testing debug endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/debug")
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(
                f"   CORS origins: {len(result.get('cors_origins', []))} configured")
            print("   ✅ Debug endpoint working")
            return True
        else:
            print(f"   ❌ Debug endpoint error: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Debug endpoint test error: {e}")
        return False


if __name__ == "__main__":
    print("🧪 Starting comprehensive API test suite...\n")

    tests = [
        ("Health Check", test_health),
        ("CORS Configuration", test_cors),
        ("Chat API", test_chat_api),
        ("Session API", test_session_api),
        ("Debug Endpoint", test_debug_endpoint),
    ]

    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
        print()
        time.sleep(0.5)  # Small delay between tests

    print("📊 Test Results Summary:")
    print("=" * 50)
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1

    print(f"\nOverall: {passed}/{len(results)} tests passed")

    if passed == len(results):
        print("\n🎉 All tests passed! The backend API is working correctly.")
        print("If the frontend chatbot is still not working, the issue is in the browser/frontend code.")
    else:
        print(
            f"\n⚠️  {len(results) - passed} test(s) failed. Please check the backend configuration.")
