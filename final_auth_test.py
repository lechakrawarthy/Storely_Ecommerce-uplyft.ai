#!/usr/bin/env python3
"""
Final Authentication Flow Test
Validates that the CORS and authentication fixes are working properly
"""

import requests
import json
import time
from datetime import datetime

API_BASE = 'http://localhost:5000'


def test_api_health():
    """Test API health endpoint"""
    print("🏥 Testing API Health...")
    try:
        response = requests.get(f'{API_BASE}/api/health')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API is healthy: {data['message']}")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Failed to connect to API: {e}")
        return False


def test_cors_headers():
    """Test that CORS headers are properly set"""
    print("\n🌐 Testing CORS Headers...")
    try:
        # Test with OPTIONS request (preflight)
        response = requests.options(f'{API_BASE}/api/auth/login',
                                    headers={
            'Origin': 'http://localhost:8080',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        })

        cors_header = response.headers.get('Access-Control-Allow-Origin')
        if cors_header:
            print(f"✅ CORS enabled: {cors_header}")
            return True
        else:
            print("❌ CORS headers not found")
            return False
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
        return False


def test_signup():
    """Test user signup"""
    print("\n📝 Testing User Signup...")
    signup_data = {
        "name": "Test User Final",
        "email": f"finaltest_{int(time.time())}@example.com",
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }

    try:
        response = requests.post(f'{API_BASE}/api/auth/signup',
                                 json=signup_data,
                                 headers={'Origin': 'http://localhost:8080'})

        if response.status_code == 201:
            data = response.json()
            print(f"✅ Signup successful: {data['message']}")
            return True, signup_data['email']
        else:
            data = response.json()
            print(f"❌ Signup failed: {data.get('error', 'Unknown error')}")
            return False, None
    except Exception as e:
        print(f"❌ Signup request failed: {e}")
        return False, None


def test_login(email=None):
    """Test user login"""
    print("\n🔐 Testing User Login...")

    # Use test user if no email provided
    if not email:
        email = "test@example.com"

    login_data = {
        "email": email,
        "password": "testpass123"
    }

    try:
        response = requests.post(f'{API_BASE}/api/auth/login',
                                 json=login_data,
                                 headers={'Origin': 'http://localhost:8080'})

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful: {data['message']}")
            return True
        else:
            data = response.json()
            print(f"❌ Login failed: {data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Login request failed: {e}")
        return False


def test_error_handling():
    """Test error handling for invalid credentials"""
    print("\n🚫 Testing Error Handling...")

    # Test with invalid credentials
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }

    try:
        response = requests.post(f'{API_BASE}/api/auth/login',
                                 json=login_data,
                                 headers={'Origin': 'http://localhost:8080'})

        if response.status_code == 404:
            data = response.json()
            print(f"✅ Error handling works: {data['error']}")
            return True
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False


def main():
    """Run all authentication tests"""
    print("🧪 FINAL AUTHENTICATION FLOW TEST")
    print("=" * 50)
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🎯 Testing API at: {API_BASE}")
    print(f"🌐 Testing CORS for: http://localhost:8080")
    print("=" * 50)

    tests_passed = 0
    total_tests = 5

    # Test 1: API Health
    if test_api_health():
        tests_passed += 1

    # Test 2: CORS Headers
    if test_cors_headers():
        tests_passed += 1

    # Test 3: User Signup
    signup_success, new_user_email = test_signup()
    if signup_success:
        tests_passed += 1

    # Test 4: User Login (with new user or default test user)
    if test_login(new_user_email):
        tests_passed += 1

    # Test 5: Error Handling
    if test_error_handling():
        tests_passed += 1

    # Final Results
    print("\n" + "=" * 50)
    print("📊 FINAL TEST RESULTS")
    print("=" * 50)
    print(f"✅ Tests Passed: {tests_passed}/{total_tests}")
    print(f"📈 Success Rate: {(tests_passed/total_tests)*100:.1f}%")

    if tests_passed == total_tests:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Authentication flow is working correctly")
        print("✅ CORS issue has been resolved")
        print("✅ Frontend can now successfully communicate with backend")
        print("\n🚀 Your login and signup pages should now work properly!")
    else:
        print(f"\n⚠️  {total_tests - tests_passed} test(s) failed")
        print("❌ Some issues may still need to be addressed")

    print("\n🔗 Test your application at:")
    print("   • Login: http://localhost:8080/login")
    print("   • Signup: http://localhost:8080/signup")
    print("   • Main App: http://localhost:8080")


if __name__ == "__main__":
    main()
