import json
import requests
from models import SessionLocal, User
import sys
import os
sys.path.append('api')


print("=== Database and API Test ===")

# Test 1: Check current database state
print("\n1. Current database state:")
db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"   Users found: {len(users)}")
    for user in users:
        print(f"   - {user.name} | {user.email} | Created: {user.created_at}")
finally:
    db.close()

# Test 2: Test API health
print("\n2. Testing API connectivity:")
try:
    response = requests.get('http://localhost:5000/api/health', timeout=5)
    print(f"   API Health: {response.status_code} - {response.text}")
except Exception as e:
    print(f"   API Error: {e}")

# Test 3: Test signup endpoint
print("\n3. Testing signup endpoint:")
try:
    signup_data = {
        "name": "API Test User",
        "type": "email",
        "email": "apitest@example.com",
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }

    response = requests.post(
        'http://localhost:5000/api/auth/signup',
        json=signup_data,
        headers={'Content-Type': 'application/json'},
        timeout=10
    )

    print(f"   Signup Status: {response.status_code}")
    if response.status_code < 400:
        print(f"   ✅ Signup successful!")
        result = response.json()
        print(f"   User created: {result.get('user', {}).get('name')}")
    else:
        print(f"   ❌ Signup failed: {response.text}")

except Exception as e:
    print(f"   Signup Error: {e}")

# Test 4: Check database after API call
print("\n4. Database state after signup test:")
db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"   Users found: {len(users)}")
    for user in users:
        print(f"   - {user.name} | {user.email} | Created: {user.created_at}")
finally:
    db.close()

print("\n=== Test Complete ===")
