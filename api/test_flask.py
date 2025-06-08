#!/usr/bin/env python3
"""
Simple Flask test to debug startup issues
"""
import sys
import os

print("Starting simple Flask test...")

try:
    from flask import Flask, jsonify
    print("✓ Flask imported")
    
    app = Flask(__name__)
    
    @app.route('/test')
    def test():
        return jsonify({'message': 'Hello from Flask!'})
    
    print("✓ Flask app created")
    
    if __name__ == '__main__':
        print("Starting test server on port 5001...")
        app.run(host='0.0.0.0', port=5001, debug=True)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
