"""
Analytics request validation
"""
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from models.interfaces import ValidationError
from models.common import sanitize_input


class AnalyticsValidator:
    """Validates analytics-related requests"""

    @staticmethod
    def validate_date_range(start_date: Optional[str], end_date: Optional[str]) -> Dict[str, datetime]:
        """Validate date range parameters"""
        errors = []
        parsed_dates = {}

        # Default to last 30 days if no dates provided
        if not start_date and not end_date:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
            return {'start_date': start_date, 'end_date': end_date}

        # Parse start date
        if start_date:
            try:
                parsed_start = datetime.fromisoformat(
                    start_date.replace('Z', '+00:00'))
                parsed_dates['start_date'] = parsed_start
            except (ValueError, AttributeError):
                errors.append(
                    "Invalid start_date format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)")

        # Parse end date
        if end_date:
            try:
                parsed_end = datetime.fromisoformat(
                    end_date.replace('Z', '+00:00'))
                parsed_dates['end_date'] = parsed_end
            except (ValueError, AttributeError):
                errors.append(
                    "Invalid end_date format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)")

        # Validate date logic
        if 'start_date' in parsed_dates and 'end_date' in parsed_dates:
            if parsed_dates['start_date'] >= parsed_dates['end_date']:
                errors.append("start_date must be before end_date")

            # Check if date range is too large (max 1 year)
            if (parsed_dates['end_date'] - parsed_dates['start_date']).days > 365:
                errors.append("Date range cannot exceed 365 days")

        # Set defaults for missing dates
        if 'start_date' not in parsed_dates:
            if 'end_date' in parsed_dates:
                parsed_dates['start_date'] = parsed_dates['end_date'] - \
                    timedelta(days=30)
            else:
                parsed_dates['start_date'] = datetime.utcnow() - \
                    timedelta(days=30)

        if 'end_date' not in parsed_dates:
            if 'start_date' in parsed_dates:
                parsed_dates['end_date'] = parsed_dates['start_date'] + \
                    timedelta(days=30)
            else:
                parsed_dates['end_date'] = datetime.utcnow()

        if errors:
            raise ValidationError(
                f"Date validation failed: {'; '.join(errors)}")

        return parsed_dates

    @staticmethod
    def validate_metric_type(metric_type: str) -> Optional[str]:
        """Validate analytics metric type"""
        valid_metrics = {
            'product_views', 'product_searches', 'user_registrations',
            'chat_sessions', 'popular_products', 'search_terms',
            'user_activity', 'conversion_rate', 'revenue'
        }

        if not metric_type:
            return "Metric type is required"

        if metric_type not in valid_metrics:
            return f"Invalid metric type. Must be one of: {', '.join(valid_metrics)}"

        return None

    @staticmethod
    def validate_grouping(grouping: Optional[str]) -> Optional[str]:
        """Validate data grouping parameter"""
        if not grouping:
            return None  # Grouping is optional

        valid_groupings = {'hour', 'day', 'week', 'month'}

        if grouping not in valid_groupings:
            return f"Invalid grouping. Must be one of: {', '.join(valid_groupings)}"

        return None

    @staticmethod
    def validate_limit(limit: Optional[int]) -> int:
        """Validate limit parameter"""
        if limit is None:
            return 100  # Default limit

        try:
            limit = int(limit)
        except (ValueError, TypeError):
            raise ValidationError("Limit must be an integer")

        if limit < 1 or limit > 1000:
            raise ValidationError("Limit must be between 1 and 1000")

        return limit

    @staticmethod
    def validate_analytics_request(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate analytics data request"""
        errors = []

        # Extract parameters
        metric_type = sanitize_input(data.get('metric_type', ''))
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        grouping = sanitize_input(
            data.get('grouping')) if data.get('grouping') else None
        limit = data.get('limit')

        # Validate metric type
        metric_error = AnalyticsValidator.validate_metric_type(metric_type)
        if metric_error:
            errors.append(metric_error)

        # Validate grouping
        grouping_error = AnalyticsValidator.validate_grouping(grouping)
        if grouping_error:
            errors.append(grouping_error)

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        # Validate dates and limit separately (they can raise their own ValidationErrors)
        date_range = AnalyticsValidator.validate_date_range(
            start_date, end_date)
        validated_limit = AnalyticsValidator.validate_limit(limit)

        return {
            'metric_type': metric_type,
            'start_date': date_range['start_date'],
            'end_date': date_range['end_date'],
            'grouping': grouping,
            'limit': validated_limit
        }

    @staticmethod
    def validate_event_tracking_request(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate event tracking request"""
        errors = []

        event_type = sanitize_input(data.get('event_type', ''))
        event_data = data.get('event_data', {})

        # Validate event type
        valid_events = {
            'product_view', 'product_search', 'add_to_cart', 'remove_from_cart',
            'checkout_start', 'checkout_complete', 'user_registration', 'user_login',
            'chat_message', 'chat_session_start', 'page_view'
        }

        if not event_type:
            errors.append("Event type is required")
        elif event_type not in valid_events:
            errors.append(
                f"Invalid event type. Must be one of: {', '.join(valid_events)}")

        # Validate event data
        if not isinstance(event_data, dict):
            errors.append("Event data must be an object")
        elif len(str(event_data)) > 5000:  # Reasonable size limit
            errors.append("Event data too large")

        if errors:
            raise ValidationError(f"Validation failed: {'; '.join(errors)}")

        return {
            'event_type': event_type,
            'event_data': event_data,
            'timestamp': datetime.utcnow()
        }

    @staticmethod
    def validate_dashboard_request(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate dashboard data request"""
        # Dashboard requests are simpler - just need date range
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        date_range = AnalyticsValidator.validate_date_range(
            start_date, end_date)

        return {
            'start_date': date_range['start_date'],
            'end_date': date_range['end_date']
        }
