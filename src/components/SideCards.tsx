import React from 'react';

const SideCards = () => (
    <>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
            <div className="font-bold text-lg mb-2">New Gen X-Bud</div>
            <img src="/placeholder.svg" alt="X-Bud" className="w-24 h-24 object-contain rounded-xl mb-2" />
            <button
                onClick={() => alert('Viewing New Gen X-Bud details')}
                className="mt-2 bg-black text-white rounded-full px-4 py-2 flex items-center gap-1 hover:bg-gray-800 transition"
            >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
            <div className="font-bold text-lg mb-2">Light Grey Surface Headphone</div>
            <img src="/placeholder.svg" alt="Surface Headphone" className="w-24 h-24 object-contain rounded-xl mb-2" />
            <div className="text-xs text-gray-500">Boosted with bass</div>
            <button
                onClick={() => alert('Viewing Light Grey Surface Headphone details')}
                className="mt-2 bg-black text-white rounded-full px-4 py-2 flex items-center gap-1 hover:bg-gray-800 transition"
            >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
        </div>
    </>
);

export default SideCards;
