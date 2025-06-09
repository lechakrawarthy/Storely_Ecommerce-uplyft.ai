#!/usr/bin/env python3
"""
Seed script to populate the store.db with 300 products:
- 100 Books
- 100 Electronics  
- 100 Textiles
"""
import sqlite3
import random
from datetime import datetime


def create_products_data():
    """Create 300 products across 3 categories"""
    products = []

    # Books (100 products)
    books = [
        # Fiction
        "The Alchemist", "1984", "To Kill a Mockingbird", "Pride and Prejudice", "The Great Gatsby",
        "One Hundred Years of Solitude", "The Catcher in the Rye", "Lord of the Flies", "Jane Eyre", "Wuthering Heights",
        "The Lord of the Rings", "Harry Potter and the Sorcerer's Stone", "The Hobbit", "Dune", "Foundation",
        "Brave New World", "Fahrenheit 451", "The Handmaid's Tale", "Animal Farm", "The Road",

        # Non-Fiction
        "Sapiens", "Atomic Habits", "Deep Work", "The 7 Habits of Highly Effective People", "Think and Grow Rich",
        "Rich Dad Poor Dad", "The Power of Now", "How to Win Friends and Influence People", "The Lean Startup", "Zero to One",
        "Good to Great", "The Innovator's Dilemma", "Outliers", "The Tipping Point", "Blink",
        "Freakonomics", "The Art of War", "Man's Search for Meaning", "The 4-Hour Workweek", "The Millionaire Next Door",

        # Technical/Educational
        "Clean Code", "Design Patterns", "The Pragmatic Programmer", "Code Complete", "Refactoring",
        "You Don't Know JS", "JavaScript: The Good Parts", "Python Crash Course", "Learning Python", "Automate the Boring Stuff",
        "Introduction to Algorithms", "Computer Science Distilled", "The Art of Computer Programming", "Structure and Interpretation",
        "Database System Concepts", "Operating System Concepts", "Computer Networks", "Machine Learning Yearning", "Deep Learning", "AI: A Modern Approach",

        # Business & Self-Help
        "The E-Myth Revisited", "Start With Why", "Purple Cow", "The Hard Thing About Hard Things", "Crossing the Chasm",
        "Blue Ocean Strategy", "The Lean Six Sigma Pocket Toolbook", "Getting Things Done", "The One Thing", "Essentialism",
        "The Power of Habit", "Mindset", "Grit", "Peak", "Flow",
        "The Compound Effect", "The Magic of Thinking Big", "The Success Principles", "The Miracle Morning", "Unlimited Power",

        # Science & Philosophy
        "A Brief History of Time", "The Elegant Universe", "Cosmos", "The Origin of Species", "The Double Helix",
        "The Structure of Scientific Revolutions", "The Republic", "Meditations", "Thus Spoke Zarathustra", "Being and Time",
        "The Prince", "Leviathan", "A Theory of Justice", "The Wealth of Nations", "Das Kapital",
        "The Critique of Pure Reason", "Beyond Good and Evil", "The Will to Power", "The Phenomenology of Spirit", "Being and Nothingness"
    ]

    book_descriptions = [
        "A transformative journey of self-discovery and purpose",
        "A thought-provoking exploration of society and human nature",
        "Essential reading for personal and professional growth",
        "A comprehensive guide to understanding complex concepts",
        "Practical insights for modern challenges"
    ]

    for i, book in enumerate(books):
        products.append({
            'name': book,
            'category': 'Books',
            'price': round(random.uniform(15.99, 89.99), 2),
            'stock': random.randint(5, 50),
            'description': random.choice(book_descriptions),
            'image_url': f'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text={book.replace(" ", "+")}',
            'badge': random.choice(['Bestseller', 'New Release', 'Popular', 'Award Winner', 'Editor\'s Choice'])
        })

    # Electronics (100 products)
    electronics = [
        # Smartphones & Tablets
        "iPhone 15 Pro", "Samsung Galaxy S24", "Google Pixel 8", "OnePlus 12", "Xiaomi 14",
        "iPad Pro 12.9", "Samsung Galaxy Tab S9", "Microsoft Surface Pro 9", "iPad Air", "Amazon Fire HD 10",
        "iPhone 15", "Samsung Galaxy S24 Ultra", "Google Pixel 8 Pro", "OnePlus 12 Pro", "Xiaomi 14 Ultra",

        # Laptops & Computers
        "MacBook Pro 16-inch", "Dell XPS 13", "ThinkPad X1 Carbon", "HP Spectre x360", "Surface Laptop 5",
        "ASUS ROG Zephyrus", "Acer Predator Helios", "MSI Gaming Laptop", "Alienware m15", "Razer Blade 15",
        "iMac 24-inch", "Mac Studio", "Dell OptiPlex", "HP Pavilion Desktop", "ASUS Desktop PC",

        # Audio & Headphones
        "AirPods Pro 2", "Sony WH-1000XM5", "Bose QuietComfort", "Sennheiser HD 650", "Audio-Technica ATH-M50x",
        "Marshall Acton III", "Sonos One", "JBL Charge 5", "Ultimate Ears BOOM 3", "Anker Soundcore",
        "Apple HomePod", "Amazon Echo Dot", "Google Nest Audio", "Sonos Arc", "Bose SoundLink",

        # Smart Home & Accessories
        "Apple Watch Series 9", "Samsung Galaxy Watch 6", "Fitbit Versa 4", "Garmin Forerunner", "Amazfit GTR 4",
        "Ring Video Doorbell", "Nest Thermostat", "Philips Hue Bulbs", "Amazon Echo Show", "Google Nest Hub",
        "Wireless Charger", "Power Bank 20000mAh", "USB-C Hub", "Webcam 4K", "Bluetooth Mouse",

        # Gaming & Entertainment
        "PlayStation 5", "Xbox Series X", "Nintendo Switch OLED", "Steam Deck", "Nintendo Switch Lite",
        "Gaming Monitor 27-inch", "Mechanical Keyboard", "Gaming Mouse", "VR Headset", "Gaming Chair",
        "4K Smart TV 55-inch", "Streaming Device", "Soundbar", "Projector 4K", "Gaming Headset",

        # Cameras & Photography
        "Canon EOS R6", "Sony A7 IV", "Nikon Z6 II", "Fujifilm X-T5", "GoPro Hero 12",
        "DJI Mini 4 Pro", "Instax Mini 12", "Ring Light", "Tripod Carbon Fiber", "Camera Lens 85mm",

        # Storage & Networking
        "External SSD 1TB", "NAS Drive", "Wi-Fi 6 Router", "Mesh Network System", "USB Flash Drive",
        "Portable Hard Drive", "Cloud Storage Device", "Network Switch", "Wi-Fi Extender", "Ethernet Cable"
    ]

    electronics_descriptions = [
        "Cutting-edge technology for modern professionals",
        "High-performance device with advanced features",
        "Premium quality with exceptional durability",
        "Latest innovation in consumer electronics",
        "Professional-grade equipment for demanding users"
    ]

    for i, electronic in enumerate(electronics):
        products.append({
            'name': electronic,
            'category': 'Electronics',
            'price': round(random.uniform(29.99, 2999.99), 2),
            'stock': random.randint(2, 25),
            'description': random.choice(electronics_descriptions),
            'image_url': f'https://via.placeholder.com/300x300/10B981/FFFFFF?text={electronic.replace(" ", "+")}',
            'badge': random.choice(['Latest', 'Premium', 'Best Seller', 'Tech Choice', 'Innovation'])
        })

    # Textiles (100 products)
    textiles = [
        # Men's Clothing
        "Classic White Shirt", "Slim Fit Jeans", "Wool Blazer", "Cotton T-Shirt", "Polo Shirt",
        "Chino Pants", "Dress Shirt", "Casual Hoodie", "Leather Jacket", "Denim Jacket",
        "Formal Suit", "Cargo Shorts", "Tank Top", "Cardigan", "Sweater",
        "Track Pants", "Board Shorts", "Flannel Shirt", "Henley Shirt", "Bomber Jacket",

        # Women's Clothing
        "Summer Dress", "Blouse", "Skinny Jeans", "Maxi Dress", "Pencil Skirt",
        "Cardigan", "Blazer", "Jumpsuit", "Crop Top", "High-Waisted Jeans",
        "Wrap Dress", "A-Line Skirt", "Tunic Top", "Leggings", "Palazzo Pants",
        "Midi Dress", "Off-Shoulder Top", "Bodycon Dress", "Wide-Leg Pants", "Kimono",

        # Activewear & Sports
        "Yoga Pants", "Sports Bra", "Running Shorts", "Athletic T-Shirt", "Workout Leggings",
        "Compression Shorts", "Tank Top", "Sweatshirt", "Joggers", "Sports Hoodie",
        "Cycling Shorts", "Moisture-Wicking Shirt", "Training Pants", "Athletic Shorts", "Gym Top",

        # Accessories & Undergarments
        "Cotton Underwear", "Bra Set", "Socks Pack", "Boxer Briefs", "Camisole",
        "Shapewear", "Sleep Set", "Loungewear", "Robe", "Nightgown",
        "Thermal Underwear", "Compression Socks", "No-Show Socks", "Sports Socks", "Crew Socks",

        # Seasonal & Outerwear
        "Winter Coat", "Puffer Jacket", "Trench Coat", "Rain Jacket", "Windbreaker",
        "Peacoat", "Parka", "Vest", "Shawl", "Scarf",
        "Gloves", "Beanie", "Sun Hat", "Baseball Cap", "Bucket Hat",

        # Home Textiles
        "Bed Sheets Set", "Comforter", "Pillow Cases", "Throw Blanket", "Bath Towel Set",
        "Curtains", "Table Runner", "Placemats", "Throw Pillows", "Area Rug",
        "Duvet Cover", "Mattress Protector", "Pillow", "Blanket", "Kitchen Towels"
    ]

    textile_descriptions = [
        "Premium quality fabric with exceptional comfort",
        "Stylish design perfect for any occasion",
        "Durable material with superior craftsmanship",
        "Contemporary fashion with timeless appeal",
        "Soft, breathable fabric for all-day comfort"
    ]

    for i, textile in enumerate(textiles):
        products.append({
            'name': textile,
            'category': 'Textiles',
            'price': round(random.uniform(9.99, 299.99), 2),
            'stock': random.randint(10, 100),
            'description': random.choice(textile_descriptions),
            'image_url': f'https://via.placeholder.com/300x400/EF4444/FFFFFF?text={textile.replace(" ", "+")}',
            'badge': random.choice(['Trending', 'Comfort', 'Premium', 'Popular', 'Best Value'])
        })

    return products


