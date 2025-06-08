import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import MobileLoadingAnimations from './MobileLoadingAnimations';

const LoadingSpinner = () => {
    const isMobile = useIsMobile(); if (isMobile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
                <div className="flex flex-col items-center space-y-6">
                    <MobileLoadingAnimations type="spinner" size="lg" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">BookBuddy</div>
                        <div className="text-sm text-gray-600">Loading your experience...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
            <div className="flex flex-col items-center space-y-4">
                {/* Animated spinner */}
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-lime-300 rounded-full animate-spin animate-reverse"></div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">BookBuddy</div>
                    <div className="text-sm text-gray-600">Loading...</div>
                </div>
            </div>
        </div>);
};

export default LoadingSpinner;
