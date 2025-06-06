
import React, { useState, useRef, useEffect } from 'react';
import { Wand } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bookbuddy';
  timestamp: Date;
}

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm BookBuddy 📚 I'm here to help you discover amazing books! What kind of story are you in the mood for today?",
      sender: 'bookbuddy',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "🔍 Find mystery books",
    "📚 Recommend bestsellers under ₹500", 
    "👩‍🏫 Study help books",
    "💖 Romance novels",
    "🐉 Fantasy adventures",
    "👻 Horror stories"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great choice! 📖 Let me find some perfect books for you. What's your budget range?",
        "I love that genre! 🌟 Here are some amazing recommendations based on your interest...",
        "Excellent taste! 📚 I have some fantastic suggestions that match your mood perfectly!",
        "Wonderful! ✨ Let me curate a special selection just for you. Any specific authors you enjoy?",
        "Perfect! 🎯 I can definitely help with that. Would you prefer fiction or non-fiction?"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bookbuddy',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm BookBuddy 📚 I'm here to help you discover amazing books! What kind of story are you in the mood for today?",
      sender: 'bookbuddy',
      timestamp: new Date()
    }]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <section id="chatbot" className="min-h-screen bg-gradient-to-br from-white via-lavender-50 to-mint-50 book-pattern py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-poppins bg-gradient-to-r from-lavender-600 to-mint-600 bg-clip-text text-transparent mb-4">
            Chat with BookBuddy
          </h2>
          <p className="text-xl text-gray-600">Your AI book concierge is ready to help! 🤖✨</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-lavender-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-lavender-500 to-mint-500 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-white">BookBuddy</h3>
                <p className="text-white/80 text-sm">Online & Ready to Help!</p>
              </div>
            </div>
            <button 
              onClick={resetChat}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200 hover:scale-110 animate-sparkle"
              title="Reset Chat"
            >
              <Wand size={20} className="text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} chat-bubble`}
              >
                <div className="max-w-xs lg:max-w-md">
                  {message.sender === 'bookbuddy' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-lavender-400 to-mint-400 rounded-full flex items-center justify-center text-sm">
                        🤖
                      </div>
                      <span className="text-xs text-gray-500">BookBuddy</span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-lavender-500 to-mint-500 text-white ml-auto'
                        : 'bg-lavender-100 text-gray-800'
                    } shadow-lg`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start chat-bubble">
                <div className="max-w-xs lg:max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-lavender-400 to-mint-400 rounded-full flex items-center justify-center text-sm">
                      🤖
                    </div>
                    <span className="text-xs text-gray-500">BookBuddy is typing...</span>
                  </div>
                  <div className="bg-lavender-100 px-4 py-3 rounded-2xl shadow-lg">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-4 py-2 border-t border-lavender-100">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-3 py-2 bg-lavender-100 hover:bg-lavender-200 text-lavender-700 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-lavender-100">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask me about books, genres, authors..."
                className="flex-1 px-4 py-3 bg-lavender-50 border border-lavender-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-lavender-500 to-mint-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotSection;
