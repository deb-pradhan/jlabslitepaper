import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, MessageSquare } from 'lucide-react';

const NoiseOverlay = () => <div className="noise-overlay" />;

// Table of Contents items for litepaper
const tocItems = [
    { id: 'hero', label: 'Abstract' },
    { id: 'intro', label: '1. The Idle Majority' },
    { id: 'thesis', label: '2. Economic Thesis' },
    { id: 'overview', label: '3. What Deploy Is' },
    { id: 'product', label: '4. Product Stack' },
    { id: 'sustainability', label: '5. Structural Yield' },
    { id: 'yaas', label: '6. Yield as a Service' },
    { id: 'transparency', label: '7. Transparency' },
    { id: 'roadmap', label: '8. Roadmap' },
    { id: 'invitation', label: '9. An Open Invitation' },
];

const Layout = ({ children, onOpenChat }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [activeSection, setActiveSection] = useState('hero');
    const [isTocOpen, setIsTocOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Litepaper' },
        { path: '/pitch', label: 'Pitch Deck' },
        { path: '/faq', label: 'FAQ' },
    ];

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            let current = '';

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

                <div className="flex items-center gap-2">
                    {/* Mobile TOC Toggle */}
                    <button
                        onClick={() => setIsTocOpen(!isTocOpen)}
                        className="lg:hidden p-2 border border-black hover:bg-black hover:text-white transition-colors"
                    >
                        {isTocOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    {/* Ask AI Button */}
                    <button
                        onClick={onOpenChat}
                        className="flex items-center gap-2 px-4 py-2 border border-black font-mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Ask AI</span>
                    </button>

                    <a 
                        href="https://app.deploy.finance/dashboard?ref=MBRY6BF8" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-black font-mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        Launch App
                    </a>
                </div>
            </header>

            {/* Sidebar / Table of Contents */}
            <aside className={clsx(
                "fixed left-0 top-14 md:top-16 bottom-0 w-64 border-r border-black bg-bone/95 backdrop-blur-md overflow-y-auto transition-transform duration-300 z-40",
                isTocOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6">
                    <div className="mb-6 pb-4 border-b border-black/20">
                        <h2 className="font-serif text-lg font-bold">Contents</h2>
                        <p className="text-[10px] uppercase tracking-widest text-black/50 mt-1">November 2025</p>
                    </div>

                    <ul className="space-y-1">
                        {tocItems.map((item, index) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    onClick={() => setIsTocOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 py-2 px-3 text-sm transition-colors border-l-2",
                                        activeSection === item.id
                                            ? "border-accent text-black font-medium bg-black/5"
                                            : "border-transparent text-black/60 hover:text-black hover:border-black/30"
                                    )}
                                >
                                    <span className="font-mono text-[10px] text-black/40">
                                        {String(index).padStart(2, '0')}
                                    </span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isTocOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsTocOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="pt-14 md:pt-16 lg:pl-64 min-h-screen">
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
