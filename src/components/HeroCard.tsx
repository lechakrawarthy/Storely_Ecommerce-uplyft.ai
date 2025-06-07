import React from "react";
import { ArrowRight, Twitter, Instagram, Youtube, Linkedin, Heart, Package, Truck, Shield } from "lucide-react";

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
                            <span className="text-sm text-gray-500">🛍️ Shop with Confidence</span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Storely<br />
                            Experience.
                        </h1>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-light text-gray-300">01</span>
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-gray-800 mb-1">Premium Quality</div>
                                <div className="text-sm text-gray-500">Discover amazing products from top brands<br />with guaranteed quality and fast delivery!</div>
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
                            <span className="text-sm text-gray-500">Follow us on:</span>
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-pastel-400 cursor-pointer" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer" />
                            <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-sage-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* Right Product Image */}
                    <div className="flex-1 flex items-center justify-center relative">
                        <img
                            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&q=80"
                            alt="Shopping Experience"
                            className="w-80 h-80 object-contain z-10"
                        />
                        {/* Floating dots */}
                        <div className="absolute top-20 left-10 w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="absolute top-32 right-16 w-3 h-3 bg-pastel-400 rounded-full"></div>
                        <div className="absolute bottom-32 left-20 w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="absolute bottom-20 right-10 w-2 h-2 bg-sage-600 rounded-full"></div>
                    </div>
                </div>

                {/* Store Features Card */}
                <div className="col-span-4 row-span-2 glass-strong rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose Us</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Fast Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">Secure Shopping</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600">Quality Products</span>
                        </div>
                    </div>
                </div>                {/* New Gen X-Bud Card */}
                <div className="col-span-4 row-span-2 glass-strong rounded-2xl p-4 flex flex-col shadow-md hover:shadow-lg transition-all cursor-pointer group" onClick={handleViewAll}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-800">Premium<br />Electronics</h4>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Latest Technology</div>
                    <img
                        src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=300&q=80"
                        alt="Electronics"
                        className="w-full h-20 object-contain mt-2 group-hover:scale-105 transition-transform"
                    />
                </div>

                {/* Fashion & Textiles Card */}
                <div className="col-span-4 row-span-2 glass-strong rounded-2xl p-4 flex flex-col shadow-md hover:shadow-lg transition-all cursor-pointer group" onClick={handleViewAll}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-800">Fashion &<br />Textiles</h4>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Trendy & Comfortable</div>
                    <img
                        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80"
                        alt="Fashion"
                        className="w-full h-16 object-contain group-hover:scale-105 transition-transform"
                    />
                </div>

                {/* Bottom Row Cards */}                {/* More Products Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">Best Sellers</h4>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                    <div className="text-xs text-gray-500 mb-3">500+ products</div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                            <Truck className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>                {/* Customer Reviews Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                    <div className="flex -space-x-2 mb-2">
                        <div className="w-8 h-8 bg-sage-500 rounded-full"></div>
                        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                        <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                    </div>
                    <div className="text-2xl font-bold text-white bg-pastel-500 rounded-full w-12 h-12 flex items-center justify-center mb-1">4.8</div>
                    <div className="text-xs text-gray-500">2.4k reviews</div>
                </div>                {/* Trending Badge Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col shadow-sm">
                    <div className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full w-fit mb-2">🔥 Trending</div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">New Books Collection</h4>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                        <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                    </div>
                </div>                {/* Smart Devices Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">Smart Devices</h4>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=200&q=80"
                        alt="Smart Watch"
                        className="w-full h-12 object-contain mb-2"
                    />
                    <div className="bg-yellow-400 text-black text-xs px-2 py-1 rounded w-fit">4.7</div>
                </div>
            </div>
        </div>
    );
};

export default HeroCard;
