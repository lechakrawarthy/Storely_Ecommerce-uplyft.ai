#!/usr/bin/env python3
"""
Test Electronics Category
"""
import requests

def test_electronics():
    """Test Electronics category products"""
    try:
        # Test Electronics category
        print("🔍 Testing Electronics Category")
        print("=" * 40)
        
        response = requests.get('http://localhost:5000/api/products?category=Electronics&limit=5')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            products = data.get('data', {}).get('products', [])
            print(f"Electronics products found: {len(products)}")
            
            if products:
                print("\nSample Electronics Products:")
                for i, product in enumerate(products[:5], 1):
                    print(f"  {i}. {product.get('name')} (ID: {product.get('id')}) - ${product.get('price')}")
            else:
                print("❌ No Electronics products returned")
        else:
            print(f"❌ Error: {response.text}")
            
        # Test all products to see categories
        print(f"\n🔍 Testing All Products Categories")
        response = requests.get('http://localhost:5000/api/products?limit=10')
        if response.status_code == 200:
            data = response.json()
            products = data.get('data', {}).get('products', [])
            categories = set(p.get('category') for p in products)
            print(f"Categories found in first 10 products: {categories}")
            
            # Count products by category
            category_counts = {}
            for product in products:
                cat = product.get('category')
                category_counts[cat] = category_counts.get(cat, 0) + 1
            
            print("Category distribution in first 10 products:")
            for cat, count in category_counts.items():
                print(f"  - {cat}: {count} products")
                
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_electronics()
