import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
from datetime import datetime
import uuid
from models import SessionLocal, Product, User, ChatSession, ChatMessage, init_db
import config
import logging
from functools import wraps

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
CORS(app, origins=config.CORS_ORIGINS)

# Configure logging
logging.basicConfig(level=getattr(logging, config.LOG_LEVEL if hasattr(config, 'LOG_LEVEL') else 'INFO'))
logger = logging.getLogger(__name__)

# Initialize database
init_db()

# Download required NLTK data
print("Checking NLTK data...")
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
    print("NLTK data found!")
except LookupError:
    print("Downloading NLTK data...")
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    print("NLTK downloads complete!")

print("Initializing NLTK components...")
# Initialize NLTK components
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
print("NLTK initialization complete!")

# Intent patterns
intent_patterns = {
    'greeting': [
        r'hello', r'hi', r'hey', r'greetings', r'good morning', r'good afternoon', r'good evening'
    ],
    'book_search': [
        r'book', r'novel', r'fiction', r'non-fiction', r'textbook', r'author', r'title', 
        r'reading', r'literature', r'story', r'find book'
    ],
    'category_search': [
        r'category', r'genre', r'type', r'section', r'group', r'classification', r'collection'
    ],
    'price_query': [
        r'price', r'cost', r'how much', r'affordable', r'expensive', r'cheap', r'budget', 
        r'discount', r'offer', r'deal', r'sale', r'under \$\d+', r'less than \$\d+'
    ],
    'availability': [
        r'available', r'in stock', r'stock', r'have', r'get', r'when', r'deliver', r'shipping'
    ],
    'recommendation': [
        r'recommend', r'suggestion', r'best', r'popular', r'top', r'trending', r'bestseller',
        r'most read', r'award winning'
    ],
    'checkout': [
        r'checkout', r'buy', r'purchase', r'cart', r'basket', r'order', r'payment', r'pay'
    ],
    'help': [
        r'help', r'support', r'assist', r'guide', r'how to', r'explain', r'what can you do'
    ],
    'author_search': [
        r'author', r'writer', r'who wrote', r'written by'
    ],
    'thanks': [
        r'thank', r'thanks', r'appreciate'
    ]
}

