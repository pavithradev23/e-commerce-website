import React, { useState, useRef, useEffect } from 'react';
import '../chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: "Hello! 👋 I'm your shopping assistant. Try: 'show me red shirts' or 'blue electronics with 4+ stars'", 
            isUser: false 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const BACKEND_URL = "http://localhost:5000/chat";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        console.log('🚀 Sending message:', inputValue);
        
        const userMessage = { 
            id: Date.now(), 
            text: inputValue, 
            isUser: true 
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
        
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue })
            });
            
            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('📦 Response data:', data);
            
            if (data.success) {
                const botMessage = { 
                    id: Date.now() + 1, 
                    text: data.reply, 
                    isUser: false,
                    metadata: data.metadata || {},
                    filters: data.filters || {}
                };
                setMessages(prev => [...prev, botMessage]);
                
                if (data.products && data.products.length > 0) {
                    const productMessage = {
                        id: Date.now() + 2,
                        text: `Found ${data.products.length} matching product(s)`,
                        isUser: false,
                        products: data.products,
                        showProducts: true,
                        filters: data.filters || {},
                        metadata: data.metadata || {}
                    };
                    setMessages(prev => [...prev, productMessage]);
                }
            } else {
                throw new Error(data.error || 'Request failed');
            }
            
        } catch (error) {
            console.error('❌ Error:', error);
            
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting. Please try again in a moment.",
                isUser: false
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            { 
                id: 1, 
                text: "Hello! 👋 I'm your shopping assistant. Try: 'show me red shirts' or 'blue electronics with 4+ stars'", 
                isUser: false 
            }
        ]);
    };

    const getColorStyle = (colorName) => {
        const colorMap = {
            'red': '#ff4444',
            'blue': '#3498db',
            'green': '#2ecc71',
            'black': '#2c3e50',
            'white': '#ecf0f1',
            'yellow': '#f1c40f',
            'gold': '#ffd700',
            'silver': '#bdc3c7',
            'pink': '#e84393',
            'purple': '#9b59b6',
            'orange': '#e67e22',
            'grey': '#95a5a6',
            'gray': '#95a5a6'
        };
        
        const bgColor = colorMap[colorName?.toLowerCase()] || '#95a5a6';
        const textColor = (colorName?.toLowerCase() === 'white' || colorName?.toLowerCase() === 'yellow') ? '#2c3e50' : '#ffffff';
        
        return {
            backgroundColor: bgColor,
            color: textColor,
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            display: 'inline-block',
            margin: '2px',
            fontWeight: '500',
            border: '1px solid rgba(0,0,0,0.1)'
        };
    };

    const renderMessage = (msg) => {
        const isColorFallbackMessage = msg.text && 
            (msg.text.includes("Sorry, we don't have") || msg.text.includes("Sorry, I couldn't find")) &&
            msg.text.includes("products") &&
            msg.metadata?.available_colors;
        
        return (
            <div key={msg.id} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
                <div className="message-text">
                    {msg.text.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < msg.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </div>
                
                {isColorFallbackMessage && msg.metadata.available_colors && msg.metadata.available_colors.length > 0 && (
                    <div className="color-fallback-section">
                        <div className="color-fallback-header">
                            <span className="color-suggestion-icon">🎨</span>
                            <span className="color-suggestion-text">Try these colors instead:</span>
                        </div>
                        <div className="color-chips-container">
                            {msg.metadata.available_colors.map((color, index) => (
                                <button
                                    key={index}
                                    className="color-chip-button"
                                    style={getColorStyle(color)}
                                    onClick={() => {
                                        const colorQuery = color + " products";
                                        setInputValue(colorQuery);
                                        setTimeout(() => {
                                            const sendBtn = document.querySelector('.send-button');
                                            if (sendBtn) sendBtn.click();
                                        }, 100);
                                    }}
                                    title={`Search for ${color} products`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                        <div className="color-fallback-hint">
                            <small>Click on a color to search for products in that color</small>
                        </div>
                    </div>
                )}
                
               
                {msg.filters && (msg.filters.color_requested || msg.filters.min_rating || msg.filters.category) && (
                    <div className="active-filters">
                        {msg.filters.color_requested && (
                            <span className="filter-tag" style={getColorStyle(msg.filters.color_requested)}>
                                🎨 Color: {msg.filters.color_requested}
                            </span>
                        )}
                        {msg.filters.min_rating && (
                            <span className="filter-tag rating-filter">
                                ⭐ Rating: {msg.filters.min_rating}+
                            </span>
                        )}
                        {msg.filters.category && (
                            <span className="filter-tag category-filter">
                                📁 Category: {msg.filters.category}
                            </span>
                        )}
                    </div>
                )}
                

                {msg.showProducts && msg.products && msg.products.length > 0 && (
                    <div className="products-section">
                        <div className="products-header">
                            <span className="products-count">
                                {msg.products.length} product{msg.products.length !== 1 ? 's' : ''} found
                            </span>
                            {msg.metadata?.exact_color_found && msg.filters?.color_requested && (
                                <span className="exact-match-banner">
                                    ✓ All products match your color request
                                </span>
                            )}
                        </div>
                        <div className="products-grid">
                            {msg.products.map((product, index) => (
                                <div 
                                    key={`${msg.id}-${product.id}-${index}`} 
                                    className="product-card"
                                >
                                    <div className="product-image-container">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150x150?text=Product';
                                            }}
                                        />
                                        {product.exact_color_match && (
                                            <div className="exact-match-badge" title="Exact color match">
                                                ✓ Exact Color
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <div className="product-name" title={product.name}>
                                            {product.name.length > 30 
                                                ? product.name.substring(0, 30) + '...' 
                                                : product.name}
                                        </div>
                                        <div className="product-price">{product.price}</div>
                                        
                                        <div className="product-details">
                                            <span className="product-rating">
                                                ⭐ {product.rating}
                                            </span>
                                            {product.color && product.color !== 'Various' && (
                                                <span 
                                                    className="product-color-tag" 
                                                    style={getColorStyle(product.color)}
                                                    title={`Color: ${product.color}`}
                                                >
                                                    {product.color}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="product-category">{product.category}</div>
                                        <div className="product-description">{product.description}</div>
                                        
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => window.open(product.url, '_blank')}
                                            title="View product details"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <span className="chatbot-icon">🛍️</span>
                            <span className="chatbot-name">Smart Shopping Assistant</span>
                        </div>
                        <div className="chatbot-actions">
                            <button className="chatbot-clear-btn" onClick={clearChat} title="Clear chat">
                                🗑️ Clear
                            </button>
                            <button className="chatbot-close-btn" onClick={toggleChat} title="Close chat">
                                ×
                            </button>
                        </div>
                    </div>
                    
                     
                    <div className="chatbot-messages">
                        {messages.map(msg => renderMessage(msg))}
                        
                        {isTyping && (
                            <div className="typing-indicator">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span>Searching products...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            className="chatbot-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Try: 'red shirts' or 'blue electronics with 4 stars'..."
                            disabled={isTyping}
                        />
                        <button 
                            className="send-button" 
                            onClick={handleSend}
                            disabled={isTyping || !inputValue.trim()}
                            title="Send message"
                        >
                            {isTyping ? '...' : 'Send'}
                        </button>
                    </div>
                    
                    <div className="chatbot-footer">
                        <small>💡 Try searching by color, category, or rating!</small>
                    </div>
                </div>
            )}

            <button className="chatbot-toggle-btn" onClick={toggleChat}>
                <span className="chat-icon">💬</span>
                <span className="chat-text">
                    {isOpen ? 'Close Assistant' : 'Shopping Assistant'}
                </span>
            </button>
        </div>
    );
};

export default Chatbot;