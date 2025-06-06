import React from 'react';

const ProductStats = () => (
    <section id="stats">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 mt-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500 mb-1">More Products</div>
                    <div className="font-bold text-lg mb-2">460 plus items.</div>
                    <div className="flex gap-2">
                        <img src="/placeholder.svg" alt="product1" className="w-8 h-8 rounded-full" />
                        <img src="/placeholder.svg" alt="product2" className="w-8 h-8 rounded-full" />
                        <img src="/placeholder.svg" alt="product3" className="w-8 h-8 rounded-full" />
                        <img src="/placeholder.svg" alt="product4" className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="font-bold text-2xl mb-1">5m+</div>
                    <div className="text-gray-500 text-xs mb-2">Downloads</div>
                    <div className="flex items-center gap-1">
                        <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold">4.6 reviews</span>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500 mb-1">Popular</div>
                    <div className="font-bold text-lg mb-2">Listening Has Been Released</div>
                    <div className="flex gap-2">
                        <img src="/placeholder.svg" alt="avatar1" className="w-8 h-8 rounded-full" />
                        <img src="/placeholder.svg" alt="avatar2" className="w-8 h-8 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold">4.7</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default ProductStats;
