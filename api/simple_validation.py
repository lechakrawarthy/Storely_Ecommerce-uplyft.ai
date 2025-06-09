#!/usr/bin/env python3
"""
Simple validation script to check backend status
"""
import os
import sys

print("=== BACKEND VALIDATION SCRIPT ===")
print(f"Python version: {sys.version}")
print(f"Current directory: {os.getcwd()}")
print(f"Script location: {__file__}")

# Check if key files exist
required_files = [
    "app_final.py",
    "services/controller.py",
    "configs/development.py",
    "models/auth/main.py",
    "models/products/main.py",
    "models/chat/main.py",
    "models/analytics/main.py"
]

print("\n=== FILE EXISTENCE CHECK ===")
for file_path in required_files:
    exists = os.path.exists(file_path)
    status = "✓" if exists else "❌"
    print(f"{status} {file_path}")

# Try basic imports
print("\n=== IMPORT TESTING ===")
try:
    # Test basic import
    import app_final
    print("✓ app_final module imported successfully")
    
    # Test app creation
    app = app_final.create_app()
    print("✓ Flask app created successfully")
    print(f"  - App name: {app.name}")
    print(f"  - Debug mode: {app.config.get('DEBUG', 'Not set')}")
    
    # Test routes
    with app.app_context():
        routes = list(app.url_map.iter_rules())
        print(f"✓ Found {len(routes)} registered routes")
        
        # Show first few routes
        for i, route in enumerate(routes[:5]):
            print(f"  - {route}")
        
        if len(routes) > 5:
            print(f"  ... and {len(routes) - 5} more routes")

except Exception as e:
    print(f"❌ Import failed: {e}")
    import traceback
    traceback.print_exc()

print("\n=== VALIDATION COMPLETE ===")
