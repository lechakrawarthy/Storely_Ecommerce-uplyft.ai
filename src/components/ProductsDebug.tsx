import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { type Product } from '../data/products';

interface ApiResponse {
    success?: boolean;
    data?: Product[];
    products?: Product[];
}

const ProductsDebug = () => {
    const { products, categories, loading, error } = useProducts();
    const [directApiTest, setDirectApiTest] = useState<ApiResponse | Product[] | null>(null);
    const [directApiError, setDirectApiError] = useState<string | null>(null);

    // Test direct API call
    useEffect(() => {
        const testApi = async () => {
            try {
                console.log('Testing direct API call...');
                const response = await fetch('http://localhost:5000/api/products?limit=5');
                console.log('API Response status:', response.status);
                const data = await response.json();
                console.log('API Response data:', data);
                setDirectApiTest(data);
            } catch (err) {
                console.error('Direct API test error:', err);
                setDirectApiError(err instanceof Error ? err.message : 'Unknown error');
            }
        };
        testApi();
    }, []);

    return (
        <div className="p-6 bg-gray-100 rounded-lg m-4">
            <h2 className="text-xl font-bold mb-4">Products Debug Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded">
                    <h3 className="font-semibold">Loading State</h3>
                    <p className={loading ? "text-red-500" : "text-green-500"}>
                        {loading ? "Loading..." : "Loaded"}
                    </p>
                </div>
                <div className="bg-white p-4 rounded">
                    <h3 className="font-semibold">Error State</h3>
                    <p className={error ? "text-red-500" : "text-green-500"}>
                        {error || "No errors"}
                    </p>
                    {error && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-gray-600">Full Error Details</summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{error}</pre>
                        </details>
                    )}
                </div>

                <div className="bg-white p-4 rounded">
                    <h3 className="font-semibold">Products Count</h3>
                    <p className="text-blue-500 font-bold text-xl">
                        {products.length}
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 rounded mb-4">
                <h3 className="font-semibold mb-2">Categories ({categories.length})</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <span key={cat} className="bg-blue-100 px-2 py-1 rounded text-sm">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>      <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">Direct API Test</h3>
                {directApiError ? (
                    <div className="text-red-500">
                        <p><strong>API Error:</strong> {directApiError}</p>
                    </div>
                ) : directApiTest ? (
                    <div className="text-green-500">
                        <p><strong>API Working!</strong> Got {Array.isArray(directApiTest) ? directApiTest.length : 1} products</p>
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-gray-600">API Response</summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                {JSON.stringify(directApiTest, null, 2)}
                            </pre>
                        </details>
                    </div>
                ) : (
                    <p className="text-orange-500">Testing API...</p>
                )}
            </div>

            <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">First 3 Products</h3>
                {products.slice(0, 3).map(product => (
                    <div key={product.id} className="border-b py-2">
                        <p><strong>ID:</strong> {product.id}</p>
                        <p><strong>Title:</strong> {product.title}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Price:</strong> ₹{product.price}</p>
                        <p><strong>In Stock:</strong> {product.inStock ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsDebug;
