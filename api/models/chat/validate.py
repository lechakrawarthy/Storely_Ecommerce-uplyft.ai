"""
Chat request validation
"""
from typing import Optional, Dict, Any, List
from datetime import datetime
from models.interfaces import (
    ChatRequest, ChatResponse, ChatSessionResponse, ValidationError,
    ChatIntent, ChatMessage as ChatMessageModel
)
from models.common import sanitize_input


class ChatValidator:
    """Validates chat-related requests"""

    @staticmethod
    def validate_message_content(content: str) -> Optional[str]:
        """Validate chat message content"""
        if not content:
            return "Message content is required"

        content = content.strip()

        if len(content) > 2000:
            return "Message too long (max 2000 characters)"

        if len(content) < 1:
            return "Message cannot be empty"

        return None

    @staticmethod
    def validate_session_id(session_id: str) -> Optional[str]:
        """Validate chat session ID format"""
        if not session_id:
            return "Session ID is required"

        session_id = session_id.strip()

        # Basic UUID format check
        if len(session_id) < 10 or len(session_id) > 50:
            return "Invalid session ID format"

        return None

    @staticmethod
    def validate_intent(intent: str) -> Optional[str]:
        """Validate chat intent"""
        if not intent:
            return None  # Intent is optional

        try:
            ChatIntent(intent)
            return None
        except ValueError:
            return f"Invalid intent. Must be one of: {', '.join([i.value for i in ChatIntent])}"

    @staticmethod
    def validate_chat_request(data: Dict[str, Any]) -> ChatRequest:
        """Validate chat message request"""
        errors = []

        # Extract and sanitize fields
        message = sanitize_input(data.get('message', ''))
        session_id = sanitize_input(
            data.get('session_id')) if data.get('session_id') else None
        intent = sanitize_input(
            data.get('intent')) if data.get('intent') else None

        # Validate message
        message_error = ChatValidator.validate_message_content(message)
        if message_error:
            errors.append(message_error)

        # Validate session ID if provided
        if session_id:
            session_error = ChatValidator.validate_session_id(session_id)
            if session_error:
                errors.append(session_error)

        # Validate intent if provided
        if intent:
            intent_error = ChatValidator.validate_intent(intent)
            if intent_error:
                errors.append(intent_error)

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return ChatRequest(
            message=message,
            session_id=session_id,
            intent=ChatIntent(intent) if intent else None
        )

    @staticmethod
    def validate_feedback_request(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate chat feedback request"""
        errors = []

        message_id = sanitize_input(data.get('message_id', ''))
        helpful = data.get('helpful')
        feedback_text = sanitize_input(
            data.get('feedback')) if data.get('feedback') else None

        # Validate message ID
        if not message_id:
            errors.append("Message ID is required")

        # Validate helpful flag
        if helpful is None:
            errors.append("Helpful flag is required")
        elif not isinstance(helpful, bool):
            errors.append("Helpful flag must be boolean")

        # Validate feedback text if provided
        if feedback_text and len(feedback_text) > 500:
            errors.append("Feedback text too long (max 500 characters)")

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return {
            'message_id': message_id,
            'helpful': helpful,
            'feedback': feedback_text
        }

    @staticmethod
    def validate_search_query(query: str) -> Optional[str]:
        """Validate search query for chat context"""
        if not query:
            return "Search query is required"

        query = query.strip()

        if len(query) > 200:
            return "Search query too long (max 200 characters)"

        if len(query) < 2:
            return "Search query too short (min 2 characters)"

        return None

    @staticmethod
    def validate_pagination_params(data: Dict[str, Any]) -> Dict[str, int]:
        """Validate pagination parameters"""
        page = data.get('page', 1)
        limit = data.get('limit', 20)

        # Convert to integers
        try:
            page = int(page)
            limit = int(limit)
        except (ValueError, TypeError):
            raise ValidationError("Page and limit must be integers")

        # Validate ranges
        if page < 1:
            raise ValidationError("Page must be >= 1")

        if limit < 1 or limit > 100:
            raise ValidationError("Limit must be between 1 and 100")

        return {'page': page, 'limit': limit}
