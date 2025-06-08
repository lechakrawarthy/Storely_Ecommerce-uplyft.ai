#!/usr/bin/env python3
import requests
import json


def test_api_server():
    """Test if the API server is running and responding"""
    try:
        # Test basic health check
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        print(f"Health check status: {response.status_code}")
        print(f"Response: {response.text}")

        # Test login endpoint
        login_data = {
            "email": "test@example.com",
            "password": "testpassword"
        }
        response = requests.post('http://localhost:5000/api/auth/login',
                                 json=login_data, timeout=5)
        print(f"Login test status: {response.status_code}")
        print(f"Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("❌ API server is not running or not accessible on port 5000")
    except requests.exceptions.Timeout:
        print("❌ API server is not responding (timeout)")
    except Exception as e:
        print(f"❌ Error testing API: {e}")


if __name__ == "__main__":
    test_api_server()
