from datetime import timedelta
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_compress import Compress
from dotenv import load_dotenv
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
from datetime import datetime, timedelta
import uuid
from models import SessionLocal, Product, User, ChatSession, ChatMessage, OTPSession, init_db
import config
import logging
from functools import wraps
import jwt
import bcrypt
import secrets
import random
import string

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY

# Enable compression for all responses
compress = Compress(app)
app.config['COMPRESS_MIMETYPES'] = [
    'text/html', 'text/css', 'text/xml', 'text/javascript', 'text/plain',
    'application/json', 'application/javascript', 'application/xml+rss',
    'application/atom+xml', 'image/svg+xml'
]
app.config['COMPRESS_LEVEL'] = 6
app.config['COMPRESS_MIN_SIZE'] = 500

CORS(app, origins=config.CORS_ORIGINS)

# Configure logging
logging.basicConfig(level=getattr(
    logging, config.LOG_LEVEL if hasattr(config, 'LOG_LEVEL') else 'INFO'))
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
    ],    'price_query': [
        r'price', r'cost', r'how much', r'affordable', r'expensive', r'cheap', r'budget',
        r'discount', r'offer', r'deal', r'sale', r'under \d+', r'less than \d+',
        r'below \d+', r'cheaper than \d+', r'maximum \d+', r'under \$\d+', r'less than \$\d+'
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

    # Check price_query patterns first since they're more specific
    for pattern in intent_patterns['price_query']:
        if re.search(pattern, message):
            return 'price_query'

    # Then check other intents
    for intent, patterns in intent_patterns.items():
        if intent == 'price_query':  # Skip since we already checked it
            continue
        for pattern in patterns:
            if re.search(pattern, message):
                return intent
    return 'general'


def preprocess_text(text):
    """Preprocess text for NLP"""
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(token)
              for token in tokens if token not in stop_words]
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
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id).first()
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
            response['message'] = "Hello! I'm your Storely AI assistant. I can help you find books, check prices, or answer questions about our store. What are you looking for today?"
            response['suggestions'] = ['Find popular books',
                                       'New releases', 'Book recommendations', 'Search by author']

        elif intent == 'book_search':
            products = filter_products(message)
            if products:
                response['message'] = f"I found {len(products)} books that might interest you:"
                response['products'] = products
                response['type'] = 'product'
            else:
                response['message'] = "I couldn't find any books matching your request. Could you try different keywords or browse our categories?"
                response['suggestions'] = ['Fiction', 'Non-fiction',
                                           'Science', 'History', 'Biography']

        elif intent == 'price_query':
            price_match = re.search(r'(\d+)', message)
            if price_match:
                price = int(price_match.group(1))
                products = db.query(Product).filter(
                    Product.price <= price).limit(5).all()
                product_dicts = [p.to_dict() for p in products]
                if product_dicts:
                    response['message'] = f"Here are books under ${price}:"
                    response['products'] = product_dicts
                    response['type'] = 'product'
                else:
                    response['message'] = f"I couldn't find books under ${price}. Would you like to see our budget-friendly options?"
                    response['suggestions'] = ['Budget books',
                                               'Special offers', 'Discounted books']
            else:
                response['message'] = "For which price range would you like to see books?"
                response['suggestions'] = [
                    'Under $20', 'Under $50', 'Premium books']

        elif intent == 'category_search':
            response['message'] = "We have several book categories. Which one interests you?"
            response['suggestions'] = ['Fiction', 'History',
                                       'Science', 'Education', 'Biography']
            response['type'] = 'suggestions'

        elif intent == 'recommendation':
            # Get top-rated books
            top_books = db.query(Product).order_by(
                Product.rating.desc()).limit(5).all()
            top_books_dicts = [book.to_dict() for book in top_books]
            response['message'] = "Here are some of our highest-rated books:"
            response['products'] = top_books_dicts
            response['type'] = 'product'

        elif intent == 'checkout':
            response['message'] = "Ready to complete your purchase? You can proceed to checkout, or continue shopping if you'd like to add more books."
            response['suggestions'] = ['Proceed to checkout',
                                       'Continue shopping', 'View cart']

        elif intent == 'help':
            response['message'] = "I can help you find books by title, author, or genre, check prices, make recommendations, and assist with checkout. What would you like to do?"
            response['suggestions'] = ['Find a book',
                                       'Browse categories', 'Get recommendations', 'Checkout help']

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
                    response['suggestions'] = ['Browse authors',
                                               'Search by title', 'Popular authors']
            else:
                response['message'] = "Which author are you interested in?"
                response['suggestions'] = ['Search by title instead',
                                           'Browse authors', 'Popular authors']

        elif intent == 'thanks':
            response['message'] = "You're welcome! Is there anything else I can help you with?"
            response['suggestions'] = ['Find more books', 'No, thanks']

        else:
            # General case or unknown intent
            response['message'] = "I'm not sure I understand. Would you like to browse our books, check prices, or get recommendations?"
            response['suggestions'] = ['Browse books',
                                       'Check prices', 'Get recommendations', 'Help']
          # Add bot response to database
        bot_message = ChatMessage(
            session_id=session_id,
            sender='bot',
            message=response['message'],
            products_json=json.dumps(response.get(
                'products')) if response.get('products') else None,
            suggestions_json=json.dumps(response.get(
                'suggestions')) if response.get('suggestions') else None
        )
        db.add(bot_message)
        db.commit()

        return response

    finally:
        db.close()


