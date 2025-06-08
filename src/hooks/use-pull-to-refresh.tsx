import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
    threshold?: number;
    onRefresh?: () => Promise<void> | void;
    disabled?: boolean;
    refreshingText?: string;
    pullText?: string;
    releaseText?: string;
}

export const usePullToRefresh = (options: PullToRefreshOptions = {}) => {
    const {
        threshold = 80,
        onRefresh,
        disabled = false,
        refreshingText = 'Refreshing...',
        pullText = 'Pull to refresh',
        releaseText = 'Release to refresh',
    } = options;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    const [canRelease, setCanRelease] = useState(false);

    const containerRef = useRef<HTMLElement>(null);
    const startY = useRef(0);
    const currentY = useRef(0);

    const handleRefresh = async () => {
        if (disabled || !onRefresh) return;

        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
            setPullDistance(0);
            setIsPulling(false);
            setCanRelease(false);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container || disabled) return;

        let isAtTop = true;

        const checkScrollPosition = () => {
            isAtTop = container.scrollTop === 0;
        };

        const handleTouchStart = (e: TouchEvent) => {
            checkScrollPosition();
            if (isAtTop && !isRefreshing) {
                startY.current = e.touches[0].clientY;
                setIsPulling(true);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling || isRefreshing) return;

            currentY.current = e.touches[0].clientY;
            const distance = Math.max(0, (currentY.current - startY.current) * 0.5);

            if (distance > 0 && isAtTop) {
                e.preventDefault();
                setPullDistance(distance);
                setCanRelease(distance >= threshold);
            }
        };

        const handleTouchEnd = () => {
            if (!isPulling) return;

            if (canRelease && !isRefreshing) {
                handleRefresh();
            } else {
                setPullDistance(0);
                setIsPulling(false);
                setCanRelease(false);
            }
        };

        const handleScroll = () => {
            checkScrollPosition();
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('scroll', handleScroll);
        };
    }, [isPulling, canRelease, isRefreshing, threshold, disabled]);

    const getStatusText = () => {
        if (isRefreshing) return refreshingText;
        if (canRelease) return releaseText;
        return pullText;
    };

    const getProgress = () => {
        return Math.min(pullDistance / threshold, 1);
    };

    return {
        ref: containerRef,
        isRefreshing,
        isPulling,
        canRelease,
        pullDistance,
        progress: getProgress(),
        statusText: getStatusText(),
    };
};
