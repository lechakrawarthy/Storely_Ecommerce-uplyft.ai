#!/usr/bin/env python3
"""
Comprehensive test to verify the migration from static to dynamic data is complete
"""

import requests
import json
from datetime import datetime


def test_api_health():
    """Test API health endpoint"""
    try:
        response = requests.get("http://localhost:5000/api/health", timeout=5)
        print(
            f"✅ API Health: {response.status_code} - {response.json().get('message', 'Unknown')}")
        return True
    except Exception as e:
        print(f"❌ API Health failed: {e}")
        return False


def test_products_endpoint():
    """Test products endpoint"""
    try:
        response = requests.get(
            "http://localhost:5000/api/products?limit=5", timeout=5)
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products API: Got {len(products)} products")

            # Verify product structure
            if products and len(products) > 0:
                product = products[0]
                required_fields = ['id', 'name', 'category',
                                   'price', 'stock', 'description', 'image_url']
                missing_fields = [
                    field for field in required_fields if field not in product]

                if not missing_fields:
                    print(f"✅ Product structure: All required fields present")
                    print(
                        f"   Sample product: {product.get('name')} - ${product.get('price')}")
                    return True
                else:
                    print(
                        f"❌ Product structure: Missing fields {missing_fields}")
                    return False
            else:
                print(f"❌ Products API: No products returned")
                return False
        else:
            print(f"❌ Products API: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Products API failed: {e}")
        return False


def test_categories_endpoint():
    """Test categories endpoint"""
    try:
        response = requests.get(
            "http://localhost:5000/api/categories", timeout=5)
        if response.status_code == 200:
            categories = response.json()
            print(
                f"✅ Categories API: Got {len(categories)} categories: {categories}")
            return True
        else:
            print(f"❌ Categories API: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Categories API failed: {e}")
        return False


def test_frontend_accessibility():
    """Test if frontend is accessible"""
    try:
        response = requests.get("http://localhost:8080", timeout=5)
        if response.status_code == 200:
            print(f"✅ Frontend: Accessible on port 8080")
            return True
        else:
            print(f"❌ Frontend: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend failed: {e}")
        return False


def test_cors_configuration():
    """Test CORS configuration"""
    try:
        headers = {
            'Origin': 'http://localhost:8080',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        }

        # Test CORS preflight
        response = requests.options(
            "http://localhost:5000/api/products", headers=headers, timeout=5)

        if response.status_code in [200, 204]:
            cors_origin = response.headers.get('Access-Control-Allow-Origin')
            if cors_origin:
                print(f"✅ CORS: Configured correctly - Origin: {cors_origin}")
                return True
            else:
                print(f"❌ CORS: No Access-Control-Allow-Origin header")
                return False
        else:
            print(f"❌ CORS: Preflight failed with {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
        return False


def main():
    """Run all tests"""
    print("🔍 Testing Migration Completion")
    print("=" * 50)
    print(f"Test time: {datetime.now().isoformat()}")
    print()

    tests = [
        ("API Health Check", test_api_health),
        ("Products Endpoint", test_products_endpoint),
        ("Categories Endpoint", test_categories_endpoint),
        ("Frontend Accessibility", test_frontend_accessibility),
        ("CORS Configuration", test_cors_configuration)
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        print(f"Running: {test_name}")
        if test_func():
            passed += 1
        print()

    print("=" * 50)
    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 MIGRATION COMPLETE! All tests passed.")
        print("   The frontend should now display products from the database.")
    else:
        print("⚠️  Some tests failed. Check the issues above.")

    return passed == total


if __name__ == "__main__":
    main()