def extract_entities(message):
    """Extract entities like price ranges, categories, specific terms"""
    entities = {
        'price_range': None,
        'category': None,
        'author': None,
        'specific_terms': []
    }

    # Extract price range
    price_patterns = [
        r'under (\d+)',
        r'less than (\d+)',
        r'below (\d+)',
        r'(\d+) to (\d+)',
        r'between (\d+) and (\d+)'
    ]

    for pattern in price_patterns:
        match = re.search(pattern, message.lower())
        if match:
            if len(match.groups()) == 1:
                entities['price_range'] = {'max': int(match.group(1))}
            else:
                entities['price_range'] = {
                    'min': int(match.group(1)),
                    'max': int(match.group(2))
                }
            break

    # Extract category mentions
    category_keywords = {
        'fiction': 'Fiction',
        'textbook': 'Education',
        'history': 'History',
        'science': 'Science',
        'biography': 'Biography',
        'novel': 'Fiction',
        'academic': 'Education'
    }

    for keyword, category in category_keywords.items():
        if keyword in message.lower():
            entities['category'] = category
            break

    # Extract author mentions
    author_match = re.search(r'by\s+([A-Za-z\s]+)', message, re.IGNORECASE)
    if author_match:
        entities['author'] = author_match.group(1).strip()

    return entities


def analyze_sentiment(message):
    """Basic sentiment analysis"""
    positive_words = ['good', 'great', 'excellent',
                      'amazing', 'love', 'like', 'best', 'awesome']
    negative_words = ['bad', 'terrible', 'hate',
                      'worst', 'awful', 'disappointed']

    words = message.lower().split()
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)

    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'


def get_personalized_recommendations(user_preferences, db):
    """Get personalized product recommendations based on user preferences"""
    query = db.query(Product)

    # Filter by preferred categories
    if user_preferences.get('preferredCategories'):
        categories = user_preferences['preferredCategories']
        query = query.filter(Product.category.in_(categories))

    # Filter by budget range
    if user_preferences.get('budgetRange'):
        budget = user_preferences['budgetRange']
        if budget.get('min'):
            query = query.filter(Product.price >= budget['min'])
        if budget.get('max'):
            query = query.filter(Product.price <= budget['max'])

    # Get top-rated products
    products = query.filter(Product.rating >= 4.0).order_by(
        Product.rating.desc()).limit(8).all()

    return [p.to_dict() for p in products]


def learn_from_interaction(user_message, user_preferences, entities):
    """Learn from user interaction to update preferences"""
    updated_preferences = user_preferences.copy()

    # Learn category preferences
    if entities.get('category'):
        preferred_cats = updated_preferences.get('preferredCategories', [])
        if entities['category'] not in preferred_cats:
            preferred_cats.append(entities['category'])
            updated_preferences['preferredCategories'] = preferred_cats

    # Learn budget preferences
    if entities.get('price_range'):
        current_budget = updated_preferences.get('budgetRange', {})
        price_range = entities['price_range']

        if price_range.get('max') and not current_budget.get('max'):
            current_budget['max'] = price_range['max']
        if price_range.get('min') and not current_budget.get('min'):
            current_budget['min'] = price_range['min']

        updated_preferences['budgetRange'] = current_budget

    # Learn search terms
    search_terms = updated_preferences.get('lastSearches', [])
    keywords = extract_keywords(user_message)
    for keyword in keywords[:3]:  # Add top 3 keywords
        if keyword not in search_terms:
            search_terms.insert(0, keyword)
            if len(search_terms) > 10:  # Keep only last 10 searches
                search_terms = search_terms[:10]

    updated_preferences['lastSearches'] = search_terms

    return updated_preferences


