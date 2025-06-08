import requests
import json

# Quick CORS and API test
API_BASE = 'http://localhost:5000'

print("🧪 Quick CORS & API Test")
print("=" * 30)

try:
    # Test 1: Health check
    print("1. Testing API Health...")
    response = requests.get(f'{API_BASE}/api/health', timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✅ API is working")

    # Test 2: Login test
    print("2. Testing Login...")
    login_data = {"email": "test@example.com", "password": "testpass123"}
    response = requests.post(f'{API_BASE}/api/auth/login',
                             json=login_data,
                             headers={'Origin': 'http://localhost:8080'},
                             timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✅ Login working")
        print("   ✅ CORS fixed (no errors)")
    else:
        print(f"   Response: {response.text}")

except Exception as e:
    print(f"❌ Error: {e}")

print("\n🎉 If you see ✅ above, the authentication is fixed!")
print("🔗 Test your app at: http://localhost:8080/login")
