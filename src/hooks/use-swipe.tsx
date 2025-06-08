import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onTap?: () => void;
}

interface SwipeConfig {
    threshold?: number;
    velocity?: number;
    preventDefaultTouchmoveEvent?: boolean;
    trackTouch?: boolean;
    trackMouse?: boolean;
}

export const useSwipe = (
    handlers: SwipeHandlers,
    config: SwipeConfig = {}
) => {
    const {
        threshold = 50,
        velocity = 0.3,
        preventDefaultTouchmoveEvent = false,
        trackTouch = true,
        trackMouse = false,
    } = config;

    const [isSwiping, setIsSwiping] = useState(false);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
    const [startTime, setStartTime] = useState(0);

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let startX = 0;
        let startY = 0;
        let startTime = 0;

        const handleStart = (clientX: number, clientY: number) => {
            startX = clientX;
            startY = clientY;
            startTime = Date.now();
            setStartCoords({ x: clientX, y: clientY });
            setStartTime(startTime);
            setIsSwiping(true);
        };

        const handleMove = (clientX: number, clientY: number, event: Event) => {
            if (preventDefaultTouchmoveEvent) {
                event.preventDefault();
            }
            setEndCoords({ x: clientX, y: clientY });
        };

        const handleEnd = (clientX: number, clientY: number) => {
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const deltaTime = Date.now() - startTime;
            const velocityX = Math.abs(deltaX) / deltaTime;
            const velocityY = Math.abs(deltaY) / deltaTime;

            setEndCoords({ x: clientX, y: clientY });
            setIsSwiping(false);

            // Check if it's a tap (minimal movement and quick)
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
                handlers.onTap?.();
                return;
            }

            // Check for swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > threshold && velocityX > velocity) {
                    if (deltaX > 0) {
                        handlers.onSwipeRight?.();
                    } else {
                        handlers.onSwipeLeft?.();
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > threshold && velocityY > velocity) {
                    if (deltaY > 0) {
                        handlers.onSwipeDown?.();
                    } else {
                        handlers.onSwipeUp?.();
                    }
                }
            }
        };

        // Touch events
        const handleTouchStart = (e: TouchEvent) => {
            if (!trackTouch) return;
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!trackTouch || !isSwiping) return;
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY, e);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!trackTouch) return;
            const touch = e.changedTouches[0];
            handleEnd(touch.clientX, touch.clientY);
        };

        // Mouse events
        const handleMouseDown = (e: MouseEvent) => {
            if (!trackMouse) return;
            handleStart(e.clientX, e.clientY);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!trackMouse || !isSwiping) return;
            handleMove(e.clientX, e.clientY, e);
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!trackMouse) return;
            handleEnd(e.clientX, e.clientY);
        };

        // Add event listeners
        if (trackTouch) {
            element.addEventListener('touchstart', handleTouchStart);
            element.addEventListener('touchmove', handleTouchMove);
            element.addEventListener('touchend', handleTouchEnd);
        }

        if (trackMouse) {
            element.addEventListener('mousedown', handleMouseDown);
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            if (trackTouch) {
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchmove', handleTouchMove);
                element.removeEventListener('touchend', handleTouchEnd);
            }

            if (trackMouse) {
                element.removeEventListener('mousedown', handleMouseDown);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [handlers, threshold, velocity, preventDefaultTouchmoveEvent, trackTouch, trackMouse, isSwiping]);

    return {
        ref,
        isSwiping,
        startCoords,
        endCoords,
    };
};