def generate_enhanced_response(session_id, message, user_id=None, user_preferences=None):
    """Generate enhanced chatbot response with personalization and advanced features"""
    db = SessionLocal()
    try:
        # Get or create chat session
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id).first()
        if not session:
            session = ChatSession(
                id=session_id,
                user_id=user_id
            )
            db.add(session)
            db.commit()

        # Save user message to database
        user_msg = ChatMessage(
            session_id=session_id,
            sender='user',
            message=message
        )
        db.add(user_msg)
        db.commit()

        # Extract entities and analyze sentiment
        entities = extract_entities(message)
        sentiment = analyze_sentiment(message)
        intent = extract_intent(message)

        # Initialize response
        response = {
            'message': '',
            'type': 'text',
            'products': None,
            'suggestions': None,
            'sentiment': sentiment,
            'entities': entities,
            'learned_preferences': None
        }

        # Learn from interaction
        if user_preferences:
            updated_preferences = learn_from_interaction(
                message, user_preferences, entities)
            if updated_preferences != user_preferences:
                response['learned_preferences'] = updated_preferences

        # Generate contextual response based on intent and entities
        if intent == 'greeting':
            if sentiment == 'positive':
                response['message'] = "Hello! I'm excited to help you find amazing books today! 📚 What can I help you discover?"
            else:
                response['message'] = "Hi there! I'm here to help you find the perfect books. What are you looking for today?"
            response['suggestions'] = ['Browse bestsellers',
                                       'Find books by genre', 'Get recommendations', 'Search by author']

        elif intent == 'book_search':
            # Enhanced book search with entity extraction
            search_results = []

            if entities.get('category'):
                # Category-specific search
                query = db.query(Product).filter(
                    Product.category == entities['category'])
                if entities.get('price_range'):
                    pr = entities['price_range']
                    if pr.get('max'):
                        query = query.filter(Product.price <= pr['max'])
                    if pr.get('min'):
                        query = query.filter(Product.price >= pr['min'])

                search_results = query.limit(6).all()
                response['message'] = f"Here are some great {entities['category'].lower()} books"
                if entities.get('price_range'):
                    if entities['price_range'].get('max'):
                        response['message'] += f" under ₹{entities['price_range']['max']}"
                response['message'] += ":"

            elif entities.get('author'):
                # Author search
                author = entities['author']
                products = db.query(Product).all()
                for product in products:
                    if author.lower() in product.title.lower() or (product.description and author.lower() in product.description.lower()):
                        search_results.append(product)

                if search_results:
                    response['message'] = f"Here are books by or about {author}:"
                else:
                    response['message'] = f"I couldn't find books by {author}. Here are some popular alternatives:"
                    search_results = db.query(Product).order_by(
                        Product.rating.desc()).limit(4).all()

            else:
                # General search using keywords
                keywords = extract_keywords(message)
                if keywords:
                    search_term = ' '.join(keywords[:2])  # Use top 2 keywords
                    search_filter = f"%{search_term}%"
                    search_results = db.query(Product).filter(
                        (Product.title.ilike(search_filter)) |
                        (Product.description.ilike(search_filter))
                    ).limit(6).all()

                    if search_results:
                        response['message'] = f"Here are books matching '{search_term}':"
                    else:
                        response['message'] = "Let me show you some popular books instead:"
                        search_results = db.query(Product).order_by(
                            Product.rating.desc()).limit(6).all()

            if search_results:
                response['products'] = [book.to_dict()
                                        for book in search_results]
                response['type'] = 'product'
                response['suggestions'] = ['Show more',
                                           'Filter by price', 'Different category', 'Add to cart']
            else:
                response['suggestions'] = [
                    'Browse categories', 'Popular books', 'New arrivals']

        elif intent == 'recommendation':
            # Personalized recommendations
            if user_preferences:
                recommended_products = get_personalized_recommendations(
                    user_preferences, db)
                if recommended_products:
                    response['message'] = "Based on your preferences, here are some books you might love:"
                    response['products'] = recommended_products
                    response['type'] = 'product'
                else:
                    # Fallback to general recommendations
                    top_books = db.query(Product).order_by(
                        Product.rating.desc()).limit(6).all()
                    response['message'] = "Here are our top-rated books:"
                    response['products'] = [book.to_dict()
                                            for book in top_books]
                    response['type'] = 'product'
            else:
                # General recommendations
                top_books = db.query(Product).order_by(
                    Product.rating.desc()).limit(6).all()
                response['message'] = "Here are our highest-rated books:"
                response['products'] = [book.to_dict() for book in top_books]
                response['type'] = 'product'

            response['suggestions'] = ['More like these',
                                       'Different genre', 'Budget options', 'Add to cart']

        elif intent == 'price_query':
            # Enhanced price queries with entity extraction
            if entities.get('price_range'):
                pr = entities['price_range']
                query = db.query(Product)

                if pr.get('max'):
                    query = query.filter(Product.price <= pr['max'])
                    price_products = query.order_by(
                        Product.rating.desc()).limit(6).all()
                    response['message'] = f"Here are highly-rated books under ₹{pr['max']}:"
                else:
                    query = query.filter(Product.price >= pr['min']).filter(
                        Product.price <= pr['max'])
                    price_products = query.order_by(
                        Product.rating.desc()).limit(6).all()
                    response['message'] = f"Here are great books between ₹{pr['min']} and ₹{pr['max']}:"

                if price_products:
                    response['products'] = [book.to_dict()
                                            for book in price_products]
                    response['type'] = 'product'
                    response['suggestions'] = ['Show more',
                                               'Different price range', 'Filter by category']
                else:
                    # Include the price value in the fallback message
                    if pr.get('max'):
                        response['message'] = f"I couldn't find books under ₹{pr['max']}. Here are some affordable options:"
                    else:
                        response['message'] = f"I couldn't find books between ₹{pr['min']} and ₹{pr['max']}. Here are some affordable options:"
                    affordable_books = db.query(Product).order_by(
                        Product.price.asc()).limit(6).all()
                    response['products'] = [book.to_dict()
                                            for book in affordable_books]
                    response['type'] = 'product'
            else:
                response['message'] = "I can help you find books in any price range! What's your budget?"
                response['suggestions'] = ['Under ₹500',
                                           '₹500-1000', '₹1000-2000', 'Show all prices']

        elif intent == 'category_search':
            categories = db.query(Product.category).distinct().all()
            category_list = [cat[0] for cat in categories if cat[0]]
            response['message'] = "We have books in these categories. Which one interests you?"
            # Limit to 6 suggestions
            response['suggestions'] = category_list[:6]
            response['type'] = 'suggestions'

        elif intent == 'checkout':
            response['message'] = "Ready to complete your purchase? I can help you review your cart or proceed to checkout."
            response['suggestions'] = ['View cart',
                                       'Proceed to checkout', 'Continue shopping', 'Apply coupon']

        elif intent == 'help':
            response['message'] = "I'm your personal book assistant! I can help you:\n• Find books by title, author, or genre\n• Get personalized recommendations\n• Check prices and deals\n• Manage your cart and checkout"
            response['suggestions'] = ['Find a book',
                                       'Get recommendations', 'Browse categories', 'Price search']

        elif intent == 'thanks':
            responses = [
                "You're very welcome! Happy to help you find great books! 📚",
                "My pleasure! Is there anything else you'd like to explore?",
                "Glad I could help! Feel free to ask about more books anytime!"
            ]
            response['message'] = responses[hash(
                message) % len(responses)]  # Vary responses
            response['suggestions'] = ['Find more books',
                                       'Browse categories', 'Check my cart']

        else:
            # Enhanced general response with context awareness
            if 'expensive' in message.lower() or 'cheap' in message.lower():
                affordable_books = db.query(Product).order_by(
                    Product.price.asc()).limit(4).all()
                response['message'] = "Here are some budget-friendly options:"
                response['products'] = [book.to_dict()
                                        for book in affordable_books]
                response['type'] = 'product'
            elif any(word in message.lower() for word in ['bestseller', 'popular', 'trending']):
                popular_books = db.query(Product).order_by(
                    Product.rating.desc()).limit(4).all()
                response['message'] = "Here are our most popular books:"
                response['products'] = [book.to_dict()
                                        for book in popular_books]
                response['type'] = 'product'
            else:
                response['message'] = "I'd love to help you find the perfect books! What are you interested in?"
                response['suggestions'] = [
                    'Browse books', 'Get recommendations', 'Search by category', 'Price ranges']

        # Add bot response to database
        bot_message = ChatMessage(
            session_id=session_id,
            sender='bot',
            message=response['message'],
            products_json=json.dumps(response.get(
                'products')) if response.get('products') else None,
            suggestions_json=json.dumps(response.get(
                'suggestions')) if response.get('suggestions') else None
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
    """Enhanced chat endpoint with user preferences and advanced features"""
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing message in request'}), 400

    user_message = data['message']
    session_id = data.get('session_id', str(uuid.uuid4()))
    user_id = data.get('user_id')
    preferences = data.get('preferences', {})
    timestamp = data.get('timestamp', datetime.utcnow().isoformat())

    # Generate enhanced response with user context
    response = generate_enhanced_response(
        session_id, user_message, user_id, preferences)

    return jsonify({
        'response': response,
        'session_id': session_id,
        'timestamp': timestamp,
        'user_preferences_updated': response.get('learned_preferences') is not None
    })


@app.route('/api/sessions/<session_id>', methods=['GET'])
@handle_db_errors
def get_session(session_id):
    """Get chat session history"""
    db = SessionLocal()
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id).first()
        if session:
            return jsonify({'session': session.to_dict()})
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
        return jsonify({'session_id': session_id}), 201
    finally:
        db.close()


