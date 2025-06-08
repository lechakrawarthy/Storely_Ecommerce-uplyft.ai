#!/usr/bin/env python3
"""
Test script to check Flask app startup
"""
import sys
import os

print("Testing Flask app startup...")
print(f"Python version: {sys.version}")

try:
    from flask import Flask
    print("✓ Flask imported successfully")
except ImportError as e:
    print(f"✗ Flask import error: {e}")
    sys.exit(1)

try:
    from models import SessionLocal, Product, init_db
    print("✓ Models imported successfully")
except ImportError as e:
    print(f"✗ Models import error: {e}")
    sys.exit(1)

try:
    import config
    print("✓ Config imported successfully")
except ImportError as e:
    print(f"✗ Config import error: {e}")
    sys.exit(1)

try:
    import nltk
    print("✓ NLTK imported successfully")
except ImportError as e:
    print(f"✗ NLTK import error: {e}")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✓ Environment variables loaded")
except Exception as e:
    print(f"✗ Environment variables error: {e}")

# Test database connection
try:
    init_db()
    db = SessionLocal()
    products = db.query(Product).limit(1).all()
    db.close()
    print(f"✓ Database connection successful, found {len(products)} product(s)")
except Exception as e:
    print(f"✗ Database error: {e}")

print("All checks completed!")
