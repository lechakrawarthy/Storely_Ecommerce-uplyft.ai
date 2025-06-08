import React from 'react';
import { Loader2 } from '../utils/icons';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { useIsMobile } from '../hooks/use-mobile';
import MobileLoadingAnimations from './MobileLoadingAnimations';

interface InfiniteScrollLoaderProps {
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    className?: string;
    threshold?: number;
    rootMargin?: string;
    disabled?: boolean;
    loadingText?: string;
    endText?: string;
}

const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage,
    className = '',
    threshold = 1,
    rootMargin = '100px',
    disabled = false,
    loadingText = 'Loading more...',
    endText = 'No more items to load',
}) => {
    const isMobile = useIsMobile();
    const { ref } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        threshold,
        rootMargin,
        disabled,
    });

    if (!hasNextPage && !isFetchingNextPage) {
        return (
            <div className={`flex items-center justify-center py-8 ${className}`}>
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{endText}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`flex items-center justify-center py-8 ${className}`}
        >      {isFetchingNextPage ? (
            <div className="flex flex-col items-center gap-3">
                {isMobile ? (
                    <MobileLoadingAnimations type="dots" size="sm" />
                ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                )}
                <span className="text-sm text-gray-500 font-medium">
                    {loadingText}
                </span>
            </div>
        ) : (
            <div className="flex items-center gap-3">
                {isMobile ? (
                    <MobileLoadingAnimations type="pulse" size="sm" />
                ) : (
                    <>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-200"></div>
                    </>
                )}
            </div>
        )}
        </div>
    );
};

export default InfiniteScrollLoader;
