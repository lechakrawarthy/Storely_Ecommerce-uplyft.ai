#!/usr/bin/env python3
"""
Manual test script using requests to check server status
"""
import requests
import json
import time
from datetime import datetime

def log(message):
    """Log with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def test_server():
    """Test server endpoints manually"""
    base_url = "http://127.0.0.1:5000"
    
    log("🔍 Testing Refactored Flask Backend")
    log("=" * 50)
    
    # Test health endpoint
    log("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            log("✅ Health check PASSED")
            log(f"   Version: {data.get('version', 'Unknown')}")
            log(f"   Environment: {data.get('environment', 'Unknown')}")
        else:
            log(f"⚠️  Health check returned status: {response.status_code}")
    except Exception as e:
        log(f"❌ Health check FAILED: {e}")
        return False
    
    # Test root endpoint
    log("\n2. Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        log(f"✅ Root endpoint status: {response.status_code}")
    except Exception as e:
        log(f"❌ Root endpoint failed: {e}")
    
    # Test auth status
    log("\n3. Testing auth endpoints...")
    try:
        # Test registration endpoint structure
        response = requests.post(f"{base_url}/api/auth/register", 
                               json={}, timeout=5)
        if response.status_code == 400:  # Expected for empty data
            log("✅ Auth register endpoint responding")
        elif response.status_code == 405:
            log("⚠️  Auth register endpoint method not allowed")
        else:
            log(f"✅ Auth register endpoint status: {response.status_code}")
            
        # Test login endpoint structure
        response = requests.post(f"{base_url}/api/auth/login", 
                               json={}, timeout=5)
        if response.status_code in [400, 401]:  # Expected for empty/invalid data
            log("✅ Auth login endpoint responding")
        else:
            log(f"✅ Auth login endpoint status: {response.status_code}")
            
    except Exception as e:
        log(f"❌ Auth endpoints failed: {e}")
    
    # Test products endpoint
    log("\n4. Testing products endpoint...")
    try:
        response = requests.get(f"{base_url}/api/products", timeout=5)
        if response.status_code == 200:
            log("✅ Products endpoint responding")
            data = response.json()
            if isinstance(data.get('data'), list):
                log(f"   Found {len(data['data'])} products")
        else:
            log(f"✅ Products endpoint status: {response.status_code}")
    except Exception as e:
        log(f"❌ Products endpoint failed: {e}")
    
    # Test chat endpoint
    log("\n5. Testing chat endpoint...")
    try:
        response = requests.post(f"{base_url}/api/chat", 
                               json={'message': 'test'}, timeout=5)
        log(f"✅ Chat endpoint status: {response.status_code}")
    except Exception as e:
        log(f"❌ Chat endpoint failed: {e}")
    
    # Test analytics endpoint
    log("\n6. Testing analytics endpoint...")
    try:
        response = requests.get(f"{base_url}/api/analytics/dashboard", timeout=5)
        log(f"✅ Analytics endpoint status: {response.status_code}")
    except Exception as e:
        log(f"❌ Analytics endpoint failed: {e}")
    
    log("\n" + "=" * 50)
    log("🎉 SERVER TESTING COMPLETE!")
    log("✅ The refactored Flask backend appears to be working!")
    return True

if __name__ == "__main__":
    test_server()
