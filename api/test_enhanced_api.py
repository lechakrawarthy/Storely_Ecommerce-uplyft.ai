#!/usr/bin/env python3
"""
Comprehensive test suite for the enhanced e-commerce chatbot API
Tests authentication, chat functionality, analytics, and error handling
"""

import pytest
import json
import tempfile
import os
from datetime import datetime, timedelta
import uuid

# Test imports
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, init_db
from models import SessionLocal, User, Product, ChatSession, ChatMessage

@pytest.fixture
def client():
    """Create test client with temporary database"""
    # Create temporary database for testing
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URL'] = f'sqlite:///{app.config["DATABASE"]}'
    
    with app.test_client() as client:
        with app.app_context():
            # Clear any existing database connections
            from models import engine, Base
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            init_db()
            
            # Add sample products for testing
            _add_sample_products()
            yield client
    
    os.close(db_fd)
    os.unlink(app.config['DATABASE'])

def _add_sample_products():
    """Add sample products to test database"""
    from models import SessionLocal, Product
    db = SessionLocal()
    try:
        # Add some sample books for testing
        sample_books = [
            Product(
                id='test1',
                title='Test Book 1',
                price=299.0,
                original_price=399.0,
                category='Fiction',
                rating=4.5,
                reviews=100,
                in_stock=True,
                description='A test fiction book'
            ),
            Product(
                id='test2', 
                title='Test Book 2',
                price=799.0,
                original_price=999.0,
                category='Science',
                rating=4.2,
                reviews=50,
                in_stock=True,
                description='A test science book'
            ),
            Product(
                id='test3',
                title='Test Book 3', 
                price=150.0,
                original_price=200.0,
                category='Fiction',
                rating=4.8,
                reviews=200,
                in_stock=True,
                description='Another test fiction book'
            )
        ]
        
        for book in sample_books:
            db.add(book)
        db.commit()
    finally:
        db.close()

@pytest.fixture
def sample_user():
    """Create a sample user for testing"""
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword123'
    }

@pytest.fixture
def sample_products():
    """Create sample products for testing"""
    return [
        {
            'id': 'test-book-1',
            'title': 'Test Fiction Book',
            'price': 299.0,
            'category': 'Fiction',
            'rating': 4.5,
            'description': 'A great test fiction book'
        },
        {
            'id': 'test-book-2',
            'title': 'Test Science Book',
            'price': 599.0,
            'category': 'Science',
            'rating': 4.8,
            'description': 'An educational science book'
        }
    ]

