import React from 'react';

const HeroCard = () => {
    const handleViewAll = () => {
        const el = document.getElementById('stats');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 relative">
            <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 mb-2">Music is Classic</div>
                <h1 className="text-4xl font-bold mb-2 leading-tight">Sequoia Inspiring Musico.</h1>
                <p className="text-gray-600 mb-6">Clear Sounds<br />Making your dream music come true stay with Sequoia Sounds!</p>
                <button
                    onClick={handleViewAll}
                    className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-6 py-3 rounded-full transition flex items-center gap-2"
                >
                    View All Products
                    <span className="inline-block bg-black text-lime-300 rounded-full p-1 ml-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </span>
                </button>
                <div className="flex items-center gap-3 mt-6">
                    <span className="text-gray-500">Follow us on:</span>
                    <div className="flex gap-2">
                        <a href="#" className="hover:opacity-80"><img src="/placeholder.svg" alt="tiktok" className="w-6 h-6" /></a>
                        <a href="#" className="hover:opacity-80"><img src="/placeholder.svg" alt="twitter" className="w-6 h-6" /></a>
                        <a href="#" className="hover:opacity-80"><img src="/placeholder.svg" alt="instagram" className="w-6 h-6" /></a>
                        <a href="#" className="hover:opacity-80"><img src="/placeholder.svg" alt="linkedin" className="w-6 h-6" /></a>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex justify-center items-center relative">
                <img src="/placeholder.svg" alt="Headphones" className="w-64 h-64 object-contain rounded-2xl shadow-lg" />
            </div>
            {/* Popular Colors */}
            <div className="absolute top-6 right-6 bg-white rounded-xl shadow px-4 py-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Popular Colors</span>
                <span className="w-5 h-5 rounded-full bg-blue-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-red-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-green-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-cyan-300 inline-block"></span>
            </div>
        </div>
    );
};

export default HeroCard;
