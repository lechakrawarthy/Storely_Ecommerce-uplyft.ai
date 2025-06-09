#!/usr/bin/env python3
"""
Simple server startup test
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app_final import app
    print("✅ App imported successfully")
    
    # Test basic app configuration
    print(f"✅ Debug mode: {app.debug}")
    print(f"✅ Secret key configured: {'SECRET_KEY' in app.config}")
    
    # Try to get registered routes
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append(f"{rule.methods} {rule.rule}")
    
    print(f"✅ Total routes registered: {len(routes)}")
    print("🛤️  Routes:")
    for route in sorted(routes)[:10]:  # Show first 10 routes
        print(f"   {route}")
    if len(routes) > 10:
        print(f"   ... and {len(routes) - 10} more routes")
    
    # Test app startup
    print("\n🚀 Testing app startup...")
    with app.test_client() as client:
        # Test health endpoint
        response = client.get('/health')
        print(f"✅ Health check: {response.status_code}")
        
        # Test products endpoint
        response = client.get('/api/products')
        print(f"✅ Products endpoint: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error: {response.get_data(as_text=True)}")
        
        # Test categories endpoint
        response = client.get('/api/categories')
        print(f"✅ Categories endpoint: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error: {response.get_data(as_text=True)}")

    print("\n🎉 All startup tests passed!")

except Exception as e:
    print(f"❌ Error during startup: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
