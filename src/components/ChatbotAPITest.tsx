import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatbotAPITest: React.FC = () => {
    const [testResult, setTestResult] = useState<string>('Starting test...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const testAPI = async () => {
            try {
                console.log('=== CHATBOT API TEST ===');
                console.log('API URL:', API_URL);

                const requestData = {
                    message: 'test from react component',
                    session_id: 'react_test_123',
                    user_id: null,
                    preferences: {
                        preferredCategories: [],
                        budgetRange: { min: 0, max: 2000 },
                        lastSearches: []
                    },
                    timestamp: new Date().toISOString()
                };

                console.log('Sending request:', requestData);

                const response = await axios.post(`${API_URL}/api/chat`, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                });

                console.log('✅ API Response:', response);
                setTestResult(`SUCCESS! Message: ${response.data.response.message}`);

            } catch (error) {
                console.error('❌ API Test Error:', error);
                if (axios.isAxiosError(error)) {
                    console.error('Error details:', {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data,
                        config: error.config
                    });
                    setTestResult(`ERROR: ${error.message} - Status: ${error.response?.status || 'No response'}`);
                } else {
                    setTestResult(`ERROR: ${error}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        testAPI();
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '300px',
            zIndex: 10000
        }}>
            <h4>Chatbot API Test</h4>
            <p>{isLoading ? 'Testing...' : testResult}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Check browser console for details</p>
        </div>
    );
};

export default ChatbotAPITest;
