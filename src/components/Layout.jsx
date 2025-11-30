import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-paper-bg text-paper-text font-sans">
            <Sidebar />

            <main className="lg:pl-64 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
                    {children}
                </div>

                <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-paper-border mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-paper-muted">
                    <div>
                        © 2025 Deploy Finance. All Rights Reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link to="/pitch" className="hover:text-paper-text transition-colors font-medium">Pitch Deck</Link>
                        <a href="#" className="hover:text-paper-text transition-colors">Twitter</a>
                        <a href="#" className="hover:text-paper-text transition-colors">Discord</a>
                        <a href="#" className="hover:text-paper-text transition-colors">GitHub</a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Layout;
