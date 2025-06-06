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
    <section id="products" className="w-full my-12">
      <div className="bg-white w-full flex flex-col p-0">
        <div className="px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 text-left">Explore Products</h2>
          {/* Filters (genre chips, price slider) */}
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((g) => (
              <button
                key={g.name}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition ${selectedGenre === g.name ? 'bg-lime-300 border-lime-400 text-black' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-lime-100'}`}
                onClick={() => setSelectedGenre(g.name)}
              >
                <span className="mr-1">{g.emoji}</span>{g.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-gray-500">Price:</span>
            <input
              type="range"
              min={100}
              max={2000}
              value={priceRange[0]}
              onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="accent-lime-400"
            />
            <span className="text-xs text-gray-700">₹{priceRange[0]}</span>
            <span className="mx-1 text-xs text-gray-400">-</span>
            <input
              type="range"
              min={100}
              max={2000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="accent-lime-400"
            />
            <span className="text-xs text-gray-700">₹{priceRange[1]}</span>
          </div>
          {/* Accent Bar: Popular Genres */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Popular Genres</span>
            <span className="w-5 h-5 rounded-full bg-blue-400 inline-block"></span>
            <span className="w-5 h-5 rounded-full bg-red-400 inline-block"></span>
            <span className="w-5 h-5 rounded-full bg-green-400 inline-block"></span>
            <span className="w-5 h-5 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-5 h-5 rounded-full bg-cyan-300 inline-block"></span>
          </div>
          {/* Sort By Dropdown */}
          <div className="flex justify-end mb-4">
            <label htmlFor="sort" className="mr-2 text-sm text-gray-600 font-medium">Sort By:</label>
            <select
              id="sort"
              className="border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300"
            // onChange handler to be implemented for sorting logic
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 pb-8">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
              <img src="/placeholder.svg" alt={book.title} className="w-32 h-40 object-cover rounded-xl mb-3 shadow" />
              <div className="font-bold text-lg text-gray-800 mb-1 text-center">{book.title}</div>
              <div className="text-xs text-gray-500 mb-1">by {book.author}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-lime-200 text-lime-800 rounded-full px-2 py-1 text-xs font-semibold">{book.rating}★</span>
                <span className="text-xs text-gray-400">({book.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-lime-600">₹{book.price}</span>
                {book.originalPrice && <span className="text-xs text-gray-400 line-through">₹{book.originalPrice}</span>}
              </div>
              <button
                onClick={() => addToCart(book)}
                className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-4 py-2 rounded-full transition mt-auto"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BooksSection;
