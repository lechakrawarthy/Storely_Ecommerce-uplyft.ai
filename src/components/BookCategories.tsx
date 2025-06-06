import React from 'react';
import { Sparkles, Heart, Zap } from 'lucide-react';

const categories = [
  {
    name: 'Kids',
    icon: <Sparkles className="w-7 h-7 text-green-500 mb-2" />,
    books: 12,
    bg: 'from-white to-green-50',
    text: 'text-green-700',
  },
  {
    name: 'Love',
    icon: <Heart className="w-7 h-7 text-pink-400 mb-2" />,
    books: 8,
    bg: 'from-white to-pink-50',
    text: 'text-pink-500',
  },
  {
    name: 'Thriller',
    icon: <Zap className="w-7 h-7 text-yellow-400 mb-2" />,
    books: 15,
    bg: 'from-white to-yellow-50',
    text: 'text-yellow-500',
  },
];

const BookCategories = () => (
  <section id="categories" className="w-full py-8">
    <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Categories
      </h2>
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">📚</span>
        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Explore by Category
        </span>
        <span className="text-2xl">📖</span>
      </div>
      <p className="text-base text-green-700 text-center mb-8">
        Find your perfect read in these popular genres
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`flex-1 bg-gradient-to-br ${cat.bg} rounded-2xl p-6 flex flex-col items-center min-w-[180px]`}
          >
            {cat.icon}
            <div className={`font-semibold text-lg mb-1 ${cat.text}`}>
              {cat.name}
            </div>
            <div className="text-sm text-gray-500">
              {cat.books} books available
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BookCategories;
