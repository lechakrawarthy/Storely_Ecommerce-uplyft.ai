"""
Analytics controller - main entry point for analytics operations
"""
from typing import Dict, Any, Optional
from .validate import AnalyticsValidator
from .compute import AnalyticsService
from db.base import DatabaseManager
from models.interfaces import ValidationError


class AnalyticsController:
    """Main controller for analytics operations"""

    def __init__(self):
        self.validator = AnalyticsValidator()
        self.service = AnalyticsService()

    def get_analytics(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get analytics data based on metric type"""
        try:
            # Validate request
            validated_data = self.validator.validate_analytics_request(
                request_data)

            # Get metric data
            result = self.service.get_metric_data(
                metric_type=validated_data['metric_type'],
                start_date=validated_data['start_date'],
                end_date=validated_data['end_date'],
                grouping=validated_data['grouping'],
                limit=validated_data['limit']
            )

            return {
                'success': True,
                'data': result,
                'message': f"Analytics data retrieved for {validated_data['metric_type']}"
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid analytics request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get analytics data'
            }

    def get_dashboard(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get dashboard analytics data"""
        try:
            # Validate request
            validated_data = self.validator.validate_dashboard_request(
                request_data)

            # Get dashboard data
            result = self.service.get_dashboard_data(
                start_date=validated_data['start_date'],
                end_date=validated_data['end_date']
            )

            return {
                'success': True,
                'data': result,
                'message': 'Dashboard data retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid dashboard request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get dashboard data'
            }

    def get_product_analytics(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get product-specific analytics"""
        try:
            # Validate date range
            start_date = request_data.get('start_date')
            end_date = request_data.get('end_date')
            grouping = request_data.get('grouping')
            limit = request_data.get('limit', 50)

            date_range = self.validator.validate_date_range(
                start_date, end_date)
            validated_limit = self.validator.validate_limit(limit)

            if grouping:
                grouping_error = self.validator.validate_grouping(grouping)
                if grouping_error:
                    raise ValidationError(grouping_error)

            # Get product analytics
            result = self.service.get_product_analytics(
                start_date=date_range['start_date'],
                end_date=date_range['end_date'],
                grouping=grouping,
                limit=validated_limit
            )

            return {
                'success': True,
                'data': result,
                'message': 'Product analytics retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid product analytics request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get product analytics'
            }

    def get_user_analytics(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get user-specific analytics"""
        try:
            # Validate date range
            start_date = request_data.get('start_date')
            end_date = request_data.get('end_date')
            grouping = request_data.get('grouping')

            date_range = self.validator.validate_date_range(
                start_date, end_date)

            if grouping:
                grouping_error = self.validator.validate_grouping(grouping)
                if grouping_error:
                    raise ValidationError(grouping_error)

            # Get user analytics
            result = self.service.get_user_analytics(
                start_date=date_range['start_date'],
                end_date=date_range['end_date'],
                grouping=grouping
            )

            return {
                'success': True,
                'data': result,
                'message': 'User analytics retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid user analytics request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get user analytics'
            }

    def get_chat_analytics(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get chat-specific analytics"""
        try:
            # Validate date range
            start_date = request_data.get('start_date')
            end_date = request_data.get('end_date')
            grouping = request_data.get('grouping')

            date_range = self.validator.validate_date_range(
                start_date, end_date)

            if grouping:
                grouping_error = self.validator.validate_grouping(grouping)
                if grouping_error:
                    raise ValidationError(grouping_error)

            # Get chat analytics
            result = self.service.get_chat_analytics(
                start_date=date_range['start_date'],
                end_date=date_range['end_date'],
                grouping=grouping
            )

            return {
                'success': True,
                'data': result,
                'message': 'Chat analytics retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid chat analytics request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get chat analytics'
            }

    def get_search_analytics(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get search-specific analytics"""
        try:
            # Validate date range and limit
            start_date = request_data.get('start_date')
            end_date = request_data.get('end_date')
            limit = request_data.get('limit', 50)

            date_range = self.validator.validate_date_range(
                start_date, end_date)
            validated_limit = self.validator.validate_limit(limit)

            # Get search analytics
            result = self.service.get_search_analytics(
                start_date=date_range['start_date'],
                end_date=date_range['end_date'],
                limit=validated_limit
            )

            return {
                'success': True,
                'data': result,
                'message': 'Search analytics retrieved successfully'
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid search analytics request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get search analytics'
            }

    def track_event(self, user_id: Optional[str], request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Track an analytics event"""
        try:
            # Validate event request
            event_data = self.validator.validate_event_tracking_request(
                request_data)

            # Track the event
            success = self.service.track_event(
                user_id=user_id,
                event_type=event_data['event_type'],
                event_data=event_data['event_data'],
                timestamp=event_data['timestamp']
            )

            if success:
                return {
                    'success': True,
                    'message': 'Event tracked successfully'
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to track event',
                    'message': 'Event tracking failed'
                }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Invalid event tracking request'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to track event'
            }

    def get_realtime_stats(self) -> Dict[str, Any]:
        """Get real-time statistics"""
        try:
            # Get real-time stats (simplified)
            from datetime import datetime, timedelta

            now = datetime.utcnow()
            last_hour = now - timedelta(hours=1)
            last_24h = now - timedelta(hours=24)

            # Get stats for the last hour and 24 hours
            hourly_result = self.service.get_dashboard_data(last_hour, now)
            daily_result = self.service.get_dashboard_data(last_24h, now)

            return {
                'success': True,
                'data': {
                    'last_hour': {
                        'new_users': hourly_result['recent_activity']['new_users_24h'],
                        'chat_sessions': hourly_result['recent_activity']['chat_sessions_24h'],
                        'messages': hourly_result['recent_activity']['messages_24h']
                    },
                    'last_24h': {
                        'new_users': daily_result['summary']['new_users'],
                        'chat_sessions': daily_result['summary']['total_chat_sessions'],
                        'messages': daily_result['summary']['total_messages']
                    },
                    'timestamp': now.isoformat()
                },
                'message': 'Real-time stats retrieved successfully'
            }

        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'Failed to get real-time stats'
            }
