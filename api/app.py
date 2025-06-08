import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import json
import random
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
from datetime import datetime
import uuid
from models import SessionLocal, Product, User, ChatSession, ChatMessage, init_db

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Initialize database
init_db()

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

# Initialize NLTK components
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Chat session storage
chat_sessions = {}

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

# Extract intent from user message
def extract_intent(message):
    message = message.lower()
    for intent, patterns in intent_patterns.items():
        for pattern in patterns:
            if re.search(pattern, message):
                return intent
    return 'general'

# Preprocess text
def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
    return tokens

# Extract keywords from user message
def extract_keywords(message):
    tokens = preprocess_text(message)
    keywords = [token for token in tokens if len(token) > 2]
    return keywords

# Filter products based on user query
def filter_products(query, limit=5):
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
    
    for product in products:
        score = 0
        if category_match and product['category'] == category_match:
            score += 5
        
        # Match title
        product_title = product['title'].lower()
        for keyword in keywords:
            if keyword.lower() in product_title:
                score += 3
        
        # Match description
        product_desc = product['description'].lower()
        for keyword in keywords:
            if keyword.lower() in product_desc:
                score += 2
        
        # Price filter
        if max_price and product['price'] <= max_price:
            score += 1
        
        if score > 0:
            results.append({
                'product': product,
                'score': score
            })
    
    # Sort by relevance score
    results.sort(key=lambda x: x['score'], reverse=True)
    
    # Return only the product objects, limited to the specified number
    return [item['product'] for item in results[:limit]]

# Generate chatbot response
def generate_response(session_id, message):
    # Get or create chat session
    if session_id not in chat_sessions:
        chat_sessions[session_id] = {
            'history': [],
            'context': {},
            'timestamp': datetime.now()
        }
    
    session = chat_sessions[session_id]
    intent = extract_intent(message)
    
    # Add user message to history
    session['history'].append({
        'sender': 'user',
        'message': message,
        'timestamp': datetime.now().isoformat()
    })
    
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
            products = [p for p in products if p['price'] <= price][:5]
            if products:
                response['message'] = f"Here are books under ${price}:"
                response['products'] = products
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
        top_books = sorted(products, key=lambda x: x['rating'], reverse=True)[:5]
        response['message'] = "Here are some of our highest-rated books:"
        response['products'] = top_books
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
            for product in products:
                if author.lower() in product['title'].lower() or author.lower() in product['description'].lower():
                    matching_products.append(product)
            
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
    
    # Add bot response to history
    session['history'].append({
        'sender': 'bot',
        'message': response['message'],
        'timestamp': datetime.now().isoformat(),
        'products': response.get('products'),
        'suggestions': response.get('suggestions')
    })
    
    return response

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing message in request'}), 400
    
    user_message = data['message']
    session_id = data.get('session_id', 'default')
    
    response = generate_response(session_id, user_message)
    return jsonify({
        'response': response,
        'session_id': session_id
    })

@app.route('/api/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    if session_id in chat_sessions:
        return jsonify({
            'session_id': session_id,
            'history': chat_sessions[session_id]['history'],
            'timestamp': chat_sessions[session_id]['timestamp'].isoformat()
        })
    else:
        return jsonify({'error': 'Session not found'}), 404

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    limit = int(request.args.get('limit', 10))
    
    filtered_products = products
    if category:
        filtered_products = [p for p in products if p['category'] == category]
    
    return jsonify(filtered_products[:limit])

if __name__ == '__main__':
    # Start Flask server
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
