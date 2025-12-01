import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, MessageSquare } from 'lucide-react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import EconomicThesis from '../components/EconomicThesis';
import TechnicalArchitecture from '../components/TechnicalArchitecture';
import ProductEcosystem from '../components/ProductEcosystem';
import RiskManagement from '../components/RiskManagement';
import EfficiencyPerformance from '../components/EfficiencyPerformance';
import Transparency from '../components/Transparency';
import Roadmap from '../components/Roadmap';
import Conclusion from '../components/Conclusion';

// ============================================================================
// CHAT SIDEBAR COMPONENT
// ============================================================================

const ChatMessage = ({ message, isUser }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
        <div className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            ${isUser ? 'bg-accent text-white' : 'bg-black text-white'}
        `}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        <div className={`
            max-w-[80%] p-3 text-sm leading-relaxed
            ${isUser 
                ? 'bg-accent text-white rounded-2xl rounded-tr-sm' 
                : 'bg-black/5 text-black rounded-2xl rounded-tl-sm'
            }
        `}>
            {message}
        </div>
    </motion.div>
);

const ChatSidebar = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { text: "Hi! I'm the Deploy AI assistant. Ask me anything about Deploy, D-Assets, yield strategies, or how to get started.", isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        
        const newMessages = [...messages, { text: userMessage, isUser: true }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { text: data.reply, isUser: false }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { 
                text: "Sorry, I'm having trouble connecting right now. Please try again or reach out to hello@deploy.finance for assistance.", 
                isUser: false 
            }]);
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

    return (
        <>
            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? 0 : '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-14 md:top-16 bottom-0 w-full sm:w-96 bg-bone border-l border-black z-50 flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-black flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold">Deploy AI</h3>
                            <p className="text-[10px] uppercase tracking-widest text-black/50">Ask anything</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-black/5 rounded-2xl rounded-tl-sm p-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-black/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-black/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-black/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-black">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about Deploy..."
                            className="flex-1 px-4 py-3 bg-white border border-black text-sm font-mono placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="px-4 py-3 bg-accent text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[10px] text-black/40 mt-2 text-center">
                        Powered by Deploy AI • Responses may not always be accurate
                    </p>
                </div>
            </motion.aside>
        </>
    );
};

// ============================================================================
// MAIN LITEPAPER PAGE
// ============================================================================

function Litepaper() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <Layout onOpenChat={() => setIsChatOpen(true)}>
                <Hero />
                <Introduction />
                <EconomicThesis />
                <TechnicalArchitecture />
                <ProductEcosystem />
                <RiskManagement />
                <EfficiencyPerformance />
                <Transparency />
                <Roadmap />
                <Conclusion />
            </Layout>

            {/* Chat Sidebar */}
            <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* Floating Chat Button (mobile) */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-black transition-colors z-40 lg:hidden"
            >
                <MessageSquare className="w-6 h-6" />
            </button>
        </>
    );
}

export default Litepaper;
