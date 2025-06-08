import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const Cart = () => {
    const { items, total, itemCount, isOpen, removeItem, updateQuantity, setCartOpen, clearCart } = useCart();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setCartOpen(false)}
            />

            {/* Cart Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md glass-card border-l border-white/20 z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20 glass-strong">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-gray-800" />
                        <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                        <span className="bg-lime-300 text-black text-sm font-semibold px-2 py-1 rounded-full">
                            {itemCount}
                        </span>
                    </div>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 glass-subtle rounded-full hover:glass-strong transition-all border border-white/20"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 mb-6">Add some products to get started!</p>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="glass-subtle rounded-xl p-4 border border-white/20">                                <div className="flex items-start gap-4">
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 mb-1 truncate">{item.title}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{item.category} • {item.color}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-lime-600">₹{item.price}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center glass-subtle rounded-full hover:glass-strong transition-all border border-white/20"
                                            >
                                                <Minus className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center glass-subtle rounded-full hover:glass-strong transition-all border border-white/20"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/20 glass-strong">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-800">Total:</span>
                            <span className="text-2xl font-bold text-lime-600">₹{total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to="/checkout"
                                className="block w-full bg-lime-300 hover:bg-lime-400 text-black font-semibold py-3 rounded-full text-center transition-all shadow-md hover:shadow-lg"
                                onClick={() => setCartOpen(false)}
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCartOpen(false)}
                                    className="flex-1 glass-subtle hover:glass-strong border border-white/20 text-gray-700 font-medium py-2 rounded-full transition-all"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="flex-1 text-red-600 hover:bg-red-50 font-medium py-2 rounded-full transition-colors border border-red-200"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
