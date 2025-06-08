import React from 'react';
import { Loader2, RefreshCw, ShoppingBag, Heart, Star } from '../utils/icons';

interface MobileLoadingAnimationsProps {
    type: 'spinner' | 'pulse' | 'wave' | 'bounce' | 'skeleton' | 'cart' | 'heart' | 'rating';
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    className?: string;
}

const MobileLoadingAnimations: React.FC<MobileLoadingAnimationsProps> = ({
    type,
    size = 'md',
    color = 'primary',
    className = '',
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-4 h-4';
            case 'md':
                return 'w-6 h-6';
            case 'lg':
                return 'w-8 h-8';
            default:
                return 'w-6 h-6';
        }
    };

    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'text-blue-500';
            case 'secondary':
                return 'text-gray-500';
            case 'success':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-blue-500';
        }
    };

    const baseClasses = `${getSizeClasses()} ${getColorClasses()} ${className}`;

    switch (type) {
        case 'spinner':
            return (
                <div className="flex items-center justify-center">
                    <Loader2 className={`${baseClasses} animate-spin`} />
                </div>
            );

        case 'pulse':
            return (
                <div className="flex items-center justify-center">
                    <div className={`${baseClasses} rounded-full bg-current animate-pulse opacity-75`} />
                </div>
            );

        case 'wave':
            return (
                <div className="flex items-center justify-center gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 bg-current rounded-full animate-bounce ${getColorClasses()}`}
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '0.6s',
                            }}
                        />
                    ))}
                </div>
            );

        case 'bounce':
            return (
                <div className="flex items-center justify-center">
                    <div className={`${baseClasses} rounded-full bg-current animate-bounce`} />
                </div>
            );

        case 'skeleton':
            return (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                    <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
                </div>
            );

        case 'cart':
            return (
                <div className="flex items-center justify-center">
                    <ShoppingBag className={`${baseClasses} animate-bounce`} />
                </div>
            );

        case 'heart':
            return (
                <div className="flex items-center justify-center">
                    <Heart className={`${baseClasses} animate-pulse fill-current`} />
                </div>
            );

        case 'rating':
            return (
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 animate-pulse fill-yellow-400 text-yellow-400`}
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '1s',
                            }}
                        />
                    ))}
                </div>
            );

        default:
            return (
                <div className="flex items-center justify-center">
                    <Loader2 className={`${baseClasses} animate-spin`} />
                </div>
            );
    }
};

// Micro-interaction components
export const ButtonPressAnimation: React.FC<{
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
}> = ({ children, onPress, className = '' }) => {
    return (
        <button
            onClick={onPress}
            className={`transform transition-all duration-150 active:scale-95 active:brightness-90 hover:scale-105 ${className}`}
        >
            {children}
        </button>
    );
};

export const SwipeIndicator: React.FC<{
    direction?: 'left' | 'right' | 'up' | 'down';
    className?: string;
}> = ({ direction = 'left', className = '' }) => {
    const getDirectionClasses = () => {
        switch (direction) {
            case 'left':
                return 'animate-slide-left';
            case 'right':
                return 'animate-slide-right';
            case 'up':
                return 'animate-slide-up';
            case 'down':
                return 'animate-slide-down';
            default:
                return 'animate-slide-left';
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 bg-current rounded-full opacity-50 ${getDirectionClasses()}`}
                        style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s',
                            animationIterationCount: 'infinite',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export const FloatingAction: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}> = ({ children, onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`
        fixed bottom-6 right-6 z-50 
        bg-gradient-to-r from-blue-500 to-purple-600 
        text-white p-4 rounded-full shadow-lg 
        transform transition-all duration-300 
        hover:scale-110 hover:shadow-xl 
        active:scale-95 
        animate-float
        ${className}
      `}
        >
            {children}
        </button>
    );
};

export const ProgressRing: React.FC<{
    progress: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}> = ({ progress, size = 40, strokeWidth = 4, className = '' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={`transform -rotate-90 ${className}`}>
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="opacity-25"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                />
            </svg>
        </div>
    );
};

export default MobileLoadingAnimations;
