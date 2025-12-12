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
                Volatility Neutral. Yield Positive.
            </motion.h2>

            <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Abstract</h3>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    The $160B+ stablecoin market is seeking yield. With traditional yields compressing and DeFi complexity rising, capital seeks efficient, risk-adjusted returns. More than 80% of stablecoin supply earns zero yield. Holders face a painful trade-off: keep full control and accept nothing, or chase returns through opaque protocols, centralized custodians, or unsustainable token emission schemes that regularly collapse.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    <strong>Deploy ends this false choice.</strong>
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    Deploy is battle-tested, self-custodial financial infrastructure that unlocks sustainable yield through delta-neutral strategies on perpetual DEXes. While CEX funding rates have compressed to 3-5% and platforms like Ethena allocate heavily to T-Bills, the alpha has moved to Hyperliquid and other on-chain venues where funding rates consistently deliver 15-25% APY.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl mb-6">
                    dUSD is the yield-bearing stablecoin at the core of Deploy. Deposit stablecoins, receive dUSD, and let delta-neutral strategies work for you—automatically. No lockups, no token emissions, no complexity. Just real yield from genuine market demand.
                </p>
                <p className="text-paper-text leading-relaxed max-w-3xl">
                    This is not speculation. Our private beta hit $15M TVL in 2 weeks with no marketing, generated $1.6M in yield, and attracted 2,000+ wallets—all with zero incidents. $80M+ in TVL is already committed for public launch.
                </p>

                <div className="mt-8 font-serif italic text-lg text-paper-accent">
                    Hedge the volatility. Unlock more yield. Join us.
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
