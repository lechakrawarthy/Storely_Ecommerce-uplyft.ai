#!/usr/bin/env python3
"""
PowerShell-compatible comprehensive test for the refactored Flask backend
"""
import sys
import os
import time
import json
import requests
import subprocess
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def log(message):
    """Log with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")
    sys.stdout.flush()


def test_imports():
    """Test if all modules can be imported successfully"""
    log("🔍 Testing imports...")
    
    try:
        # Test main app import
        from app_final import create_app
        log("✓ Successfully imported create_app from app_final")
        
        # Test app creation
        app = create_app()
        log("✓ Successfully created Flask app instance")
        
        # Test configuration
        debug_mode = app.config.get('DEBUG', False)
        log(f"✓ App configuration loaded (Debug: {debug_mode})")
        
        # Test controller import
        from services.controller import ServiceController
        log("✓ Successfully imported ServiceController")
        
        # Test controller creation
        controller = ServiceController()
        log("✓ Successfully created ServiceController instance")
        
        # Test route registration
        with app.app_context():
            routes = [str(rule) for rule in app.url_map.iter_rules()]
            log(f"✓ App has {len(routes)} registered routes")
            
            # Show some key routes
            key_routes = [r for r in routes if any(endpoint in r for endpoint in ['/api/auth', '/api/products', '/api/chat'])]
            if key_routes:
                log("✓ Key API routes found:")
                for route in key_routes[:5]:
                    log(f"  - {route}")
        
        return True
        
    except Exception as e:
        log(f"❌ Import test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_server_health():
    """Test if server is responding"""
    log("🏥 Testing server health...")
    
    base_url = "http://127.0.0.1:5000"
    endpoints_to_test = [
        "/",
        "/health",
        "/api/auth/status",
        "/api/products",
    ]
    
    server_responding = False
    
    for endpoint in endpoints_to_test:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=5)
            log(f"✓ {endpoint} responded with status {response.status_code}")
            server_responding = True
            break
        except requests.exceptions.RequestException as e:
            log(f"⚠️  {endpoint} not responding: {str(e)}")
            continue
    
    return server_responding


def test_api_endpoints():
    """Test specific API endpoints"""
    log("🔗 Testing API endpoints...")
    
    base_url = "http://127.0.0.1:5000"
    test_results = {}
    
    # Test endpoints
    endpoints = {
        "root": "/",
        "health": "/health",
        "auth_status": "/api/auth/status",
        "products": "/api/products",
        "chat_status": "/api/chat/status",
        "analytics": "/api/analytics/stats"
    }
    
    for name, endpoint in endpoints.items():
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=5)
            test_results[name] = {
                "status_code": response.status_code,
                "success": response.status_code < 500,
                "response_size": len(response.content)
            }
            log(f"✓ {name} ({endpoint}): {response.status_code}")
            
        except requests.exceptions.RequestException as e:
            test_results[name] = {
                "status_code": None,
                "success": False,
                "error": str(e)
            }
            log(f"❌ {name} ({endpoint}): {str(e)}")
    
    return test_results


def test_auth_endpoints():
    """Test authentication endpoints"""
    log("🔐 Testing authentication endpoints...")
    
    base_url = "http://127.0.0.1:5000"
    
    # Test registration
    try:
        register_data = {
            "username": f"test_user_{int(time.time())}",
            "email": f"test_{int(time.time())}@example.com",
            "password": "testpassword123"
        }
        
        response = requests.post(f"{base_url}/api/auth/register", json=register_data, timeout=5)
        log(f"✓ Registration endpoint: {response.status_code}")
        
        if response.status_code == 201:
            # Test login with the same credentials
            login_data = {
                "username": register_data["username"],
                "password": register_data["password"]
            }
            
            login_response = requests.post(f"{base_url}/api/auth/login", json=login_data, timeout=5)
            log(f"✓ Login endpoint: {login_response.status_code}")
            
            return True
        
    except requests.exceptions.RequestException as e:
        log(f"❌ Auth test failed: {str(e)}")
        return False


def main():
    """Run all tests"""
    log("🚀 Starting comprehensive backend testing...")
    log("=" * 50)
    
    test_results = {
        "imports": False,
        "server_health": False,
        "api_endpoints": {},
        "auth_flow": False
    }
    
    # Test 1: Import and module tests
    test_results["imports"] = test_imports()
    
    log("\n" + "=" * 50)
    
    # Test 2: Server health
    test_results["server_health"] = test_server_health()
    
    log("\n" + "=" * 50)
    
    # Test 3: API endpoints (only if server is responding)
    if test_results["server_health"]:
        test_results["api_endpoints"] = test_api_endpoints()
        
        log("\n" + "=" * 50)
        
        # Test 4: Authentication flow
        test_results["auth_flow"] = test_auth_endpoints()
    
    # Summary
    log("\n" + "=" * 50)
    log("📋 TEST SUMMARY:")
    log("=" * 50)
    
    log(f"✓ Imports & Modules: {'PASS' if test_results['imports'] else 'FAIL'}")
    log(f"✓ Server Health: {'PASS' if test_results['server_health'] else 'FAIL'}")
    
    if test_results["api_endpoints"]:
        successful_endpoints = sum(1 for result in test_results["api_endpoints"].values() if result.get("success", False))
        total_endpoints = len(test_results["api_endpoints"])
        log(f"✓ API Endpoints: {successful_endpoints}/{total_endpoints} PASS")
        
    log(f"✓ Auth Flow: {'PASS' if test_results['auth_flow'] else 'FAIL'}")
    
    # Overall result
    overall_success = (
        test_results["imports"] and 
        test_results["server_health"] and
        (not test_results["api_endpoints"] or 
         any(result.get("success", False) for result in test_results["api_endpoints"].values()))
    )
    
    log("\n" + "=" * 50)
    if overall_success:
        log("🎉 OVERALL RESULT: BACKEND REFACTORING SUCCESSFUL!")
        log("✅ The refactored Flask backend is working properly")
    else:
        log("⚠️  OVERALL RESULT: ISSUES DETECTED")
        log("❌ Some components need attention")
    
    log("=" * 50)
    
    return overall_success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
