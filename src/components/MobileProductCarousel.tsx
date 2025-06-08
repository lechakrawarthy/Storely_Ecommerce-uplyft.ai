import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star } from '../utils/icons';
import { useSwipe } from '../hooks/use-swipe';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from './ui/use-toast';
import { Product } from '../data/products';
import OptimizedImage from './OptimizedImage';

interface MobileProductCarouselProps {
    products: Product[];
    title?: string;
    autoPlay?: boolean;
    autoPlayDelay?: number;
    showDots?: boolean;
    showArrows?: boolean;
    itemsPerView?: number;
}

const MobileProductCarousel: React.FC<MobileProductCarouselProps> = ({
    products,
    title = 'Featured Products',
    autoPlay = false,
    autoPlayDelay = 3000,
    showDots = true,
    showArrows = true,
    itemsPerView = 1,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { toast } = useToast();

    const totalSlides = Math.ceil(products.length / itemsPerView);

    const goToSlide = (index: number) => {
        if (index < 0) {
            setCurrentIndex(totalSlides - 1);
        } else if (index >= totalSlides) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(index);
        }
    };

    const nextSlide = () => {
        setIsTransitioning(true);
        goToSlide(currentIndex + 1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        goToSlide(currentIndex - 1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const swipeHandlers = useSwipe({
        onSwipeLeft: nextSlide,
        onSwipeRight: prevSlide,
    }, {
        threshold: 50,
        velocity: 0.3,
    });

    // Auto-play functionality
    useEffect(() => {
        if (autoPlay && products.length > itemsPerView) {
            autoPlayRef.current = setInterval(nextSlide, autoPlayDelay);
            return () => {
                if (autoPlayRef.current) {
                    clearInterval(autoPlayRef.current);
                }
            };
        }
    }, [autoPlay, autoPlayDelay, currentIndex, products.length, itemsPerView]);

    // Pause auto-play on hover/touch
    const handleInteractionStart = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
    };

    const handleInteractionEnd = () => {
        if (autoPlay && products.length > itemsPerView) {
            autoPlayRef.current = setInterval(nextSlide, autoPlayDelay);
        }
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
        toast({
            title: "Added to Cart",
            description: `${product.title} has been added to your cart.`,
            className: "bg-green-50 border-green-200 text-green-800",
        });
    };

    const handleWishlistToggle = (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(productId);
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>

            {/* Carousel Container */}
            <div
                className="relative overflow-hidden"
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
            >
                <div
                    ref={swipeHandlers.ref}
                    className={`flex transition-transform duration-300 ease-out ${isTransitioning ? '' : 'transition-none'
                        }`}
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                        width: `${totalSlides * 100}%`,
                    }}
                >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            className="flex"
                            style={{ width: `${100 / totalSlides}%` }}
                        >
                            {products
                                .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                                .map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex-1 p-4"
                                        style={{ width: `${100 / itemsPerView}%` }}
                                    >
                                        <div className="bg-gray-50 rounded-xl overflow-hidden group">
                                            {/* Product Image */}
                                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                                                <OptimizedImage
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={(e) => handleWishlistToggle(product.id, e)}
                                                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isInWishlist(product.id)
                                                        ? 'bg-red-500 text-white shadow-lg'
                                                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                                                        }`}
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''
                                                            }`}
                                                    />
                                                </button>

                                                {/* Quick Add to Cart */}
                                                <button
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    className="absolute bottom-3 right-3 p-2 bg-black/80 text-white rounded-full hover:bg-black transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-3 space-y-2">
                                                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                    {product.title}
                                                </h4>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1">
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < Math.floor(product.rating)
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        ({product.rating})
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₹{product.price}
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ₹{product.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {showArrows && totalSlides > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all z-10"
                            disabled={isTransitioning}
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all z-10"
                            disabled={isTransitioning}
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </>
                )}
            </div>

            {/* Dots Indicator */}
            {showDots && totalSlides > 1 && (
                <div className="flex justify-center gap-2 py-4">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-gray-800 w-6'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MobileProductCarousel;
