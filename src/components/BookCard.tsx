
import React, { useState } from 'react';
import OptimizedImage from './OptimizedImage';

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

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAddToCart = () => {
    setIsFlipped(true);
    onAddToCart(book);

    // Reset flip animation after 600ms
    setTimeout(() => setIsFlipped(false), 600);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-sunshine-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="book-card group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-lavender-100">
      {/* Book Cover */}
      <div className="relative overflow-hidden bg-gradient-to-br from-lavender-100 to-mint-100 h-64">
        <OptimizedImage
          src={book.cover}
          alt={`${book.title} cover`}
          className="w-full h-full"
          placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTdlNWZmO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2QzZjVmZjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2JnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNhOGE1ZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfk5Y8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk4OTVmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4="
        />

        {/* Genre Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-lavender-600">
          {book.genre}
        </div>

        {/* Discount Badge */}
        {book.originalPrice && (
          <div className="absolute top-2 left-2 bg-peach-400 text-white px-2 py-1 rounded-full text-xs font-bold">
            SALE
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 group-hover:text-lavender-600 transition-colors duration-200">
          {book.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3">by {book.author}</p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex">
            {renderStars(book.rating)}
          </div>
          <span className="text-sm text-gray-500">({book.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-lavender-600">₹{book.price}</span>
            {book.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{book.originalPrice}</span>
            )}
          </div>

          {/* Price Tag Bubble */}
          <div className="bg-mint-100 text-mint-700 px-3 py-1 rounded-full text-sm font-semibold">
            Best Price
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 page-flip ${isFlipped
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-lavender-500 to-mint-500 text-white hover:shadow-lg hover:scale-105'
            }`}
        >
          {isFlipped ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-lavender-400/10 to-mint-400/10 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default BookCard;
