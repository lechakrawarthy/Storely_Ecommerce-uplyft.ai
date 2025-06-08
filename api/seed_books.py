import os
from models import init_db, SessionLocal, Product
import uuid

def seed_books_data():
    """Seed the database with book data"""
    init_db()
    
    db = SessionLocal()
    try:
        # Check if we already have data
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} products. Skipping seeding.")
            return
        
        # Book data
        books = [
            {
                'id': str(uuid.uuid4()),
                'title': 'The Great Gatsby',
                'price': 12.99,
                'original_price': 15.99,
                'image': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
                'category': 'Fiction',
                'color': 'Green',
                'rating': 4.5,
                'reviews': 1250,
                'badge': 'Classic',
                'discount': 19,
                'in_stock': True,
                'description': 'A classic American novel about the Jazz Age and the American Dream'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'To Kill a Mockingbird',
                'price': 13.99,
                'original_price': 16.99,
                'image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
                'category': 'Fiction',
                'color': 'Blue',
                'rating': 4.8,
                'reviews': 2100,
                'badge': 'Bestseller',
                'discount': 18,
                'in_stock': True,
                'description': 'A gripping tale of racial injustice and childhood innocence in the American South'
            },
            {
                'id': str(uuid.uuid4()),
                'title': '1984',
                'price': 11.99,
                'original_price': 14.99,
                'image': 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=400&q=80',
                'category': 'Fiction',
                'color': 'Red',
                'rating': 4.7,
                'reviews': 1800,
                'badge': 'Dystopian',
                'discount': 20,
                'in_stock': True,
                'description': 'George Orwell\'s dystopian social science fiction novel about totalitarianism'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'A Brief History of Time',
                'price': 16.99,
                'original_price': 19.99,
                'image': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
                'category': 'Science',
                'color': 'Black',
                'rating': 4.6,
                'reviews': 950,
                'badge': 'Educational',
                'discount': 15,
                'in_stock': True,
                'description': 'Stephen Hawking\'s exploration of the universe and the nature of time'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'The Art of War',
                'price': 9.99,
                'original_price': 12.99,
                'image': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
                'category': 'History',
                'color': 'Gold',
                'rating': 4.4,
                'reviews': 720,
                'badge': 'Ancient Wisdom',
                'discount': 23,
                'in_stock': True,
                'description': 'Sun Tzu\'s ancient Chinese military treatise on strategy and tactics'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Python Programming for Beginners',
                'price': 24.99,
                'original_price': 29.99,
                'image': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                'category': 'Education',
                'color': 'Yellow',
                'rating': 4.5,
                'reviews': 480,
                'badge': 'Programming',
                'discount': 17,
                'in_stock': True,
                'description': 'A comprehensive guide to learning Python programming from scratch'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Steve Jobs',
                'price': 18.99,
                'original_price': 22.99,
                'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'category': 'Biography',
                'color': 'Silver',
                'rating': 4.7,
                'reviews': 1300,
                'badge': 'Biography',
                'discount': 17,
                'in_stock': True,
                'description': 'Walter Isaacson\'s definitive biography of Apple co-founder Steve Jobs'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'The Hitchhiker\'s Guide to the Galaxy',
                'price': 14.99,
                'original_price': 17.99,
                'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'category': 'Fiction',
                'color': 'Blue',
                'rating': 4.6,
                'reviews': 890,
                'badge': 'Sci-Fi',
                'discount': 17,
                'in_stock': True,
                'description': 'Douglas Adams\' comedic science fiction series about space travel'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Sapiens: A Brief History of Humankind',
                'price': 19.99,
                'original_price': 24.99,
                'image': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
                'category': 'History',
                'color': 'Brown',
                'rating': 4.8,
                'reviews': 2400,
                'badge': 'Bestseller',
                'discount': 20,
                'in_stock': True,
                'description': 'Yuval Noah Harari\'s exploration of human history and evolution'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'The Alchemist',
                'price': 13.99,
                'original_price': 16.99,
                'image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
                'category': 'Fiction',
                'color': 'Orange',
                'rating': 4.5,
                'reviews': 1650,
                'badge': 'Inspirational',
                'discount': 18,
                'in_stock': True,
                'description': 'Paulo Coelho\'s philosophical novel about following your dreams'
            }
        ]
        
        # Add books to database
        for book_data in books:
            book = Product(**book_data)
            db.add(book)
        
        db.commit()
        print(f"Successfully seeded {len(books)} books into the database!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_books_data()
