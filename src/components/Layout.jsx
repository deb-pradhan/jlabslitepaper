import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NoiseOverlay = () => <div className="noise-overlay" />;

const Layout = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/', label: 'Litepaper' },
        { path: '/pitch', label: 'Pitch Deck' },
        { path: '/faq', label: 'FAQ' },
    ];

    return (
        <div className="pitch-deck-container font-mono min-h-screen bg-bone text-black relative">
            <NoiseOverlay />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-14 md:h-16 border-b border-black z-50 flex items-center justify-between px-4 md:px-6 backdrop-blur-md bg-bone/80">
                <Link to="/">
                    <img 
                        src="/deploy_logo.png" 
                        alt="Deploy." 
                        className="h-5 md:h-6" 
                    />
                </Link>
                
                <nav className="hidden md:flex border border-black">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors
                                ${index < navItems.length - 1 ? 'border-r border-black' : ''}
                                ${currentPath === item.path 
                                    ? 'bg-accent text-white' 
                                    : 'hover:bg-black hover:text-white'
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <a 
                    href="https://deploy.finance" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-black font-mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                    Launch App
                </a>
            </header>

            {/* Main Content */}
            <main className="pt-20 md:pt-24 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {children}
                </div>

                {/* Footer */}
                <footer className="border-t border-black px-6 py-8">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="font-mono text-xs text-black/50">
                            © 2025 Deploy Finance. All Rights Reserved.
                        </div>
                        <div className="flex gap-6 font-mono text-xs">
                            <Link to="/" className="hover:text-accent transition-colors">Litepaper</Link>
                            <Link to="/pitch" className="hover:text-accent transition-colors">Pitch Deck</Link>
                            <Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link>
                            <a href="https://twitter.com/deploy_finance" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>
                            <a href="https://discord.gg/deploy" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Discord</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Layout;
