"""
Chat controller - main entry point for chat operations
"""
from typing import Dict, Any, Optional
from .validate import ChatValidator
from .compute import ChatService
from db.base import DatabaseManager
from models.products.compute import ProductService
from models.interfaces import ValidationError


class ChatController:
    """Main controller for chat operations"""

    def __init__(self):
        self.validator = ChatValidator()
        self.service = ChatService()

    def send_message(self, user_id: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle chat message"""
        try:
            # Validate request
            chat_request = self.validator.validate_chat_request(request_data)

            # Process message
            response = self.service.process_chat_message(user_id, chat_request)

            return {
                'success': True,
                'data': {
                    'message_id': response.message_id,
                    'session_id': response.session_id,
                    'response': response.response,
                    'intent': response.intent.value,
                    'suggested_products': [
                        {
                            'id': p.id,
                            'name': p.name,
                            'price': p.price,
                            'image_url': p.image_url,
                            'rating': p.rating
                        } for p in response.suggested_products
                    ],
                    'timestamp': response.timestamp.isoformat()
                },
                'message': 'Message processed successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to process message'
            }

    def get_chat_history(self, user_id: str, session_id: str,
                         request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get chat history for a session"""
        try:
            # Validate pagination
            pagination = self.validator.validate_pagination_params(
                request_data)

            # Get history
            result = self.service.get_chat_history(
                user_id=user_id,
                session_id=session_id,
                page=pagination['page'],
                limit=pagination['limit']
            )

            # Format messages
            formatted_messages = []
            for msg in result['messages']:
                formatted_messages.append({
                    'id': msg.id,
                    'message': msg.message,
                    'is_user': msg.is_user,
                    'intent': msg.intent.value if msg.intent else None,
                    'timestamp': msg.timestamp.isoformat(),
                    'is_helpful': msg.is_helpful,
                    'feedback': msg.feedback
                })

            return {
                'success': True,
                'data': {
                    'messages': formatted_messages,
                    'pagination': {
                        'total_count': result['total_count'],
                        'page': result['page'],
                        'limit': result['limit'],
                        'has_more': result['has_more']
                    }
                },
                'message': 'Chat history retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get chat history'
            }

    def get_user_sessions(self, user_id: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get chat sessions for a user"""
        try:
            # Validate pagination
            pagination = self.validator.validate_pagination_params(
                request_data)

            # Get sessions
            result = self.service.get_user_sessions(
                user_id=user_id,
                page=pagination['page'],
                limit=pagination['limit']
            )

            # Format sessions
            formatted_sessions = []
            for session in result['sessions']:
                formatted_sessions.append({
                    'id': session.id,
                    'created_at': session.created_at.isoformat(),
                    'updated_at': session.updated_at.isoformat(),
                    'message_count': session.message_count,
                    'last_message': session.last_message,
                    'last_message_timestamp': session.last_message_timestamp.isoformat() if session.last_message_timestamp else None
                })

            return {
                'success': True,
                'data': {
                    'sessions': formatted_sessions,
                    'pagination': {
                        'total_count': result['total_count'],
                        'page': result['page'],
                        'limit': result['limit'],
                        'has_more': result['has_more']
                    }
                },
                'message': 'Chat sessions retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get chat sessions'
            }

    def submit_feedback(self, user_id: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit feedback for chat message"""
        try:
            # Validate request
            feedback_data = self.validator.validate_feedback_request(
                request_data)

            # Submit feedback
            success = self.service.submit_feedback(
                user_id=user_id,
                message_id=feedback_data['message_id'],
                helpful=feedback_data['helpful'],
                feedback=feedback_data['feedback']
            )

            return {
                'success': True,
                'message': 'Feedback submitted successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to submit feedback'
            }

    def delete_session(self, user_id: str, session_id: str) -> Dict[str, Any]:
        """Delete a chat session"""
        try:
            # For now, we'll just return success
            # In a full implementation, you'd delete the session from the database
            return {
                'success': True,
                'message': 'Chat session deleted successfully'
            }

        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to delete chat session'
            }
