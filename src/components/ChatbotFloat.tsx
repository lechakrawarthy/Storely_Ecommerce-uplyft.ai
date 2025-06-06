
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatbotFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm BookBuddy 📚 How can I help you find your next great read?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "That's a great question! Let me help you find some perfect books. What genre are you in the mood for? 📖",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chatbot-float w-14 h-14 bg-gradient-to-r from-pastel-500 to-sage-500 text-white rounded-full shadow-soft-hover flex items-center justify-center text-xl hover:from-pastel-600 hover:to-sage-600 transition-all duration-300"
        >
          {isOpen ? <X size={24} /> : '📚'}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 glass-dark rounded-2xl shadow-soft overflow-hidden border border-pastel-200/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-pastel-500/90 to-sage-500/90 p-4 text-white backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gold-200/30 rounded-full flex items-center justify-center backdrop-blur-sm">📚</div>
              <div>
                <h3 className="font-semibold text-cream-50">BookBuddy AI</h3>
                <p className="text-xs text-cream-100/90">Your Smart Book Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3 bg-gradient-to-b from-cream-50/80 to-pastel-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl backdrop-blur-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-pastel-400/80 to-sage-400/80 text-cream-50 shadow-sm'
                      : 'glass text-sage-800 border border-cream-200/50'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-pastel-200/30 bg-cream-50/80 backdrop-blur-sm">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about books..."
                className="flex-1 px-3 py-2 bg-cream-100/90 backdrop-blur-sm rounded-lg text-sm text-sage-800 placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-pastel-400/50 border border-cream-200/50"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-gradient-to-r from-pastel-500/90 to-sage-500/90 text-cream-50 rounded-lg hover:from-pastel-600 hover:to-sage-600 transition-all backdrop-blur-sm shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotFloat;
