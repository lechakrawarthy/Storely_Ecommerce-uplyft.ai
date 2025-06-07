import React from 'react';
import { Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass-card border-t border-white/20 backdrop-blur-lg mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-black text-gray-900">S</div>
                            <span className="text-xl font-medium text-gray-900">torely</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Your premium destination for books, electronics, and textiles.
                            Experience the future of shopping with our intelligent chatbot assistant.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                            <span>Made with love for premium shopping</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Home', 'Products', 'Categories', 'About Us', 'Contact', 'Help Center'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-lime-600 transition-colors text-sm font-medium"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg">Categories</h3>
                        <ul className="space-y-2">
                            {['Electronics', 'Books & Literature', 'Fashion & Textiles', 'Smart Accessories', 'Home & Living', 'Tech Gadgets'].map((category) => (
                                <li key={category}>
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-lime-600 transition-colors text-sm font-medium"
                                    >
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg">Get In Touch</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="glass-subtle p-2 rounded-lg border border-white/20">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span>hello@Storely.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="glass-subtle p-2 rounded-lg border border-white/20">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span>+91 9848022338</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="glass-subtle p-2 rounded-lg border border-white/20">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span>Hindupur, AP</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="pt-4">
                            <h4 className="font-medium text-gray-900 mb-3">Follow Us</h4>
                            <div className="flex items-center gap-3">
                                {[
                                    { icon: Instagram, color: 'hover:text-pink-500' }, { icon: Twitter, color: 'hover:text-pastel-400' },
                                    { icon: Facebook, color: 'hover:text-sage-600' },
                                    { icon: Linkedin, color: 'hover:text-sage-700' }
                                ].map(({ icon: Icon, color }, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className={`glass-subtle p-2 rounded-lg border border-white/20 text-gray-600 ${color} transition-all hover:glass-strong hover:border-white/30`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="glass-strong rounded-2xl p-6 mb-8 border border-white/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">Stay Updated</h3>
                            <p className="text-gray-600 text-sm">Get the latest updates on new products and exclusive offers.</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 rounded-full glass-subtle border border-white/20 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:glass-strong text-sm"
                            />
                            <button className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="glass-subtle rounded-xl p-4 border border-white/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span>© {currentYear}</span>
                            <div className="flex items-center gap-1">
                                <div className="text-lg font-black text-gray-900">S</div>
                                <span className="font-medium text-gray-900">torely.</span>
                            </div>
                            <span>All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-lime-600 transition-colors font-medium">Privacy Policy</a>
                            <a href="#" className="hover:text-lime-600 transition-colors font-medium">Terms of Service</a>
                            <a href="#" className="hover:text-lime-600 transition-colors font-medium">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
