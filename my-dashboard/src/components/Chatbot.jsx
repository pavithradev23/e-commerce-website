import React, { useState, useRef, useEffect } from 'react';
import '../chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // 🔧 YOUR GOOGLE APPS SCRIPT URL
    const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxViz3t-97Ka-LBBcMBONVKGjy3refyfA_P7i0vBz23_QHBcZIHCN-aRJBetulIBuijdQ/exec";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = { id: Date.now(), text: inputValue, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Create unique callback name
        const callbackName = `chatbotCallback_${Date.now()}`;
        
        // Create JSONP script element
        const script = document.createElement('script');
        const encodedMessage = encodeURIComponent(inputValue);
        script.src = `${BACKEND_URL}?q=${encodedMessage}&callback=${callbackName}`;
        
        // Set up callback function
        // Set up callback function
window[callbackName] = (data) => {
    // Clean up
    delete window[callbackName];
    if (script.parentNode) {
        script.parentNode.removeChild(script);
    }
    
    console.log('✅ JSONP Response:', data);
    
    // Handle response
    if (data.candidates && data.candidates[0]) {
        const botMessage = { 
            id: Date.now() + 1, 
            text: data.candidates[0].content.parts[0].text, 
            isUser: false 
        };
        setMessages(prev => [...prev, botMessage]);
    } else if (data.error) {
        // Check if error is an object or string
        let errorMessage = '';
        if (typeof data.error === 'string') {
            errorMessage = data.error;
        } else if (data.error.message) {
            errorMessage = data.error.message;
        } else {
            errorMessage = JSON.stringify(data.error);
        }
        
        const errorMsg = { 
            id: Date.now() + 1, 
            text: `AI Error: ${errorMessage}`, 
            isUser: false 
        };
        setMessages(prev => [...prev, errorMsg]);
    } else {
        console.warn('Unexpected response format:', data);
        const errorMsg = { 
            id: Date.now() + 1, 
            text: `Unexpected response: ${JSON.stringify(data).substring(0, 100)}`, 
            isUser: false 
        };
        setMessages(prev => [...prev, errorMsg]);
    }
    
    setIsTyping(false);
};

        // Set timeout for error handling
        setTimeout(() => {
            if (window[callbackName]) {
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                const errorMessage = { 
                    id: Date.now() + 1, 
                    text: 'Request timeout. Please try again.', 
                    isUser: false 
                };
                setMessages(prev => [...prev, errorMessage]);
                setIsTyping(false);
            }
        }, 10000);

        // Append script to trigger JSONP request
        document.body.appendChild(script);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
        ]);
    };

    return (
        <div className="chatbot-container">
            {/* Chatbot Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <span className="chatbot-icon">🤖</span>
                            <span className="chatbot-name">AI Assistant</span>
                        </div>
                        <div className="chatbot-actions">
                            <button className="chatbot-clear-btn" onClick={clearChat} title="Clear chat">
                                🗑️
                            </button>
                            <button className="chatbot-close-btn" onClick={toggleChat} title="Close chat">
                                ×
                            </button>
                        </div>
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div 
                                key={msg.id} 
                                className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span>AI is typing...</span>
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
                            placeholder="Type your message here..."
                            disabled={isTyping}
                        />
                        <button 
                            className="send-button" 
                            onClick={handleSend}
                            disabled={isTyping || !inputValue.trim()}
                        >
                            {isTyping ? '...' : '→'}
                        </button>
                    </div>
                    
                    <div className="chatbot-footer">
                        <small>Powered by Google Gemini AI</small>
                    </div>
                </div>
            )}

            {/* Chatbot Toggle Button */}
            <button className="chatbot-toggle-btn" onClick={toggleChat}>
                <span className="chat-icon">💬</span>
                <span className="chat-text">
                    {isOpen ? 'Close Chat' : 'Chat with AI'}
                </span>
            </button>
        </div>
    );
};

export default Chatbot;