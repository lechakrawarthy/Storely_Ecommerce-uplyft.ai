#!/usr/bin/env python3
"""
Test script to simulate a signup request and check the database
"""

from models import SessionLocal, User
import requests
import json
import sys
import os

# Add the api directory to path so we can import models
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))


def test_signup_api():
    """Test the signup API endpoint"""
    print("Testing signup API...")

    # Test data
    signup_data = {
        "name": "John Doe",
        "type": "email",
        "email": "johndoe@example.com",
        "password": "password123",
        "confirmPassword": "password123"
    }

    try:
        # Make signup request
        response = requests.post(
            'http://localhost:5000/api/auth/signup',
            json=signup_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )

        print(f"Signup API Response Status: {response.status_code}")
        print(f"Response: {response.text}")

        if response.status_code == 201:
            response_data = response.json()
            print(f"✅ Signup successful!")
            print(f"User ID: {response_data.get('user', {}).get('id')}")
            print(f"User Name: {response_data.get('user', {}).get('name')}")
            print(f"User Email: {response_data.get('user', {}).get('email')}")
            return True
        else:
            print(f"❌ Signup failed: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server. Is it running on port 5000?")
        return False
    except Exception as e:
        print(f"❌ Error testing signup: {e}")
        return False


def check_database_after_signup():
    """Check database contents after signup"""
    print("\nChecking database after signup...")

    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total users in database: {len(users)}")

        for i, user in enumerate(users, 1):
            print(f"\nUser {i}:")
            print(f"  ID: {user.id}")
            print(f"  Name: {user.name}")
            print(f"  Email: {user.email}")
            print(f"  Phone: {user.phone}")
            print(f"  Created: {user.created_at}")
            print(f"  Email verified: {user.is_email_verified}")
            print(f"  Phone verified: {user.is_phone_verified}")
            print(f"  Active: {user.is_active}")

    except Exception as e:
        print(f"❌ Error checking database: {e}")
    finally:
        db.close()


def main():
    print("=== Signup Test and Database Check ===\n")

    # First, check current database state
    print("1. Checking current database state...")
    check_database_after_signup()

    # Test API signup
    print("\n" + "="*50)
    print("2. Testing API signup...")
    success = test_signup_api()

    # Check database again after signup
    if success:
        print("\n" + "="*50)
        print("3. Checking database after new signup...")
        check_database_after_signup()


if __name__ == "__main__":
    main()
