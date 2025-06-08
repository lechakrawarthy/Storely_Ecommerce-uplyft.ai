// Test script to simulate frontend API call
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testChatAPI() {
    try {
        console.log('Testing frontend to backend API call...');

        const requestData = {
            message: 'hello',
            session_id: 'test_frontend_123',
            user_id: null,
            preferences: {
                preferredCategories: [],
                budgetRange: { min: 0, max: 2000 },
                lastSearches: []
            },
            timestamp: new Date().toISOString()
        };

        console.log('Request data:', JSON.stringify(requestData, null, 2));
        console.log('Making request to:', `${API_URL}/api/chat`);

        const response = await axios.post(`${API_URL}/api/chat`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8082'
            },
            timeout: 10000
        });

        console.log('✅ Success! Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testChatAPI();
