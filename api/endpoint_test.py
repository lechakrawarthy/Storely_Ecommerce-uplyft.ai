#!/usr/bin/env python3
"""
Comprehensive API endpoint test for the refactored Flask backend
"""

import requests
import json
import sys
import time

BASE_URL = "http://127.0.0.1:5000"

def test_endpoint(method, url, data=None, headers=None):
    """Test a single endpoint and return result"""
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        return {
            'success': True,
            'status_code': response.status_code,
            'data': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text,
            'headers': dict(response.headers)
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    print("🧪 Testing Refactored Flask API Endpoints")
    print("=" * 50)
    
    # Test endpoints
    tests = [
        # Health check
        ("GET", f"{BASE_URL}/health", None, "Health Check"),
        
        # Product endpoints
        ("GET", f"{BASE_URL}/api/products", None, "Get Products"),
        ("GET", f"{BASE_URL}/api/products?limit=5", None, "Get Products with Limit"),
        ("GET", f"{BASE_URL}/api/products?category=Books", None, "Get Products by Category"),
        ("GET", f"{BASE_URL}/api/products/1", None, "Get Product by ID"),
        ("GET", f"{BASE_URL}/api/categories", None, "Get Categories"),
        
        # Auth endpoints
        ("POST", f"{BASE_URL}/api/auth/register", {
            "email": "test@example.com", 
            "password": "testpass123", 
            "name": "Test User"
        }, "User Registration"),
        
        ("POST", f"{BASE_URL}/api/auth/login", {
            "email": "test@example.com", 
            "password": "testpass123"
        }, "User Login"),
        
        # Chat endpoints
        ("POST", f"{BASE_URL}/api/chat/send", {
            "message": "Hello", 
            "session_id": "test123"
        }, "Send Chat Message"),
        
        ("GET", f"{BASE_URL}/api/chat/history/test123", None, "Get Chat History"),
        
        # Analytics endpoints
        ("POST", f"{BASE_URL}/api/analytics/track", {
            "event": "page_view", 
            "data": {"page": "/products"}
        }, "Track Analytics Event"),
    ]
    
    results = []
    
    for method, url, data, name in tests:
        print(f"🔍 Testing: {name}")
        print(f"   {method} {url}")
        
        result = test_endpoint(method, url, data)
        results.append((name, result))
        
        if result['success']:
            status = result['status_code']
            if 200 <= status < 300:
                print(f"   ✅ SUCCESS ({status})")
                if isinstance(result['data'], dict):
                    if 'success' in result['data']:
                        print(f"   📋 Response: success={result['data']['success']}")
                    if 'data' in result['data']:
                        data_preview = str(result['data']['data'])[:100]
                        print(f"   📋 Data preview: {data_preview}...")
                else:
                    print(f"   📋 Response: {str(result['data'])[:100]}...")
            else:
                print(f"   ⚠️  HTTP {status}")
                print(f"   📋 Response: {result['data']}")
        else:
            print(f"   ❌ FAILED: {result['error']}")
        
        print()
        time.sleep(0.5)  # Small delay between requests
    
    # Summary
    print("=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result['success'] and 200 <= result.get('status_code', 0) < 300)
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("💔 Some tests failed. Check individual results above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
