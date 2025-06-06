import React, { useState } from "react";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search logic or callback
        alert(`Searching for: ${query}`);
    };
    return (
        <form onSubmit={handleSubmit} className="w-full flex items-center bg-white rounded-2xl shadow-lg px-6 py-4 mb-6 max-w-2xl mx-auto">
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, categories, or brands..."
                className="flex-1 bg-transparent outline-none text-lg text-gray-800 font-medium placeholder-gray-400"
            />
            <button type="submit" className="ml-4 p-2 rounded-full bg-lime-300 hover:bg-lime-400 transition">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
        </form>
    );
};

export default SearchBar;
