import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import uuid
from models import SessionLocal, Product, init_db
import config
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
CORS(app, origins=config.CORS_ORIGINS)

# Configure logging
logging.basicConfig(level=getattr(
    logging, config.LOG_LEVEL if hasattr(config, 'LOG_LEVEL') else 'INFO'))
logger = logging.getLogger(__name__)

print("Initializing database...")
# Initialize database
init_db()
print("Database initialized!")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


@app.route('/api/products', methods=['GET'])
def get_products():
    """Get products with optional filtering"""
    db = SessionLocal()
    try:
        category = request.args.get('category')
        limit = int(request.args.get('limit', 10))

        query = db.query(Product)
        if category:
            query = query.filter(Product.category == category)

        products = query.limit(limit).all()
        filtered_products = [p.to_dict() for p in products]

        return jsonify(filtered_products)
    finally:
        db.close()


@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Simple chat endpoint without NLP"""
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing message in request'}), 400

    user_message = data['message'].lower()
    session_id = data.get('session_id', str(uuid.uuid4()))

    # Simple keyword-based responses
    response = {
        'message': '',
        'products': None,
        'suggestions': [],
        'type': 'text'
    }

    if 'hello' in user_message or 'hi' in user_message:
        response['message'] = "Hello! I'm your Storely AI assistant. How can I help you find a book today?"
        response['suggestions'] = ['Show me fiction books',
                                   'Science books', 'History books']
    elif 'fiction' in user_message:
        db = SessionLocal()
        try:
            books = db.query(Product).filter(
                Product.category == 'Fiction').limit(5).all()
            response['message'] = "Here are some great fiction books:"
            response['products'] = [book.to_dict() for book in books]
            response['type'] = 'product'
        finally:
            db.close()
    elif 'science' in user_message:
        db = SessionLocal()
        try:
            books = db.query(Product).filter(
                Product.category == 'Science').limit(5).all()
            response['message'] = "Here are some science books:"
            response['products'] = [book.to_dict() for book in books]
            response['type'] = 'product'
        finally:
            db.close()
    elif 'history' in user_message:
        db = SessionLocal()
        try:
            books = db.query(Product).filter(
                Product.category == 'History').limit(5).all()
            response['message'] = "Here are some history books:"
            response['products'] = [book.to_dict() for book in books]
            response['type'] = 'product'
        finally:
            db.close()
    else:
        response['message'] = "I can help you find books! Try asking about fiction, science, or history books."
        response['suggestions'] = ['Fiction books',
                                   'Science books', 'History books']

    return jsonify({
        'response': response,
        'session_id': session_id
    })


if __name__ == '__main__':
    print("Starting Storely API server...")
    port = int(os.environ.get('PORT', config.PORT))
    print(f"Starting Flask server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=config.DEBUG)
