"""
Product business logic and operations
"""
from typing import List, Dict, Any, Optional
from models.interfaces import ProductRequest, ProductResponse
from models.constants import PRODUCT_CATEGORIES
from db.products import ProductRepository
import logging

logger = logging.getLogger(__name__)


class ProductService:
    """Product business logic service"""

    def __init__(self):
        self.repository = ProductRepository()

    def get_products(self, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get products with filters and pagination"""
        try:
            products = self.repository.get_all_products(filters)
            total_count = self.repository.get_product_count(filters)

            # Convert to response format
            product_responses = [ProductResponse(
                **product.to_dict()) for product in products]

            # Add metadata
            result = {
                'products': [product.__dict__ for product in product_responses],
                'total': total_count,
                'page_size': filters.get('limit', 10) if filters else 10,
                'offset': filters.get('offset', 0) if filters else 0,
                'has_more': total_count > (filters.get('offset', 0) + len(products))
            }

            logger.info(
                f"Retrieved {len(products)} products with filters: {filters}")
            return result

        except Exception as e:
            logger.error(f"Error in get_products: {e}")
            raise
        finally:
            self.repository.close()

    def get_product_by_id(self, product_id: str) -> Optional[ProductResponse]:
        """Get a specific product by ID"""
        try:
            product = self.repository.get_product_by_id(product_id)
            if product:
                return ProductResponse(**product.to_dict())
            return None

        except Exception as e:
            logger.error(f"Error getting product {product_id}: {e}")
            raise
        finally:
            self.repository.close()

    def search_products(self, query: str, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """Search products by query with optional filters"""
        try:
            # Add search query to filters
            search_filters = filters.copy() if filters else {}
            search_filters['search_query'] = query

            products = self.repository.get_all_products(search_filters)
            total_count = self.repository.get_product_count(search_filters)

            # Convert to response format
            product_responses = [ProductResponse(
                **product.to_dict()) for product in products]

            result = {
                'results': [product.__dict__ for product in product_responses],
                'query': query,
                'total': total_count,
                'count': len(products),
                'page_size': search_filters.get('limit', 10),
                'offset': search_filters.get('offset', 0)
            }

            logger.info(f"Search '{query}' returned {len(products)} products")
            return result

        except Exception as e:
            logger.error(f"Error searching products: {e}")
            raise
        finally:
            self.repository.close()

    def get_categories(self) -> List[str]:
        """Get all available product categories"""
        try:
            categories = self.repository.get_categories()

            # Add "All" option at the beginning
            if categories and "All" not in categories:
                categories.insert(0, "All")

            logger.info(f"Retrieved {len(categories)} categories")
            return categories

        except Exception as e:
            logger.error(f"Error getting categories: {e}")
            raise
        finally:
            self.repository.close()

    def get_featured_products(self, limit: int = 6) -> List[ProductResponse]:
        """Get featured products for homepage"""
        try:
            products = self.repository.get_featured_products(limit)
            product_responses = [ProductResponse(
                **product.to_dict()) for product in products]

            logger.info(
                f"Retrieved {len(product_responses)} featured products")
            return [product.__dict__ for product in product_responses]

        except Exception as e:
            logger.error(f"Error getting featured products: {e}")
            raise
        finally:
            self.repository.close()

    def get_products_by_category(self, category: str, limit: int = 10) -> List[ProductResponse]:
        """Get products filtered by category"""
        try:
            products = self.repository.get_products_by_category(
                category, limit)
            product_responses = [ProductResponse(
                **product.to_dict()) for product in products]

            logger.info(
                f"Retrieved {len(product_responses)} products from category '{category}'")
            return [product.__dict__ for product in product_responses]

        except Exception as e:
            logger.error(f"Error getting products by category: {e}")
            raise
        finally:
            self.repository.close()

    def get_product_recommendations(self, product_id: str, limit: int = 4) -> List[ProductResponse]:
        """Get product recommendations based on category and price range"""
        try:
            # Get the base product
            base_product = self.repository.get_product_by_id(product_id)
            if not base_product:
                return []

            # Find similar products in the same category
            similar_products = self.repository.get_products_by_category(
                base_product.category,
                limit + 1  # +1 to exclude the base product
            )

            # Filter out the base product and limit results
            recommendations = [
                product for product in similar_products
                if product.id != base_product.id
            ][:limit]

            product_responses = [ProductResponse(
                **product.to_dict()) for product in recommendations]

            logger.info(
                f"Generated {len(product_responses)} recommendations for product {product_id}")
            return [product.__dict__ for product in product_responses]

        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            raise
        finally:
            self.repository.close()

    def get_price_range(self, category: str = None) -> Dict[str, float]:
        """Get min and max prices for products, optionally filtered by category"""
        try:
            filters = {'category': category} if category else {}
            products = self.repository.get_all_products(filters)

            if not products:
                return {'min_price': 0.0, 'max_price': 0.0}

            prices = [
                product.price for product in products if product.price is not None]
            if not prices:
                return {'min_price': 0.0, 'max_price': 0.0}

            result = {
                'min_price': min(prices),
                'max_price': max(prices)
            }

            logger.info(f"Price range for category '{category}': {result}")
            return result

        except Exception as e:
            logger.error(f"Error getting price range: {e}")
            raise
        finally:
            self.repository.close()

# Convenience functions for use in API endpoints


def get_all_products(filters: Dict[str, Any] = None) -> Dict[str, Any]:
    """Get all products with filters"""
    service = ProductService()
    return service.get_products(filters)


def get_single_product(product_id: str) -> Optional[Dict[str, Any]]:
    """Get a single product by ID"""
    service = ProductService()
    product = service.get_product_by_id(product_id)
    return product.__dict__ if product else None


def search_all_products(query: str, filters: Dict[str, Any] = None) -> Dict[str, Any]:
    """Search products by query"""
    service = ProductService()
    return service.search_products(query, filters)


def get_all_categories() -> List[str]:
    """Get all product categories"""
    service = ProductService()
    return service.get_categories()


def get_featured_products_list(limit: int = 6) -> List[Dict[str, Any]]:
    """Get featured products"""
    service = ProductService()
    return service.get_featured_products(limit)
