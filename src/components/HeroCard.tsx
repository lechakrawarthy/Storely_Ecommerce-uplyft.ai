import React from "react";
import { ArrowRight, Twitter, Instagram, Youtube, Linkedin, Heart, Package, Truck, Shield, Star, Gift, Sparkles, TrendingUp } from "../utils/icons";
import OptimizedImage from "./OptimizedImage";

const HeroCard = () => {
    const handleViewAll = () => {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }; return (
        <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
            {/* Main Bento Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:grid-rows-8 lg:h-[600px]">
                {/* Main Hero Card - Large Left Section */}
                <div className="lg:col-span-8 lg:row-span-8 glass-card rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-lg">
                    {/* Left Content */}
                    <div className="flex-1 z-10 text-center lg:text-left mb-6 lg:mb-0">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                            <span className="text-sm text-gray-500">🛍️ Shop with Confidence</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Storely<br />
                            Experience.
                        </h1>
                        <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
                            <span className="text-2xl lg:text-4xl font-light text-gray-300">01</span>
                            <div className="flex-1 text-center lg:text-left">
                                <div className="text-base lg:text-lg font-semibold text-gray-800 mb-1">Premium Quality</div>
                                <div className="text-sm text-gray-500">Discover amazing products from top brands<br className="hidden lg:block" />with guaranteed quality and fast delivery!</div>
                            </div>
                        </div>
                        <button
                            onClick={handleViewAll}
                            className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all mx-auto lg:mx-0"
                        >
                            View All Products
                            <div className="bg-black text-lime-300 rounded-full p-1">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>

                        {/* Social Icons */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                            <span className="text-sm text-gray-500 hidden sm:block">Follow us on:</span>
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                            <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                        </div>
                    </div>                    {/* Right Product Image */}
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                            <OptimizedImage
                                src="https://cdn2.hubspot.net/hubfs/53/ecommerce%20marketing.jpg"
                                alt="Shopping Cart and Products"
                                className="w-full h-full object-cover z-10"
                                priority={true}
                                width={320}
                                height={320}
                                sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                            />
                        </div>
                        {/* Floating dots - Hide on mobile for cleaner look */}
                        <div className="hidden lg:block absolute top-20 left-10 w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="hidden lg:block absolute top-32 right-16 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                        <div className="hidden lg:block absolute bottom-32 left-20 w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        <div className="hidden lg:block absolute bottom-20 right-10 w-2 h-2 bg-green-600 rounded-full animate-pulse delay-200"></div>
                    </div>
                </div>

                {/* Right Side Cards (Stacked) - Responsive */}
                <div className="lg:col-span-4 lg:row-span-8 flex flex-col gap-4">
                    {/* Why Choose Us Card */}
                    <div className="glass-strong rounded-2xl p-4 lg:p-6 shadow-md flex-1 flex flex-col justify-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center lg:text-left">Why Choose Us</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Truck className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Secure Shopping</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Quality Products</span>
                            </div>
                        </div>
                    </div>

                    {/* Premium Electronics Card */}
                    <div className="glass-strong rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group flex-1 flex flex-col" onClick={handleViewAll}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-semibold text-gray-800">Premium<br />Electronics</h4>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        <div className="text-xs text-gray-500 mb-3">Latest Technology</div>                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=400&q=80"
                                alt="Electronics"
                                className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                width={400}
                                height={64}
                                sizes="400px"
                            />
                        </div>
                    </div>

                    {/* Fashion & Textiles Card */}
                    <div className="glass-strong rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group flex-1 flex flex-col" onClick={handleViewAll}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-semibold text-gray-800">Fashion &<br />Textiles</h4>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        <div className="text-xs text-gray-500 mb-3">Trendy & Comfortable</div>                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80"
                                alt="Fashion"
                                className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                width={400}
                                height={64}
                                sizes="400px"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Row Cards */}
                {/* Best Sellers Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewAll}>
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
                </div>

                {/* Customer Reviews Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewAll}>
                    <div className="flex items-center justify-between w-full mb-1">
                        <h4 className="text-sm font-semibold text-gray-800">Reviews</h4>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <div className="flex -space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="text-2xl font-bold text-white bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center mb-1">4.8</div>
                    <div className="text-xs text-gray-500">2.4k reviews</div>
                </div>

                {/* New Arrivals Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewAll}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">New Arrivals</h4>
                        <Sparkles className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full w-fit mb-2">✨ Fresh</div>
                    <div className="text-xs text-gray-500 mb-2">Latest Collection</div>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                        <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                        <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
                    </div>
                </div>

                {/* Special Offers Card */}
                <div className="col-span-2 row-span-2 glass-subtle rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewAll}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">Special Offers</h4>
                        <Gift className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full w-fit mb-2">🎁 Sale</div>
                    <div className="text-xs text-gray-500 mb-2">Up to 50% off</div>
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold px-2 py-1 rounded w-fit">
                        Limited Time
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroCard;
