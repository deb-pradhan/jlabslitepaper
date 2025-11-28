import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Users, ArrowRight, Lock, Activity, Globe, ChevronRight, Layers, Landmark, Code, Terminal, Zap, Wallet, User, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

// --- Assets & Data ---
const SLIDES = [
    'Title',
    'Conflict',
    'Philosophy',
    'Solution',
    'Product',
    'Traction',
    'Moat',
    'Engine',
    'Team',
    'Ask'
];

// --- Shared Components ---

const NoiseOverlay = () => (
    <div className="noise-overlay" />
);

const GridBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 flex justify-between px-4 md:px-24">
            <div className="w-px h-full bg-black opacity-10" />
            <div className="w-px h-full bg-black opacity-10 hidden md:block" />
            <div className="w-px h-full bg-black hidden md:block opacity-10" />
            <div className="w-px h-full bg-black hidden md:block opacity-10" />
            <div className="w-px h-full bg-black opacity-10 hidden md:block" />
            <div className="w-px h-full bg-black opacity-10" />
        </div>
    </div>
);

const SlideContainer = ({ children, className = "", dark = false }) => (
    <div className={`relative w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-24 py-20 md:py-0 overflow-x-hidden ${dark ? 'bg-black text-white' : 'bg-bone text-black'} ${className}`}>
        {children}
    </div>
);

const AnimatedNumber = ({ value, prefix = "", suffix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        if (start === end) return;
        
        let timer = setInterval(() => {
            start += end / 40; 
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setDisplayValue(start.toFixed(value % 1 === 0 ? 0 : 1));
        }, 25);

        return () => clearInterval(timer);
    }, [value]);

    return <span className="tabular-nums tracking-tighter">{prefix}{displayValue}{suffix}</span>;
};

// --- SLIDE 1: Title Card & Category Definition ---
const TitleSlide = () => (
    <SlideContainer>
        <div className="relative z-10 w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center md:text-left"
            >
                {/* Category Badge */}
                <div className="inline-flex items-center gap-3 mb-8 md:mb-12 border border-black px-4 py-2 bg-white">
                    <div className="w-2 h-2 bg-accent" />
                    <span className="font-mono text-xs tracking-[0.3em] uppercase">Autonomous Finance Infrastructure</span>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-5xl md:text-[10rem] font-serif text-black leading-[0.85] mb-8 md:mb-12 tracking-tight">
                    <span className="block">Deploy</span>
                    <span className="block text-accent italic">Finance</span>
                </h1>
                
                {/* Sub-headline: 5-word summary */}
                <p className="text-xl md:text-3xl font-mono text-black/80 mb-12 md:mb-16 max-w-2xl">
                    Yield infrastructure for idle capital.
                </p>
                
                {/* CTAs */}
                <div className="flex flex-col md:flex-row gap-4">
                    <a href="http://litepaper.deploy.finance/" target="_blank" rel="noopener noreferrer" className="px-8 py-5 min-h-[56px] text-sm font-mono font-bold uppercase tracking-wider bg-accent text-white border border-accent hover:bg-black hover:border-black transition-all text-center">
                        Read Litepaper
                    </a>
                    <a href="mailto:hello@deploy.finance" className="px-8 py-5 min-h-[56px] text-sm font-mono font-bold uppercase tracking-wider bg-transparent text-black border border-black hover:bg-black hover:text-white transition-all text-center">
                        Contact Us
                    </a>
                </div>
            </motion.div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-8 left-0 w-full h-1 bg-hatch hidden md:block" />
        </div>
    </SlideContainer>
);

