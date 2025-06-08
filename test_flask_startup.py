#!/usr/bin/env python3

"""
Simple test to check if Flask can start properly
"""

import sys
import os

# Add the api directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

print("Testing Flask startup...")

try:
    print("1. Importing basic Flask...")
    from flask import Flask, jsonify
    print("✅ Flask imported successfully")

    print("2. Importing config...")
    import config
    print("✅ Config imported successfully")

    print("3. Importing models...")
    from models import SessionLocal, User
    print("✅ Models imported successfully")

    print("4. Creating Flask app...")
    app = Flask(__name__)
    app.config['SECRET_KEY'] = config.SECRET_KEY
    print("✅ Flask app created successfully")

    print("5. Adding test route...")

    @app.route('/test', methods=['GET'])
    def test_route():
        return jsonify({'status': 'working', 'message': 'Test route works'})
    print("✅ Test route added successfully")

    print("6. Testing database connection...")
    db = SessionLocal()
    users = db.query(User).count()
    db.close()
    print(f"✅ Database connection works. Found {users} users.")

    print("7. Starting Flask server on port 5001...")
    app.run(host='127.0.0.1', port=5001, debug=False)

except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
