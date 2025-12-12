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
                Delta-Neutral Yields on Hyperliquid
            </motion.h2>

            <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Abstract</h3>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    The $160B+ stablecoin market is hungry for yield. Delta-neutral funding rate arbitrage has long been one of the most reliable yield sources in crypto—but the alpha on centralized exchanges is dying. Yields have compressed to 5-8% as institutional capital floods in, counterparty risk remains ever-present, and the largest platforms are increasingly allocating to T-Bills, capping returns at the risk-free rate of ~4.5%.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    <strong>The alpha has moved to Perp DEXes. That's where Deploy operates.</strong>
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    Deploy is battle-tested financial infrastructure that captures delta-neutral yields on Hyperliquid—delivering 15-25% APY through perpetual futures funding rate arbitrage. Higher funding rates, deeper liquidity, and full on-chain transparency. Users deposit stablecoins, receive dUSD, and earn yield automatically while maintaining full control of their assets.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    The strategy is simple: when crypto markets are bullish (most of the time), longs pay shorts. Deploy maintains delta-neutral positions, collecting the funding rate premium without directional exposure. This yield is structural—it has existed on more than 95% of all trading days since perpetual futures were invented.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl">
                    This is not speculation. This is infrastructure that has already survived extreme market cycles, delivered positive returns during every crash, and attracted $15M+ in deposits with zero liquidations. Our pilot phase proved the demand—now we're scaling.
                </p>

                <div className="mt-8 font-serif italic text-lg text-paper-accent">
                    Hedge the volatility. Unlock more yield.
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
