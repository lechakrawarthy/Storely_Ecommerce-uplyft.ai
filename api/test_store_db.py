import sqlite3
import os

# Test the store.db database directly
db_path = os.path.join(os.path.dirname(__file__), 'store.db')
print(f"Database path: {db_path}")
print(f"Database exists: {os.path.exists(db_path)}")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Check table structure
    cur.execute("PRAGMA table_info(products)")
    columns = cur.fetchall()
    print("Products table columns:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")

    # Get a sample product
    cur.execute("SELECT * FROM products LIMIT 1")
    product = cur.fetchone()
    if product:
        print(f"\nSample product data:")
        for i, col in enumerate(columns):
            print(f"  {col[1]}: {product[i]}")

    conn.close()