// --- SLIDE 2: The Conflict (The "Villain") ---
const ConflictSlide = () => (
    <SlideContainer dark>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mb-6">01 — The Conflict</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-6xl font-serif leading-[1.1] mb-12 max-w-5xl">
                    Digital finance is rewriting the rules, but only <span className="text-accent italic">institutions</span> benefit.
                </h2>
                
                {/* The Problem Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                    <div className="border border-white/20 p-8 md:p-12">
                        <div className="text-6xl md:text-8xl font-serif text-accent mb-4">$1.6T</div>
                        <div className="font-mono text-sm uppercase tracking-wide text-white/60">Stablecoin market cap</div>
                    </div>
                    <div className="border border-white/20 p-8 md:p-12">
                        <div className="text-6xl md:text-8xl font-serif text-white/30 mb-4">80%</div>
                        <div className="font-mono text-sm uppercase tracking-wide text-white/60">Sits completely idle</div>
                    </div>
                </div>
                
                {/* Key Phrase */}
                <div className="border-l-2 border-accent pl-6 md:pl-8">
                    <p className="text-lg md:text-2xl font-mono text-white/80 leading-relaxed">
                        "The current system was built for a world that no longer exists. Retail capital deserves institutional-grade yield."
                    </p>
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 3: The Philosophy (The "Why Us") ---
const PhilosophySlide = () => (
    <SlideContainer>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 mb-6">02 — Our Philosophy</div>
                
                {/* Main Question */}
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-12 md:mb-16">
                    What makes us different?
                </h2>
                
                {/* Three Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black">
                    {[
                        { 
                            value: "Autonomous", 
                            desc: "No human intervention. Algorithms execute 24/7 across markets, capturing yield while you sleep.",
                            icon: Zap
                        },
                        { 
                            value: "Delta-Neutral", 
                            desc: "Zero directional risk. We profit from market inefficiencies, not price speculation.",
                            icon: Shield
                        },
                        { 
                            value: "Transparent", 
                            desc: "Real-time dashboards. Third-party attestations. Every position visible on-chain.",
                            icon: Activity
                        }
                    ].map((item, i) => (
                        <motion.div 
                            key={item.value}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-bone p-8 md:p-12 hover:bg-accent hover:text-white transition-colors group"
                        >
                            <item.icon className="w-8 h-8 md:w-12 md:h-12 mb-6 md:mb-8 stroke-1 text-accent group-hover:text-white" />
                            <h3 className="text-3xl md:text-4xl font-serif italic mb-4 group-hover:text-white">{item.value}</h3>
                            <p className="font-mono text-sm leading-relaxed opacity-70 group-hover:opacity-100 group-hover:text-white/90">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 4: The Solution (The "Hero") ---
const SolutionSlide = () => (
    <SlideContainer>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 mb-6">03 — The Solution</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-6xl font-serif leading-[1.1] mb-6">
                    Deploy puts <span className="text-accent italic">your capital</span> in control.
                </h2>
                
                <p className="text-lg md:text-xl font-mono text-black/60 mb-12 md:mb-16 max-w-3xl">
                    We are the foundation of a new yield economy. Deposit stablecoins, receive D-Assets, earn institutional-grade returns.
                </p>
                
                {/* How it Works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:border md:border-black">
                    {[
                        { step: "01", title: "Deposit", desc: "USDC, USDT, or DAI enters our secure vault system via audited smart contracts.", icon: Landmark },
                        { step: "02", title: "Auto-Hedge", desc: "Algorithms instantly deploy capital across delta-neutral strategies on Hyperliquid.", icon: Code },
                        { step: "03", title: "Earn D-Assets", desc: "Receive DUSD—a yield-bearing stablecoin representing your position.", icon: Layers }
                    ].map((item, i) => (
                        <div key={item.step} className={`p-8 md:p-12 border border-black md:border-0 ${i < 2 ? 'md:border-r' : ''} bg-white hover:bg-black hover:text-white transition-colors group`}>
                            <div className="font-mono text-xs text-accent group-hover:text-accent mb-6">STEP {item.step}</div>
                            <item.icon className="w-10 h-10 md:w-14 md:h-14 mb-6 stroke-1 text-black group-hover:text-white" />
                            <h3 className="text-2xl md:text-3xl font-serif italic mb-4 group-hover:text-white">{item.title}</h3>
                            <p className="font-mono text-sm leading-relaxed opacity-70 group-hover:opacity-100 group-hover:text-white/90">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 5: Product Experience ---
const ProductSlide = () => (
    <SlideContainer>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 mb-6">04 — The Product</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-12">
                    Enterprise-grade power.<br/>
                    <span className="text-accent italic">Consumer-grade</span> simplicity.
                </h2>
                
                {/* Product Preview */}
                <div className="border-2 border-black bg-white p-6 md:p-12 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Left: Key Features */}
                        <div className="space-y-6">
                            {[
                                { label: "One-Click Deposit", desc: "Connect wallet, deposit stablecoins, start earning. No complex setup." },
                                { label: "Real-Time Dashboard", desc: "Track your yield, positions, and strategy performance live." },
                                { label: "Instant Withdrawals", desc: "Your capital, your control. Withdraw anytime without lockups." }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-8 h-8 bg-accent text-white flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-mono text-sm font-bold uppercase mb-1">{feature.label}</div>
                                        <div className="font-mono text-xs text-black/60">{feature.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Right: Live APY Display */}
                        <div className="bg-bone border border-black p-8 flex flex-col justify-center">
                            <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">Current Live APY</div>
                            <div className="text-6xl md:text-8xl font-serif text-accent mb-4">22.6%</div>
                            <div className="font-mono text-xs uppercase tracking-widest text-black/60">Income: Funding Rate Strategy</div>
                            <div className="mt-6 pt-6 border-t border-black/20 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-2xl font-mono">6.1</div>
                                    <div className="font-mono text-[10px] uppercase text-black/40">Sharpe Ratio</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-mono">&lt;2%</div>
                                    <div className="font-mono text-[10px] uppercase text-black/40">Max Drawdown</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 6: Traction (Social Proof) ---
const TractionSlide = () => (
    <SlideContainer dark>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mb-6">05 — Traction</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-4">
                    <span className="text-accent">2,000+</span> wallets are already building with Deploy.
                </h2>
                <p className="text-lg font-mono text-white/50 mb-12 md:mb-16">The movement has already started.</p>
                
                {/* Hard Numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/20 mb-12">
                    {[
                        { label: "TVL", value: "15", prefix: "$", suffix: "M" },
                        { label: "Yield Distributed", value: "1.6", prefix: "$", suffix: "M" },
                        { label: "Pre-Commitments", value: "80", prefix: "$", suffix: "M" },
                        { label: "Active Wallets", value: "2000", prefix: "", suffix: "+" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-black p-6 md:p-10 text-center">
                            <div className="text-3xl md:text-5xl font-serif text-white mb-2">
                                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </div>
                            <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40">{stat.label}</div>
                        </div>
                    ))}
                </div>
                
                {/* Key Insight */}
                <div className="border-l-2 border-accent pl-6 md:pl-8">
                    <p className="text-lg md:text-xl font-mono text-white/70">
                        "This isn't just software—it's a <span className="text-accent">network effect</span>. Every dollar deposited strengthens the protocol."
                    </p>
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 7: Comparative Moat ---
const MoatSlide = () => (
    <SlideContainer>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 mb-6">06 — Why We Win</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-12">
                    The Old Way vs. <span className="text-accent italic">The Deploy Way</span>
                </h2>
                
                {/* Comparison Table */}
                <div className="border-2 border-black overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-3 border-b-2 border-black">
                        <div className="p-4 md:p-6 bg-black/5"></div>
                        <div className="p-4 md:p-6 bg-black/10 text-center font-mono text-xs uppercase tracking-widest border-l border-black">Traditional Yield</div>
                        <div className="p-4 md:p-6 bg-accent text-white text-center font-mono text-xs uppercase tracking-widest border-l border-black">Deploy</div>
                    </div>
                    
                    {/* Rows */}
                    {[
                        { metric: "APY", old: "3-7%", deploy: "15-25%" },
                        { metric: "Risk Model", old: "Directional", deploy: "Delta-Neutral" },
                        { metric: "Transparency", old: "Opaque", deploy: "Real-time" },
                        { metric: "Withdrawals", old: "Locked periods", deploy: "Instant" },
                        { metric: "Min. Deposit", old: "$100K+", deploy: "$100" },
                    ].map((row, i) => (
                        <div key={row.metric} className={`grid grid-cols-3 ${i < 4 ? 'border-b border-black' : ''}`}>
                            <div className="p-4 md:p-6 font-mono text-sm font-bold">{row.metric}</div>
                            <div className="p-4 md:p-6 text-center font-mono text-sm text-black/50 border-l border-black flex items-center justify-center gap-2">
                                <X className="w-4 h-4 text-red-500 hidden md:block" />
                                {row.old}
                            </div>
                            <div className="p-4 md:p-6 text-center font-mono text-sm font-bold bg-accent/5 border-l border-black flex items-center justify-center gap-2">
                                <Check className="w-4 h-4 text-accent hidden md:block" />
                                {row.deploy}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Competitor Comparison */}
                <div className="mt-12 space-y-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">APY Comparison</div>
                    {[
                        { name: "Deploy", val: 22.6, width: "90%" },
                        { name: "Ethena", val: 7.6, width: "30%" },
                        { name: "Resolv", val: 7.0, width: "28%" },
                    ].map((item, i) => (
                        <div key={item.name}>
                            <div className="flex justify-between mb-2 font-mono text-xs uppercase">
                                <span className={i === 0 ? 'font-bold' : ''}>{item.name}</span>
                                <span className={i === 0 ? 'text-accent font-bold' : 'text-black/50'}>{item.val}%</span>
                            </div>
                            <div className="h-4 border border-black p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: item.width }}
                                    transition={{ duration: 1, delay: 0.3 + (i * 0.15) }}
                                    className={`h-full ${i === 0 ? 'bg-accent' : 'bg-black/20'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 8: Business Engine ---
const EngineSlide = () => (
    <SlideContainer>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 mb-6">07 — Business Model</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-12">
                    The <span className="text-accent italic">DUSD</span> flywheel fuels growth.
                </h2>
                
                {/* Flywheel Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { 
                            pillar: "Access", 
                            title: "Deposit", 
                            desc: "Users deposit stablecoins and receive DUSD—a yield-bearing token.",
                            metric: "Entry point",
                            icon: Landmark
                        },
                        { 
                            pillar: "Retention", 
                            title: "Compound", 
                            desc: "Yield auto-compounds daily. The longer you stay, the more you earn.",
                            metric: "Stickiness",
                            icon: TrendingUp
                        },
                        { 
                            pillar: "Revenue", 
                            title: "Performance Fee", 
                            desc: "We take 20% of profits generated. You win, we win.",
                            metric: "Aligned incentives",
                            icon: Zap
                        }
                    ].map((item, i) => (
                        <div key={item.pillar} className="border-2 border-black p-8 bg-white relative overflow-hidden group hover:bg-black hover:text-white transition-colors">
                            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4 group-hover:text-accent">Pillar {i + 1}: {item.pillar}</div>
                            <item.icon className="w-10 h-10 mb-4 stroke-1 text-black group-hover:text-white" />
                            <h3 className="text-2xl font-serif italic mb-3 group-hover:text-white">{item.title}</h3>
                            <p className="font-mono text-sm text-black/60 mb-6 group-hover:text-white/70">{item.desc}</p>
                            <div className="font-mono text-xs uppercase tracking-widest text-black/30 group-hover:text-white/40">{item.metric}</div>
                        </div>
                    ))}
                </div>
                
                {/* Revenue Model */}
                <div className="border border-black p-8 bg-bone">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">Revenue Model</div>
                            <div className="text-4xl md:text-5xl font-serif text-accent mb-2">20%</div>
                            <div className="font-mono text-sm text-black/60">Performance fee on profits</div>
                        </div>
                        <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">Target AUM</div>
                            <div className="text-4xl md:text-5xl font-serif text-black mb-2">$500M</div>
                            <div className="font-mono text-sm text-black/60">Within 24 months post-launch</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 9: The Team ---
const TeamSlide = () => (
    <SlideContainer>
        <div className="w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 mb-6">08 — The Team</div>
                
                {/* Main Statement */}
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-4">
                    Builders from <span className="text-accent italic">DeFi & TradFi</span>
                </h2>
                <p className="text-lg font-mono text-black/50 mb-12">The only team capable of bridging both worlds.</p>
                
                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black">
                    {[
                        { 
                            name: "Benjamin", 
                            role: "Founder & CEO", 
                            superpower: "Product visionary. Built and scaled multiple fintech products.",
                            prev: "Product & Tech Background"
                        },
                        { 
                            name: "Ben Lilly", 
                            role: "Co-Founder", 
                            superpower: "DeFi strategist. Designed yield strategies managing $100M+.",
                            prev: "Jarvis Labs, Economist"
                        },
                        { 
                            name: "Amit Trehan", 
                            role: "CTO", 
                            superpower: "Security-first engineer. Built trading systems at scale.",
                            prev: "Ex-VP Lloyd's Bank"
                        }
                    ].map((member) => (
                        <div key={member.name} className="bg-white p-8 md:p-12 hover:bg-bone transition-colors group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-black/5 mb-6 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                <User className="w-8 h-8 md:w-10 md:h-10 text-black/20 group-hover:text-accent/40 transition-colors" />
                            </div>
                            <div className="font-serif text-2xl md:text-3xl mb-1">{member.name}</div>
                            <div className="font-mono text-xs uppercase tracking-widest text-accent mb-4">{member.role}</div>
                            <p className="font-mono text-sm text-black/70 leading-relaxed mb-4">{member.superpower}</p>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-black/30">{member.prev}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- SLIDE 10: The Ask ---
const AskSlide = () => (
    <SlideContainer dark>
        <div className="w-full max-w-5xl text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Section Tag */}
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mb-8">09 — The Invitation</div>
                
                {/* Main Statement */}
                <h2 className="text-4xl md:text-8xl font-serif leading-[0.9] mb-8">
                    We aren't raising capital.<br/>
                    <span className="text-accent italic">We're recruiting conviction.</span>
                </h2>
                
                {/* The Deal */}
                <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-12 border-y border-white/20 py-10">
                    <div className="text-center">
                        <div className="font-mono text-xs uppercase tracking-widest mb-2 text-white/40">Raising</div>
                        <div className="text-5xl md:text-7xl font-serif text-accent">$5M</div>
                    </div>
                    <div className="text-center">
                        <div className="font-mono text-xs uppercase tracking-widest mb-2 text-white/40">Valuation</div>
                        <div className="text-5xl md:text-7xl font-serif text-white">$50M</div>
                    </div>
                </div>
                
                {/* The Milestone */}
                <div className="mb-12">
                    <div className="font-mono text-sm text-white/60 mb-4">This unlocks:</div>
                    <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
                        {["DUSD Mainnet Launch", "$100M TVL Target", "Enterprise Integrations"].map((milestone) => (
                            <div key={milestone} className="border border-white/20 px-6 py-3 font-mono text-sm text-white/80">
                                {milestone}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* CTA */}
                <a 
                    href="mailto:hello@deploy.finance" 
                    className="inline-flex items-center gap-4 bg-accent text-white px-12 py-6 font-mono text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors border border-accent hover:border-white"
                >
                    Join Us <ArrowRight className="w-6 h-6" />
                </a>
                
                <div className="mt-8 font-mono text-sm text-white/40">
                    hello@deploy.finance
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// --- Main Application ---

export default function DeployPitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = useCallback((direction) => {
        if (isScrolling || isMenuOpen) return;
        setIsScrolling(true);
        setCurrentSlide(prev => {
            if (direction === 'next') return Math.min(prev + 1, SLIDES.length - 1);
            if (direction === 'prev') return Math.max(prev - 1, 0);
            return prev;
        });
        setTimeout(() => setIsScrolling(false), 800);
    }, [isScrolling, isMenuOpen]);

    useEffect(() => {
        const onWheel = (e) => {
            if (Math.abs(e.deltaY) > 30) handleScroll(e.deltaY > 0 ? 'next' : 'prev');
        };
        const onKeyDown = (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') handleScroll('next');
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') handleScroll('prev');
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        window.addEventListener('wheel', onWheel);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [handleScroll]);

    const CurrentSlideComponent = [
        TitleSlide,
        ConflictSlide,
        PhilosophySlide,
        SolutionSlide,
        ProductSlide,
        TractionSlide,
        MoatSlide,
        EngineSlide,
        TeamSlide,
        AskSlide
    ][currentSlide];

    // Determine if current slide is dark
    const isDarkSlide = [1, 5, 9].includes(currentSlide);

    return (
        <div className={`font-mono min-h-screen w-screen overflow-x-hidden relative selection:bg-accent selection:text-white ${isDarkSlide ? 'bg-black text-white' : 'bg-bone text-black'}`}>
            <NoiseOverlay />
            {!isDarkSlide && <GridBackground />}
            
            {/* Top Bar */}
            <div className={`fixed top-0 left-0 right-0 h-14 md:h-16 border-b z-50 flex items-center justify-between px-4 md:px-6 backdrop-blur-sm transition-colors ${isDarkSlide ? 'border-white/20 bg-black/90' : 'border-black bg-bone/95'}`}>
                <img src="/deploy_logo.png" alt="Deploy." className={`h-5 md:h-6 ${isDarkSlide ? 'invert' : ''}`} />
                
                {/* Desktop Navigation */}
                <div className={`hidden md:flex border ${isDarkSlide ? 'border-white/30' : 'border-black'}`}>
                    {SLIDES.map((slide, i) => (
                        <button
                            key={slide}
                            onClick={() => setCurrentSlide(i)}
                            className={`px-4 py-1 text-xs font-mono uppercase tracking-widest transition-colors ${
                                i === currentSlide 
                                    ? 'bg-accent text-white' 
                                    : isDarkSlide 
                                        ? 'bg-white/10 text-white hover:bg-white/20' 
                                        : 'bg-black text-white hover:bg-bone hover:text-accent'
                            }`}
                        >
                            {slide}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Trigger */}
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className={`md:hidden px-3 py-2 border font-mono text-xs uppercase tracking-widest min-h-[40px] flex items-center transition-colors ${isDarkSlide ? 'border-white/30 bg-white/10 text-white' : 'border-black bg-black text-white'}`}
                >
                    [ MENU ]
                </button>
                
                {/* Desktop Slide Counter */}
                <div className={`hidden md:block font-mono text-xs ${isDarkSlide ? 'text-white/60' : ''}`}>
                    {currentSlide + 1}/{SLIDES.length}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "tween", ease: "circOut", duration: 0.25 }}
                        className="fixed inset-0 bg-bone/95 backdrop-blur-md z-[60] flex flex-col md:hidden"
                    >
                        {/* Mobile Menu Header */}
                        <div className="h-14 border-b border-black flex items-center justify-between px-4 bg-bone/80 backdrop-blur-sm flex-shrink-0">
                             <img src="/deploy_logo.png" alt="Deploy." className="h-5" />
                             <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="px-3 py-2 border border-black bg-black text-white font-mono text-xs uppercase tracking-widest min-h-[40px] flex items-center"
                            >
                                [ CLOSE ]
                            </button>
                        </div>

                        {/* Mobile Menu Items */}
                        <div className="flex-1 overflow-y-auto">
                            {SLIDES.map((slide, i) => (
                                <button
                                    key={slide}
                                    onClick={() => {
                                        setCurrentSlide(i);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-6 py-5 border-b border-black font-serif text-2xl transition-colors flex items-center justify-between min-h-[60px] ${
                                        i === currentSlide ? 'bg-accent text-white' : 'hover:bg-black hover:text-white'
                                    }`}
                                >
                                    <span>{slide}</span>
                                    <span className="font-mono text-xs opacity-60">0{i+1}</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* Mobile Menu Footer */}
                        <div className="p-6 border-t border-black bg-black text-white flex-shrink-0">
                             <div className="font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Connect</div>
                             <a href="mailto:hello@deploy.finance" className="text-base font-serif hover:text-accent transition-colors">hello@deploy.finance</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full min-h-screen pt-14 md:pt-16"
                >
                    <CurrentSlideComponent />
                </motion.div>
            </AnimatePresence>
            
            {/* Mobile Progress Bar */}
            <div 
                className="fixed bottom-0 left-0 h-1 bg-accent z-40 md:hidden transition-all duration-500" 
                style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }} 
            />
        </div>
    );
}
