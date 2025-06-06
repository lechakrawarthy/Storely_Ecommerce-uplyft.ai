import React from "react";
import { ArrowRight } from "lucide-react";

const sideProducts = [
    {
        title: "New Gen X-Bud",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    },
    {
        title: "Light Grey Surface Headphone",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
];

const SideCards = () => (
    <aside className="flex flex-col gap-6">
        {/* Popular Colors */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 items-start">
            <span className="font-semibold text-gray-700 mb-2">Popular Colors</span>
            <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-pastel-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-red-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-green-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-5 h-5 rounded-full bg-cyan-300 inline-block"></span>
            </div>
        </div>
        {/* Product Highlights */}
        {sideProducts.map((prod) => (
            <div
                key={prod.title}
                className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 items-start hover:shadow-lg transition group cursor-pointer"
            >
                <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-28 object-cover rounded-xl mb-2"
                />
                <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-gray-800 text-base">
                        {prod.title}
                    </span>
                    <button className="ml-auto bg-gray-100 hover:bg-lime-200 rounded-full p-2 transition">
                        <ArrowRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>
        ))}
    </aside>
);

export default SideCards;
