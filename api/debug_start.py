#!/usr/bin/env python3
"""
Debug version of app_final.py with verbose output
"""
import os
import sys

print("=== DEBUG: Starting app_final.py ===")
print(f"Python version: {sys.version}")
print(f"Current directory: {os.getcwd()}")

try:
    print("1. Importing modules...")
    import logging
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    from werkzeug.exceptions import HTTPException
    print("✓ Basic imports successful")

    # Import refactored components
    print("2. Importing database...")
    from db.base import init_database
    print("✓ Database import successful")

    print("3. Importing controller...")
    from services.controller import APIController
    print("✓ Controller import successful")

    print("4. Importing configs...")
    from configs.production import ProductionConfig
    from configs.development import DevelopmentConfig
    print("✓ Config imports successful")

    print("5. Creating Flask app...")
    app = Flask(__name__)
    print("✓ Flask app created")

    print("6. Setting up CORS...")
    CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
    print("✓ CORS configured")

    print("7. Loading configuration...")
    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)
    print(f"✓ Configuration loaded for {env}")

    print("8. Setting up logging...")
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)
    print("✓ Logging configured")

    print("9. Initializing database...")
    database_url = app.config.get('DATABASE_URL', 'sqlite:///store.db')
    init_database(database_url)
    print(f"✓ Database initialized: {database_url}")

    print("10. Creating API controller...")
    secret_key = app.config.get(
        'SECRET_KEY', 'dev-secret-key-change-in-production')
    api = APIController(secret_key)
    print("✓ API Controller created")

    # Add a simple test route
    @app.route('/test')
    def test_route():
        return {'status': 'success', 'message': 'Server is running!'}

    print("11. Starting server...")
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'

    print(f"🚀 Starting server on port {port}, debug={debug}")

    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    print("=== DEBUG: Failed to start ===")
