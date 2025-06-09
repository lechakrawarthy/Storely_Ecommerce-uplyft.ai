"""
Simplified API server that serves products from the database
without heavy dependencies like NLTK
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import sqlite3
import json
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Configure CORS
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:8080",  # Current frontend port
    "http://localhost:8082",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",  # Current frontend port
    "http://127.0.0.1:8082"
]

CORS(app, origins=CORS_ORIGINS)

DATABASE_PATH = 'api/store.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable dict-like access
    return conn

def format_product(row):
    """Format database row as product dict"""
    return {
        "id": str(row['id']) if row['id'] else str(1),
        "title": row['name'],  # Map name to title for frontend compatibility
        "name": row['name'],
        "category": row['category'],
        "price": float(row['price']) if row['price'] else 0.0,
        "stock": int(row['stock']) if row['stock'] else 0,
        "inStock": (row['stock'] or 0) > 0,
        "description": row['description'] or "",
        "image": row['image_url'] or "",
        "imageUrl": row['image_url'] or "",
        "badge": row['badge'] or "",
        "rating": 4.5,  # Default rating
        "reviews": 100,  # Default reviews
        "originalPrice": None,
        "discount": None,
        "color": None
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Database API is running',
        'timestamp': datetime.now().isoformat(),
        'database': DATABASE_PATH
    }), 200

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get products with optional filtering"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get query parameters
        category = request.args.get('category')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # Build query
        query = "SELECT * FROM products"
        params = []
        
        if category and category != 'All':
            query += " WHERE category = ?"
            params.append(category)
        
        query += f" LIMIT {limit} OFFSET {offset}"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        products = [format_product(row) for row in rows]
        
        conn.close()
        return jsonify(products), 200
        
    except Exception as e:
        print(f"Error getting products: {e}")
        return jsonify({'error': 'Failed to fetch products'}), 500

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        
        conn.close()
        
        if row:
            return jsonify(format_product(row)), 200
        else:
            return jsonify({'error': 'Product not found'}), 404
            
    except Exception as e:
        print(f"Error getting product {product_id}: {e}")
        return jsonify({'error': 'Failed to fetch product'}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all available categories"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category")
        rows = cursor.fetchall()
        
        categories = ['All'] + [row['category'] for row in rows]
        
        conn.close()
        return jsonify(categories), 200
        
    except Exception as e:
        print(f"Error getting categories: {e}")
        return jsonify({'error': 'Failed to fetch categories'}), 500

@app.route('/api/search', methods=['GET'])
def search_products():
    """Search products"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query_param = request.args.get('q', '').lower()
        category = request.args.get('category')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        limit = int(request.args.get('limit', 20))
        
        # Build search query
        sql_query = "SELECT * FROM products WHERE 1=1"
        params = []
        
        if query_param:
            sql_query += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)"
            search_param = f"%{query_param}%"
            params.extend([search_param, search_param])
        
        if category and category != 'All':
            sql_query += " AND category = ?"
            params.append(category)
            
        if min_price is not None:
            sql_query += " AND price >= ?"
            params.append(min_price)
            
        if max_price is not None:
            sql_query += " AND price <= ?"
            params.append(max_price)
        
        sql_query += f" LIMIT {limit}"
        
        cursor.execute(sql_query, params)
        rows = cursor.fetchall()
        
        results = [format_product(row) for row in rows]
        
        conn.close()
        return jsonify({
            'results': results,
            'count': len(results),
            'query': query_param
        }), 200
        
    except Exception as e:
        print(f"Error searching products: {e}")
        return jsonify({'error': 'Failed to search products'}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as total FROM products")
        total_products = cursor.fetchone()['total']
        
        cursor.execute("SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC")
        category_stats = [{'category': row['category'], 'count': row['count']} for row in cursor.fetchall()]
        
        cursor.execute("SELECT AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price FROM products WHERE price > 0")
        price_stats = cursor.fetchone()
        
        conn.close()
        
        return jsonify({
            'total_products': total_products,
            'categories': category_stats,
            'price_range': {
                'average': round(price_stats['avg_price'] or 0, 2),
                'minimum': price_stats['min_price'] or 0,
                'maximum': price_stats['max_price'] or 0
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

if __name__ == '__main__':
    print("🚀 Starting Database API Server...")
    print("📍 Available endpoints:")
    print("  GET  /api/health")
    print("  GET  /api/products")
    print("  GET  /api/products/<id>")
    print("  GET  /api/categories")
    print("  GET  /api/search")
    print("  GET  /api/stats")
    print(f"🗄️  Database: {DATABASE_PATH}")
    print(f"🌐 CORS Origins: {CORS_ORIGINS}")
    print(f"🚀 Starting server on http://localhost:5000")
    
    app.run(host='127.0.0.1', port=5000, debug=True)
