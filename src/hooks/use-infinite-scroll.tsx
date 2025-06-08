import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollOptions {
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    threshold?: number;
    rootMargin?: string;
    disabled?: boolean;
}

export const useInfiniteScroll = (options: InfiniteScrollOptions = {}) => {
    const {
        hasNextPage = false,
        isFetchingNextPage = false,
        fetchNextPage,
        threshold = 1,
        rootMargin = '100px',
        disabled = false,
    } = options;

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (
                entry.isIntersecting &&
                hasNextPage &&
                !isFetchingNextPage &&
                !disabled &&
                fetchNextPage
            ) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage, disabled]
    );

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver(handleIntersect, {
            threshold,
            rootMargin,
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleIntersect, threshold, rootMargin]);

    return {
        ref: loadMoreRef,
        hasNextPage,
        isFetchingNextPage,
    };
};
