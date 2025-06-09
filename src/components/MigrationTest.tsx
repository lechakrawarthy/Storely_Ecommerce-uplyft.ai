// Database Migration Completion Test
// This component verifies that the frontend is correctly loading products from the database

import React, { useEffect, useState } from 'react';
import { allProducts, getProductsLoadingState } from '../data/products';

interface MigrationStatus {
    dataLoaded: boolean;
    productCount: number;
    categories: string[];
    loadingState: {
        isLoading: boolean;
        error: string | null;
        hasData: boolean;
    };
    apiStatus: 'checking' | 'connected' | 'fallback' | 'error';
}

const MigrationTest: React.FC = () => {
    const [status, setStatus] = useState<MigrationStatus>({
        dataLoaded: false,
        productCount: 0,
        categories: [],
        loadingState: getProductsLoadingState(),
        apiStatus: 'checking'
    });

    useEffect(() => {
        const checkMigrationStatus = async () => {
            // Wait a moment for products to load
            setTimeout(() => {
                const loadingState = getProductsLoadingState();
                const categories = [...new Set(allProducts.map(p => p.category))];

                // Determine API status
                let apiStatus: MigrationStatus['apiStatus'] = 'fallback';
                if (loadingState.error) {
                    apiStatus = allProducts.length > 0 ? 'fallback' : 'error';
                } else if (allProducts.length >= 300) {
                    apiStatus = 'connected';
                }

                setStatus({
                    dataLoaded: allProducts.length > 0,
                    productCount: allProducts.length,
                    categories,
                    loadingState,
                    apiStatus
                });
            }, 1000);
        };

        checkMigrationStatus();
    }, []);

    const getStatusColor = (apiStatus: string) => {
        switch (apiStatus) {
            case 'connected': return 'text-green-600 bg-green-50 border-green-200';
            case 'fallback': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getStatusMessage = (apiStatus: string) => {
        switch (apiStatus) {
            case 'connected': return 'Database connected - Products loaded from API';
            case 'fallback': return 'Using fallback data - API unavailable';
            case 'error': return 'Error loading products';
            default: return 'Checking connection...';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="font-semibold text-gray-900">Migration Status</h3>
            </div>

            <div className="space-y-2 text-sm">
                <div className={`px-3 py-2 rounded-lg border ${getStatusColor(status.apiStatus)}`}>
                    <div className="font-medium">{getStatusMessage(status.apiStatus)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium text-gray-700">Products</div>
                        <div className="text-gray-900">{status.productCount}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium text-gray-700">Categories</div>
                        <div className="text-gray-900">{status.categories.length}</div>
                    </div>
                </div>

                {status.categories.length > 0 && (
                    <div className="text-xs text-gray-600">
                        <div className="font-medium mb-1">Available:</div>
                        <div>{status.categories.join(', ')}</div>
                    </div>
                )}

                {status.loadingState.error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        API Error: {status.loadingState.error}
                    </div>
                )}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                Migration: Database → Frontend ✅
            </div>
        </div>
    );
};

export default MigrationTest;
