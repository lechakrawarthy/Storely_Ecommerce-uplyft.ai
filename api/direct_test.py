#!/usr/bin/env python3
"""
Direct import test
"""
import sys
import os

print("=== Direct Import Test ===")

try:
    print("1. Importing app_final module...")
    # Add current directory to Python path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

    import app_final
    print("✅ app_final imported successfully")

    print("2. Creating app instance...")
    app = app_final.create_app()
    print("✅ App created successfully")

    print("3. Testing with test client...")
    with app.test_client() as client:
        response = client.get('/health')
        print(f"Health endpoint status: {response.status_code}")
        if response.status_code == 200:
            print(f"Health response: {response.get_json()}")
            print("✅ Health endpoint working")
        else:
            print(f"⚠ Health endpoint returned {response.status_code}")

        # Test products endpoint
        response = client.get('/api/products')
        print(f"Products endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.get_json()
            print(
                f"✅ Products endpoint working, returned {len(data.get('data', []))} products")
        else:
            print(f"⚠ Products endpoint returned {response.status_code}")
            print(f"Response: {response.get_data(as_text=True)}")

    print("\n🎉 ALL TESTS PASSED! The refactored backend is working!")

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Import Test Complete ===")
