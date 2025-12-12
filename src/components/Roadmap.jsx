import React from 'react';
import Section from './Section';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const Roadmap = () => {
    return (
        <Section id="roadmap" subtitle="8. Roadmap" title="$80M+ Committed — Scaling to Billions">
            <motion.div
                className="relative border-l border-paper-border ml-4 md:ml-6 space-y-8 py-4 not-prose"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {/* Milestone 1 */}
                <motion.div className="relative pl-8 md:pl-12 group" variants={itemVariants}>
                    {/* Timeline Dot */}
                    <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-paper-accent ring-4 ring-paper-bg group-hover:scale-125 transition-transform duration-300"></div>

                    {/* Content Card */}
                    <div className="bg-paper-card p-6 rounded-xl border border-paper-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <span className="inline-block px-2 py-1 rounded bg-paper-bg text-xs font-bold uppercase tracking-wider text-paper-muted mb-3 border border-paper-border">
                            January 2026
                        </span>
                        <h4 className="text-lg md:text-xl font-serif font-bold mb-2 text-paper-text">
                            dUSD Public Launch
                        </h4>
                        <p className="text-paper-muted leading-relaxed">
                            Launch on Ethereum mainnet with $80M+ TVL committed from strategic LPs and institutional partners.
                        </p>
                    </div>
                </motion.div>

                {/* Milestone 2 */}
                <motion.div className="relative pl-8 md:pl-12 group" variants={itemVariants}>
                    <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-paper-accent ring-4 ring-paper-bg group-hover:scale-125 transition-transform duration-300"></div>

                    <div className="bg-paper-card p-6 rounded-xl border border-paper-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <span className="inline-block px-2 py-1 rounded bg-paper-bg text-xs font-bold uppercase tracking-wider text-paper-muted mb-3 border border-paper-border">
                            Q1 2026
                        </span>
                        <h4 className="text-lg md:text-xl font-serif font-bold mb-2 text-paper-text">
                            Transparency Dashboard
                        </h4>
                        <p className="text-paper-muted leading-relaxed">
                            Full transparency dashboard and third-party attestations live.
                        </p>
                    </div>
                </motion.div>

                {/* Milestone 3 */}
                <motion.div className="relative pl-8 md:pl-12 group" variants={itemVariants}>
                    <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-paper-accent ring-4 ring-paper-bg group-hover:scale-125 transition-transform duration-300"></div>

                    <div className="bg-paper-card p-6 rounded-xl border border-paper-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <span className="inline-block px-2 py-1 rounded bg-paper-bg text-xs font-bold uppercase tracking-wider text-paper-muted mb-3 border border-paper-border">
                            Q1–Q2 2026
                        </span>
                        <h4 className="text-lg md:text-xl font-serif font-bold mb-2 text-paper-text">
                            Integrations & Spending
                        </h4>
                        <p className="text-paper-muted leading-relaxed">
                            First wave of major lending-protocol integrations and physical debit-card spending via partners.
                        </p>
                    </div>
                </motion.div>

                {/* Milestone 4 */}
                <motion.div className="relative pl-8 md:pl-12 group" variants={itemVariants}>
                    <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-paper-accent ring-4 ring-paper-bg group-hover:scale-125 transition-transform duration-300"></div>

                    <div className="bg-paper-card p-6 rounded-xl border border-paper-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <span className="inline-block px-2 py-1 rounded bg-paper-bg text-xs font-bold uppercase tracking-wider text-paper-muted mb-3 border border-paper-border">
                            Mid-2026
                        </span>
                        <h4 className="text-lg md:text-xl font-serif font-bold mb-2 text-paper-text">
                            Privacy & Enterprise
                        </h4>
                        <p className="text-paper-muted leading-relaxed">
                            Privacy-enhanced DUSD and Canton Network enterprise deployment.
                        </p>
                    </div>
                </motion.div>

                {/* Milestone 5 */}
                <motion.div className="relative pl-8 md:pl-12 group" variants={itemVariants}>
                    <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-paper-accent ring-4 ring-paper-bg group-hover:scale-125 transition-transform duration-300"></div>

                    <div className="bg-paper-card p-6 rounded-xl border border-paper-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <span className="inline-block px-2 py-1 rounded bg-paper-bg text-xs font-bold uppercase tracking-wider text-paper-muted mb-3 border border-paper-border">
                            2026–2027
                        </span>
                        <h4 className="text-lg md:text-xl font-serif font-bold mb-2 text-paper-text">
                            Scale to Billions
                        </h4>
                        <p className="text-paper-muted leading-relaxed">
                            $500 million → $2 billion+ TVL as network effects compound.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    );
};

export default Roadmap;