@app.route('/api/sessions/<session_id>', methods=['DELETE'])
@handle_db_errors
def delete_session(session_id):
    """Delete a chat session and its messages"""
    db = SessionLocal()
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id).first()
        if session:
            # Delete all messages first
            db.query(ChatMessage).filter(
                ChatMessage.session_id == session_id).delete()
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


# Debug Endpoints (for development only)

@app.route('/api/debug/users', methods=['GET'])
@handle_db_errors
def debug_get_users():
    """Debug endpoint to list all users (development only)"""
    if not config.DEBUG:
        return jsonify({'error': 'Debug endpoints are disabled in production'}), 403

    db = SessionLocal()
    try:
        users = db.query(User).all()
        return jsonify({
            'count': len(users),
            'users': [user.to_dict() for user in users]
        }), 200
    finally:
        db.close()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200


@app.route('/api/debug', methods=['GET'])
def debug_info():
    """Debug endpoint to check configuration"""
    return jsonify({
        'cors_origins': config.CORS_ORIGINS,
        'api_url': request.url_root,
        'headers': dict(request.headers),
        'method': request.method,
        'timestamp': datetime.utcnow().isoformat()
    })

# Authentication Endpoints


@app.route('/api/auth/register', methods=['POST'])
@handle_db_errors
def register_user():
    """Register a new user"""
    db = SessionLocal()
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')  # In production, hash this!

        if not username or not email or not password:
            return jsonify({'error': 'Username, email, and password are required'}), 400

        # Check if username or email already exists
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()

        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409

        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            password_hash=password,  # In production, use proper hashing
            preferences_json=json.dumps({
                'preferredCategories': [],
                'budgetRange': {},
                'lastSearches': []
            })
        )

        db.add(user)
        db.commit()

        return jsonify({
            'message': 'User registered successfully',
            'user_id': user.id,
            'username': user.username
        }), 201

    finally:
        db.close()


