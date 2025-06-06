
import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import BookCategories from '../components/BookCategories';
import ChatbotSection from '../components/ChatbotSection';
import BooksSection from '../components/BooksSection';
import ChatbotFloat from '../components/ChatbotFloat';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BookCategories />
      <BooksSection />
      <ChatbotSection />
      <ChatbotFloat />
    </div>
  );
};

export default Index;
