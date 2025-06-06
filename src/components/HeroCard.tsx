import React from "react";
import { ArrowRight, Twitter, Instagram, Youtube, Linkedin, Heart } from "lucide-react";

const HeroCard = () => {
    const handleViewAll = () => {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            {/* Main Bento Grid */}
            <div className="grid grid-cols-12 grid-rows-8 gap-4 h-[600px]">
                {/* Main Hero Card - Large Left Section */}
                <div className="col-span-8 row-span-6 glass-card rounded-3xl p-8 flex items-center justify-between relative overflow-hidden shadow-lg">
                    {/* Left Content */}
                    <div className="flex-1 z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-500">🎵 Music is Classic</span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Sequoia Inspiring<br />
                            Musico.
                        </h1>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-light text-gray-300">01</span>
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-gray-800 mb-1">Clear Sounds</div>
                                <div className="text-sm text-gray-500">Making your dream music come true<br />stay with Sequios Sounds!</div>
                            </div>
                        </div>
                        <button
                            onClick={handleViewAll}
                            className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all"
                        >
                            View All Products
                            <div className="bg-black text-lime-300 rounded-full p-1">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4 mt-8">
                            <span className="text-sm text-gray-500">Follow us on:</span>                            <Twitter className="w-5 h-5 text-gray-400 hover:text-pastel-400 cursor-pointer" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer" />
                            <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-sage-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* Right Product Image */}
                    <div className="flex-1 flex items-center justify-center relative">
                        <img
                            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80"
                            alt="Blue Headphones"
                            className="w-80 h-80 object-contain z-10"
                        />
                        {/* Floating dots */}
                        <div className="absolute top-20 left-10 w-2 h-2 bg-gray-300 rounded-full"></div>                        <div className="absolute top-32 right-16 w-3 h-3 bg-pastel-400 rounded-full"></div>
                        <div className="absolute bottom-32 left-20 w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="absolute bottom-20 right-10 w-2 h-2 bg-sage-600 rounded-full"></div>
                    </div>
                </div>                {/* Popular Colors Card */}
                <div className="col-span-4 row-span-2 glass-strong rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Colors</h3>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 bg-pastel-500 rounded-full"></div>
                        <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                        <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                        <div className="w-6 h-6 bg-cyan-400 rounded-full"></div>
                    </div>
                </div>

                {/* New Gen X-Bud Card */}
                <div className="col-span-4 row-span-2 glass-strong rounded-2xl p-4 flex flex-col shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-800">New Gen<br />X-Bud</h4>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=300&q=80"
                        alt="Earbuds"
                        className="w-full h-20 object-contain mt-2"
                    />
                </div>

                {/* Light Grey Surface Headphone Card */}
                <div className="col-span-4 row-span-2 glass-strong rounded-2xl p-4 flex flex-col shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-800">Light Grey Surface<br />Headphone</h4>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Boosted with bass</div>
                    <img
                        src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80"
                        alt="VR Headset"
                        className="w-full h-16 object-contain"
                    />
                </div>

                {/* Bottom Row Cards */}
                {/* More Products Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">More Products</h4>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                    <div className="text-xs text-gray-500 mb-3">460 plus items</div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-400 rounded-lg"></div>
                    </div>
                </div>

                {/* Reviews Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">                    <div className="flex -space-x-2 mb-2">
                    <div className="w-8 h-8 bg-sage-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                </div>
                    <div className="text-2xl font-bold text-white bg-pastel-500 rounded-full w-12 h-12 flex items-center justify-center mb-1">5m+</div>
                    <div className="text-xs text-gray-500">46 reviews</div>
                </div>

                {/* Popular Badge Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col shadow-sm">
                    <div className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full w-fit mb-2">🔥 Popular</div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Listening Has Been Released</h4>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                    </div>
                </div>

                {/* AR/VR Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1592478411213-6153e4ebc696?auto=format&fit=crop&w=200&q=80"
                        alt="AR Device"
                        className="w-full h-12 object-contain mb-2"
                    />
                    <div className="bg-yellow-400 text-black text-xs px-2 py-1 rounded w-fit">4.7</div>
                </div>
            </div>
        </div>
    );
};

export default HeroCard;
