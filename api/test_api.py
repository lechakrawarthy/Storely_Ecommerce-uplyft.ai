import unittest
import json
from app import app, generate_response

class ChatbotAPITests(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
    def test_chat_endpoint_valid_input(self):
        """Test the chat endpoint with valid input"""
        response = self.app.post('/api/chat',
                                data=json.dumps({'message': 'Hello', 'session_id': 'test-session'}),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('response', data)
        self.assertIn('message', data['response'])
        
    def test_chat_endpoint_missing_message(self):
        """Test the chat endpoint with missing message"""
        response = self.app.post('/api/chat',
                                data=json.dumps({'session_id': 'test-session'}),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        
    def test_session_retrieval(self):
        """Test retrieving a session"""
        # First create a session by sending a message
        self.app.post('/api/chat',
                    data=json.dumps({'message': 'Hello', 'session_id': 'test-session'}),
                    content_type='application/json')
        
        # Then get the session
        response = self.app.get('/api/sessions/test-session')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['session_id'], 'test-session')
        self.assertIn('history', data)
        self.assertTrue(len(data['history']) >= 2)  # User message + bot response
        
    def test_nonexistent_session(self):
        """Test retrieving a nonexistent session"""
        response = self.app.get('/api/sessions/nonexistent-session')
        
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn('error', data)
        
    def test_products_endpoint(self):
        """Test retrieving products"""
        response = self.app.get('/api/products')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        
    def test_products_endpoint_with_category(self):
        """Test retrieving products by category"""
        response = self.app.get('/api/products?category=Fiction')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        
    def test_intent_extraction(self):
        """Test intent extraction from different messages"""
        self.assertEqual(extract_intent('Hello there'), 'greeting')
        self.assertEqual(extract_intent('I want to buy a book'), 'book_search')
        self.assertEqual(extract_intent('What books do you have under $25?'), 'price_query')
        self.assertEqual(extract_intent('Who wrote Harry Potter?'), 'author_search')
        
    def test_response_generation(self):
        """Test response generation for different intents"""
        greeting_response = generate_response('test', 'Hello')
        self.assertIn('message', greeting_response)
        self.assertNotEqual(greeting_response['message'], '')
        
        book_search_response = generate_response('test', 'I want a fiction book')
        self.assertIn('message', book_search_response)
        
        price_response = generate_response('test', 'Books under $30')
        self.assertIn('message', price_response)

if __name__ == '__main__':
    unittest.main()
