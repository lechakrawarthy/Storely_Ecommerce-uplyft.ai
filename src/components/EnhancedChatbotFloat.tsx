import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, ShoppingCart, Bot, Sparkles, Zap, Package, Search, ArrowRight, Loader, RefreshCw } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from './BooksSection';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

// API URL from environment or default to local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

interface ChatSession {
  id: string;
  timestamp: string;
  history: Message[];
}

const ProductChatCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 max-w-xs transition-all hover:shadow-md">
      <div className="flex gap-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-16 h-16 object-cover rounded-lg"
          loading="lazy"
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
              aria-label="Add to cart"
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
      <div className="w-2 h-2 bg-pastel-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-xs text-gray-600 ml-2 font-medium">mimi is analyzing...</span>
  </div>
);

const QuickActions = ({ onActionClick }: { onActionClick: (action: string) => void }) => (
  <div className="p-3 border-b border-gray-100">
    <p className="text-xs text-gray-500 mb-2 font-medium">Quick Actions:</p>
    <div className="flex flex-wrap gap-2">
      {[
        { text: '🔍 Search Books', action: 'search books' },
        { text: '⭐ Best Sellers', action: 'show bestsellers' },
        { text: '💰 Budget Books', action: 'books under 500' },
        { text: '📚 Categories', action: 'show categories' }
      ].map((item, idx) => (
        <button
          key={idx}
          onClick={() => onActionClick(item.action)}
          className="text-xs px-3 py-1.5 bg-gradient-to-r from-pastel-100 to-sage-100 hover:from-pastel-200 hover:to-sage-200 rounded-full text-gray-700 transition-all duration-200 border border-pastel-200/50"
        >
          {item.text}
        </button>
      ))}
    </div>
  </div>
);

const SessionHistory = ({ sessions, onLoadSession }: { sessions: ChatSession[], onLoadSession: (id: string) => void }) => (
  <div className="max-h-32 overflow-y-auto">
    <p className="text-xs text-gray-500 mb-2 px-3 font-medium">Recent Sessions:</p>
    {sessions.length === 0 ? (
      <p className="text-xs text-gray-400 px-3 pb-2">No previous sessions</p>
    ) : (
      sessions.slice(0, 3).map((session) => (
        <button
          key={session.id}
          onClick={() => onLoadSession(session.id)}
          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          <p className="text-xs text-gray-600 truncate">Session {session.timestamp}</p>
        </button>
      ))
    )}
  </div>
);

const ChatbotFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [previousSessions, setPreviousSessions] = useState<ChatSession[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    preferredCategories: [] as string[],
    budgetRange: { min: 0, max: 2000 },
    lastSearches: [] as string[]
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to BookBuddy Assistant! 📚 I'm your intelligent shopping companion designed to help you discover amazing books, electronics, and textiles. I can search our inventory, provide personalized recommendations, and guide you through your purchase journey.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    },
    {
      id: 2,
      sender: 'bot',
      timestamp: new Date(),
      type: 'suggestions',
      suggestions: ['🔍 Search our 100+ book collection', '⭐ Show bestsellers', '💝 Personalized recommendations', '📱 Browse electronics', '👕 Explore textiles']
    }
  ]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadSession = useCallback(async (id: string) => {
    setIsConnecting(true);
    setConnectionError(false);
    
    try {
      const response = await axios.get(`${API_URL}/api/sessions/${id}`);
        if (response.data && response.data.history?.length > 0) {
        // Convert API format to our message format
        const loadedMessages = response.data.history.map((msg: {
          id?: number;
          message: string;
          sender: 'user' | 'bot';
          timestamp: string;
          products?: Product[];
          suggestions?: string[];
        }) => ({
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
  }, [toast]);

  // Initialize session ID once when component mounts
  useEffect(() => {
    if (!sessionId) {
      // Use user ID if logged in, otherwise create a random session ID
      const newSessionId = user?.id || `anon_${Math.random().toString(36).substring(2, 11)}`;
      setSessionId(newSessionId);

      // Try to load existing session from API
      loadSession(newSessionId);
    }
  }, [user, sessionId, loadSession]);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Store user's search for learning preferences
    setUserPreferences(prev => ({
      ...prev,
      lastSearches: [userMessage, ...prev.lastSearches.slice(0, 4)]
    }));

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        session_id: sessionId,
        user_id: user?.id,
        preferences: userPreferences,
        timestamp: new Date().toISOString()
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

        // Update user preferences based on bot recommendations
        if (botResponse.learned_preferences) {
          setUserPreferences(prev => ({
            ...prev,
            ...botResponse.learned_preferences
          }));
        }
      }
    } catch (error) {
      console.error('Error communicating with chatbot API:', error);
      setIsTyping(false);
      setConnectionError(true);
      
      // Provide more helpful offline fallback
      const fallbackMessage = generateOfflineResponse(userMessage);
      
      const errorMessage: Message = {
        id: Date.now(),
        text: fallbackMessage,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Working offline",
        description: "Providing basic assistance while reconnecting...",
      });
    }
  };

  // Enhanced offline fallback with basic NLP
  const generateOfflineResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('book') || input.includes('read')) {
      return "📚 I'd love to help you find books! Try browsing our categories: Fiction, Non-fiction, Educational, or search for specific titles when I'm back online.";
    }
    if (input.includes('price') || input.includes('cost') || input.includes('budget')) {
      return "💰 For budget-friendly options, check our 'Under ₹500' section or filter by price range in the main catalog.";
    }
    if (input.includes('recommend') || input.includes('suggest')) {
      return "⭐ I'd recommend checking our bestsellers section for popular choices, or browse by your favorite genres!";
    }
    if (input.includes('electronic') || input.includes('gadget')) {
      return "📱 Our electronics section has great deals on headphones, smartwatches, and tech accessories!";
    }
    
    return "I'm temporarily offline but will be back soon! Meanwhile, you can browse our catalog or try the search filters to find what you're looking for.";
  };

  const loadPreviousSession = async (sessionIdToLoad: string) => {
    try {
      await loadSession(sessionIdToLoad);
      setSessionId(sessionIdToLoad);
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        variant: "destructive",
        title: "Could not load session",
        description: "Please try again later",
      });
    }
  };
  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Chat reset! How can I help you find the perfect products today? 🛍️",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      },
      {
        id: 2,
        sender: 'bot',
        timestamp: new Date(),
        type: 'suggestions',
        suggestions: ['🔍 Search products', '⭐ Show bestsellers', '💝 Get recommendations', '📱 Browse electronics']
      }
    ]);
    
    // Create new session
    const newSessionId = user?.id ? `${user.id}_${Date.now()}` : `anon_${Math.random().toString(36).substring(2, 11)}`;
    setSessionId(newSessionId);
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
    handleApiRequest(message);
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

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed z-50 transition-all duration-300 ${isMobile ? 'bottom-6 right-4' : 'bottom-6 right-6'
        }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-gradient-to-r from-sage-500 to-gold-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isMobile ? 'w-14 h-14' : 'w-16 h-16'
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
            <div className="bg-gradient-to-r from-sage-500 to-gold-500 p-4 text-white flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">BookBuddy Assistant 📚</h3>
                  <p className="text-xs opacity-90">AI-powered • Book Expert</p>
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
                  onClick={resetChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Reset conversation"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Connection Status */}
            {isConnecting && (
              <div className="bg-blue-50 p-2 text-xs text-center text-blue-700 flex items-center justify-center">
                <Loader size={12} className="animate-spin mr-2" /> Connecting to BookBuddy AI...
              </div>
            )}
            
            {connectionError && (
              <div className="bg-red-50 p-2 text-xs text-center text-red-700">
                Connection error - Some features may not work properly
              </div>
            )}

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
                            <div className="w-6 h-6 bg-gradient-to-r from-sage-500 to-gold-500 rounded-full flex items-center justify-center mr-2">
                              <Bot size={12} className="text-white" />
                            </div>
                            <span className="text-xs text-gray-500">BookBuddy Assistant</span>
                          </div>
                        )}

                        {msg.type === 'text' && msg.text && (
                          <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                              ? 'bg-gradient-to-r from-sage-500 to-gold-500 text-white'
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
                                  className="bg-gradient-to-r from-sage-100 to-gold-100 text-sage-700 px-3 py-2 rounded-full text-xs font-medium hover:from-sage-200 hover:to-gold-200 transition-colors border border-sage-200"
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
                      placeholder='Ask me about books...'
                      className={`flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:bg-white transition-colors ${isMobile ? 'py-3 text-base' : ''
                        }`}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || isTyping}
                      className={`p-2 bg-gradient-to-r from-sage-500 to-gold-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'p-3' : ''
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
