import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import Navbar from './Navbar';

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
    const [activeSection, setActiveSection] = useState('hero');
    const [isTocOpen, setIsTocOpen] = useState(false);

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

            {/* Shared Navbar */}
            <Navbar 
                onOpenChat={onOpenChat} 
                onToggleSidebar={() => setIsTocOpen(!isTocOpen)}
                showSidebarToggle={true}
            />

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
                            <a href="https://x.com/DeployFinance" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>
                            <a href="https://t.me/DeployFinanceChat" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Telegram</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Layout;
