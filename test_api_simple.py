#!/usr/bin/env python3
"""
Simple test API server to verify the setup
"""
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Test API is running'})

@app.route('/api/test')
def test():
    return jsonify({'message': 'Test endpoint working'})

if __name__ == '__main__':
    print("Starting test API server on port 5000...")
    app.run(host='127.0.0.1', port=5000, debug=True)
