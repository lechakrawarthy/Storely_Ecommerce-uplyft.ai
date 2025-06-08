import os
import re
import json
from models import init_db, SessionLocal, Product
import uuid

def extract_products_from_ts():
    # Read products from TypeScript file
    try:
        with open('../src/data/products.ts', 'r') as f:
            content = f.read()
        
        # Extract the array content using regex
        match = re.search(r'export const allProducts: Product\[\] = \[(.*?)\];', content, re.DOTALL)
        if match:
            products_str = f"[{match.group(1)}]"
            # Convert TypeScript to valid JSON
            products_str = re.sub(r'(\w+):', r'"\1":', products_str)  # Add quotes to keys
            products_str = re.sub(r',\s*(\}|\])', r'\1', products_str)  # Remove trailing commas
            
            try:
                return json.loads(products_str)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                return []
        else:
            print("No product data found in the file")
            return []
    except Exception as e:
        print(f"Error reading products file: {e}")
        return []

def seed_database():
    # Initialize database
    init_db()
    db = SessionLocal()
    
    try:
        # Check if products already exist
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} products. Skipping seed.")
            return
        
        # Extract products from TypeScript file
        products_data = extract_products_from_ts()
        
        if not products_data:
            print("No product data to seed")
            return
        
        # Create product objects
        for data in products_data:
            product = Product(
                id=data.get("id", str(uuid.uuid4())),
                title=data.get("title", "Unknown Book"),
                price=data.get("price", 0),
                original_price=data.get("originalPrice"),
                image=data.get("image", ""),
                category=data.get("category", "Uncategorized"),
                color=data.get("color", ""),
                rating=data.get("rating", 0),
                reviews=data.get("reviews", 0),
                badge=data.get("badge"),
                discount=data.get("discount"),
                in_stock=data.get("inStock", True),
                description=data.get("description", "")
            )
            db.add(product)
        
        db.commit()
        print(f"Successfully seeded {len(products_data)} products")
    
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
