import React from "react";
import { Heart, ShoppingCart, User } from "lucide-react";

const UserProfile = () => (
    <div className="fixed top-8 right-8 z-50 bg-white/90 rounded-full shadow-lg flex items-center gap-3 px-4 py-2 backdrop-blur border border-gray-100">
        <button className="hover:bg-gray-100 p-2 rounded-full">
            <Heart className="w-5 h-5 text-gray-700" />
        </button>
        <button className="hover:bg-gray-100 p-2 rounded-full">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
        </button>
        <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-gray-500" />
        </span>
        <span className="font-medium text-gray-700 ml-2">Ryman Alex</span>
    </div>
);

export default UserProfile;
