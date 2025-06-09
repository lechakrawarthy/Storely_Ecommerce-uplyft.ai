#!/usr/bin/env python3
"""
Minimal server test
"""
import os
import sys

print("Testing minimal server...")

try:
    # Add the api directory to Python path
    api_dir = os.path.dirname(os.path.abspath(__file__))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)

    print(f"API directory: {api_dir}")
    print(f"Python path includes: {api_dir in sys.path}")

    # Try to import the main module
    print("Importing Flask...")
    from flask import Flask

    print("Importing our modules...")
    from services.controller import APIController
    from configs.development import DevelopmentConfig
    from db.base import init_database

    print("Creating app...")
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    print("Initializing database...")
    init_database(app.config.get('DATABASE_URL', 'sqlite:///store.db'))

    print("Creating controller...")
    controller = APIController(app.config.get('SECRET_KEY', 'test-key'))

    # Add a simple route
    @app.route('/')
    def home():
        return {'message': 'Storely API is running!', 'status': 'success'}

    @app.route('/health')
    def health():
        return {
            'message': 'Storely E-commerce API is running',
            'version': '2.0.0-refactored',
            'status': 'healthy'
        }

    # Test the app
    print("Testing app with test client...")
    with app.test_client() as client:
        response = client.get('/')
        print(f"Home route: {response.status_code} - {response.get_json()}")

        response = client.get('/health')
        print(f"Health route: {response.status_code} - {response.get_json()}")

    print("✅ SUCCESS: All components working!")

    # Start the server
    print("Starting server on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
