import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, ShoppingCart, Bot, Sparkles, Zap, Package, Search, ArrowRight, Loader, RefreshCw } from '../utils/icons';
import { useCart } from '../contexts/CartContext';
import type { Product } from './BooksSection';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

// API URL from environment or default to local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ChatSession {
  id: string;
  timestamp: string;
  history: Message[];
}

// Sample products for chatbot recommendations (fallback)
const sampleProducts: Product[] = [
  {
    id: 'e1',
    title: 'New Gen X-Bud',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    color: 'Black',
    rating: 4.7,
    reviews: 320,
    inStock: true,
    description: 'Premium wireless earbuds with noise cancellation',
  },
  {
    id: 'f1',
    title: 'Premium Sneakers',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
    category: 'Fashion',
    color: 'White',
    rating: 4.5,
    reviews: 156,
    inStock: true,
    description: 'Comfortable premium sneakers for everyday wear',
  },
  {
    id: 'b1',
    title: 'JavaScript Mastery',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
    category: 'Books',
    color: 'Paperback',
    rating: 4.8,
    reviews: 892,
    inStock: true,
    description: 'Complete guide to mastering JavaScript programming',
  },
  {
    id: 't1',
    title: 'Cotton T-Shirt',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    category: 'Textiles',
    color: 'White',
    rating: 4.3,
    reviews: 78,
    inStock: true,
    description: '100% organic cotton premium quality t-shirt',
  }
];

interface Message {
  id: number | string;
  text?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'loading' | 'suggestions';
  products?: Product[];
  suggestions?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductChatCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 max-w-xs">
      <div className="flex gap-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-800 line-clamp-2">{product.title}</h4>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-yellow-500">★</span>
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex space-x-1 p-3">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-xs text-gray-500 ml-2">Mimi is thinking...</span>
  </div>
);

const ChatbotFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Mimi your Assistant 📚 Your personal concierge! I can help you find books,electronics,textiles check prices, and recommend great deals based on your interests.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    },
    {
      id: 2,
      sender: 'bot',
      timestamp: new Date(),
      type: 'suggestions',
      suggestions: ['Find fiction books', 'Book recommendations', 'Browse categories', 'Books under ₹500']
    }
  ]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Initialize session ID once when component mounts
  useEffect(() => {
    if (!sessionId) {
      // Use user ID if logged in, otherwise create a random session ID
      const newSessionId = user?.id || `anon_${Math.random().toString(36).substring(2, 11)}`;
      setSessionId(newSessionId);

      // Try to load existing session from API
      loadSession(newSessionId);
    }
  }, [user, sessionId]);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadSession = async (id: string) => {
    setIsConnecting(true);
    setConnectionError(false);

    try {
      const response = await axios.get(`${API_URL}/api/sessions/${id}`);

      if (response.data && response.data.history?.length > 0) {
        // Convert API format to our message format
        const loadedMessages = response.data.history.map((msg: any) => ({
          id: msg.id || Date.now() + Math.random(),
          text: msg.message,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          type: msg.products ? 'product' : msg.suggestions ? 'suggestions' : 'text',
          products: msg.products,
          suggestions: msg.suggestions
        }));

        setMessages(loadedMessages);
        toast({
          title: "Session loaded",
          description: "Your previous conversation has been restored",
        });
      }
    } catch (error) {
      console.log('No existing session found or error loading session');
      // If no session exists, that's expected for new users - no need to show error
      // Only set error if it's not a 404
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        setConnectionError(true);
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Could not connect to chatbot service",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: suggestion,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    handleApiRequest(suggestion);
  };

  const handleApiRequest = async (userMessage: string) => {
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        session_id: sessionId
      });

      setIsTyping(false);

      if (response.data && response.data.response) {
        const botResponse = response.data.response;

        const newMessage: Message = {
          id: Date.now(),
          text: botResponse.message,
          sender: 'bot',
          timestamp: new Date(),
          type: botResponse.products ? 'product' : botResponse.suggestions?.length ? 'suggestions' : 'text',
          products: botResponse.products,
          suggestions: botResponse.suggestions
        };

        setMessages(prev => [...prev, newMessage]);
        setConnectionError(false);
      }
    } catch (error) {
      console.error('Error communicating with chatbot API:', error);
      setIsTyping(false);
      setConnectionError(true);

      const errorMessage: Message = {
        id: Date.now(),
        text: "Sorry, I'm having trouble connecting to my brain. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not connect to chatbot service",
      });
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    handleBotResponse(message);
  };
  const handleAddToCart = (product: Product) => {
    addItem(product);

    const confirmMessage: Message = {
      id: Date.now(),
      text: `✅ Added "${product.title}" to your cart! Anything else I can help you find?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, confirmMessage]);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed z-50 transition-all duration-300 ${isMobile ? 'bottom-6 right-4' : 'bottom-6 right-6'
        }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isMobile ? 'w-14 h-14' : 'w-16 h-16'
            }`}
          aria-label="Open chat"
        >
          {isOpen ? <X size={isMobile ? 20 : 24} /> : <Bot size={isMobile ? 20 : 24} />}

          {/* Notification badge for new messages */}
          {!isOpen && messages.length > 2 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          {isMobile && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          )}

          <div className={`fixed z-50 transition-all duration-300 ${isMobile
            ? 'inset-4 bg-white rounded-3xl shadow-2xl border border-gray-200'
            : `bottom-24 right-6 w-96 ${isMinimized ? 'h-16' : 'h-[500px]'} bg-white rounded-2xl shadow-2xl border border-gray-200`
            }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 text-white flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Ask Storely Assistant 🤖</h3>
                  <p className="text-xs opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isMobile && (
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                  >
                    {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {(!isMinimized || isMobile) && (
              <>
                {/* Messages */}
                <div className={`flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 ${isMobile ? 'h-[calc(100vh-240px)]' : 'h-80'
                  }`}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs ${isMobile ? 'max-w-[280px]' : ''} ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        {msg.sender === 'bot' && (
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-2">
                              <Bot size={12} className="text-white" />
                            </div>
                            <span className="text-xs text-gray-500">Storely Assistant</span>
                          </div>
                        )}

                        {msg.type === 'text' && msg.text && (
                          <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        )}

                        {msg.type === 'product' && msg.products && (
                          <div className="space-y-2">
                            {msg.text && (
                              <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl">
                                <p className="text-sm">{msg.text}</p>
                              </div>
                            )}
                            {msg.products.map((product) => (
                              <ProductChatCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                              />
                            ))}
                          </div>
                        )}

                        {msg.type === 'suggestions' && msg.suggestions && (
                          <div className="space-y-2">
                            {msg.text && (
                              <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl">
                                <p className="text-sm">{msg.text}</p>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {msg.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 px-3 py-2 rounded-full text-xs font-medium hover:from-blue-200 hover:to-green-200 transition-colors border border-blue-200"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`p-4 border-t border-gray-200 bg-white ${isMobile ? 'rounded-b-3xl' : 'rounded-b-2xl'}`}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder='Try "smartphones under ₹1000"'
                      className={`flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${isMobile ? 'py-3 text-base' : ''
                        }`}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className={`p-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'p-3' : ''
                        }`}
                    >
                      <Send size={isMobile ? 20 : 16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ChatbotFloat;
