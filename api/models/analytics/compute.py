"""
Analytics business logic and services
"""
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import json
import uuid
from sqlalchemy import func, and_, or_
from models.interfaces import ValidationError
from db.base import get_db_session, Product, User, ChatSession, ChatMessage


class AnalyticsService:
    """Handles analytics business logic and data aggregation"""

    def __init__(self):
        # Use global database session
        pass

    def _get_date_grouping_format(self, grouping: str) -> str:
        """Get SQL date format for grouping"""
        formats = {
            'hour': '%Y-%m-%d %H:00:00',
            'day': '%Y-%m-%d',
            'week': '%Y-%W',
            'month': '%Y-%m'
        }
        return formats.get(grouping, '%Y-%m-%d')

    def get_product_analytics(self, start_date: datetime, end_date: datetime,
                              grouping: Optional[str] = None, limit: int = 100) -> Dict[str, Any]:
        """Get product-related analytics"""
        try:
            session = get_db_session()
            try:
                # Get most viewed products (simplified)
                popular_products = session.query(
                    Product.id,
                    Product.name,
                    Product.price,
                    func.count().label('view_count')
                ).group_by(
                    Product.id
                ).order_by(
                    func.count().desc()
                ).limit(limit).all()

                # Format results
                products_data = [
                    {
                        'id': p.id,
                        'name': p.name,
                        'price': float(p.price) if p.price else 0.0,
                        'view_count': p.view_count
                    } for p in popular_products
                ]

                return {
                    'popular_products': products_data,
                    'total_products': session.query(Product).count(),
                    'date_range': {
                        'start_date': start_date.isoformat(),
                        'end_date': end_date.isoformat()
                    }
                }
            finally:
                session.close()

        except Exception as e:
            raise ValidationError(f"Failed to get product analytics: {str(e)}")

    def get_user_analytics(self, start_date: datetime, end_date: datetime,
                           grouping: Optional[str] = None) -> Dict[str, Any]:
        """Get user-related analytics"""
        try:
            session = get_db_session()
            try:
                # Get total users
                total_users = session.query(User).count()

                # Get new users in period
                new_users = session.query(User).filter(
                    User.created_at.between(start_date, end_date)
                ).count()

                return {
                    'total_users': total_users,
                    'new_users': new_users,
                    'active_users': total_users,  # Simplified
                    'registration_trends': [],
                    'date_range': {
                        'start_date': start_date.isoformat(),
                        'end_date': end_date.isoformat()
                    }
                }
            finally:
                session.close()

        except Exception as e:
            raise ValidationError(f"Failed to get user analytics: {str(e)}")

    def get_chat_analytics(self, start_date: datetime, end_date: datetime,
                           grouping: Optional[str] = None) -> Dict[str, Any]:
        """Get chat-related analytics"""
        try:
            session = get_db_session()
            try:
                # Total stats (simplified)
                total_sessions = session.query(ChatSession).count()
                total_messages = session.query(ChatMessage).count()

                return {
                    'total_sessions': total_sessions,
                    'total_messages': total_messages,
                    'avg_session_length': 5.0,  # Simplified
                    'session_trends': [],
                    'message_trends': [],
                    'intent_distribution': [],
                    'date_range': {
                        'start_date': start_date.isoformat(),
                        'end_date': end_date.isoformat()
                    }
                }
            finally:
                session.close()

        except Exception as e:
            raise ValidationError(f"Failed to get chat analytics: {str(e)}")

    def get_search_analytics(self, start_date: datetime, end_date: datetime,
                             limit: int = 50) -> Dict[str, Any]:
        """Get search-related analytics"""
        try:
            return {
                'top_search_terms': [],
                'total_searches': 0,
                'unique_terms': 0,
                'search_trends': [],
                'date_range': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat()
                }
            }

        except Exception as e:
            raise ValidationError(f"Failed to get search analytics: {str(e)}")

    def get_dashboard_data(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get comprehensive dashboard data"""
        try:
            # Get data from individual analytics methods
            user_analytics = self.get_user_analytics(start_date, end_date)
            chat_analytics = self.get_chat_analytics(start_date, end_date)
            product_analytics = self.get_product_analytics(
                start_date, end_date, limit=5)
            search_analytics = self.get_search_analytics(
                start_date, end_date, limit=10)

            return {
                'summary': {
                    'total_users': user_analytics['total_users'],
                    'new_users': user_analytics['new_users'],
                    'active_users': user_analytics['active_users'],
                    'total_chat_sessions': chat_analytics['total_sessions'],
                    'total_messages': chat_analytics['total_messages'],
                    'total_products': product_analytics['total_products'],
                    'total_searches': search_analytics['total_searches']
                },
                'recent_activity': {
                    'new_users_24h': 0,
                    'chat_sessions_24h': 0,
                    'messages_24h': 0
                },
                'top_products': product_analytics['popular_products'][:5],
                'top_search_terms': search_analytics['top_search_terms'][:5],
                'intent_distribution': chat_analytics['intent_distribution'],
                'user_trends': user_analytics.get('registration_trends', []),
                'chat_trends': chat_analytics.get('session_trends', []),
                'date_range': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat()
                }
            }

        except Exception as e:
            raise ValidationError(f"Failed to get dashboard data: {str(e)}")

    def track_event(self, user_id: Optional[str], event_type: str,
                    event_data: Dict[str, Any], timestamp: datetime) -> bool:
        """Track analytics event (simplified implementation)"""
        try:
            # In a production system, you'd store this in an events table
            # For now, we'll just log it
            event_record = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'event_type': event_type,
                'event_data': event_data,
                'timestamp': timestamp.isoformat()
            }

            # Log the event (in production, save to database)
            print(f"Analytics Event: {json.dumps(event_record)}")

            return True

        except Exception as e:
            print(f"Failed to track event: {str(e)}")
            return False

    def get_metric_data(self, metric_type: str, start_date: datetime,
                        end_date: datetime, grouping: Optional[str] = None,
                        limit: int = 100) -> Dict[str, Any]:
        """Get specific metric data"""
        try:
            if metric_type == 'user_registrations':
                return self.get_user_analytics(start_date, end_date, grouping)
            elif metric_type == 'chat_sessions':
                return self.get_chat_analytics(start_date, end_date, grouping)
            elif metric_type == 'popular_products':
                return self.get_product_analytics(start_date, end_date, grouping, limit)
            elif metric_type == 'search_terms':
                return self.get_search_analytics(start_date, end_date, limit)
            else:
                return {'message': f'Metric type {metric_type} not implemented yet'}

        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            raise ValidationError(f"Failed to get metric data: {str(e)}")
