#!/usr/bin/env python3
"""
Manual test to debug the application startup
"""
import sys
import os
import traceback

print("=== Manual Test Started ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {sys.path[:3]}...")

try:
    print("\n1. Testing basic imports...")
    import flask
    print(f"✓ Flask version: {flask.__version__}")

    from flask import Flask, request, jsonify
    print("✓ Flask components imported")

    print("\n2. Testing service imports...")
    from services.controller import APIController
    print("✓ APIController imported")

    print("\n3. Testing config...")
    from configs.development import DevelopmentConfig
    print("✓ DevelopmentConfig imported")

    print("\n4. Testing app creation...")
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    print("✓ Flask app created")

    print("\n5. Testing controller initialization...")
    controller = APIController()
    print("✓ Controller initialized")

    print("\n6. Testing route registration...")

    # Test a simple route
    @app.route('/test')
    def test_route():
        return {'status': 'success', 'message': 'Test route working'}

    print("✓ Test route registered")

    print("\n7. Testing app startup...")
    app.config['TESTING'] = True
    with app.test_client() as client:
        response = client.get('/test')
        if response.status_code == 200:
            print("✓ Test route responds correctly")
        else:
            print(f"⚠ Test route returned status {response.status_code}")

    print("\n=== ALL TESTS PASSED ===")
    print("The application components can be imported and initialized successfully!")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print(f"Error type: {type(e).__name__}")
    print(f"Traceback:")
    traceback.print_exc()

print("\n=== Manual Test Completed ===")
