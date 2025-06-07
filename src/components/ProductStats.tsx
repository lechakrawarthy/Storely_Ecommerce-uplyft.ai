import React from "react";

const ProductStats = () => (
    <section className="w-full mt-8">
        <div className="flex flex-row gap-6 justify-between">
            {/* More Products */}
            <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">More Products</div>
                <div className="font-bold text-lg mb-2">460 plus items.</div>
                <div className="flex gap-2">
                    <img src="/placeholder.svg" alt="product1" className="w-8 h-8 rounded-full" />
                    <img src="/placeholder.svg" alt="product2" className="w-8 h-8 rounded-full" />
                    <img src="/placeholder.svg" alt="product3" className="w-8 h-8 rounded-full" />
                </div>
            </div>
            {/* Downloads */}
            <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <div className="flex flex-col items-center">                    <div className="bg-pastel-200 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-pastel-700">5m+</span>
                </div>
                    <div className="text-gray-500 text-xs mb-2">Downloads</div>
                    <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold">4.6 reviews</span>
                </div>
            </div>
            {/* Popular */}
            <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">Popular</div>
                <div className="font-bold text-lg mb-2">Listening Has Been Released</div>
                <div className="flex gap-2">
                    <img src="/placeholder.svg" alt="avatar1" className="w-8 h-8 rounded-full" />
                    <img src="/placeholder.svg" alt="avatar2" className="w-8 h-8 rounded-full" />
                </div>
                <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold mt-2">4.7</span>
            </div>
        </div>
    </section>
);

export default ProductStats;
