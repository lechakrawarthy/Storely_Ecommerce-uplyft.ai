"""
Product data access layer
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from db.base import Product, get_db_session
from models.interfaces import ProductRequest, ProductResponse
import logging

logger = logging.getLogger(__name__)


class ProductRepository:
    """Product data access operations"""

    def __init__(self, db_session: Session = None):
        self._db_session = db_session
        self._db = None

    @property
    def db(self):
        """Lazy database session initialization"""
        if self._db is None:
            self._db = self._db_session or get_db_session()
        return self._db

    def get_all_products(self, filters: Dict[str, Any] = None) -> List[Product]:
        """Get all products with optional filters"""
        try:
            query = self.db.query(Product)

            if filters:
                # Category filter
                if 'category' in filters and filters['category']:
                    query = query.filter(
                        Product.category == filters['category'])

                # Price range filters
                if 'min_price' in filters and filters['min_price'] is not None:
                    query = query.filter(Product.price >= filters['min_price'])

                if 'max_price' in filters and filters['max_price'] is not None:
                    query = query.filter(Product.price <= filters['max_price'])

                # Search query
                if 'search_query' in filters and filters['search_query']:
                    search_term = f"%{filters['search_query']}%"
                    query = query.filter(
                        or_(
                            Product.name.ilike(search_term),
                            Product.description.ilike(search_term),
                            Product.category.ilike(search_term)                        )
                    )            # Add ordering to ensure Electronics appear early - reverse alphabetical by category
            # This puts Electronics first, then Clothing, then Books
            query = query.order_by(Product.category.desc(), Product.id)

            # Pagination (must come AFTER ordering)
            if filters:
                if 'offset' in filters:
                    query = query.offset(filters['offset'])

                if 'limit' in filters:
                    query = query.limit(filters['limit'])
            
            products = query.all()
            logger.info(f"Retrieved {len(products)} products")
            return products

        except Exception as e:
            logger.error(f"Error retrieving products: {e}")
            raise

    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """Get a specific product by ID"""
        try:
            product = self.db.query(Product).filter(
                Product.id == int(product_id)).first()
            if product:
                logger.info(f"Retrieved product: {product.name}")
            else:
                logger.warning(f"Product not found: {product_id}")
            return product

        except ValueError:
            logger.error(f"Invalid product ID format: {product_id}")
            return None
        except Exception as e:
            logger.error(f"Error retrieving product {product_id}: {e}")
            raise

    def get_categories(self) -> List[str]:
        """Get all unique product categories"""
        try:
            categories = self.db.query(Product.category).distinct().all()
            category_list = [cat[0] for cat in categories if cat[0]]
            logger.info(f"Retrieved {len(category_list)} categories")
            return category_list

        except Exception as e:
            logger.error(f"Error retrieving categories: {e}")
            raise

    def search_products(self, search_query: str, limit: int = 10) -> List[Product]:
        """Search products by name, description, or category"""
        try:
            search_term = f"%{search_query}%"
            products = self.db.query(Product).filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.category.ilike(search_term)
                )
            ).limit(limit).all()

            logger.info(
                f"Search '{search_query}' returned {len(products)} products")
            return products

        except Exception as e:
            logger.error(f"Error searching products: {e}")
            raise

    def get_products_by_category(self, category: str, limit: int = 10) -> List[Product]:
        """Get products by category"""
        try:
            products = self.db.query(Product).filter(
                Product.category == category
            ).limit(limit).all()

            logger.info(
                f"Retrieved {len(products)} products from category '{category}'")
            return products

        except Exception as e:
            logger.error(f"Error retrieving products by category: {e}")
            raise

    def get_featured_products(self, limit: int = 6) -> List[Product]:
        """Get featured products (with badges or highest stock)"""
        try:
            # First try to get products with badges
            featured = self.db.query(Product).filter(
                Product.badge.isnot(None)
            ).limit(limit).all()

            # If not enough, get products with highest stock
            if len(featured) < limit:
                remaining = limit - len(featured)
                additional = self.db.query(Product).filter(
                    Product.badge.is_(None)
                ).order_by(Product.stock.desc()).limit(remaining).all()
                featured.extend(additional)

            logger.info(f"Retrieved {len(featured)} featured products")
            return featured

        except Exception as e:
            logger.error(f"Error retrieving featured products: {e}")
            raise

    def get_product_count(self, filters: Dict[str, Any] = None) -> int:
        """Get total count of products matching filters"""
        try:
            query = self.db.query(Product)

            if filters:
                if 'category' in filters and filters['category']:
                    query = query.filter(
                        Product.category == filters['category'])

                if 'min_price' in filters and filters['min_price'] is not None:
                    query = query.filter(Product.price >= filters['min_price'])

                if 'max_price' in filters and filters['max_price'] is not None:
                    query = query.filter(Product.price <= filters['max_price'])

                if 'search_query' in filters and filters['search_query']:
                    search_term = f"%{filters['search_query']}%"
                    query = query.filter(
                        or_(
                            Product.name.ilike(search_term),
                            Product.description.ilike(search_term),
                            Product.category.ilike(search_term)
                        )
                    )

            count = query.count()
            logger.info(f"Product count: {count}")
            return count

        except Exception as e:
            logger.error(f"Error counting products: {e}")
            raise

    def close(self):
        """Close the database session"""
        if self.db:
            self.db.close()

# Convenience functions for single operations


def get_products(filters: Dict[str, Any] = None) -> List[ProductResponse]:
    """Get products and convert to response format"""
    repo = ProductRepository()
    try:
        products = repo.get_all_products(filters)
        return [ProductResponse(**product.to_dict()) for product in products]
    finally:
        repo.close()


def get_product(product_id: str) -> Optional[ProductResponse]:
    """Get a single product by ID"""
    repo = ProductRepository()
    try:
        product = repo.get_product_by_id(product_id)
        return ProductResponse(**product.to_dict()) if product else None
    finally:
        repo.close()


def search_products_by_query(query: str, limit: int = 10) -> List[ProductResponse]:
    """Search products by query"""
    repo = ProductRepository()
    try:
        products = repo.search_products(query, limit)
        return [ProductResponse(**product.to_dict()) for product in products]
    finally:
        repo.close()
