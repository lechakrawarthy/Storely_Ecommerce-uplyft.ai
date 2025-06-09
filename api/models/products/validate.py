"""
Product validation functions
"""
from typing import Dict, Any, List
from models.interfaces import ValidationError, ProductRequest
from models.constants import PRODUCT_CATEGORIES, MAX_PRODUCTS_PER_REQUEST
from models.common import sanitize_input


class ProductValidator:
    """Product request validator"""

    @staticmethod
    def validate_product_filters(request_data: Dict[str, Any]) -> ProductRequest:
        """Validate product filter request"""
        return validate_product_request(request_data)

    @staticmethod
    def validate_search_query_input(query: str) -> str:
        """Validate search query"""
        return validate_search_query(query)

    @staticmethod
    def validate_price_range_input(min_price: float = None, max_price: float = None) -> None:
        """Validate price range"""
        validate_price_range(min_price, max_price)


def validate_product_request(request_data: Dict[str, Any]) -> ProductRequest:
    """Validate and create ProductRequest from request data"""

    # Category validation
    category = request_data.get('category')
    if category:
        category = sanitize_input(category)
        if category not in PRODUCT_CATEGORIES and category != 'All':
            raise ValidationError(
                f"Invalid category. Allowed: {', '.join(PRODUCT_CATEGORIES)}", "category")

    # Limit validation
    try:
        limit = int(request_data.get('limit', 10))
        if limit < 1 or limit > MAX_PRODUCTS_PER_REQUEST:
            raise ValidationError(
                f"Limit must be between 1 and {MAX_PRODUCTS_PER_REQUEST}", "limit")
    except (ValueError, TypeError):
        raise ValidationError("Limit must be a valid integer", "limit")

    # Offset validation
    try:
        offset = int(request_data.get('offset', 0))
        if offset < 0:
            raise ValidationError("Offset must be non-negative", "offset")
    except (ValueError, TypeError):
        raise ValidationError("Offset must be a valid integer", "offset")

    # Price range validation
    min_price = request_data.get('min_price')
    max_price = request_data.get('max_price')

    if min_price is not None:
        try:
            min_price = float(min_price)
            if min_price < 0:
                raise ValidationError(
                    "Minimum price must be non-negative", "min_price")
        except (ValueError, TypeError):
            raise ValidationError(
                "Minimum price must be a valid number", "min_price")

    if max_price is not None:
        try:
            max_price = float(max_price)
            if max_price < 0:
                raise ValidationError(
                    "Maximum price must be non-negative", "max_price")
        except (ValueError, TypeError):
            raise ValidationError(
                "Maximum price must be a valid number", "max_price")

    if min_price is not None and max_price is not None and min_price > max_price:
        raise ValidationError(
            "Minimum price cannot be greater than maximum price", "price_range")

    # Search query validation
    search_query = request_data.get('q') or request_data.get('search_query')
    if search_query:
        search_query = sanitize_input(search_query, max_length=200)
        if len(search_query.strip()) < 2:
            raise ValidationError(
                "Search query must be at least 2 characters", "search_query")

    return ProductRequest(
        category=category,
        limit=limit,
        offset=offset,
        min_price=min_price,
        max_price=max_price,
        search_query=search_query
    )


def validate_product_id(product_id: str) -> str:
    """Validate product ID format"""
    if not product_id:
        raise ValidationError("Product ID is required", "product_id")

    product_id = sanitize_input(product_id)

    try:
        # Check if it's a valid integer
        int(product_id)
        return product_id
    except ValueError:
        raise ValidationError(
            "Product ID must be a valid number", "product_id")


def validate_search_query(query: str) -> str:
    """Validate search query"""
    if not query:
        raise ValidationError("Search query is required", "query")

    query = sanitize_input(query, max_length=200)

    if len(query.strip()) < 2:
        raise ValidationError(
            "Search query must be at least 2 characters", "query")

    if len(query.strip()) > 200:
        raise ValidationError(
            "Search query is too long (max 200 characters)", "query")

    return query.strip()


def validate_category_filter(category: str) -> str:
    """Validate category filter"""
    if not category:
        return None

    category = sanitize_input(category)

    if category == 'All':
        return None

    if category not in PRODUCT_CATEGORIES:
        raise ValidationError(
            f"Invalid category. Allowed: All, {', '.join(PRODUCT_CATEGORIES)}", "category")

    return category


def validate_pagination(limit: int = None, offset: int = None) -> tuple:
    """Validate pagination parameters"""
    # Validate limit
    if limit is not None:
        try:
            limit = int(limit)
            if limit < 1 or limit > MAX_PRODUCTS_PER_REQUEST:
                raise ValidationError(
                    f"Limit must be between 1 and {MAX_PRODUCTS_PER_REQUEST}", "limit")
        except (ValueError, TypeError):
            raise ValidationError("Limit must be a valid integer", "limit")
    else:
        limit = 10  # default

    # Validate offset
    if offset is not None:
        try:
            offset = int(offset)
            if offset < 0:
                raise ValidationError("Offset must be non-negative", "offset")
        except (ValueError, TypeError):
            raise ValidationError("Offset must be a valid integer", "offset")
    else:
        offset = 0  # default

    return limit, offset


def validate_price_range(min_price: float = None, max_price: float = None) -> tuple:
    """Validate price range parameters"""
    if min_price is not None:
        try:
            min_price = float(min_price)
            if min_price < 0:
                raise ValidationError(
                    "Minimum price must be non-negative", "min_price")
        except (ValueError, TypeError):
            raise ValidationError(
                "Minimum price must be a valid number", "min_price")

    if max_price is not None:
        try:
            max_price = float(max_price)
            if max_price < 0:
                raise ValidationError(
                    "Maximum price must be non-negative", "max_price")
        except (ValueError, TypeError):
            raise ValidationError(
                "Maximum price must be a valid number", "max_price")

    if min_price is not None and max_price is not None and min_price > max_price:
        raise ValidationError(
            "Minimum price cannot be greater than maximum price", "price_range")

    return min_price, max_price
