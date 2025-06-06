
import React from 'react';
import { MessageCircle } from 'lucide-react';

const HeroSection = () => {
  const scrollToChatbot = () => {
    const element = document.getElementById('chatbot');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cream-50 to-pastel-50 flex flex-col items-center justify-center pt-16"
    >
      {/* Floating Book Emojis */}
      <div className="floating-book top-24 left-10">📚</div>
      <div className="floating-book top-32 right-20">📖</div>
      <div className="floating-book top-60 left-1/4">📘</div>
      <div className="floating-book bottom-40 right-1/3">📗</div>
      <div className="floating-book bottom-60 left-20">📕</div>

      {/* Main Content */}
      <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-5xl sm:text-6xl lg:text-7xl mb-4 block">📚</span>
            <span className="bg-gradient-to-r from-pastel-600 via-sage-600 to-gold-600 bg-clip-text text-transparent">
              Your friendly AI book concierge
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-sage-700 font-medium mb-8 max-w-2xl mx-auto">
            Discover your next favorite read with personalized recommendations, 
            surprise book boxes, and intelligent chat assistance.
          </p>
        </div>

        {/* CTA Button */}
        <button 
          onClick={scrollToChatbot}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-pastel-500 to-sage-500 rounded-full shadow-soft hover:shadow-soft-hover transform hover:scale-105 transition-all duration-300 mb-16"
        >
          <span className="mr-3">Start Chatting</span>
          <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
