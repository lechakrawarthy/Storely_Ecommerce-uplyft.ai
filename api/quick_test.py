#!/usr/bin/env python3
"""
Quick test to verify basic functionality
"""
import traceback
import sys


def test_imports():
    """Test all critical imports"""
    print("Testing imports...")
    try:
        from services.controller import APIController
        print("✓ APIController imported")

        from db.base import init_database
        print("✓ Database module imported")

        from models.auth.main import AuthController
        print("✓ Auth controller imported")

        print("All imports successful!")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        traceback.print_exc()
        return False


def test_app_creation():
    """Test Flask app creation"""
    print("\nTesting app creation...")
    try:
        from app_final import create_app
        app = create_app()
        print("✓ Flask app created successfully")
        return True
    except Exception as e:
        print(f"❌ App creation error: {e}")
        traceback.print_exc()
        return False


def test_basic_auth():
    """Test basic authentication functionality"""
    print("\nTesting authentication service...")
    try:
        from models.auth.compute import AuthService
        auth_service = AuthService()
        print("✓ AuthService instantiated")
        return True
    except Exception as e:
        print(f"❌ Auth service error: {e}")
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🧪 Running quick diagnostic tests...\n")

    all_passed = True
    all_passed &= test_imports()
    all_passed &= test_app_creation()
    all_passed &= test_basic_auth()

    print(f"\n{'✅ All tests passed!' if all_passed else '❌ Some tests failed!'}")
    sys.exit(0 if all_passed else 1)