# Enhanced Authentication System

# JWT Configuration
JWT_SECRET_KEY = os.environ.get(
    'JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_EXPIRATION_DELTA = timedelta(days=7)


def generate_jwt_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + JWT_EXPIRATION_DELTA,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')


def verify_jwt_token(token):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def jwt_required(f):
    """Decorator for routes that require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid authorization header format'}), 401

        if not token:
            return jsonify({'error': 'Authorization token is required'}), 401

        user_id = verify_jwt_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401

        # Add user_id to request context
        request.current_user_id = user_id
        return f(*args, **kwargs)

    return decorated_function


def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password, hashed):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_otp():
    """Generate 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))


def send_otp_sms(phone, otp_code):
    """Send OTP via SMS (mock implementation)"""
    # In production, integrate with SMS service like Twilio, AWS SNS, etc.
    logger.info(f"SMS OTP sent to {phone}: {otp_code}")
    return True


def send_otp_email(email, otp_code):
    """Send OTP via email (mock implementation)"""
    # In production, integrate with email service like SendGrid, SES, etc.
    logger.info(f"Email OTP sent to {email}: {otp_code}")
    return True

# Authentication Endpoints


@app.route('/api/auth/signup', methods=['POST'])
@handle_db_errors
def signup_user():
    """Enhanced user signup with email/phone support"""
    db = SessionLocal()
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400

        signup_type = data.get('type', 'email')  # 'email' or 'phone'

        if signup_type == 'email':
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')

            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400

            if password != confirm_password:
                return jsonify({'error': 'Passwords do not match'}), 400

            if len(password) < 6:
                return jsonify({'error': 'Password must be at least 6 characters'}), 400

            # Check if email already exists
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                return jsonify({'error': 'Email already registered'}), 409

            # Create new user
            user_id = str(uuid.uuid4())
            hashed_password = hash_password(password)

            new_user = User(
                id=user_id,
                name=data['name'],
                email=email,
                password_hash=hashed_password,
                is_email_verified=False
            )

            db.add(new_user)
            db.commit()

            # Generate JWT token
            token = generate_jwt_token(user_id)

            return jsonify({
                'message': 'Account created successfully',
                'token': token,
                'user': new_user.to_dict(),
                'requires_verification': True
            }), 201

        elif signup_type == 'phone':
            phone = data.get('phone')
            otp = data.get('otp')

            if not phone:
                return jsonify({'error': 'Phone number is required'}), 400

            if not otp:
                return jsonify({'error': 'OTP is required'}), 400

            # Verify OTP
            otp_session = db.query(OTPSession).filter(
                OTPSession.phone == phone,
                OTPSession.purpose == 'signup',
                OTPSession.is_used == False
            ).order_by(OTPSession.created_at.desc()).first()

            if not otp_session:
                return jsonify({'error': 'No OTP session found'}), 400

            otp_session.attempts += 1
            db.commit()

            if not otp_session.is_valid(otp):
                if otp_session.attempts >= otp_session.max_attempts:
                    return jsonify({'error': 'Maximum OTP attempts exceeded'}), 429
                elif otp_session.is_expired():
                    return jsonify({'error': 'OTP has expired'}), 400
                else:
                    return jsonify({'error': 'Invalid OTP'}), 400

            # Check if phone already exists
            existing_user = db.query(User).filter(User.phone == phone).first()
            if existing_user:
                return jsonify({'error': 'Phone number already registered'}), 409

            # Create new user
            user_id = str(uuid.uuid4())
            new_user = User(
                id=user_id,
                name=data['name'],
                phone=phone,
                is_phone_verified=True
            )

            db.add(new_user)

            # Mark OTP as used
            otp_session.is_used = True
            otp_session.user_id = user_id

            db.commit()

            # Generate JWT token
            token = generate_jwt_token(user_id)

            return jsonify({
                'message': 'Account created successfully',
                'token': token,
                'user': new_user.to_dict()
            }), 201

        else:
            return jsonify({'error': 'Invalid signup type'}), 400

    finally:
        db.close()


