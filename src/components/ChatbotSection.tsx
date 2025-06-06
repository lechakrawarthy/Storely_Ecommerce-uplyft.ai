import React, { useState, useRef, useEffect } from 'react';
import { Wand, X, Minimize2, Maximize2, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from './BooksSection';

const initialMessage = {
  id: '1',
  text: "Hi! I'm your shopping assistant. Ask for any product, color, price, or type—and I'll help you find and buy it!",
  sender: 'bot',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const ChatbotSection = () => {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotFilter, setChatbotFilter] = useState<null | ((product: Product) => boolean)>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simple NLP for demo: detect color, price, or type
    let filter: ((product: Product) => boolean) | null = null;
    let botText = "Let me find the best products for you!";
    const colorMatch = input.match(/(black|white|blue|grey)/i);
    const priceMatch = input.match(/\b(\d{2,5})\b/);
    const typeMatch = input.match(/(t\s*-?\s*shirt|headphone|book|electronics|textiles?)/i);
    if (colorMatch) {
      const color = colorMatch[1][0].toUpperCase() + colorMatch[1].slice(1).toLowerCase();
      filter = (p: Product) => p.color === color;
      botText = `Here are some ${color} products for you!`;
    } else if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      filter = (p: Product) => p.price <= price;
      botText = `Here are products under ₹${price}.`;
    } else if (typeMatch) {
      const type = typeMatch[1].toLowerCase().includes('shirt') ? 'Textiles' :
        typeMatch[1].toLowerCase().includes('headphone') ? 'Electronics' :
          typeMatch[1].toLowerCase().includes('book') ? 'Books' :
            typeMatch[1].toLowerCase().includes('electronics') ? 'Electronics' :
              typeMatch[1].toLowerCase().includes('textile') ? 'Textiles' : '';
      if (type) {
        filter = (p: Product) => p.category === type;
        botText = `Here are some ${type} products for you!`;
      }
    }
    setTimeout(() => {
      setIsTyping(false);
      setMessages(msgs => [...msgs, {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatbotFilter(() => filter);
    }, 1200);
  };

  const handleReset = () => {
    setMessages([initialMessage]);
    setChatbotFilter(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    const successMsg = {
      id: (Date.now() + 2).toString(),
      text: `Great! I've added "${product.title}" to your cart. Would you like to continue shopping or checkout?`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(msgs => [...msgs, successMsg]);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-lime-300 hover:bg-lime-400 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Open ShopBot"
      >
        🤖
      </button>
    );
  }

  return (
    <>
      <section className={`fixed bottom-8 right-8 z-50 w-full max-w-md transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
        <div className="glass-card rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between glass-strong px-6 py-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-lime-300 rounded-full flex items-center justify-center text-2xl shadow-md">🤖</span>
              <span className="font-semibold text-gray-800">ShopBot</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 glass-subtle rounded-full hover:glass-strong transition-all border border-white/20"
                title="Reset Chat"
              >
                <Wand size={16} className="text-lime-600" />
              </button>
              <button
                onClick={handleMinimize}
                className="p-2 glass-subtle rounded-full hover:glass-strong transition-all border border-white/20"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={16} className="text-gray-600" /> : <Minimize2 size={16} className="text-gray-600" />}
              </button>
              <button
                onClick={handleClose}
                className="p-2 glass-subtle rounded-full hover:glass-strong hover:bg-red-100 transition-all border border-white/20"
                title="Close Chat"
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          </div>

          {/* Messages - only show when not minimized */}
          {!isMinimized && (
            <>
              <div className="h-72 overflow-y-auto px-6 py-4 space-y-4 glass-subtle">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-md border ${msg.sender === 'user' ? 'bg-lime-300 text-black ml-auto border-lime-400' : 'glass-strong text-gray-800 border-white/20'}`}>
                      <div className="text-sm">{msg.text}</div>
                      <div className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 rounded-2xl shadow-md glass-strong text-gray-800 border border-white/20">
                      <span className="italic text-gray-500">ShopBot is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-6 py-4 border-t border-white/20 glass-strong">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for a product, color, price, or type..."
                  className="flex-1 px-4 py-3 rounded-full glass-subtle focus:outline-none focus:ring-2 focus:ring-lime-400 focus:glass-strong text-base border border-white/20"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-lime-300 hover:bg-lime-400 text-black font-semibold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Product suggestions below chat if filter is active */}
      {chatbotFilter && !isMinimized && (
        <div className="fixed bottom-0 left-0 w-full max-w-2xl glass-card rounded-t-3xl shadow-2xl p-6 z-40 border-t border-white/30">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Suggested Products</h3>
          {/* ProductGrid with chatbotFilter */}
        </div>
      )}
    </>
  );
};

export default ChatbotSection;
