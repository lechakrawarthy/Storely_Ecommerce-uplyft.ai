"""
Product controller - main entry point for product operations
"""
from typing import Dict, Any, Optional
from models.products.validate import ProductValidator
from models.products.compute import ProductService
from models.interfaces import ProductRequest, ValidationError


class ProductController:
    """Main controller for product operations"""

    def __init__(self):
        self.validator = ProductValidator()
        self.service = ProductService()

    def get_products(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle get products request"""
        try:
            # Validate request
            self.validator.validate_product_filters(request_data)

            # Process request
            result = self.service.get_products(request_data)

            return {
                'success': True,
                'data': result
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': 'validation_error'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'error_type': 'server_error'
            }

    def search_products(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle product search request"""
        try:
            # Validate search query
            query = request_data.get('query', '')
            if not query:
                raise ValidationError("Search query is required")

            self.validator.validate_search_query(query)

            # Process search
            result = self.service.search_products(request_data)

            return {
                'success': True,
                'data': result
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': 'validation_error'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'error_type': 'server_error'
            }

    def get_product_by_id(self, product_id: int) -> Dict[str, Any]:
        """Handle get product by ID request"""
        try:
            # Validate product ID
            if not isinstance(product_id, int) or product_id <= 0:
                raise ValidationError("Invalid product ID")

            # Get product
            result = self.service.get_product_by_id(product_id)

            if not result:
                return {
                    'success': False,
                    'error': 'Product not found',
                    'error_type': 'not_found'
                }

            return {
                'success': True,
                'data': result
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': 'validation_error'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'error_type': 'server_error'
            }

    def get_product_recommendations(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle product recommendations request"""
        try:
            # Get user ID if provided
            user_id = request_data.get('user_id')
            limit = request_data.get('limit', 5)

            # Validate limit
            if not isinstance(limit, int) or limit <= 0 or limit > 50:
                raise ValidationError("Limit must be between 1 and 50")

            # Get recommendations
            result = self.service.get_recommendations(user_id, limit)

            return {
                'success': True,
                'data': result
            }

        except ValidationError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': 'validation_error'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'error_type': 'server_error'
            }

    def get_categories(self) -> Dict[str, Any]:
        """Handle get categories request"""
        try:
            # Get categories from service
            result = self.service.get_categories()

            return {
                'success': True,
                'data': result
            }

        except Exception as e:
            return {
                'success': False,
                'error': 'Internal server error',
                'error_type': 'server_error'
            }