@app.route('/api/auth/send-otp', methods=['POST'])
@handle_db_errors
def send_otp():
    """Send OTP for phone verification"""
    db = SessionLocal()
    try:
        data = request.get_json()
        phone = data.get('phone')
        # 'signup', 'login', 'verification'
        purpose = data.get('purpose', 'signup')

        if not phone:
            return jsonify({'error': 'Phone number is required'}), 400

        # Validate phone format (basic validation)
        if not phone.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            return jsonify({'error': 'Invalid phone number format'}), 400

        # Check rate limiting (max 3 OTPs per hour per phone)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        recent_otps = db.query(OTPSession).filter(
            OTPSession.phone == phone,
            OTPSession.created_at >= one_hour_ago
        ).count()

        if recent_otps >= 3:
            return jsonify({'error': 'Too many OTP requests. Please try again later.'}), 429

        # Generate and store OTP
        otp_code = generate_otp()
        otp_session_id = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(minutes=10)  # OTP expires in 10 minutes

        otp_session = OTPSession(
            id=otp_session_id,
            phone=phone,
            otp_code=otp_code,
            purpose=purpose,
            expires_at=expires_at
        )

        db.add(otp_session)
        db.commit()

        # Send OTP (mock implementation)
        send_otp_sms(phone, otp_code)

        return jsonify({
            'message': 'OTP sent successfully',
            'expires_in': 600  # 10 minutes in seconds
        }), 200

    finally:
        db.close()


