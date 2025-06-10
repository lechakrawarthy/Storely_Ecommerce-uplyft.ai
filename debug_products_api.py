#!/usr/bin/env python3
"""
Debug Products API
Test the products endpoint directly to see the actual error
"""
import sys
import os

# Add the api directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

try:
    print("1. Testing database initialization...")
    from db.base import init_database
    init_database('sqlite:///api/store.db')
    print("✅ Database initialized successfully")
    
    print("\n2. Testing ProductService import...")
    from models.products.compute import ProductService
    print("✅ ProductService imported successfully")
    
    print("\n3. Testing ProductService initialization...")
    service = ProductService()
    print("✅ ProductService initialized successfully")
    
    print("\n4. Testing get_products method...")
    result = service.get_products({'limit': 10, 'offset': 0})
    print(f"✅ get_products returned: {len(result.get('products', []))} products")
    print(f"   Structure: {list(result.keys())}")
    
    print("\n5. Testing ProductController...")
    from models.products.main import ProductController
    controller = ProductController()
    print("✅ ProductController initialized successfully")
    
    print("\n6. Testing ProductController.get_products...")
    request_data = {'limit': 10, 'offset': 0}
    result = controller.get_products(request_data)
    print(f"✅ ProductController.get_products returned: {result}")
    
except Exception as e:
    print(f"❌ Error at step: {e}")
    import traceback
    traceback.print_exc()
