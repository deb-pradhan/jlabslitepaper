import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { path: '/', label: 'Litepaper' },
    { path: '/pitch', label: 'Pitch Deck' },
    { path: '/faq', label: 'FAQ' },
];

const Navbar = ({ dark = false, onOpenChat, onToggleSidebar, showSidebarToggle = false }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className={`
                fixed top-0 left-0 right-0 h-14 md:h-16 
                border-b z-50 
                flex items-center justify-between 
                px-4 md:px-6 
                backdrop-blur-md transition-colors duration-300
                ${dark ? 'border-white/10 bg-black/80' : 'border-black bg-bone/80'}
            `}>
                {/* Left: Logo + Sidebar Toggle */}
                <div className="flex items-center gap-3">
                    {showSidebarToggle && (
                        <button
                            onClick={onToggleSidebar}
                            className={`hidden md:block lg:hidden p-2 border transition-colors ${
                                dark 
                                    ? 'border-white/20 hover:bg-white hover:text-black' 
                                    : 'border-black hover:bg-black hover:text-white'
                            }`}
                        >
                            <Menu size={18} />
                        </button>
                    )}
                    <Link to="/">
                        <img 
                            src="/deploy_logo.png" 
                            alt="Deploy." 
                            className={`h-5 md:h-6 ${dark ? 'invert' : ''}`} 
                        />
                    </Link>
                </div>
                
                {/* Center: Desktop Nav */}
                <nav className={`hidden md:flex border ${dark ? 'border-white/20' : 'border-black'}`}>
                    {navItems.map((item, index) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors
                                ${index < navItems.length - 1 ? (dark ? 'border-r border-white/20' : 'border-r border-black') : ''}
                                ${currentPath === item.path 
                                    ? 'bg-accent text-white' 
                                    : dark
                                        ? 'hover:bg-white hover:text-black'
                                        : 'hover:bg-black hover:text-white'
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`
                            md:hidden p-2 border transition-colors
                            ${dark 
                                ? 'border-white/20 hover:bg-white hover:text-black' 
                                : 'border-black hover:bg-black hover:text-white'
                            }
                        `}
                    >
                        <Menu size={18} />
                    </button>

                    {/* Ask AI Button */}
                    {onOpenChat && (
                        <button
                            onClick={onOpenChat}
                            className={`
                                hidden sm:flex items-center gap-2 px-4 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors
                                ${dark 
                                    ? 'border-white/20 hover:bg-white hover:text-black' 
                                    : 'border-black hover:bg-black hover:text-white'
                                }
                            `}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Ask AI</span>
                        </button>
                    )}

                    <a 
                        href="https://app.deploy.finance/dashboard?ref=MBRY6BF8" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`
                            px-4 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors
                            ${dark 
                                ? 'border-white/20 hover:bg-white hover:text-black' 
                                : 'border-black hover:bg-black hover:text-white'
                            }
                        `}
                    >
                        Launch App
                    </a>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-bone z-[60] flex flex-col md:hidden"
                    >
                        {/* Menu Header */}
                        <div className="h-14 border-b border-black flex items-center justify-between px-4 flex-shrink-0">
                            <img src="/deploy_logo.png" alt="Deploy." className="h-5" />
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <nav className="flex-1 overflow-y-auto">
                            {navItems.map((item, i) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        w-full text-left px-6 py-5 
                                        border-b border-black/20 
                                        font-serif text-xl 
                                        transition-colors 
                                        flex items-center justify-between
                                        ${currentPath === item.path ? 'bg-accent text-white' : 'bg-transparent text-black hover:bg-black/5'}
                                    `}
                                >
                                    <span>{item.label}</span>
                                    <span className="font-mono text-xs opacity-50">{String(i + 1).padStart(2, '0')}</span>
                                </Link>
                            ))}
                        </nav>
                        
                        {/* Menu Footer */}
                        <div className="p-6 border-t border-black bg-black text-white flex-shrink-0">
                            <a 
                                href="https://app.deploy.finance/dashboard?ref=MBRY6BF8" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-accent text-white text-center font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                            >
                                Launch App
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
