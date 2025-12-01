import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================================================
// FAQ DATA
// ============================================================================

const faqCategories = [
    {
        title: "General",
        faqs: [
            {
                question: "What is Deploy?",
                answer: "Deploy is a self-custodial financial infrastructure that automatically converts idle Bitcoin, Ethereum, and stablecoins into productive, yield-generating collateral called D-Assets. Think of it as the first true Neobank of the crypto era—a universal financial layer where you never need to sell your superior assets to live, spend, borrow, or grow wealth."
            },
            {
                question: "How is Deploy different from other yield protocols?",
                answer: "Unlike traditional DeFi protocols that rely on token emissions, liquidity mining, or unsustainable incentives, Deploy harvests real yield from perpetual futures funding rates—one of the most reliable and uncorrelated yield sources in crypto. Our yield is structural, not speculative. It comes from genuine market demand, not from printing tokens."
            },
            {
                question: "Is Deploy a custodial service?",
                answer: "No. Deploy is completely self-custodial by design. Your assets remain fully under your control at all times. We never take custody of user funds. All operations are executed through smart contracts that you interact with directly from your own wallet."
            },
            {
                question: "Who is Deploy built for?",
                answer: "Deploy is built for everyone from retail holders who want their idle assets to work harder, to high-net-worth individuals seeking institutional-grade yields, to sovereign-scale institutions looking for transparent, verifiable yield infrastructure. Our B2B Yield-as-a-Service offering allows fintechs and payment companies to white-label our technology."
            }
        ]
    },
    {
        title: "D-Assets & DUSD",
        faqs: [
            {
                question: "What are D-Assets?",
                answer: "D-Assets are yield-enhanced versions of your original assets. When you deposit BTC, ETH, or stablecoins into Deploy, you receive D-Assets (dBTC, dETH, dUSD) that maintain 1:1 backing while continuously earning yield from funding rate arbitrage. D-Assets are liquid, transferable, and can be used as collateral."
            },
            {
                question: "What is DUSD?",
                answer: "DUSD is Deploy's yield-bearing stablecoin. Unlike traditional stablecoins that sit idle, DUSD automatically earns yield while maintaining its dollar peg. It's the 'inferior money' in our economic thesis—perfect for spending and daily transactions while your BTC and ETH holdings (the 'superior money') continue appreciating."
            },
            {
                question: "How do I mint D-Assets?",
                answer: "Simply connect your wallet to deploy.finance, select the asset you want to deposit (BTC, ETH, or stablecoins), and confirm the transaction. You'll receive the equivalent D-Asset in your wallet immediately. The process is permissionless and takes just a few seconds."
            },
            {
                question: "Can I redeem my D-Assets for the underlying asset?",
                answer: "Yes, D-Assets can be redeemed 1:1 for the underlying asset at any time. There are no lock-up periods or withdrawal delays. Your assets remain liquid and accessible whenever you need them."
            }
        ]
    },
    {
        title: "Yield & Returns",
        faqs: [
            {
                question: "Where does the yield come from?",
                answer: "Deploy's yield comes from perpetual futures funding rates. In perpetual futures markets, traders pay funding rates to maintain their positions. By taking the opposite side of crowded trades (typically shorting when the market is overly long), Deploy captures these funding payments. This is a structural, market-driven yield source that has existed since perpetual futures were invented."
            },
            {
                question: "What APY can I expect?",
                answer: "Historical funding rate yields have averaged 15-30% APY, though this varies with market conditions. During high volatility periods, yields can spike significantly higher. During quiet markets, yields may compress. We display real-time APY data directly from our live strategies on the platform."
            },
            {
                question: "Is the yield sustainable?",
                answer: "Yes. Unlike token emission schemes that inevitably dilute and collapse, funding rate yield is structural. It exists because of a fundamental market dynamic: speculators are willing to pay to maintain leveraged positions. As long as there are perpetual futures markets with traders taking directional bets, this yield source will exist."
            },
            {
                question: "How often is yield distributed?",
                answer: "Yield accrues continuously in real-time. Your D-Asset balance reflects accumulated yield automatically. There's no need to claim or harvest—your holdings simply grow over time."
            }
        ]
    },
    {
        title: "Security & Risk",
        faqs: [
            {
                question: "How does Deploy manage risk?",
                answer: "Deploy employs multiple layers of risk management: delta-neutral positioning ensures no directional market exposure, automated rebalancing maintains optimal hedge ratios, position limits prevent over-concentration, and multi-venue execution reduces counterparty risk. Our strategies have been battle-tested through multiple market cycles including major crashes."
            },
            {
                question: "What happens during a market crash?",
                answer: "Because Deploy maintains delta-neutral positions, market direction doesn't affect our core strategy. In fact, high volatility often increases funding rates, potentially boosting yields. Our systems automatically rebalance to maintain neutrality regardless of price movements."
            },
            {
                question: "Is my principal at risk?",
                answer: "While no investment is entirely without risk, Deploy's delta-neutral strategy is designed to preserve principal regardless of market direction. The main risks are smart contract risk (mitigated by audits and battle-testing), exchange counterparty risk (mitigated by multi-venue execution), and extreme funding rate scenarios (mitigated by position limits and automated risk controls)."
            },
            {
                question: "Has Deploy been audited?",
                answer: "Yes. Our smart contracts have undergone multiple security audits by leading blockchain security firms. Additionally, our strategies have been live and battle-tested for over five years across multiple market conditions, including the 2022 crash and various black swan events."
            }
        ]
    },
    {
        title: "Transparency & Verification",
        faqs: [
            {
                question: "Can I verify Deploy's trading activity?",
                answer: "Absolutely. Every single trade and transaction is verifiable on-chain. You can independently audit our positions using blockchain explorers like Hypurrscan. We believe transparency is not a marketing feature—it's a fundamental requirement for institutional trust."
            },
            {
                question: "How can I track my portfolio performance?",
                answer: "The Deploy dashboard provides real-time visibility into your holdings, accumulated yield, historical performance, and current strategy allocation. All data is pulled directly from on-chain sources, ensuring accuracy and verifiability."
            },
            {
                question: "Does Deploy publish proof of reserves?",
                answer: "Yes. All reserves are verifiable on-chain in real-time. Unlike centralized platforms that publish periodic attestations, our proof of reserves is continuous and permissionlessly auditable by anyone at any time."
            }
        ]
    },
    {
        title: "Getting Started",
        faqs: [
            {
                question: "What wallets are supported?",
                answer: "Deploy supports all major Web3 wallets including MetaMask, WalletConnect-compatible wallets, Coinbase Wallet, Rainbow, and hardware wallets like Ledger and Trezor. Any wallet that can connect to Ethereum-based applications will work."
            },
            {
                question: "What are the minimum deposit amounts?",
                answer: "There are no minimum deposit requirements. Whether you're depositing $100 or $100 million, Deploy's infrastructure scales to accommodate all sizes. Our B2B partners may have different minimums based on their specific implementations."
            },
            {
                question: "Are there any fees?",
                answer: "Deploy charges a performance fee on generated yield—you only pay when you earn. There are no deposit fees, withdrawal fees, or management fees. Our interests are fully aligned with yours: we only make money when you make money."
            },
            {
                question: "How do I get started?",
                answer: "Visit deploy.finance, connect your wallet, choose the asset you want to deposit, and confirm the transaction. That's it. The entire process takes less than a minute. Your assets will immediately begin earning yield."
            }
        ]
    }
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

const NoiseOverlay = () => <div className="noise-overlay" />;

const GridBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 flex justify-between px-6 md:px-24">
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-px h-full bg-black/10 ${i > 0 && i < 5 ? 'hidden md:block' : ''}`} />
            ))}
        </div>
    </div>
);

// ============================================================================
// FAQ ACCORDION COMPONENT
// ============================================================================

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-black">
        <button
            onClick={onClick}
            className="w-full py-5 md:py-6 flex items-start justify-between gap-4 text-left hover:bg-black/5 transition-colors px-4 md:px-6"
        >
            <span className="font-serif text-lg md:text-xl">{question}</span>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mt-1"
            >
                <ChevronDown className="w-5 h-5" />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="px-4 md:px-6 pb-6 text-black/70 leading-relaxed">
                        {answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQCategory = ({ title, faqs, openIndex, setOpenIndex, categoryIndex }) => (
    <div className="mb-12 md:mb-16">
        <div className="flex items-baseline gap-4 mb-6 border-b border-black pb-4">
            <span className="font-mono text-xs md:text-sm text-black/40">
                {String(categoryIndex + 1).padStart(2, '0')}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif">{title}</h2>
        </div>
        <div className="border-t border-black">
            {faqs.map((faq, i) => {
                const globalIndex = `${categoryIndex}-${i}`;
                return (
                    <FAQItem
                        key={i}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === globalIndex}
                        onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                    />
                );
            })}
        </div>
    </div>
);

// ============================================================================
// MAIN FAQ PAGE
// ============================================================================

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="pitch-deck-container font-mono min-h-screen bg-bone text-black relative">
            <NoiseOverlay />
            <GridBackground />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-14 md:h-16 border-b border-black z-50 flex items-center justify-between px-4 md:px-6 backdrop-blur-md bg-bone/80">
                <img 
                    src="/deploy_logo.png" 
                    alt="Deploy." 
                    className="h-5 md:h-6" 
                />
                
                <nav className="hidden md:flex border border-black">
                    <Link
                        to="/"
                        className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border-r border-black hover:bg-black hover:text-white transition-colors"
                    >
                        Litepaper
                    </Link>
                    <Link
                        to="/pitch"
                        className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border-r border-black hover:bg-black hover:text-white transition-colors"
                    >
                        Pitch Deck
                    </Link>
                    <Link
                        to="/faq"
                        className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-accent text-white"
                    >
                        FAQ
                    </Link>
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
            <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-16 lg:px-24 max-w-5xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="mb-16 md:mb-24">
                    <Link 
                        to="/pitch" 
                        className="inline-flex items-center gap-2 text-black/50 hover:text-black transition-colors mb-8 font-mono text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Pitch Deck
                    </Link>
                    
                    <div className="font-mono text-[11px] md:text-xs tracking-[0.25em] uppercase mb-4 text-black/40">
                        Frequently Asked Questions
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6">
                        Everything you need to know about <span className="text-accent italic">Deploy</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
                        Can't find what you're looking for? Reach out to our team at{' '}
                        <a href="mailto:hello@deploy.finance" className="text-accent hover:underline">
                            hello@deploy.finance
                        </a>
                    </p>
                </div>

                {/* FAQ Categories */}
                {faqCategories.map((category, i) => (
                    <FAQCategory
                        key={i}
                        title={category.title}
                        faqs={category.faqs}
                        openIndex={openIndex}
                        setOpenIndex={setOpenIndex}
                        categoryIndex={i}
                    />
                ))}

                {/* CTA Section */}
                <div className="mt-16 md:mt-24 p-8 md:p-12 border-2 border-black bg-black text-white text-center">
                    <h2 className="text-2xl md:text-3xl font-serif mb-4">Ready to put your assets to work?</h2>
                    <p className="text-white/60 mb-8 max-w-lg mx-auto">
                        Join thousands of users already earning real yield on their crypto holdings.
                    </p>
                    <a 
                        href="https://deploy.finance" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-accent text-white font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                        Launch App
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-black px-6 md:px-16 lg:px-24 py-8 relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="font-mono text-xs text-black/50">
                        © 2025 Deploy Finance. All Rights Reserved.
                    </div>
                    <div className="flex gap-6 font-mono text-xs">
                        <Link to="/" className="hover:text-accent transition-colors">Litepaper</Link>
                        <Link to="/pitch" className="hover:text-accent transition-colors">Pitch Deck</Link>
                        <a href="https://twitter.com/deploy_finance" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>
                        <a href="https://discord.gg/deploy" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Discord</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FAQ;

