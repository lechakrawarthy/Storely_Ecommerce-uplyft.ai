import React from 'react';

const UserProfile = () => (
    <div className="fixed top-6 right-8 flex items-center gap-3 z-50">
        <button className="bg-white rounded-full shadow p-2 hover:bg-gray-100 transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-.5.5-.5-.5a5.5 5.5 0 0 0-7.8 7.8l.5.5L12 21.3l7.3-7.3.5-.5a5.5 5.5 0 0 0 0-7.8z" /></svg>
        </button>
        <button className="bg-white rounded-full shadow p-2 hover:bg-gray-100 transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        </button>
        <div className="flex items-center gap-2 bg-white rounded-full shadow px-3 py-1">
            <img src="/placeholder.svg" alt="User" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-gray-700">Ryman Alex</span>
        </div>
    </div>
);

export default UserProfile;