@app.route('/api/auth/login', methods=['POST'])
@handle_db_errors
def login_user():
    """Enhanced login with email/phone + password/OTP support"""
    db = SessionLocal()
    try:
        data = request.get_json()
        login_type = data.get('type', 'email')  # 'email' or 'phone'

        if login_type == 'email':
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400

            # Find user by email
            user = db.query(User).filter(User.email == email).first()

            if not user or not user.password_hash or not verify_password(password, user.password_hash):
                return jsonify({'error': 'Invalid email or password'}), 401

            if not user.is_active:
                return jsonify({'error': 'Account is deactivated'}), 401

            # Update last login
            user.last_login = datetime.utcnow()
            db.commit()

            # Generate JWT token
            token = generate_jwt_token(user.id)

            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': user.to_dict()
            }), 200

        elif login_type == 'phone':
            phone = data.get('phone')
            otp = data.get('otp')

            if not phone or not otp:
                return jsonify({'error': 'Phone number and OTP are required'}), 400

            # Verify OTP
            otp_session = db.query(OTPSession).filter(
                OTPSession.phone == phone,
                OTPSession.purpose == 'login',
                OTPSession.is_used == False
            ).order_by(OTPSession.created_at.desc()).first()

            if not otp_session:
                return jsonify({'error': 'No OTP session found'}), 400

            otp_session.attempts += 1
            db.commit()

            if not otp_session.is_valid(otp):
                if otp_session.attempts >= otp_session.max_attempts:
                    return jsonify({'error': 'Maximum OTP attempts exceeded'}), 429
                elif otp_session.is_expired():
                    return jsonify({'error': 'OTP has expired'}), 400
                else:
                    return jsonify({'error': 'Invalid OTP'}), 400

            # Find user by phone
            user = db.query(User).filter(User.phone == phone).first()

            if not user:
                return jsonify({'error': 'User not found with this phone number'}), 404

            if not user.is_active:
                return jsonify({'error': 'Account is deactivated'}), 401

            # Mark OTP as used
            otp_session.is_used = True

            # Update last login
            user.last_login = datetime.utcnow()
            db.commit()

            # Generate JWT token
            token = generate_jwt_token(user.id)

            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': user.to_dict()
            }), 200

        else:
            return jsonify({'error': 'Invalid login type'}), 400

    finally:
        db.close()


@app.route('/api/auth/verify-phone', methods=['POST'])
@jwt_required
@handle_db_errors
def verify_phone():
    """Verify phone number for existing user"""
    db = SessionLocal()
    try:
        data = request.get_json()
        phone = data.get('phone')
        otp = data.get('otp')

        if not phone or not otp:
            return jsonify({'error': 'Phone number and OTP are required'}), 400

        user_id = request.current_user_id
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Verify OTP
        otp_session = db.query(OTPSession).filter(
            OTPSession.phone == phone,
            OTPSession.purpose == 'verification',
            OTPSession.is_used == False
        ).order_by(OTPSession.created_at.desc()).first()

        if not otp_session:
            return jsonify({'error': 'No OTP session found'}), 400

        otp_session.attempts += 1
        db.commit()

        if not otp_session.is_valid(otp):
            if otp_session.attempts >= otp_session.max_attempts:
                return jsonify({'error': 'Maximum OTP attempts exceeded'}), 429
            elif otp_session.is_expired():
                return jsonify({'error': 'OTP has expired'}), 400
            else:
                return jsonify({'error': 'Invalid OTP'}), 400

        # Update user phone and mark as verified
        user.phone = phone
        user.is_phone_verified = True

        # Mark OTP as used
        otp_session.is_used = True
        otp_session.user_id = user_id

        db.commit()

        return jsonify({
            'message': 'Phone number verified successfully',
            'user': user.to_dict()
        }), 200

    finally:
        db.close()


@app.route('/api/auth/profile', methods=['GET'])
@jwt_required
@handle_db_errors
def get_user_profile():
    """Get current user profile"""
    db = SessionLocal()
    try:
        user_id = request.current_user_id
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    finally:
        db.close()


@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required
@handle_db_errors
def update_user_profile():
    """Update user profile"""
    db = SessionLocal()
    try:
        user_id = request.current_user_id
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        # Update allowed fields
        if 'name' in data:
            user.name = data['name']

        if 'avatar' in data:
            user.avatar = data['avatar']

        user.updated_at = datetime.utcnow()
        db.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200

    finally:
        db.close()


