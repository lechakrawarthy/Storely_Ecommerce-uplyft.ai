import React from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '../hooks/use-pull-to-refresh';

interface PullToRefreshProps {
    onRefresh: () => Promise<void> | void;
    children: React.ReactNode;
    disabled?: boolean;
    threshold?: number;
    className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    disabled = false,
    threshold = 80,
    className = '',
}) => {
    const {
        ref,
        isRefreshing,
        isPulling,
        canRelease,
        pullDistance,
        progress,
        statusText,
    } = usePullToRefresh({
        onRefresh,
        disabled,
        threshold,
    });

    const getIndicatorColor = () => {
        if (isRefreshing) return 'text-blue-500';
        if (canRelease) return 'text-green-500';
        return 'text-gray-400';
    };

    const getIndicatorScale = () => {
        if (isRefreshing) return 'scale-100';
        return `scale-${Math.min(100, Math.floor(progress * 100))}`;
    };

    return (
        <div
            ref={ref}
            className={`relative overflow-auto h-full ${className}`}
        >
            {/* Pull to Refresh Indicator */}
            <div
                className={`absolute top-0 left-0 right-0 z-10 transition-all duration-300 ease-out ${isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    transform: `translateY(${Math.min(pullDistance - threshold, 0)}px)`,
                }}
            >
                <div className="flex flex-col items-center justify-center py-4 bg-white/95 backdrop-blur-sm">
                    <div
                        className={`p-3 rounded-full bg-gray-50 transition-all duration-200 ${getIndicatorColor()}`}
                        style={{
                            transform: `scale(${Math.min(1.2, 0.8 + progress * 0.4)})`,
                        }}
                    >
                        <RefreshCw
                            className={`w-6 h-6 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''
                                }`}
                            style={{
                                transform: `rotate(${progress * 180}deg)`,
                            }}
                        />
                    </div>
                    <p className={`mt-2 text-sm font-medium ${getIndicatorColor()}`}>
                        {statusText}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-200 rounded-full ${isRefreshing ? 'bg-blue-500' : canRelease ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                            style={{
                                width: `${Math.min(100, progress * 100)}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div
                className="min-h-full"
                style={{
                    paddingTop: isPulling || isRefreshing ? `${Math.max(0, pullDistance)}px` : '0px',
                    transition: isPulling ? 'none' : 'padding-top 0.3s ease-out',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default PullToRefresh;