class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_user_registration(self, client, sample_user):
        """Test user registration"""
        response = client.post('/api/auth/register', 
                             json=sample_user,
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'User registered successfully'
        assert 'user_id' in data
        assert data['username'] == sample_user['username']
    
    def test_duplicate_user_registration(self, client, sample_user):
        """Test duplicate user registration fails"""
        # Register user first time
        client.post('/api/auth/register', 
                   json=sample_user,
                   content_type='application/json')
        
        # Try to register again
        response = client.post('/api/auth/register', 
                             json=sample_user,
                             content_type='application/json')
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert 'already exists' in data['error']
    
    def test_user_login(self, client, sample_user):
        """Test user login"""
        # Register user first
        client.post('/api/auth/register', 
                   json=sample_user,
                   content_type='application/json')
        
        # Login
        login_data = {
            'username': sample_user['username'],
            'password': sample_user['password']
        }
        response = client.post('/api/auth/login', 
                             json=login_data,
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Login successful'
        assert data['username'] == sample_user['username']
        assert 'preferences' in data
    
    def test_invalid_login(self, client):
        """Test invalid login credentials"""
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpassword'
        }
        response = client.post('/api/auth/login', 
                             json=login_data,
                             content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid credentials' in data['error']

class TestChatbot:
    """Test chatbot functionality"""
    
    def test_basic_chat(self, client):
        """Test basic chat functionality"""
        chat_data = {
            'message': 'Hello',
            'session_id': str(uuid.uuid4())
        }
        
        response = client.post('/api/chat', 
                             json=chat_data,
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'response' in data
        assert data['session_id'] == chat_data['session_id']
    
    def test_book_search_chat(self, client):
        """Test book search through chat"""
        chat_data = {
            'message': 'I want to find fiction books',
            'session_id': str(uuid.uuid4())
        }
        
        response = client.post('/api/chat', 
                             json=chat_data,
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        response_data = data['response']
        
        assert 'fiction' in response_data['message'].lower()
        # Should return product recommendations
        if response_data.get('products'):
            assert len(response_data['products']) > 0
    
    def test_price_query_chat(self, client):
        """Test price-based queries"""
        chat_data = {
            'message': 'Show me books under 500',
            'session_id': str(uuid.uuid4())
        }
        
        response = client.post('/api/chat', 
                             json=chat_data,
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        response_data = data['response']
        
        assert '500' in response_data['message']
        if response_data.get('products'):
            # Check that returned products are under 500
            for product in response_data['products']:
                assert product['price'] <= 500
    
    def test_chat_with_preferences(self, client, sample_user):
        """Test chat with user preferences"""
        # Register and login user
        client.post('/api/auth/register', 
                   json=sample_user,
                   content_type='application/json')
        
        preferences = {
            'preferredCategories': ['Fiction', 'Science'],
            'budgetRange': {'max': 1000},
            'lastSearches': ['fiction', 'science']
        }
        
        chat_data = {
            'message': 'Give me recommendations',
            'session_id': str(uuid.uuid4()),
            'user_id': 'test-user-id',
            'preferences': preferences
        }
        
        response = client.post('/api/chat', 
                             json=chat_data,
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Should include personalized recommendations
        assert 'response' in data
        if data.get('user_preferences_updated'):
            assert data['user_preferences_updated'] is not None

class TestProductEndpoints:
    """Test product-related endpoints"""
    
    def test_get_products(self, client):
        """Test getting products"""
        response = client.get('/api/products')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
    
    def test_get_categories(self, client):
        """Test getting categories"""
        response = client.get('/api/categories')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
    
    def test_search_products(self, client):
        """Test product search"""
        response = client.get('/api/search?q=book&limit=5')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'results' in data
        assert 'count' in data
        assert len(data['results']) <= 5
    
    def test_search_with_filters(self, client):
        """Test product search with filters"""
        response = client.get('/api/search?q=book&category=Fiction&max_price=500')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'results' in data
        
        # Verify filters are applied
        for product in data['results']:
            assert product['price'] <= 500
            if 'category' in product:
                assert product['category'] == 'Fiction'

class TestSessionManagement:
    """Test chat session management"""
    
    def test_create_session(self, client):
        """Test creating a new session"""
        session_data = {'user_id': 'test-user'}
        
        response = client.post('/api/sessions', 
                             json=session_data,
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'session_id' in data
    
    def test_get_session(self, client):
        """Test getting session history"""
        # Create a session first
        session_data = {'user_id': 'test-user'}
        create_response = client.post('/api/sessions', 
                                    json=session_data,
                                    content_type='application/json')
        
        session_id = json.loads(create_response.data)['session_id']
        
        # Get session
        response = client.get(f'/api/sessions/{session_id}')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'session' in data
        assert data['session']['id'] == session_id

class TestAnalytics:
    """Test analytics endpoints"""
    
    def test_popular_products_analytics(self, client):
        """Test popular products analytics"""
        response = client.get('/api/analytics/popular-products')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'popular_products' in data
        assert 'total_analyzed' in data

class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_json(self, client):
        """Test invalid JSON handling"""
        response = client.post('/api/chat', 
                             data='invalid json',
                             content_type='application/json')
        
        assert response.status_code == 400
    
    def test_missing_required_fields(self, client):
        """Test missing required fields"""
        # Test registration without required fields
        response = client.post('/api/auth/register', 
                             json={'username': 'test'},
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'required' in data['error']
    
    def test_nonexistent_session(self, client):
        """Test accessing nonexistent session"""
        response = client.get('/api/sessions/nonexistent-id')
        assert response.status_code == 404
    
    def test_nonexistent_product(self, client):
        """Test accessing nonexistent product"""
        response = client.get('/api/products/nonexistent-id')
        assert response.status_code == 404

class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/api/health')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
        assert 'version' in data

# Performance Tests
class TestPerformance:
    """Test performance and load handling"""
    
    def test_concurrent_chat_requests(self, client):
        """Test handling multiple rapid sequential chat requests (simulating concurrent load)"""
        import time
        
        results = []
        start_time = time.time()
        
        # Make multiple rapid requests to simulate concurrent load
        for i in range(5):
            chat_data = {
                'message': f'Hello {i}',
                'session_id': str(uuid.uuid4())
            }
            response = client.post('/api/chat', 
                                 json=chat_data,
                                 content_type='application/json')
            results.append(response.status_code)
        
        end_time = time.time()
        
        # All requests should succeed
        assert all(code == 200 for code in results), f"Some requests failed: {results}"
        assert len(results) == 5
        
        # Should handle requests reasonably fast (less than 5 seconds for 5 requests)
        total_time = end_time - start_time
        assert total_time < 5.0, f"Requests took too long: {total_time:.2f} seconds"

if __name__ == '__main__':
    # Run tests
    pytest.main([__file__, '-v', '--tb=short'])
