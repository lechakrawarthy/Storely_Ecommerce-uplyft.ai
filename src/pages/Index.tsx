import React from 'react';
import SearchBar from '../components/SearchBar';
import HeroCard from '../components/HeroCard';
import ChatbotSection from '../components/ChatbotSection';
import ProductStats from '../components/ProductStats';
import SideCards from '../components/SideCards';
import UserProfile from '../components/UserProfile';
import BookCategories from '../components/BookCategories';
import BooksSection from '../components/BooksSection';
import SectionContainer from '../components/SectionContainer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-28 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Hero, Search, Chatbot, and Social */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <SectionContainer>
            <HeroCard />
          </SectionContainer>
          <SectionContainer title="Search">
            <SearchBar />
          </SectionContainer>
          <SectionContainer title="Categories">
            <BookCategories />
          </SectionContainer>
          <SectionContainer title="Explore Products">
            <BooksSection />
          </SectionContainer>
          <SectionContainer title="Chat with BookBuddy">
            <ChatbotSection />
          </SectionContainer>
          <SectionContainer title="Stats">
            <ProductStats />
          </SectionContainer>
        </section>
        {/* Right: Side Cards */}
        <aside className="flex flex-col gap-6">
          <SectionContainer title="Side Cards">
            <SideCards />
          </SectionContainer>
        </aside>
      </main>
      {/* User Profile (top right) */}
      <UserProfile />
    </div>
  );
};

export default Index;
