#!/usr/bin/env python3
"""
Simple script to check users in the database
"""

from models import SessionLocal, User
import sys
import os

# Add the api directory to path so we can import models
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))


def check_users():
    """Check and display all users in the database"""
    db = SessionLocal()
    try:
        print("Checking users in database...")

        # Count total users
        user_count = db.query(User).count()
        print(f"Total users in database: {user_count}")

        # List all users
        users = db.query(User).all()

        if users:
            print("\nUser details:")
            for user in users:
                print(f"- ID: {user.id}")
                print(f"  Name: {user.name}")
                print(f"  Email: {user.email}")
                print(f"  Phone: {user.phone}")
                print(f"  Created: {user.created_at}")
                print(f"  Email verified: {user.is_email_verified}")
                print(f"  Phone verified: {user.is_phone_verified}")
                print(f"  Active: {user.is_active}")
                print()
        else:
            print("No users found in database.")

        return user_count

    except Exception as e:
        print(f"Error accessing database: {e}")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    check_users()
