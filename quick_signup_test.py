import requests
import json


def test_signup_api():
    # Test data for a new user
    signup_data = {
        "name": "Frontend Test User",
        "type": "email",
        "email": "frontendtest@example.com",
        "password": "password123",
        "confirmPassword": "password123"
    }

    try:
        response = requests.post(
            'http://localhost:5000/api/auth/signup',
            json=signup_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

        if response.status_code == 201:
            data = response.json()
            print("✅ SUCCESS - New user created!")
            print(f"User ID: {data.get('user', {}).get('id')}")
            print(f"User Name: {data.get('user', {}).get('name')}")
            print(f"User Email: {data.get('user', {}).get('email')}")
            return True
        else:
            print("❌ FAILED - Signup unsuccessful")
            return False

    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False


if __name__ == "__main__":
    print("Testing signup API endpoint...")
    test_signup_api()
