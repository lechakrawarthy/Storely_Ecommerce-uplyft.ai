
import React, { useState } from 'react';
import BookCard from './BookCard';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  cover: string;
  genre: string;
}

const BooksSection = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [priceRange, setPriceRange] = useState([100, 2000]);
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [cart, setCart] = useState<Book[]>([]);

  const genres = [
    { name: 'All', emoji: '📚', color: 'gray' },
    { name: 'Fantasy', emoji: '🐉', color: 'lavender' },
    { name: 'Romance', emoji: '💖', color: 'peach' },
    { name: 'Horror', emoji: '👻', color: 'gray' },
    { name: 'Mystery', emoji: '🕵️‍♀️', color: 'mint' },
    { name: 'Sci-Fi', emoji: '🚀', color: 'sunshine' },
  ];

  const books: Book[] = [
    {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: 299,
      originalPrice: 399,
      rating: 5,
      reviews: 1250,
      cover: '',
      genre: 'Fantasy'
    },
    {
      id: '2',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      price: 350,
      rating: 5,
      reviews: 2100,
      cover: '',
      genre: 'Romance'
    },
    {
      id: '3',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      price: 450,
      originalPrice: 599,
      rating: 4,
      reviews: 890,
      cover: '',
      genre: 'Sci-Fi'
    },
    {
      id: '4',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      price: 250,
      rating: 4,
      reviews: 1560,
      cover: '',
      genre: 'Mystery'
    },
    {
      id: '5',
      title: 'Mexican Gothic',
      author: 'Silvia Moreno-Garcia',
      price: 320,
      rating: 4,
      reviews: 756,
      cover: '',
      genre: 'Horror'
    },
    {
      id: '6',
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      price: 380,
      rating: 4,
      reviews: 934,
      cover: '',
      genre: 'Sci-Fi'
    }
  ];

  const filteredBooks = books.filter(book => {
    const genreMatch = selectedGenre === 'All' || book.genre === selectedGenre;
    const priceMatch = book.price >= priceRange[0] && book.price <= priceRange[1];
    return genreMatch && priceMatch;
  });

  const addToCart = (book: Book) => {
    setCart(prev => [...prev, book]);
    
    // Show confetti effect
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎉';
    confetti.className = 'fixed text-4xl pointer-events-none z-50 animate-bounce';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 2000);
  };

  return (
    <section id="books" className="py-20 bg-gradient-to-br from-lavender-50 via-white to-mint-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-poppins bg-gradient-to-r from-lavender-600 to-mint-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Books
          </h2>
          <p className="text-xl text-gray-600">Curated collections just for you! ✨</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-lavender-100">
          {/* Genre Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Browse by Genre</h3>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.name}
                  onClick={() => setSelectedGenre(genre.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                    selectedGenre === genre.name
                      ? 'bg-gradient-to-r from-lavender-500 to-mint-500 text-white shadow-lg'
                      : 'bg-lavender-100 text-lavender-700 hover:bg-lavender-200'
                  }`}
                >
                  <span>{genre.emoji}</span>
                  <span>{genre.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Price Range</h3>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">₹{priceRange[0]}</span>
              <input
                type="range"
                min="100"
                max="2000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1 h-2 bg-lavender-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-600">₹{priceRange[1]}</span>
            </div>
          </div>

          {/* Format Filters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Format</h3>
            <div className="flex flex-wrap gap-3">
              {['All', 'Hardcover 📕', 'eBook 📱'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                    selectedFormat === format
                      ? 'bg-gradient-to-r from-peach-400 to-sunshine-400 text-white shadow-lg'
                      : 'bg-peach-100 text-peach-700 hover:bg-peach-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book, index) => (
            <div
              key={book.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BookCard book={book} onAddToCart={addToCart} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No books here! That's sus 🤨</h3>
            <p className="text-gray-600">Try adjusting your filters to find more books.</p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setPriceRange([100, 2000]);
                setSelectedFormat('All');
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-lavender-500 to-mint-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Reset Filters ✨
            </button>
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-4 border border-lavender-200 animate-bounce-gentle">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🛒</div>
              <div>
                <div className="font-semibold text-gray-800">{cart.length} items in cart</div>
                <div className="text-sm text-gray-600">
                  Total: ₹{cart.reduce((sum, book) => sum + book.price, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksSection;
