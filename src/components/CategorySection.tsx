import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, BookOpen, Shirt, ArrowRight, Star, TrendingUp } from "../utils/icons";
import OptimizedImage from "./OptimizedImage";

const categories = [
    {
        name: "Books",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
        icon: BookOpen,
        description: "Discover captivating stories, expand your knowledge, and embark on literary adventures",
        cta: "Explore Books",
        stats: "10,000+ titles",
        badge: "Bestsellers",
        features: ["Fiction & Non-Fiction", "Educational Materials", "Digital & Physical"]
    },
    {
        name: "Electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        icon: Monitor,
        description: "Latest cutting-edge technology, innovative gadgets, and premium tech accessories",
        cta: "Shop Electronics",
        stats: "500+ products",
        badge: "Latest Tech",
        features: ["Smartphones & Tablets", "Audio Equipment", "Smart Devices"]
    },
    {
        name: "Textiles",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        icon: Shirt,
        description: "Trendy fashion, premium quality fabrics, and stylish apparel for every occasion",
        cta: "Browse Fashion",
        stats: "2,000+ items",
        badge: "Trending",
        features: ["Men's & Women's Wear", "Home Textiles", "Accessories"]
    },
];

const CategorySection = () => {
    return (
        <section id="categories" className="w-full py-20 relative">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Explore our carefully curated collections designed to meet all your needs with premium quality and unbeatable prices
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="group relative overflow-hidden rounded-3xl glass-card border border-white/20 hover:glass-strong transition-all duration-500 transform hover:-translate-y-2 shadow-xl hover:shadow-2xl category-card-glow"
                        >                            {/* Background Image with Glass Overlay */}
                            <div className="relative h-96 overflow-hidden">
                                <OptimizedImage
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    width={800}
                                    height={384}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-500" />

                                {/* Decorative Elements */}
                                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100" />
                                <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                                {/* Top Content */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                            <category.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-white transition-colors">
                                                {category.name}
                                            </h3>
                                            <span className="text-sm text-white/90 font-medium">{category.stats}</span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                                        <span className="text-xs font-semibold flex items-center gap-1 text-white/90">
                                            <TrendingUp className="w-3 h-3" />
                                            {category.badge}
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom Content */}
                                <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-sm text-white/90 leading-relaxed">
                                        {category.description}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        {category.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 text-sm text-white/80 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                                                style={{ transitionDelay: `${idx * 100}ms` }}
                                            >
                                                <Star className="w-3 h-3 fill-current text-white flex-shrink-0" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        className="w-full bg-white/10 border border-white/30 hover:bg-white/20 hover:text-white text-white font-semibold py-3 rounded-xl transition-all duration-300 group/btn backdrop-blur-sm hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {category.cta}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* Enhanced Hover Effect Border */}
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />

                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <div className="text-center glass-strong rounded-2xl p-8 border border-white/20 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sage-50/50 to-pastel-50/50 opacity-50" />
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-sage-200/30 to-pastel-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-pastel-200/30 to-sage-200/30 rounded-full blur-2xl" />

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Can't find what you're looking for?
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                            Browse our complete collection or use our advanced search to find exactly what you need.
                            We're constantly adding new products to enhance your shopping experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                View All Products
                            </Button>
                            <Button variant="outline" className="glass-subtle border-2 border-white/30 hover:glass-strong text-gray-700 hover:text-gray-900 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
