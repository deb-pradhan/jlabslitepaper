import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const Section = ({ id, title, subtitle, children, className }) => {
    return (
        <motion.section
            id={id}
            className={clsx("mb-24 scroll-mt-24", className)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {(title || subtitle) && (
                <header className="mb-8 pb-4 border-b border-paper-border">
                    {subtitle && (
                        <span className="block text-paper-muted font-sans text-sm tracking-wider uppercase mb-2">
                            {subtitle}
                        </span>
                    )}
                    {title && (
                        <h2 className="text-3xl font-serif font-bold text-paper-text">
                            {title}
                        </h2>
                    )}
                </header>
            )}

            <div className="prose prose-slate max-w-none text-paper-text">
                {children}
            </div>
        </motion.section>
    );
};

export default Section;
