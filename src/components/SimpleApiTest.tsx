import React, { useState } from 'react';

const SimpleApiTest = () => {
    const [result, setResult] = useState<string>('Click button to test');
    const [loading, setLoading] = useState(false);

    const testApi = async () => {
        setLoading(true);
        setResult('Testing...');

        try {
            console.log('Starting API test...');

            // Test 1: Basic fetch
            const response = await fetch('http://localhost:5000/api/products?limit=2');
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            setResult(`✅ Success! Got ${data.length} products. First product: ${JSON.stringify(data[0], null, 2)}`);
        } catch (error) {
            console.error('API test error:', error);
            setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Simple API Test</h1>

            <button
                onClick={testApi}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Testing...' : 'Test API'}
            </button>

            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h2 className="font-semibold mb-2">Result:</h2>
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
        </div>
    );
};

export default SimpleApiTest;