def seed_database():
    """Clear and populate the products table"""
    print("🌱 Seeding database with 300 products...")

    # Connect to database
    conn = sqlite3.connect('api/store.db')
    cursor = conn.cursor()

    # Clear existing products
    cursor.execute('DELETE FROM products')
    print("  Cleared existing products")

    # Create products data
    products = create_products_data()

    # Insert products
    for i, product in enumerate(products, 1):
        cursor.execute('''
            INSERT INTO products (name, category, price, stock, description, image_url, badge)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['name'],
            product['category'],
            product['price'],
            product['stock'],
            product['description'],
            product['image_url'],
            product['badge']
        ))

        if i % 50 == 0:
            print(f"  Inserted {i} products...")

    # Commit changes
    conn.commit()

    # Verify the data
    cursor.execute(
        'SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category')
    results = cursor.fetchall()

    print(f"\n✅ Database seeded successfully!")
    print("Product distribution:")
    for category, count in results:
        print(f"  {category}: {count} products")

    # Show sample products
    print(f"\nSample products:")
    for category in ['Books', 'Electronics', 'Textiles']:
        cursor.execute(
            'SELECT name, price FROM products WHERE category = ? LIMIT 3', (category,))
        samples = cursor.fetchall()
        print(f"  {category}:")
        for name, price in samples:
            print(f"    - {name} (${price})")

    conn.close()


if __name__ == "__main__":
    seed_database()
