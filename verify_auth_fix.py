#!/usr/bin/env python3
"""
Authentication testing tool for verification
"""

import requests
import json
import sys

API_BASE = 'http://localhost:5000'


class Colors:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    PURPLE = "\033[95m"
    BOLD = "\033[1m"
    END = "\033[0m"


def print_header(title):
    print(f"\n{Colors.BOLD}{Colors.BLUE}====== {title} ======{Colors.END}\n")


def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")


def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.END}")


def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")


def print_info(message):
    print(f"{Colors.PURPLE}ℹ {message}{Colors.END}")


def print_response(response, show_headers=False):
    try:
        if show_headers:
            print("\nHeaders:")
            for key, value in response.headers.items():
                print(f"  {key}: {value}")

        print("\nResponse:")
        if response.headers.get('Content-Type', '').startswith('application/json'):
            pretty_json = json.dumps(response.json(), indent=2)
            print(f"{pretty_json}")
        else:
            print(f"{response.text[:1000]}")  # Limit to 1000 chars
    except Exception as e:
        print(f"Error printing response: {e}")


def test_health():
    print_header("Testing API Health")
    try:
        response = requests.get(f"{API_BASE}/api/health")
        if response.status_code == 200:
            print_success(f"API is healthy: {response.status_code}")
            print_response(response)
            return True
        else:
            print_error(f"API health check failed: {response.status_code}")
            print_response(response)
            return False
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False


def test_invalid_login():
    print_header("Testing Invalid Login")
    invalid_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }

    try:
        response = requests.post(
            f"{API_BASE}/api/auth/login", json=invalid_data)
        if response.status_code in [401, 404]:
            print_success(
                f"Invalid login properly rejected: {response.status_code}")
            print_response(response)
            return True
        else:
            print_error(
                f"Unexpected status code for invalid login: {response.status_code}")
            print_response(response)
            return False
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False


def test_login():
    print_header("Testing Valid Login")
    valid_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }

    try:
        response = requests.post(f"{API_BASE}/api/auth/login", json=valid_data)
        if response.status_code == 200:
            print_success(f"Login successful: {response.status_code}")
            print_response(response)
            return True, response.json().get("token", "")
        else:
            print_error(f"Login failed: {response.status_code}")
            print_response(response)
            return False, ""
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False, ""


def test_signup():
    print_header("Testing User Signup")
    import random
    random_suffix = random.randint(1000, 9999)

    signup_data = {
        "name": f"Test User {random_suffix}",
        "email": f"test{random_suffix}@example.com",
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }

    try:
        response = requests.post(
            f"{API_BASE}/api/auth/signup", json=signup_data)
        if response.status_code == 201:
            print_success(f"Signup successful: {response.status_code}")
            print_info(f"Created user: {signup_data['email']}")
            print_response(response)
            return True, signup_data["email"], "testpass123"
        else:
            print_error(f"Signup failed: {response.status_code}")
            print_response(response)
            return False, "", ""
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False, "", ""


def test_duplicate_signup(email):
    print_header("Testing Duplicate User Signup (should fail)")

    signup_data = {
        "name": "Duplicate User",
        "email": email,
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }

    try:
        response = requests.post(
            f"{API_BASE}/api/auth/signup", json=signup_data)
        if response.status_code == 409:
            print_success(
                f"Duplicate signup properly rejected: {response.status_code}")
            print_response(response)
            return True
        else:
            print_error(
                f"Unexpected status code for duplicate signup: {response.status_code}")
            print_response(response)
            return False
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False


def test_new_user_login(email, password):
    print_header(f"Testing Login with New User: {email}")
    login_data = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(f"{API_BASE}/api/auth/login", json=login_data)
        if response.status_code == 200:
            print_success(f"New user login successful: {response.status_code}")
            print_response(response)
            return True
        else:
            print_error(f"New user login failed: {response.status_code}")
            print_response(response)
            return False
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False


def test_list_users():
    print_header("Listing All Users")
    try:
        response = requests.get(f"{API_BASE}/api/debug/users")
        if response.status_code == 200:
            users = response.json().get("users", [])
            count = len(users)
            print_success(f"Found {count} users in the database")
            print_response(response)
            return True
        else:
            print_error(f"Failed to list users: {response.status_code}")
            print_response(response)
            return False
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False


def main():
    print_header("AUTHENTICATION SYSTEM TEST")

    # Start with testing API health
    if not test_health():
        print_error("API health check failed. Make sure the server is running.")
        sys.exit(1)

    # Test existing user login
    test_login()

    # Test invalid login
    test_invalid_login()

    # Test user signup
    success, new_email, password = test_signup()
    if success:
        # Test duplicate signup
        test_duplicate_signup(new_email)

        # Test login with new user
        test_new_user_login(new_email, password)

    # List users to see all current accounts
    test_list_users()

    print_header("TEST SUMMARY")
    print_info("Run the frontend application and try:")
    print_info("1. Login with valid user: test@example.com / testpass123")
    print_info(f"2. Login with new test user: {new_email} / {password}")
    print_info("3. Try invalid login credentials")
    print_info("4. Try to create a duplicate account")
    print_info("\nEnsure the app only redirects on successful login/signup")
    print_info("and shows error messages on authentication failures.")


if __name__ == "__main__":
    main()
