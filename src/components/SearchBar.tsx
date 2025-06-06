import React, { useState } from 'react';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Searching for: ${query}`);
    };
    return (
        <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-2xl shadow-md px-6 py-4 mb-4">
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, categories, or brands..."
                className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
            />
            <button type="submit" className="ml-3 bg-black text-white rounded-full p-2 hover:bg-gray-800 transition">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
        </form>
    );
};

export default SearchBar;
