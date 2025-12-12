import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center mb-24 border-b border-paper-border pb-12">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <span className="inline-block px-3 py-1 rounded-full bg-paper-border text-xs font-mono text-paper-muted mb-6">
                    NOVEMBER 2025
                </span>
            </motion.div>

            <motion.h1
                className="text-4xl md:text-7xl font-serif font-bold text-paper-text mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
                Deploy Litepaper
            </motion.h1>
            <motion.h2
                className="text-xl md:text-3xl font-serif text-paper-muted mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                The Neobank for the Digital Age
            </motion.h2>

            <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Abstract</h3>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    The cryptocurrency ecosystem has matured into a multi trillion dollar asset class, yet the majority of its capital remains idle. More than one trillion dollars sits unproductive in wallets and vaults, earning nothing. Holders face a painful trade-off: keep full control and accept zero yield, or chase returns through opaque protocols, centralized custodians, or unsustainable token emission schemes that regularly collapse.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    <strong>Deploy ends this false choice.</strong>
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    Deploy is battle tested, self custodial financial infrastructure that automatically converts idle Bitcoin, Ethereum, and stablecoins into productive, high quality collateral called D Assets. These assets remain fully under the user’s control while continuously harvesting the most reliable and uncorrelated yield source in crypto: perpetual futures funding rates.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    The ultimate vision is far larger than another yield optimizer. Deploy is building the first true Neobank of the crypto era, a universal financial layer where individuals and institutions never need to sell their superior assets to live, spend, borrow, or grow wealth. Hold value in Bitcoin and Ethereum. Hold debt and daily spending power in DUSD, the yield-bearing stablecoin that finally makes “inferior money” work for you instead of against you.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl">
                    This is not speculation. This is infrastructure that has already survived five years of extreme market cycles, delivered positive returns during every crash, and attracted high net worth individuals, family offices, and hedge funds with fifteen million dollars in deposits and zero liquidations.
                </p>

                <div className="mt-8 font-serif italic text-lg text-paper-accent">
                    The Neobank era starts now. Join us.
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
