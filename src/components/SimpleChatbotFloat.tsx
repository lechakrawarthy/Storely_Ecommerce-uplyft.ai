import React, { useState } from 'react';
import { MessageCircle, X, Send } from '../utils/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const SimpleChatbotFloat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi! I'm your shopping assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        try {
            console.log('🚀 SIMPLE TEST: Sending message to API:', message);
            console.log('API URL:', API_URL);

            const requestData = {
                message: message,
                session_id: 'simple_test_' + Date.now(),
                user_id: null,
                preferences: {
                    preferredCategories: [],
                    budgetRange: { min: 0, max: 2000 },
                    lastSearches: []
                },
                timestamp: new Date().toISOString()
            };

            const response = await axios.post(`${API_URL}/api/chat`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            console.log('✅ SIMPLE TEST: API Response received:', response.data);

            // Add bot response
            const botMessage: Message = {
                id: Date.now() + 1,
                text: response.data.response.message,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('❌ SIMPLE TEST: API Error:', error);

            // Add error message
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-50"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col z-50">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Simple Chat Test</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-2">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                                    Typing...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isTyping}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default SimpleChatbotFloat;
