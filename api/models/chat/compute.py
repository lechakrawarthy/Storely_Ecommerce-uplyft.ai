"""
Chat business logic and services
"""
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime, timedelta
import re
import uuid
from models.interfaces import (
    ChatRequest, ChatResponse, ChatSessionResponse, ChatMessage as ChatMessageModel,
    ChatIntent, ValidationError, Product
)
from db.base import DatabaseManager
from models.products.compute import ProductService
from models.constants import CHAT_INTENTS, ErrorMessages


class ChatService:
    """Handles chat business logic and AI responses"""

    def __init__(self):
        # Use global database session
        self.product_service = ProductService()
        self.session_timeout_hours = 24
        self.max_messages_per_session = 100

        # Intent patterns for basic classification
        self.intent_patterns = {
            ChatIntent.PRODUCT_SEARCH: [
                r'search', r'find', r'look for', r'show me', r'what.*have',
                r'products?', r'items?', r'available'
            ],
            ChatIntent.PRODUCT_INQUIRY: [
                r'price', r'cost', r'how much', r'details', r'specifications',
                r'spec', r'features', r'about this', r'tell me more'
            ],
            ChatIntent.ORDER_HELP: [
                r'order', r'buy', r'purchase', r'checkout', r'cart',
                r'shipping', r'delivery', r'payment'
            ],
            ChatIntent.SUPPORT: [
                r'help', r'support', r'problem', r'issue', r'trouble',
                r'contact', r'customer service'
            ],
            ChatIntent.GENERAL: [
                r'hello', r'hi', r'hey', r'thanks', r'thank you',
                r'goodbye', r'bye', r'how are you'
            ]
        }

    def _classify_intent(self, message: str) -> ChatIntent:
        """Classify user message intent using pattern matching"""
        message_lower = message.lower()

        # Check each intent pattern
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    return intent

        # Default to general if no pattern matches
        return ChatIntent.GENERAL

    def _create_or_get_session(self, user_id: str, session_id: Optional[str] = None) -> str:
        """Create new chat session or get existing one"""
        with self.db.get_session() as session:
            if session_id:
                # Check if session exists and is valid
                chat_session = session.query(self.db.ChatSession).filter(
                    self.db.ChatSession.id == session_id,
                    self.db.ChatSession.user_id == user_id,
                    self.db.ChatSession.created_at > datetime.utcnow(
                    ) - timedelta(hours=self.session_timeout_hours)
                ).first()

                if chat_session:
                    return session_id

            # Create new session
            new_session = self.db.ChatSession(
                id=str(uuid.uuid4()),
                user_id=user_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(new_session)
            session.commit()

            return new_session.id

    def _save_message(self, session_id: str, message: str, is_user: bool,
                      intent: Optional[ChatIntent] = None) -> str:
        """Save chat message to database"""
        with self.db.get_session() as session:
            chat_message = self.db.ChatMessage(
                id=str(uuid.uuid4()),
                session_id=session_id,
                message=message,
                is_user=is_user,
                intent=intent.value if intent else None,
                timestamp=datetime.utcnow()
            )
            session.add(chat_message)
            session.commit()

            return chat_message.id

    def _generate_response(self, message: str, intent: ChatIntent,
                           user_id: str) -> Tuple[str, List[Product]]:
        """Generate AI response based on intent and message"""
        suggested_products = []

        if intent == ChatIntent.PRODUCT_SEARCH:
            response, products = self._handle_product_search(message, user_id)
            suggested_products = products
        elif intent == ChatIntent.PRODUCT_INQUIRY:
            response = self._handle_product_inquiry(message)
        elif intent == ChatIntent.ORDER_HELP:
            response = self._handle_order_help(message)
        elif intent == ChatIntent.SUPPORT:
            response = self._handle_support(message)
        elif intent == ChatIntent.GENERAL:
            response = self._handle_general(message)
        else:
            response = "I'm here to help you with your shopping needs. What can I assist you with today?"

        return response, suggested_products

    def _handle_product_search(self, message: str, user_id: str) -> Tuple[str, List[Product]]:
        """Handle product search requests"""
        try:
            # Extract search terms from message
            search_terms = self._extract_search_terms(message)

            if not search_terms:
                return "What specific product are you looking for? I can help you find it!", []

            # Search for products
            search_result = self.product_service.search_products(
                query=search_terms,
                page=1,
                limit=5
            )

            products = search_result.get('products', [])

            if not products:
                return f"I couldn't find any products matching '{search_terms}'. Try different keywords or browse our categories.", []

            # Format response
            product_count = len(products)
            response = f"I found {product_count} product{'s' if product_count != 1 else ''} matching '{search_terms}':\n\n"

            for i, product in enumerate(products, 1):
                response += f"{i}. **{product.name}** - ${product.price:.2f}\n"
                if product.description:
                    # Truncate description
                    desc = product.description[:100] + "..." if len(
                        product.description) > 100 else product.description
                    response += f"   {desc}\n"
                response += "\n"

            response += "Would you like more details about any of these products?"

            return response, products

        except Exception as e:
            return "I'm having trouble searching for products right now. Please try again later.", []

    def _handle_product_inquiry(self, message: str) -> str:
        """Handle product-specific inquiries"""
        responses = [
            "I'd be happy to help you with product details! Could you specify which product you're interested in?",
            "For detailed product information, you can check the product page or ask me about a specific item.",
            "What would you like to know about our products? I can help with specifications, pricing, and availability."
        ]

        # Simple keyword-based responses
        if any(word in message.lower() for word in ['price', 'cost', 'how much']):
            return "Product prices vary by item. You can see the current price on each product page, or tell me which specific product you're asking about."

        if any(word in message.lower() for word in ['shipping', 'delivery']):
            return "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping costs are calculated at checkout based on your location."

        return responses[0]

    def _handle_order_help(self, message: str) -> str:
        """Handle order and purchase assistance"""
        if any(word in message.lower() for word in ['cart', 'checkout']):
            return "To complete your purchase, add items to your cart and proceed to checkout. I can help if you encounter any issues during the process!"

        if any(word in message.lower() for word in ['payment', 'pay']):
            return "We accept all major credit cards, PayPal, and other secure payment methods. Your payment information is always encrypted and secure."

        if any(word in message.lower() for word in ['track', 'tracking']):
            return "You can track your order using the tracking number sent to your email after purchase. Check your order history for tracking details."

        return "I'm here to help with your order! Whether you need help with checkout, payment, or tracking, just let me know what you need assistance with."

    def _handle_support(self, message: str) -> str:
        """Handle customer support requests"""
        return "I'm here to help! For immediate assistance, you can continue chatting with me. For complex issues, you can also contact our customer support team at support@storely.com or call 1-800-STORELY."

    def _handle_general(self, message: str) -> str:
        """Handle general conversation"""
        greetings = ['hello', 'hi', 'hey']
        thanks = ['thanks', 'thank you']
        goodbye = ['goodbye', 'bye', 'see you']

        message_lower = message.lower()

        if any(greeting in message_lower for greeting in greetings):
            return "Hello! Welcome to Storely! I'm here to help you find products and answer your questions. What can I assist you with today?"

        if any(thank in message_lower for thank in thanks):
            return "You're welcome! Is there anything else I can help you with?"

        if any(bye in message_lower for bye in goodbye):
            return "Thank you for chatting with me! Feel free to reach out anytime you need help. Have a great day!"

        return "I'm your shopping assistant at Storely! I can help you find products, answer questions about orders, and provide customer support. How can I help you today?"

    def _extract_search_terms(self, message: str) -> str:
        """Extract search terms from user message"""
        # Remove common stop words and chat-specific words
        stop_words = {
            'i', 'am', 'looking', 'for', 'can', 'you', 'help', 'me', 'find',
            'search', 'show', 'me', 'want', 'need', 'buy', 'purchase',
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'have', 'has'
        }

        # Clean the message
        words = re.findall(r'\b\w+\b', message.lower())
        search_words = [
            word for word in words if word not in stop_words and len(word) > 2]

        return ' '.join(search_words)

    def process_chat_message(self, user_id: str, request: ChatRequest) -> ChatResponse:
        """Process incoming chat message and generate response"""
        try:
            # Classify intent if not provided
            intent = request.intent or self._classify_intent(request.message)

            # Create or get chat session
            session_id = self._create_or_get_session(
                user_id, request.session_id)

            # Save user message
            user_message_id = self._save_message(
                session_id=session_id,
                message=request.message,
                is_user=True,
                intent=intent
            )

            # Generate AI response
            response_text, suggested_products = self._generate_response(
                message=request.message,
                intent=intent,
                user_id=user_id
            )

            # Save AI response
            ai_message_id = self._save_message(
                session_id=session_id,
                message=response_text,
                is_user=False
            )

            # Update session timestamp
            with self.db.get_session() as db_session:
                chat_session = db_session.query(self.db.ChatSession).filter(
                    self.db.ChatSession.id == session_id
                ).first()
                if chat_session:
                    chat_session.updated_at = datetime.utcnow()
                    db_session.commit()

            return ChatResponse(
                message_id=ai_message_id,
                session_id=session_id,
                response=response_text,
                intent=intent,
                suggested_products=suggested_products,
                timestamp=datetime.utcnow()
            )

        except Exception as e:
            # Log error and return fallback response
            print(f"Chat processing error: {str(e)}")

            # Create fallback session if needed
            try:
                session_id = self._create_or_get_session(
                    user_id, request.session_id)
                fallback_message_id = self._save_message(
                    session_id=session_id,
                    message="I'm sorry, I'm having trouble processing your message right now. Please try again.",
                    is_user=False
                )

                return ChatResponse(
                    message_id=fallback_message_id,
                    session_id=session_id,
                    response="I'm sorry, I'm having trouble processing your message right now. Please try again.",
                    intent=ChatIntent.GENERAL,
                    suggested_products=[],
                    timestamp=datetime.utcnow()
                )
            except Exception:
                # Last resort response
                return ChatResponse(
                    message_id=str(uuid.uuid4()),
                    session_id=request.session_id or str(uuid.uuid4()),
                    response="I'm experiencing technical difficulties. Please try again later.",
                    intent=ChatIntent.GENERAL,
                    suggested_products=[],
                    timestamp=datetime.utcnow()
                )

    def get_chat_history(self, user_id: str, session_id: str,
                         page: int = 1, limit: int = 50) -> Dict[str, Any]:
        """Get chat history for a session"""
        try:
            with self.db.get_session() as session:
                # Verify session belongs to user
                chat_session = session.query(self.db.ChatSession).filter(
                    self.db.ChatSession.id == session_id,
                    self.db.ChatSession.user_id == user_id
                ).first()

                if not chat_session:
                    raise ValidationError("Chat session not found")

                # Get messages with pagination
                offset = (page - 1) * limit
                messages = session.query(self.db.ChatMessage).filter(
                    self.db.ChatMessage.session_id == session_id
                ).order_by(self.db.ChatMessage.timestamp.asc()).offset(offset).limit(limit).all()

                # Convert to response format
                message_list = []
                for msg in messages:
                    message_list.append(ChatMessageModel(
                        id=msg.id,
                        session_id=msg.session_id,
                        message=msg.message,
                        is_user=msg.is_user,
                        intent=ChatIntent(msg.intent) if msg.intent else None,
                        timestamp=msg.timestamp,
                        is_helpful=msg.is_helpful,
                        feedback=msg.feedback
                    ))

                # Get total count
                total_count = session.query(self.db.ChatMessage).filter(
                    self.db.ChatMessage.session_id == session_id
                ).count()

                return {
                    'messages': message_list,
                    'total_count': total_count,
                    'page': page,
                    'limit': limit,
                    'has_more': offset + len(messages) < total_count
                }

        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            raise ValidationError(f"Failed to get chat history: {str(e)}")

    def get_user_sessions(self, user_id: str, page: int = 1, limit: int = 20) -> Dict[str, Any]:
        """Get chat sessions for a user"""
        try:
            with self.db.get_session() as session:
                offset = (page - 1) * limit

                # Get sessions with latest message
                sessions = session.query(self.db.ChatSession).filter(
                    self.db.ChatSession.user_id == user_id
                ).order_by(self.db.ChatSession.updated_at.desc()).offset(offset).limit(limit).all()

                session_list = []
                for chat_session in sessions:
                    # Get last message
                    last_message = session.query(self.db.ChatMessage).filter(
                        self.db.ChatMessage.session_id == chat_session.id
                    ).order_by(self.db.ChatMessage.timestamp.desc()).first()

                    # Get message count
                    message_count = session.query(self.db.ChatMessage).filter(
                        self.db.ChatMessage.session_id == chat_session.id
                    ).count()

                    session_list.append(ChatSessionResponse(
                        id=chat_session.id,
                        created_at=chat_session.created_at,
                        updated_at=chat_session.updated_at,
                        message_count=message_count,
                        last_message=last_message.message if last_message else None,
                        last_message_timestamp=last_message.timestamp if last_message else None
                    ))

                # Get total count
                total_count = session.query(self.db.ChatSession).filter(
                    self.db.ChatSession.user_id == user_id
                ).count()

                return {
                    'sessions': session_list,
                    'total_count': total_count,
                    'page': page,
                    'limit': limit,
                    'has_more': offset + len(sessions) < total_count
                }

        except Exception as e:
            raise ValidationError(f"Failed to get chat sessions: {str(e)}")

    def submit_feedback(self, user_id: str, message_id: str,
                        helpful: bool, feedback: Optional[str] = None) -> bool:
        """Submit feedback for a chat message"""
        try:
            with self.db.get_session() as session:
                # Find the message and verify it belongs to user's session
                message = session.query(self.db.ChatMessage).join(
                    self.db.ChatSession
                ).filter(
                    self.db.ChatMessage.id == message_id,
                    self.db.ChatSession.user_id == user_id,
                    self.db.ChatMessage.is_user == False  # Only allow feedback on AI messages
                ).first()

                if not message:
                    raise ValidationError("Message not found or unauthorized")

                # Update feedback
                message.is_helpful = helpful
                message.feedback = feedback
                session.commit()

                return True

        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            raise ValidationError(f"Failed to submit feedback: {str(e)}")
