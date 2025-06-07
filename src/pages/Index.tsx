import React from 'react';
import Navigation from '../components/Navigation';
import HeroCard from '../components/HeroCard';
import ProductGrid from '../components/BooksSection';
import CategorySection from '../components/CategorySection';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative flex flex-col overflow-x-hidden">
      {/* Background decoration for glass effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 pointer-events-none"></div>
      <div className="fixed top-20 left-10 w-32 h-32 bg-pastel-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed bottom-32 left-1/4 w-40 h-40 bg-indigo-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <Navigation />
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 flex flex-col gap-10 pt-28 pb-24">
        <HeroCard />
        <CategorySection />
        <ProductGrid />
        <FAQ />      </main>
      <Footer />
    </div>
  );
};

export default Index;