def handle_db_errors(f):
    """Decorator for handling database errors"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Database error in {f.__name__}: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
    return decorated_function

def extract_intent(message):
    """Extract intent from user message"""
    message = message.lower()
    for intent, patterns in intent_patterns.items():
        for pattern in patterns:
            if re.search(pattern, message):
                return intent
    return 'general'

def preprocess_text(text):
    """Preprocess text for NLP"""
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
    return tokens

def extract_keywords(message):
    """Extract keywords from user message"""
    tokens = preprocess_text(message)
    keywords = [token for token in tokens if len(token) > 2]
    return keywords

def filter_products(query, limit=5):
    """Filter products based on user query"""
    db = SessionLocal()
    try:
        keywords = extract_keywords(query)
        
        # Extract numeric values for price filtering
        price_match = re.search(r'(\d+)', query)
        max_price = int(price_match.group(1)) if price_match else None
        
        results = []
        
        # Check for specific category mentions
        category_match = None
        for keyword in keywords:
            if keyword.lower() in ['fiction', 'novel', 'story']:
                category_match = 'Fiction'
            elif keyword.lower() in ['textbook', 'academic', 'education']:
                category_match = 'Education'
            elif keyword.lower() in ['history', 'historical']:
                category_match = 'History'
            elif keyword.lower() in ['science', 'scientific', 'biology', 'physics', 'chemistry']:
                category_match = 'Science'
            elif keyword.lower() in ['biography', 'memoir']:
                category_match = 'Biography'
        
        # Get all products from database
        products = db.query(Product).all()
        
        for product in products:
            score = 0
            product_dict = product.to_dict()
            
            if category_match and product.category == category_match:
                score += 5
            
            # Match title
            product_title = product.title.lower()
            for keyword in keywords:
                if keyword.lower() in product_title:
                    score += 3
            
            # Match description
            product_desc = product.description.lower() if product.description else ""
            for keyword in keywords:
                if keyword.lower() in product_desc:
                    score += 2
            
            # Price filter
            if max_price and product.price <= max_price:
                score += 1
            
            if score > 0:
                results.append({
                    'product': product_dict,
                    'score': score
                })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['score'], reverse=True)
        
        # Return only the product objects, limited to the specified number
        return [item['product'] for item in results[:limit]]
    
    finally:
        db.close()

def generate_response(session_id, message):
    """Generate chatbot response"""
    db = SessionLocal()
    try:
        # Get or create chat session
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not session:
            session = ChatSession(
                id=session_id,
                user_id=None  # For now, we'll handle anonymous sessions
            )
            db.add(session)
            db.commit()
        
        intent = extract_intent(message)
        
        # Add user message to database
        user_message = ChatMessage(
            session_id=session_id,
            sender='user',
            message=message
        )
        db.add(user_message)
        
        response = {
            'message': '',
            'products': None,
            'suggestions': [],
            'type': 'text'
        }
        
        # Handle based on intent
        if intent == 'greeting':
            response['message'] = "Hello! I'm your Book Buddy AI assistant. I can help you find books, check prices, or answer questions about our store. What are you looking for today?"
            response['suggestions'] = ['Find popular books', 'New releases', 'Book recommendations', 'Search by author']
        
        elif intent == 'book_search':
            products = filter_products(message)
            if products:
                response['message'] = f"I found {len(products)} books that might interest you:"
                response['products'] = products
                response['type'] = 'product'
            else:
                response['message'] = "I couldn't find any books matching your request. Could you try different keywords or browse our categories?"
                response['suggestions'] = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography']
        
        elif intent == 'price_query':
            price_match = re.search(r'(\d+)', message)
            if price_match:
                price = int(price_match.group(1))
                products = db.query(Product).filter(Product.price <= price).limit(5).all()
                product_dicts = [p.to_dict() for p in products]
                if product_dicts:
                    response['message'] = f"Here are books under ${price}:"
                    response['products'] = product_dicts
                    response['type'] = 'product'
                else:
                    response['message'] = f"I couldn't find books under ${price}. Would you like to see our budget-friendly options?"
                    response['suggestions'] = ['Budget books', 'Special offers', 'Discounted books']
            else:
                response['message'] = "For which price range would you like to see books?"
                response['suggestions'] = ['Under $20', 'Under $50', 'Premium books']
        
        elif intent == 'category_search':
            response['message'] = "We have several book categories. Which one interests you?"
            response['suggestions'] = ['Fiction', 'History', 'Science', 'Education', 'Biography']
            response['type'] = 'suggestions'
        
        elif intent == 'recommendation':
            # Get top-rated books
            top_books = db.query(Product).order_by(Product.rating.desc()).limit(5).all()
            top_books_dicts = [book.to_dict() for book in top_books]
            response['message'] = "Here are some of our highest-rated books:"
            response['products'] = top_books_dicts
            response['type'] = 'product'
        
        elif intent == 'checkout':
            response['message'] = "Ready to complete your purchase? You can proceed to checkout, or continue shopping if you'd like to add more books."
            response['suggestions'] = ['Proceed to checkout', 'Continue shopping', 'View cart']
        
        elif intent == 'help':
            response['message'] = "I can help you find books by title, author, or genre, check prices, make recommendations, and assist with checkout. What would you like to do?"
            response['suggestions'] = ['Find a book', 'Browse categories', 'Get recommendations', 'Checkout help']
        
        elif intent == 'author_search':
            # Extract potential author name
            author_match = re.search(r'by\s+([A-Za-z\s]+)', message)
            if author_match:
                author = author_match.group(1).strip()
                # Filter products that mention this author
                matching_products = []
                products = db.query(Product).all()
                for product in products:
                    if author.lower() in product.title.lower() or (product.description and author.lower() in product.description.lower()):
                        matching_products.append(product.to_dict())
                
                if matching_products:
                    response['message'] = f"Here are books by or about {author}:"
                    response['products'] = matching_products[:5]
                    response['type'] = 'product'
                else:
                    response['message'] = f"I couldn't find books by {author}. Would you like to browse our authors or search for something else?"
                    response['suggestions'] = ['Browse authors', 'Search by title', 'Popular authors']
            else:
                response['message'] = "Which author are you interested in?"
                response['suggestions'] = ['Search by title instead', 'Browse authors', 'Popular authors']
        
        elif intent == 'thanks':
            response['message'] = "You're welcome! Is there anything else I can help you with?"
            response['suggestions'] = ['Find more books', 'No, thanks']
        
        else:
            # General case or unknown intent
            response['message'] = "I'm not sure I understand. Would you like to browse our books, check prices, or get recommendations?"
            response['suggestions'] = ['Browse books', 'Check prices', 'Get recommendations', 'Help']
        
        # Add bot response to database
        bot_message = ChatMessage(
            session_id=session_id,
            sender='bot',
            message=response['message'],
            products_json=json.dumps(response.get('products')) if response.get('products') else None,
            suggestions_json=json.dumps(response.get('suggestions')) if response.get('suggestions') else None
        )
        db.add(bot_message)
        db.commit()
        
        return response
    
    finally:
        db.close()

# API Endpoints

@app.route('/api/chat', methods=['POST'])
@handle_db_errors
def chat_endpoint():
    """Main chat endpoint"""
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing message in request'}), 400
    
    user_message = data['message']
    session_id = data.get('session_id', str(uuid.uuid4()))
    
    response = generate_response(session_id, user_message)
    return jsonify({
        'response': response,
        'session_id': session_id
    })

@app.route('/api/sessions/<session_id>', methods=['GET'])
@handle_db_errors
def get_session(session_id):
    """Get chat session history"""
    db = SessionLocal()
    try:
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            return jsonify(session.to_dict())
        else:
            return jsonify({'error': 'Session not found'}), 404
    finally:
        db.close()

@app.route('/api/sessions', methods=['POST'])
@handle_db_errors
def create_session():
    """Create a new chat session"""
    session_id = str(uuid.uuid4())
    db = SessionLocal()
    try:
        session = ChatSession(id=session_id)
        db.add(session)
        db.commit()
        return jsonify({'session_id': session_id})
    finally:
        db.close()

@app.route('/api/sessions/<session_id>', methods=['DELETE'])
@handle_db_errors
def delete_session(session_id):
    """Delete a chat session and its messages"""
    db = SessionLocal()
    try:
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            # Delete all messages first
            db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
            # Delete the session
            db.delete(session)
            db.commit()
            return jsonify({'message': 'Session deleted successfully'})
        else:
            return jsonify({'error': 'Session not found'}), 404
    finally:
        db.close()

@app.route('/api/products', methods=['GET'])
@handle_db_errors
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

@app.route('/api/products/<product_id>', methods=['GET'])
@handle_db_errors
def get_product(product_id):
    """Get a specific product by ID"""
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            return jsonify(product.to_dict())
        else:
            return jsonify({'error': 'Product not found'}), 404
    finally:
        db.close()

@app.route('/api/categories', methods=['GET'])
@handle_db_errors
def get_categories():
    """Get all available categories"""
    db = SessionLocal()
    try:
        categories = db.query(Product.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        return jsonify(category_list)
    finally:
        db.close()

@app.route('/api/search', methods=['GET'])
@handle_db_errors
def search_products():
    """Advanced product search"""
    db = SessionLocal()
    try:
        query = request.args.get('q', '')
        category = request.args.get('category')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        limit = request.args.get('limit', 10, type=int)
        
        # Build query
        product_query = db.query(Product)
        
        if query:
            # Search in title and description
            search_filter = f"%{query}%"
            product_query = product_query.filter(
                (Product.title.ilike(search_filter)) | 
                (Product.description.ilike(search_filter))
            )
        
        if category:
            product_query = product_query.filter(Product.category == category)
        
        if min_price is not None:
            product_query = product_query.filter(Product.price >= min_price)
        
        if max_price is not None:
            product_query = product_query.filter(Product.price <= max_price)
        
        products = product_query.limit(limit).all()
        results = [p.to_dict() for p in products]
        
        return jsonify({
            'results': results,
            'count': len(results),
            'query': query
        })
    finally:
        db.close()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("Starting Book Buddy API server...")
    print("Initializing NLTK...")
    
    # Start Flask server
    port = int(os.environ.get('PORT', config.PORT))
    print(f"Starting Flask server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=config.DEBUG)
