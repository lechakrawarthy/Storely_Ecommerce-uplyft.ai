import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Grid } from '../utils/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useSwipe } from '../hooks/use-swipe';
import { allProducts, type Product } from '../data/products';

interface MobileProductNavigationProps {
    currentProduct: Product;
    className?: string;
}

const MobileProductNavigation: React.FC<MobileProductNavigationProps> = ({
    currentProduct,
    className = ''
}) => {
    const navigate = useNavigate();
    const { id: currentId } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showIndicator, setShowIndicator] = useState(false);

    // Find current product index
    useEffect(() => {
        const index = allProducts.findIndex(product => product.id === currentProduct.id);
        setCurrentIndex(index);
    }, [currentProduct.id]);

    const navigateToProduct = (direction: 'prev' | 'next') => {
        let newIndex = currentIndex;

        if (direction === 'prev' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'next' && currentIndex < allProducts.length - 1) {
            newIndex = currentIndex + 1;
        }

        if (newIndex !== currentIndex) {
            const newProduct = allProducts[newIndex];
            navigate(`/product/${newProduct.id}`);

            // Show navigation indicator briefly
            setShowIndicator(true);
            setTimeout(() => setShowIndicator(false), 2000);
        }
    };

    // Swipe gesture handling
    const { onTouchStart, onTouchEnd } = useSwipe({
        onSwipeLeft: () => navigateToProduct('next'),
        onSwipeRight: () => navigateToProduct('prev'),
        threshold: 100,
        velocity: 0.3,
    });

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allProducts.length - 1;
    const previousProduct = hasPrevious ? allProducts[currentIndex - 1] : null;
    const nextProduct = hasNext ? allProducts[currentIndex + 1] : null;

    return (
        <>
            {/* Gesture Area - Full width invisible overlay */}
            <div
                className={`fixed inset-0 z-10 lg:hidden ${className}`}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                style={{ pointerEvents: 'none' }}
            />

            {/* Navigation Indicators */}
            {showIndicator && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm lg:hidden">
                    <div className="flex items-center gap-2 text-sm">
                        <Grid className="w-4 h-4" />
                        <span>Swipe to navigate products</span>
                    </div>
                </div>
            )}

            {/* Navigation Pills */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 lg:hidden">
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                    {/* Previous Product */}
                    {hasPrevious && (
                        <button
                            onClick={() => navigateToProduct('prev')}
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <div className="text-xs">
                                <div className="font-medium truncate max-w-[80px]">
                                    {previousProduct?.title.split(' ').slice(0, 2).join(' ')}
                                </div>
                                <div className="text-white/70">Previous</div>
                            </div>
                        </button>
                    )}

                    {/* Current Position */}
                    <div className="px-3 py-1 text-xs">
                        <div className="font-medium">{currentIndex + 1}</div>
                        <div className="text-white/70">of {allProducts.length}</div>
                    </div>

                    {/* Next Product */}
                    {hasNext && (
                        <button
                            onClick={() => navigateToProduct('next')}
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <div className="text-xs text-right">
                                <div className="font-medium truncate max-w-[80px]">
                                    {nextProduct?.title.split(' ').slice(0, 2).join(' ')}
                                </div>
                                <div className="text-white/70">Next</div>
                            </div>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Swipe Hint - Show on first visit */}
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 lg:hidden">
                <div className="bg-blue-500/90 text-white px-4 py-2 rounded-full text-sm animate-bounce">
                    ← Swipe to browse products →
                </div>
            </div>
        </>
    );
};

export default MobileProductNavigation;
