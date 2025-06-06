
import React from 'react';
import { Heart, Zap, Ghost, Smile, Globe, Sparkles } from 'lucide-react';

const BookCategories = () => {
  const categories = [
    { name: 'Kids', icon: Sparkles, color: 'gold', books: 12 },
    { name: 'Love', icon: Heart, color: 'pastel', books: 8 },
    { name: 'Thriller', icon: Zap, color: 'sage', books: 15 },
    { name: 'Horror', icon: Ghost, color: 'cream', books: 6 },
    { name: 'Humorous', icon: Smile, color: 'gold', books: 10 },
    { name: 'Adventure', icon: Globe, color: 'sage', books: 9 },
  ];

  return (
    <section id="categories" className="py-20 bg-gradient-to-br from-cream-50 to-pastel-50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-book top-24 left-10 text-2xl opacity-20">📚</div>
        <div className="floating-book top-32 right-20 text-2xl opacity-20">📖</div>
        <div className="floating-book bottom-40 left-1/4 text-2xl opacity-20">📘</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="glass-gold p-3 rounded-full">
              <div className="text-3xl">📚</div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins bg-gradient-to-r from-pastel-600 to-sage-600 bg-clip-text text-transparent">
              Explore by Category
            </h2>
          </div>
          <p className="text-lg text-sage-600">Find your perfect read in these popular genres</p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-6 min-w-max px-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className="category-card glass p-6 rounded-2xl min-w-[200px] cursor-pointer shadow-soft hover:shadow-soft-hover transition-all duration-300 group hover:bg-gradient-to-br hover:from-cream-100/80 hover:to-pastel-100/60"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <IconComponent className={`w-8 h-8 text-${category.color}-600 mx-auto mb-4 group-hover:text-${category.color}-700 transition-colors duration-300`} />
                    <h3 className="font-semibold text-sage-800 mb-2 group-hover:text-pastel-700 transition-colors duration-300">{category.name}</h3>
                    <p className="text-sm text-sage-600 group-hover:text-sage-700 transition-colors duration-300">{category.books} books available</p>
                    <div className={`w-full h-2 bg-${category.color}-200 rounded-full mt-4`}>
                      <div 
                        className={`h-2 bg-gradient-to-r from-${category.color}-400 to-${category.color}-500 rounded-full transition-all duration-500 group-hover:from-${category.color}-500 group-hover:to-${category.color}-600`} 
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCategories;
