#!/usr/bin/env python3
"""
Quick script to populate the database with sample products
"""
import sys
import os
import sqlite3

# Database file path
DB_PATH = 'api/store.db'

# Sample products data
SAMPLE_PRODUCTS = [
    {
        'name': 'Classic Novel Collection',
        'description': 'A collection of timeless classic novels including Pride and Prejudice, 1984, and To Kill a Mockingbird.',
        'price': 29.99,
        'category': 'Books',
        'stock': 15,
        'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        'badge': 'bestseller'
    },
    {
        'name': 'Modern Programming Guide',
        'description': 'Complete guide to modern programming languages including Python, JavaScript, and TypeScript.',
        'price': 49.99,
        'category': 'Books',
        'stock': 8,
        'image_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop',
        'badge': 'new'
    },
    {
        'name': 'Wireless Bluetooth Headphones',
        'description': 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        'price': 149.99,
        'category': 'Electronics',
        'stock': 25,
        'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop',
        'badge': 'featured'
    },
    {
        'name': 'Smart Fitness Watch',
        'description': 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.',
        'price': 299.99,
        'category': 'Electronics',
        'stock': 12,
        'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
        'badge': 'popular'
    },
    {
        'name': 'Organic Cotton T-Shirt',
        'description': 'Comfortable, eco-friendly t-shirt made from 100% organic cotton. Available in multiple colors.',
        'price': 24.99,
        'category': 'Clothing',
        'stock': 50,
        'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
        'badge': 'eco'
    },
    {
        'name': 'Premium Denim Jeans',
        'description': 'High-quality denim jeans with a perfect fit. Durable and stylish for everyday wear.',
        'price': 89.99,
        'category': 'Clothing',
        'stock': 30,
        'image_url': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop',
        'badge': 'premium'
    },
    {
        'name': 'Gaming Mechanical Keyboard',
        'description': 'Professional gaming keyboard with RGB lighting and mechanical switches.',
        'price': 129.99,
        'category': 'Electronics',
        'stock': 18,
        'image_url': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=400&fit=crop',
        'badge': 'gaming'
    },
    {
        'name': 'Cookbook: World Cuisines',
        'description': 'Explore flavors from around the world with this comprehensive cookbook featuring 200+ recipes.',
        'price': 34.99,
        'category': 'Books',
        'stock': 22,
        'image_url': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
        'badge': 'featured'
    },
    {
        'name': 'Casual Summer Dress',
        'description': 'Light and breezy summer dress perfect for warm weather. Available in floral and solid patterns.',
        'price': 45.99,
        'category': 'Clothing',
        'stock': 35,
        'image_url': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
        'badge': 'seasonal'
    },
    {
        'name': 'Portable Bluetooth Speaker',
        'description': 'Compact speaker with excellent sound quality, waterproof design, and 12-hour battery.',
        'price': 79.99,
        'category': 'Electronics',
        'stock': 40,
        'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=400&fit=crop',
        'badge': 'portable'
    }
]

def populate_database():
    """Populate the database with sample products"""
    try:
        # Connect to database
        print("🔄 Connecting to database...")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create products table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                stock INTEGER DEFAULT 0,
                image_url TEXT,
                badge TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Check if products already exist
        cursor.execute("SELECT COUNT(*) FROM products")
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"📦 Database already has {existing_count} products")
            response = input("Would you like to clear and repopulate? (y/N): ")
            if response.lower() != 'y':
                print("✅ Keeping existing data")
                return
            
            # Clear existing products
            cursor.execute("DELETE FROM products")
            print("🗑️ Cleared existing products")
        
        # Insert sample products
        print("📦 Adding sample products...")
        for i, product in enumerate(SAMPLE_PRODUCTS, 1):
            cursor.execute("""
                INSERT INTO products (name, description, price, category, stock, image_url, badge)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                product['name'],
                product['description'],
                product['price'],
                product['category'],
                product['stock'],
                product['image_url'],
                product['badge']
            ))
            print(f"  ✅ Added: {product['name']}")
        
        # Commit changes
        conn.commit()
        
        # Verify insertion
        cursor.execute("SELECT COUNT(*) FROM products")
        total_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT DISTINCT category FROM products")
        categories = [row[0] for row in cursor.fetchall()]
        
        print(f"\n🎉 Successfully populated database!")
        print(f"📊 Total products: {total_count}")
        print(f"🏷️ Categories: {', '.join(categories)}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error populating database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    populate_database()
