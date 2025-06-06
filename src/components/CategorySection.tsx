import React from "react";
import { FlipCard, FlipCardFront, FlipCardBack } from "@/components/ui/flip-card";
import { Button } from "@/components/ui/button";
import { Monitor, BookOpen, Shirt } from "lucide-react";

const categories = [
    {
        name: "Books",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        icon: BookOpen,
        description: "Explore a world of stories, knowledge, and adventure.",
        cta: "Browse Books",
        color: "bg-emerald-500",
    },
    {
        name: "Electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        icon: Monitor,
        description: "Latest gadgets, devices, and tech accessories.",
        cta: "Shop Electronics",
        color: "bg-blue-600",
    },
    {
        name: "Textiles",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
        icon: Shirt,
        description: "Trendy apparel, fabrics, and home textiles.",
        cta: "View Textiles",
        color: "bg-pink-500",
    },
];

const CategorySection = () => (
    <section id="categories" className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-900 text-center">Shop by Category</h2>
            <div className="flex flex-wrap justify-center gap-8">
                {categories.map((cat, i) => (
                    <FlipCard key={cat.name} className="h-80 w-72">
                        <FlipCardFront className="rounded-xl overflow-hidden">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="flex flex-col items-center justify-center py-4">
                                <cat.icon className="w-8 h-8 mb-2 text-gray-700" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">{cat.name}</h3>
                                <p className="text-gray-500 text-sm">{cat.description}</p>
                            </div>
                        </FlipCardFront>
                        <FlipCardBack className={`flex flex-col items-center justify-center rounded-xl px-4 py-6 text-center text-white ${cat.color}`}>
                            <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                            <p className="mb-4 text-sm">{cat.description}</p>
                            <Button className="rounded-full bg-white text-black hover:bg-gray-100 font-semibold">{cat.cta}</Button>
                        </FlipCardBack>
                    </FlipCard>
                ))}
            </div>
        </div>
    </section>
);

export default CategorySection;
