#!/usr/bin/env python3
"""
Quick Database & API Check Script
Verifies database content and API connectivity
"""
import sqlite3
import os

def check_database():
    """Quick check of the store.db database"""
    
    # Check both possible database locations
    db_paths = [
        'store.db',           # Root directory
        'api/store.db'        # API directory
    ]
    
    for db_path in db_paths:
        if os.path.exists(db_path):
            print(f"\n📁 Found database: {db_path}")
            print(f"📊 Size: {os.path.getsize(db_path)} bytes")
            
            try:
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                
                # Check products table
                cursor.execute("SELECT COUNT(*) FROM products")
                product_count = cursor.fetchone()[0]
                print(f"🛍️  Products: {product_count}")
                
                # Check if there are categories
                try:
                    cursor.execute("SELECT DISTINCT category FROM products WHERE category IS NOT NULL")
                    categories = cursor.fetchall()
                    print(f"🏷️  Categories: {len(categories)}")
                    if categories:
                        print(f"   📝 Examples: {[cat[0] for cat in categories[:3]]}")
                except Exception as e:
                    print(f"   ❌ Categories error: {e}")
                
                # Show sample products
                cursor.execute("SELECT id, name, price, category FROM products LIMIT 3")
                sample_products = cursor.fetchall()
                print(f"📋 Sample products:")
                for product in sample_products:
                    print(f"   • ID:{product[0]} | {product[1]} | ${product[2]} | {product[3]}")
                
                conn.close()
                
            except Exception as e:
                print(f"❌ Database error: {e}")
        else:
            print(f"❌ Database not found: {db_path}")

def check_api_connection():
    """Check if the API server is responding"""
    try:
        import requests
    except ImportError:
        print("❌ 'requests' library not found. Install with: pip install requests")
        return
    
    try:
        # Test health endpoint
        response = requests.get('http://localhost:5000/health', timeout=5)
        print(f"\n🌐 API Health: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ {response.json()}")
    except Exception as e:
        print(f"❌ API connection error: {e}")
    
    try:
        # Test products endpoint
        response = requests.get('http://localhost:5000/api/products', timeout=5)
        print(f"🛍️  API Products: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            products = data.get('data', [])
            print(f"   📊 Products returned: {len(products)}")
            print(f"   📄 Response structure: {list(data.keys())}")
            if products:
                print(f"   📝 First product: {products[0] if products else 'None'}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Products API error: {e}")
    
    try:
        # Test categories endpoint
        response = requests.get('http://localhost:5000/api/categories', timeout=5)
        print(f"🏷️  API Categories: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Categories: {data}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Categories API error: {e}")

if __name__ == "__main__":
    print("🔍 Quick Database & API Check")
    print("=" * 40)
    
    check_database()
    check_api_connection()
    
    print("\n✅ Check complete!")