@app.route('/api/auth/change-password', methods=['POST'])
@jwt_required
@handle_db_errors
def change_password():
    """Change user password"""
    db = SessionLocal()
    try:
        user_id = request.current_user_id
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        confirm_password = data.get('confirmPassword')

        if not current_password or not new_password or not confirm_password:
            return jsonify({'error': 'All password fields are required'}), 400

        if new_password != confirm_password:
            return jsonify({'error': 'New passwords do not match'}), 400

        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400

        # verify current password
        if not user.password_hash or not verify_password(current_password, user.password_hash):
            return jsonify({'error': 'Current password is incorrect'}), 401

        # Update password
        user.password_hash = hash_password(new_password)
        user.updated_at = datetime.utcnow()
        db.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    finally:
        db.close()


@app.route('/api/auth/logout', methods=['POST'])
@jwt_required
@handle_db_errors
def logout_user():
    """User logout (token invalidation would be handled client-side)"""
    return jsonify({'message': 'Logout successful'}), 200


@app.route('/api/auth/refresh-token', methods=['POST'])
@jwt_required
@handle_db_errors
def refresh_token():
    """Refresh JWT token"""
    user_id = request.current_user_id
    new_token = generate_jwt_token(user_id)

    return jsonify({
        'message': 'Token refreshed successfully',
        'token': new_token
    }), 200


# Analytics Endpoints


@app.route('/api/analytics/user/<user_id>/sessions', methods=['GET'])
@handle_db_errors
def get_user_sessions(user_id):
    """Get user's chat sessions for analytics"""
    db = SessionLocal()
    try:
        sessions = db.query(ChatSession).filter(
            ChatSession.user_id == user_id).all()

        session_data = []
        for session in sessions:
            session_dict = session.to_dict()
            # Add analytics data
            total_messages = len(session.messages)
            user_messages = sum(
                1 for msg in session.messages if msg.sender == 'user')
            bot_messages = sum(
                1 for msg in session.messages if msg.sender == 'bot')

            session_dict['analytics'] = {
                'total_messages': total_messages,
                'user_messages': user_messages,
                'bot_messages': bot_messages,
                'duration_minutes': (session.updated_at - session.created_at).total_seconds() / 60
            }

            session_data.append(session_dict)

        return jsonify({
            'sessions': session_data,
            'total_sessions': len(session_data)
        })

    finally:
        db.close()


@app.route('/api/analytics/popular-products', methods=['GET'])
@handle_db_errors
def get_popular_products():
    """Get popular products based on chat interactions"""
    db = SessionLocal()
    try:
        # Get products that appear most in chat responses
        messages_with_products = db.query(ChatMessage).filter(
            ChatMessage.products_json.isnot(None)
        ).all()

        product_mentions = {}
        for message in messages_with_products:
            try:
                products = json.loads(message.products_json)
                for product in products:
                    product_id = product.get('id')
                    if product_id:
                        product_mentions[product_id] = product_mentions.get(
                            product_id, 0) + 1
            except json.JSONDecodeError:
                continue

        # Get top mentioned products
        top_product_ids = sorted(
            product_mentions.items(), key=lambda x: x[1], reverse=True)[:10]

        popular_products = []
        for product_id, mentions in top_product_ids:
            product = db.query(Product).filter(
                Product.id == product_id).first()
            if product:
                product_dict = product.to_dict()
                product_dict['chat_mentions'] = mentions
                popular_products.append(product_dict)

        return jsonify({
            'popular_products': popular_products,
            'total_analyzed': len(messages_with_products)
        })

    finally:
        db.close()

# Error handlers


@app.errorhandler(400)
def bad_request(error):
    """Handle bad request errors"""
    return jsonify({'error': 'Bad request'}), 400


@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    return jsonify({'error': 'Internal server error'}), 500


@app.before_request
def validate_json():
    """Validate JSON for POST requests"""
    if request.method == 'POST' and request.content_type == 'application/json':
        try:
            if request.data:
                request.get_json(force=True)
        except Exception:
            return jsonify({'error': 'Invalid JSON'}), 400


if __name__ == '__main__':
    print("Starting Storely API server...")
    print("Initializing NLTK...")

    # Start Flask server
    port = int(os.environ.get('PORT', config.PORT))
    print(f"Starting Flask server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=config.DEBUG)
