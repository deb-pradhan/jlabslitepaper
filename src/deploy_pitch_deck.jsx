import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, ArrowRight, Activity, Layers, Landmark, Code, Zap, User, Check, X, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import Navbar from './components/Navbar';

// ============================================================================
// CONSTANTS & CONFIG
// ============================================================================

const SLIDES = ['Title', 'Conflict', 'Philosophy', 'Solution', 'Product', 'Traction', 'Moat', 'Roadmap', 'Team', 'Ask'];
const DARK_SLIDES = [1, 5, 9]; // Conflict, Traction, Ask

const STRATEGIES_API = 'https://do510emoi4o2y.cloudfront.net/api/available-strategies';
const HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info';

// Haptic feedback utility
const haptic = {
    light: () => {
        if ('vibrate' in navigator) navigator.vibrate(10);
    },
    medium: () => {
        if ('vibrate' in navigator) navigator.vibrate(20);
    },
    heavy: () => {
        if ('vibrate' in navigator) navigator.vibrate([30, 10, 30]);
    },
    success: () => {
        if ('vibrate' in navigator) navigator.vibrate([10, 50, 20]);
    }
};

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

const SlideContainer = ({ children, className = "", dark = false }) => (
    <div className={`
        relative w-full min-h-screen 
        flex flex-col justify-center items-center 
        px-6 md:px-16 lg:px-24 
        py-24 md:py-16
        overflow-x-hidden
        ${dark ? 'bg-black text-white' : 'bg-bone text-black'}
        ${className}
    `}>
        {children}
    </div>
);

const SectionTag = ({ children, dark = false }) => (
    <div className={`font-mono text-[11px] md:text-xs tracking-[0.25em] uppercase mb-6 md:mb-8 ${dark ? 'text-white/40' : 'text-black/40'}`}>
        {children}
    </div>
);

const AnimatedNumber = ({ value, prefix = "", suffix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        if (start === end) return;
        
        const timer = setInterval(() => {
            start += end / 40; 
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setDisplayValue(start.toFixed(value % 1 === 0 ? 0 : 1));
        }, 25);

        return () => clearInterval(timer);
    }, [value]);

    return <span className="tabular-nums tracking-tight">{prefix}{displayValue}{suffix}</span>;
};

// ============================================================================
// APY CHART COMPONENT
// ============================================================================

const fetchFundingHistory = async (days = 180) => {
    const allData = [];
    const now = Date.now();
    let currentStartTime = now - (days * 24 * 60 * 60 * 1000);
    let requestCount = 0;
    
    try {
        while (currentStartTime < now && requestCount < 50) {
            requestCount++;
            const response = await fetch(HYPERLIQUID_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'fundingHistory', coin: 'HYPE', startTime: currentStartTime })
            });
            if (!response.ok) break;
            const batch = await response.json();
            if (!Array.isArray(batch) || batch.length === 0) break;
            allData.push(...batch);
            const latestTime = Math.max(...batch.map(item => item.time));
            if (latestTime <= currentStartTime || batch.length < 10) break;
            currentStartTime = latestTime + 1;
        }
        return allData;
    } catch (error) {
        console.error('Failed to fetch funding history:', error);
        return [];
    }
};

const processFundingData = (rawData, range) => {
    if (!rawData?.length) return [];
    const sorted = [...rawData].sort((a, b) => a.time - b.time);
    const now = Date.now();
    
    const config = {
        '24H': { cutoff: 24 * 60 * 60 * 1000, maxPoints: 24 },
        '1W': { cutoff: 7 * 24 * 60 * 60 * 1000, maxPoints: 21 },
        '1M': { cutoff: 30 * 24 * 60 * 60 * 1000, maxPoints: 45 },
        '3M': { cutoff: 90 * 24 * 60 * 60 * 1000, maxPoints: 90 }
    };
    
    const { cutoff, maxPoints } = config[range] || config['3M'];
    const filtered = sorted.filter(item => item.time >= now - cutoff);
    
    const chartData = filtered.map(item => {
        const date = new Date(item.time);
        let dateLabel;
        if (range === '24H') {
            dateLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        } else if (range === '1W') {
            dateLabel = `${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false })}`;
        } else {
            dateLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        }
        return { date: dateLabel, apy: Math.round(parseFloat(item.fundingRate) * 3 * 365 * 10000) / 100, time: item.time };
    });
    
    if (chartData.length > maxPoints) {
        const step = Math.ceil(chartData.length / maxPoints);
        return chartData.filter((_, i) => i % step === 0 || i === chartData.length - 1);
    }
    return chartData;
};

const APYChart = () => {
    const [activeRange, setActiveRange] = useState('1W');
    const [liveAPY, setLiveAPY] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fundingHistory, setFundingHistory] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchLiveAPY = async () => {
            try {
                const response = await fetch(STRATEGIES_API);
                const data = await response.json();
                const strategies = data.strategies || data;
                const fundingStrategy = strategies.find(s => s.name === 'Income: Funding Rate');
                if (fundingStrategy) setLiveAPY(fundingStrategy.apy);
            } catch (error) {
                console.error('Failed to fetch live APY:', error);
            }
        };
        fetchLiveAPY();
        const interval = setInterval(fetchLiveAPY, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadHistory = async () => {
            setIsLoading(true);
            const data = await fetchFundingHistory(180);
            setFundingHistory(data);
            setIsLoading(false);
        };
        loadHistory();
    }, []);

    useEffect(() => {
        if (fundingHistory.length > 0) {
            setChartData(processFundingData(fundingHistory, activeRange));
        }
    }, [activeRange, fundingHistory]);

    const ranges = ['24H', '1W', '1M', '3M'];

    return (
        <div className="w-full h-full bg-bone border border-black p-3 md:p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-black/40">Historical APY</span>
                <div className="flex border border-black flex-shrink-0">
                    {ranges.map((range) => (
                        <button
                            key={range}
                            onClick={() => { haptic.light(); setActiveRange(range); }}
                            className={`px-2 md:px-2.5 py-1 md:py-1.5 text-[9px] md:text-[10px] font-mono font-medium transition-colors ${
                                activeRange === range 
                                    ? 'bg-accent text-white' 
                                    : 'bg-bone text-black hover:bg-black hover:text-white'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
        </div>
            </div>
                
            {/* Chart */}
            <div className="flex-1 min-h-[120px] md:min-h-[140px]">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <XAxis 
                                dataKey="date" 
                                axisLine={{ stroke: 'black', strokeWidth: 1 }}
                                tickLine={false}
                                tick={{ fill: 'black', fontSize: 9, fontFamily: 'monospace' }}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                axisLine={{ stroke: 'black', strokeWidth: 1 }}
                                tickLine={false}
                                tick={{ fill: 'black', fontSize: 9, fontFamily: 'monospace' }}
                                tickFormatter={(value) => `${value}%`}
                                domain={['auto', 'auto']}
                            />
                            <ReferenceLine y={0} stroke="#000" strokeOpacity={0.1} />
                            <Line 
                                type="linear" 
                                dataKey="apy" 
                                stroke="#474DF0" 
                                strokeWidth={1.5}
                                dot={{ r: 1.5, fill: '#474DF0', strokeWidth: 0 }}
                                activeDot={{ r: 4, fill: '#474DF0', stroke: 'black', strokeWidth: 1 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-black/40">No data available</span>
             </div>
        )}
    </div>
            
            {/* Footer */}
            {liveAPY !== null && (
                <div className="flex items-center justify-between border-t border-black pt-3 mt-3 md:pt-4 md:mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl md:text-2xl text-accent font-medium">{liveAPY.toFixed(2)}%</span>
                        <span className="font-mono text-[9px] md:text-[10px] text-black/40 uppercase">APY</span>
                    </div>
                    <span className="font-mono text-[9px] md:text-[10px] text-accent uppercase tracking-wide font-medium">Live</span>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// SLIDE 1: TITLE
// ============================================================================

const TitleSlide = () => (
    <SlideContainer>
        <div className="relative z-10 w-full max-w-5xl">
                    <motion.div
                initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Category Badge */}
                <div className="inline-flex items-center gap-3 mb-10 md:mb-14 border border-black px-4 py-2.5 bg-white">
                    <div className="w-2 h-2 bg-accent" />
                    <span className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase">Autonomous Finance Infrastructure</span>
                        </div>
                        
                {/* Main Headline */}
                <h1 className="text-[3.5rem] md:text-[8rem] lg:text-[10rem] font-serif text-black leading-[0.85] mb-10 md:mb-14 tracking-tight">
                    <span className="block">Deploy</span>
                    <span className="block text-accent italic">Finance</span>
                        </h1>
                        
                {/* Sub-headline */}
                <p className="text-lg md:text-2xl lg:text-3xl font-mono text-black/70 max-w-xl leading-snug">
                    Yield infrastructure for idle capital.
                        </p>
                    </motion.div>
        </div>
    </SlideContainer>
);

// ============================================================================
// SLIDE 2: CONFLICT
// ============================================================================

const ConflictSlide = () => (
    <SlideContainer dark>
        <div className="w-full max-w-5xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <SectionTag dark>01 — The Conflict</SectionTag>
                
                <h2 className="text-xl md:text-3xl lg:text-4xl font-serif leading-tight mb-8 md:mb-12">
                    Digital finance is rewriting the rules, but only <span className="text-accent italic">institutions</span> benefit.
                </h2>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                    {/* Left: Stats */}
                    <div className="space-y-4">
                        <div className="border border-white/20 p-4 md:p-6">
                            <div className="text-4xl md:text-5xl font-serif text-accent mb-2">$1.6T</div>
                            <div className="font-mono text-xs md:text-sm uppercase tracking-wide text-white/50">Stablecoin market cap</div>
                </div>
                        <div className="border border-white/20 p-4 md:p-6 bg-white/5">
                            <div className="text-4xl md:text-5xl font-serif text-white/40 mb-2">80%</div>
                            <div className="font-mono text-xs md:text-sm uppercase tracking-wide text-white/50">Sits completely idle</div>
                </div>
            </div>
            
                    {/* Right: Bar Chart */}
                    <div className="border border-white/20 bg-black p-4 md:p-8 min-h-[220px] md:min-h-[300px] flex items-end justify-center gap-8 md:gap-12">
                        {/* Idle Bar - 80% */}
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-3xl md:text-5xl font-bold text-white/60 mb-1">80%</div>
                            <div className="font-mono text-[10px] md:text-xs text-white/40 mb-3 uppercase tracking-wider">Idle</div>
                    <motion.div 
                        initial={{ height: 0 }}
                                animate={{ height: '160px' }}
                        transition={{ duration: 1, ease: "circOut" }}
                                className="w-20 md:w-28 bg-white/30 border border-white/40"
                            />
                        </div>
                        
                        {/* Active Bar - 20% */}
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-3xl md:text-5xl font-bold text-accent mb-1">20%</div>
                            <div className="font-mono text-[10px] md:text-xs text-accent mb-3 uppercase tracking-wider">Active</div>
                    <motion.div 
                        initial={{ height: 0 }}
                                animate={{ height: '40px' }}
                        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                                className="w-20 md:w-28 bg-accent border border-accent"
                            />
                        </div>
                </div>
            </div>
                
                {/* Quote */}
                <blockquote className="border-l-2 border-accent pl-4 md:pl-6">
                    <p className="text-sm md:text-lg font-mono text-white/60 leading-relaxed">
                        "The current system was built for a world that no longer exists."
                    </p>
                </blockquote>
            </motion.div>
        </div>
    </SlideContainer>
);

// ============================================================================
// SLIDE 3: PHILOSOPHY
// ============================================================================

const PhilosophySlide = () => {
    const values = [
        { value: "Autonomous", desc: "Algorithms execute 24/7 across markets, capturing yield while you sleep.", icon: Zap },
        { value: "Delta-Neutral", desc: "Zero directional risk. We profit from inefficiencies, not speculation.", icon: Shield },
        { value: "Transparent", desc: "Real-time dashboards. Third-party attestations. On-chain visibility.", icon: Activity }
    ];

    return (
    <SlideContainer>
            <div className="w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag>02 — Our Philosophy</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-8 md:mb-12">
                        What makes us different?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0">
                        {values.map((item, i) => (
                            <motion.div 
                                key={item.value}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className={`
                                    p-4 md:p-8 
                                    border-2 border-black md:border md:border-black
                                    ${i > 0 ? 'md:border-l-0' : ''}
                                    bg-white hover:bg-black hover:text-white 
                                    transition-colors duration-200 group
                                    flex md:block items-start gap-4
                                `}
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 md:bg-transparent flex-shrink-0 flex items-center justify-center md:mb-5">
                                    <item.icon className="w-6 h-6 md:w-10 md:h-10 stroke-[1.5] text-accent md:text-black group-hover:text-white transition-colors" />
                    </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl md:text-2xl font-serif italic mb-2">{item.value}</h3>
                                    <p className="font-mono text-xs md:text-sm leading-relaxed text-black/60 group-hover:text-white/70 transition-colors">{item.desc}</p>
                </div>
                            </motion.div>
            ))}
                    </div>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// SLIDE 4: SOLUTION
// ============================================================================

const SolutionSlide = () => {
    const steps = [
        { step: "01", title: "Deposit", desc: "USDC, USDT, or DAI enters our secure vault via audited contracts.", icon: Landmark },
        { step: "02", title: "Auto-Hedge", desc: "Algorithms deploy capital across delta-neutral strategies.", icon: Code },
        { step: "03", title: "Earn D-Assets", desc: "Receive DUSD—a yield-bearing stablecoin.", icon: Layers }
    ];

    return (
    <SlideContainer>
            <div className="w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag>03 — The Solution</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3 md:mb-4">
                        Deploy puts <span className="text-accent italic">your capital</span> in control.
                    </h2>
                    
                    <p className="text-sm md:text-lg font-mono text-black/50 mb-8 md:mb-12 max-w-2xl leading-relaxed">
                        The foundation of a new yield economy. Deposit stablecoins, receive D-Assets, earn institutional-grade returns.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0">
                        {steps.map((item, i) => (
                            <div 
                                key={item.step} 
                                className={`
                                    p-4 md:p-8 
                                    border-2 border-black md:border md:border-black
                                    ${i > 0 ? 'md:border-l-0' : ''}
                                    bg-white hover:bg-black hover:text-white 
                                    transition-colors duration-200 group
                                    flex md:block items-start gap-4
                                `}
                            >
                                <div className="flex-shrink-0">
                                    <div className="font-mono text-[10px] text-accent mb-2 tracking-wide">STEP {item.step}</div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 md:bg-transparent flex items-center justify-center">
                                        <item.icon className="w-6 h-6 md:w-10 md:h-10 stroke-[1.5] text-accent md:text-black group-hover:text-white transition-colors" />
                        </div>
                                </div>
                                <div className="flex-1 min-w-0 pt-1 md:pt-0 md:mt-4">
                                    <h3 className="text-lg md:text-xl font-serif italic mb-1 md:mb-2">{item.title}</h3>
                                    <p className="font-mono text-xs md:text-sm leading-relaxed text-black/60 group-hover:text-white/70 transition-colors">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// SLIDE 5: PRODUCT
// ============================================================================

const ProductSlide = () => {
    const [liveAPY, setLiveAPY] = useState(null);

    useEffect(() => {
        const fetchLiveAPY = async () => {
            try {
                const response = await fetch(STRATEGIES_API);
                const data = await response.json();
                const strategies = data.strategies || data;
                const fundingStrategy = strategies.find(s => s.name === 'Income: Funding Rate');
                if (fundingStrategy) setLiveAPY(fundingStrategy.apy);
            } catch (error) {
                console.error('Failed to fetch live APY:', error);
            }
        };
        fetchLiveAPY();
        const interval = setInterval(fetchLiveAPY, 60000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        { label: "One-Click Deposit", desc: "Connect wallet, deposit stablecoins, start earning." },
        { label: "Real-Time Dashboard", desc: "Track yield, positions, and strategy performance live." },
        { label: "Instant Withdrawals", desc: "Your capital, your control. No lockups." }
    ];

    return (
    <SlideContainer>
            <div className="w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag>04 — The Product</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-8 md:mb-12">
                        Enterprise-grade power.<br/>
                        <span className="text-accent italic">Consumer-grade</span> simplicity.
                    </h2>
                    
                    {/* Stats Row - Mobile First */}
                    <div className="grid grid-cols-3 gap-3 mb-6 md:hidden">
                        <div className="bg-white border border-black p-3 text-center">
                            <div className="text-xl font-serif text-accent">
                                {liveAPY !== null ? `${liveAPY.toFixed(1)}%` : '—'}
                        </div>
                            <div className="font-mono text-[9px] uppercase text-black/40 mt-1">APY</div>
                        </div>
                        <div className="bg-white border border-black p-3 text-center">
                            <div className="text-xl font-mono font-bold">6.1</div>
                            <div className="font-mono text-[9px] uppercase text-black/40 mt-1">Sharpe</div>
                     </div>
                        <div className="bg-white border border-black p-3 text-center">
                            <div className="text-xl font-mono font-bold">&lt;2%</div>
                            <div className="font-mono text-[9px] uppercase text-black/40 mt-1">Drawdown</div>
                 </div>
            </div>
            
                    <div className="border-2 border-black bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Features */}
                            <div className="p-5 md:p-8 border-b lg:border-b-0 lg:border-r border-black">
                                <div className="space-y-4 md:space-y-5">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex gap-3 md:gap-4">
                                            <div className="w-6 h-6 md:w-7 md:h-7 bg-accent text-white flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
                        </div>
                        <div>
                                                <div className="font-mono text-xs md:text-sm font-bold uppercase mb-0.5">{feature.label}</div>
                                                <div className="font-mono text-[11px] md:text-xs text-black/50 leading-relaxed">{feature.desc}</div>
                        </div>
                    </div>
                ))}
                     </div>
                     
                                {/* Stats - Desktop Only */}
                                <div className="hidden md:grid pt-6 border-t border-black/10 mt-6 grid-cols-3 gap-4">
                        <div>
                                        <div className="text-2xl lg:text-3xl font-serif text-accent">
                                            {liveAPY !== null ? `${liveAPY.toFixed(1)}%` : '—'}
                                        </div>
                                        <div className="font-mono text-[10px] uppercase text-black/40 mt-1">Live APY</div>
                        </div>
                        <div>
                                        <div className="text-2xl lg:text-3xl font-mono font-bold">6.1</div>
                                        <div className="font-mono text-[10px] uppercase text-black/40 mt-1">Sharpe</div>
                        </div>
                <div>
                                        <div className="text-2xl lg:text-3xl font-mono font-bold">&lt;2%</div>
                                        <div className="font-mono text-[10px] uppercase text-black/40 mt-1">Drawdown</div>
                     </div>
                 </div>
            </div>
            
                            {/* Right: Chart */}
                            <div className="p-3 md:p-5 min-h-[240px] md:min-h-[320px]">
                                <APYChart />
                        </div>
                    </div>
                </div>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 6: TRACTION
// ============================================================================

const TractionSlide = () => {
    const stats = [
        { label: "TVL", value: "15", prefix: "$", suffix: "M" },
        { label: "Yield Paid", value: "1.6", prefix: "$", suffix: "M" },
        { label: "Commitments", value: "80", prefix: "$", suffix: "M" },
        { label: "Wallets", value: "2000", prefix: "", suffix: "+" },
    ];

    return (
        <SlideContainer dark>
            <div className="w-full max-w-5xl">
                            <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag dark>05 — Traction</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        <span className="text-accent">2,000+</span> wallets are already building with Deploy.
                    </h2>
                    <p className="text-base md:text-lg font-mono text-white/40 mb-12 md:mb-16">The movement has already started.</p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 mb-12 md:mb-16">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-black p-5 md:p-8 text-center">
                                <div className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-2">
                                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                        </div>
                                <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40">{stat.label}</div>
                    </div>
                ))}
            </div>
                    
                    {/* Quote */}
                    <blockquote className="border-l-2 border-accent pl-6 md:pl-8">
                        <p className="text-base md:text-lg font-mono text-white/60 leading-relaxed">
                            "This isn't just software—it's a <span className="text-accent">network effect</span>. Every dollar deposited strengthens the protocol."
                        </p>
                    </blockquote>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// SLIDE 7: MOAT
// ============================================================================

const MoatSlide = () => {
    const comparison = [
        { metric: "APY", old: "3-7%", deploy: "15-25%" },
        { metric: "Risk Model", old: "Directional", deploy: "Delta-Neutral" },
        { metric: "Transparency", old: "Opaque", deploy: "Real-time" },
        { metric: "Withdrawals", old: "Locked", deploy: "Instant" },
        { metric: "Min. Deposit", old: "$100K+", deploy: "$100" },
    ];

    const competitors = [
                    { name: "Deploy", val: 22.6, width: "90%" },
                    { name: "Ethena", val: 7.6, width: "30%" },
                    { name: "Resolv", val: 7.0, width: "28%" },
    ];

    return (
    <SlideContainer>
            <div className="w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag>06 — Why We Win</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-12 md:mb-16">
                        The Old Way vs. <span className="text-accent italic">The Deploy Way</span>
                    </h2>
                    
                    {/* Comparison Table */}
                    <div className="border-2 border-black overflow-hidden mb-12 md:mb-16">
                        {/* Header */}
                        <div className="grid grid-cols-3 border-b-2 border-black text-center">
                            <div className="p-3 md:p-5 bg-black/5" />
                            <div className="p-3 md:p-5 bg-black/10 font-mono text-[10px] md:text-xs uppercase tracking-widest border-l border-black">Traditional</div>
                            <div className="p-3 md:p-5 bg-accent text-white font-mono text-[10px] md:text-xs uppercase tracking-widest border-l border-black">Deploy</div>
                </div>
                
                        {/* Rows */}
                        {comparison.map((row, i) => (
                            <div key={row.metric} className={`grid grid-cols-3 ${i < comparison.length - 1 ? 'border-b border-black' : ''}`}>
                                <div className="p-3 md:p-5 font-mono text-xs md:text-sm font-bold">{row.metric}</div>
                                <div className="p-3 md:p-5 text-center font-mono text-xs md:text-sm text-black/40 border-l border-black flex items-center justify-center gap-1.5">
                                    <X className="w-3.5 h-3.5 text-red-500 hidden sm:block" />
                                    <span>{row.old}</span>
                </div>
                                <div className="p-3 md:p-5 text-center font-mono text-xs md:text-sm font-bold bg-accent/5 border-l border-black flex items-center justify-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-accent hidden sm:block" />
                                    <span>{row.deploy}</span>
                </div>
                            </div>
                        ))}
            </div>
            
                    {/* APY Comparison */}
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-widest text-black/40 mb-5">APY Comparison</div>
                        <div className="space-y-4">
                            {competitors.map((item, i) => (
                                <div key={item.name}>
                                    <div className="flex justify-between mb-2 font-mono text-xs uppercase">
                                        <span className={i === 0 ? 'font-bold' : 'text-black/50'}>{item.name}</span>
                                        <span className={i === 0 ? 'text-accent font-bold' : 'text-black/40'}>{item.val}%</span>
                        </div>
                                    <div className="h-3 md:h-4 border border-black p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                            whileInView={{ width: item.width }}
                                            transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                                            viewport={{ once: true }}
                                            className={`h-full ${i === 0 ? 'bg-accent' : 'bg-black/15'}`}
                            />
                    </div>
                </div>
                ))}
            </div>
                    </div>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// SLIDE 8: ENGINE
// ============================================================================

const RoadmapSlide = () => {
    const milestones = [
        { date: "DEC 2025", title: "DUSD Launch", desc: "Ethereum mainnet. Pre-deposit commitments." },
        { date: "Q1 2026", title: "Transparency", desc: "Full dashboard & attestations." },
        { date: "Q2 2026", title: "Integrations", desc: "Lending & Debit card spending." },
        { date: "2026-27", title: "Enterprise", desc: "Privacy layers & Canton." }
    ];

    return (
        <SlideContainer>
            <div className="w-full max-w-6xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 border-b border-black pb-4 md:pb-6">
                        <div className="flex items-baseline gap-4 mb-2 md:mb-0">
                            <span className="font-mono text-xs md:text-sm text-black/40">08</span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif">Roadmap</h2>
                        </div>
                        <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-black/40">Scale to Billions</span>
                </div>
                
                    {/* Timeline Grid */}
                    <div className="border-2 border-black">
                        {/* Desktop: Horizontal Grid */}
                        <div className="hidden md:grid md:grid-cols-4">
                            {milestones.map((item, i) => (
                                <motion.div 
                                    key={item.date}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`relative flex flex-col border-black ${i < milestones.length - 1 ? 'border-r' : ''}`}
                                >
                                    {/* Top section with date */}
                                    <div className="h-40 flex items-center justify-center border-b border-black">
                                        <div className="border border-black px-4 py-2 font-mono text-xs uppercase tracking-widest">
                                            {item.date}
                                        </div>
                                    </div>
                                    
                                    {/* Diamond marker on timeline */}
                                    <div className="relative h-0">
                                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rotate-45" />
                    </div>
                                    
                                    {/* Content section */}
                                    <div className="p-6 pt-8 text-center flex-1 flex flex-col justify-start">
                                        <h3 className="text-xl font-serif mb-2 whitespace-nowrap">{item.title}</h3>
                                        <p className="font-mono text-xs text-black/50 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                ))}
            </div>
                        
                        {/* Mobile: Vertical Stack */}
                        <div className="md:hidden">
                            {milestones.map((item, i) => (
                                <motion.div 
                                    key={item.date}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`flex items-stretch ${i < milestones.length - 1 ? 'border-b border-black' : ''}`}
                                >
                                    {/* Left: Date + Diamond */}
                                    <div className="w-24 flex-shrink-0 border-r border-black flex flex-col items-center justify-center py-5 relative">
                                        <div className="border border-black px-2 py-1 font-mono text-[9px] uppercase tracking-wider mb-3">
                                            {item.date}
        </div>
                                        <div className="w-3 h-3 bg-black rotate-45" />
                                    </div>
                                    
                                    {/* Right: Content */}
                                    <div className="flex-1 p-4">
                                        <h3 className="text-lg font-serif mb-1">{item.title}</h3>
                                        <p className="font-mono text-[10px] text-black/50 leading-relaxed">{item.desc}</p>
                </div>
                                </motion.div>
            ))}
                        </div>
                    </div>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// SLIDE 9: TEAM
// ============================================================================

const TeamSlide = () => {
    const team = [
        { name: "Benjamin", role: "Founder & CEO", superpower: "Product visionary. Built and scaled multiple fintech products.", prev: "Product & Tech Background" },
        { name: "Ben Lilly", role: "Co-Founder", superpower: "DeFi strategist. Designed yield strategies managing $100M+.", prev: "Jarvis Labs, Economist" },
        { name: "Amit Trehan", role: "CTO", superpower: "Security-first engineer. Built trading systems at scale.", prev: "Ex-VP Lloyd's Bank" }
    ];

    return (
    <SlideContainer>
            <div className="w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag>08 — The Team</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-2 md:mb-3">
                        Builders from <span className="text-accent italic">DeFi & TradFi</span>
                    </h2>
                    <p className="text-sm md:text-lg font-mono text-black/40 mb-8 md:mb-12">The only team capable of bridging both worlds.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0">
                        {team.map((member, i) => (
                            <div 
                                key={member.name} 
                                className={`
                                    bg-white p-4 md:p-8 
                                    border-2 border-black md:border md:border-black
                                    ${i > 0 ? 'md:border-l-0' : ''}
                                    hover:bg-bone transition-colors group
                                    flex md:block items-start gap-4
                                `}
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-black/5 flex-shrink-0 md:mb-4 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                    <User className="w-6 h-6 md:w-7 md:h-7 text-black/20 group-hover:text-accent/50 transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-serif text-lg md:text-xl mb-0.5">{member.name}</div>
                                    <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-accent mb-2 md:mb-3">{member.role}</div>
                                    <p className="font-mono text-xs md:text-sm text-black/60 leading-relaxed mb-2 md:mb-3">{member.superpower}</p>
                                    <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-black/30">{member.prev}</div>
                                </div>
                    </div>
                ))}
             </div>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// SLIDE 10: ASK
// ============================================================================

const AskSlide = () => {
    const milestones = ["DUSD Mainnet", "$100M TVL", "Enterprise"];

    return (
        <SlideContainer dark>
            <div className="w-full max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag dark>09 — The Invitation</SectionTag>
                    
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-serif leading-[1] md:leading-[0.95] mb-8 md:mb-12">
                        We aren't raising capital.<br/>
                        <span className="text-accent italic">We're recruiting conviction.</span>
             </h2>
             
                    {/* The Deal */}
                    <div className="grid grid-cols-2 gap-4 md:flex md:justify-center md:gap-16 mb-8 md:mb-12 border-y border-white/20 py-6 md:py-10">
                        <div>
                            <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest mb-1 md:mb-2 text-white/40">Raising</div>
                            <div className="text-4xl md:text-6xl font-serif text-accent">$5M</div>
                 </div>
                        <div>
                            <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest mb-1 md:mb-2 text-white/40">Valuation</div>
                            <div className="text-4xl md:text-6xl font-serif text-white">$50M</div>
                 </div>
             </div>
             
                    {/* Milestones */}
                    <div className="mb-8 md:mb-12">
                        <div className="font-mono text-xs md:text-sm text-white/50 mb-3 md:mb-4">This unlocks:</div>
                        <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-4">
                            {milestones.map((milestone) => (
                                <div key={milestone} className="border border-white/20 px-3 md:px-5 py-2 md:py-3 font-mono text-[10px] md:text-sm text-white/70">
                                    {milestone}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 md:mb-8">
                        <a 
                            href="http://litepaper.deploy.finance/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center gap-2 md:gap-3 bg-accent text-white px-6 md:px-10 py-4 md:py-5 font-mono text-sm md:text-base font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors border-2 border-accent hover:border-white w-full sm:w-auto"
                        >
                            Read Litepaper <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </a>
                        <a 
                            href="mailto:hello@deploy.finance" 
                            className="inline-flex items-center justify-center gap-2 md:gap-3 bg-transparent text-white px-6 md:px-10 py-4 md:py-5 font-mono text-sm md:text-base font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors border-2 border-white w-full sm:w-auto"
                        >
                            Contact Us
                        </a>
                    </div>
                    
                    <div className="font-mono text-xs md:text-sm text-white/30">
                        hello@deploy.finance
                    </div>
                </motion.div>
        </div>
    </SlideContainer>
);
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

// ============================================================================
// BOTTOM SLIDE NAVIGATION
// ============================================================================

const BottomSlideNav = ({ currentSlide, totalSlides, slideName, onPrev, onNext, onOpenIndex, onGoToSlide, dark = false }) => {
    const canGoPrev = currentSlide > 0;
    const canGoNext = currentSlide < totalSlides - 1;

    return (
        <div className={`
            fixed bottom-0 left-0 right-0 h-14 md:h-16
            border-t z-50
            flex items-center justify-between
            px-4 md:px-6
            backdrop-blur-md transition-colors duration-300
            ${dark ? 'border-white/10 bg-black/90' : 'border-black bg-bone/90'}
        `}>
            {/* Left: Slide Counter + Name */}
            <div className="flex items-center gap-3 md:gap-4">
                <div className={`font-mono text-sm md:text-base tabular-nums ${dark ? 'text-white' : 'text-black'}`}>
                    <span className="font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                    <span className={dark ? 'text-white/40' : 'text-black/40'}> / {String(totalSlides).padStart(2, '0')}</span>
                </div>
                <div className={`hidden sm:block w-px h-6 ${dark ? 'bg-white/20' : 'bg-black/20'}`} />
                <div className={`hidden sm:block font-mono text-[10px] md:text-xs uppercase tracking-widest ${dark ? 'text-white/60' : 'text-black/60'}`}>
                    {slideName}
                </div>
            </div>

            {/* Center: Navigation Arrows + Dots */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Prev Arrow */}
                <button
                    onClick={onPrev}
                    disabled={!canGoPrev}
                    className={`
                        p-2 md:p-2.5 border transition-colors
                        ${dark 
                            ? 'border-white/20 hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white' 
                            : 'border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black'
                        }
                    `}
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Dot Indicators */}
                <div className="hidden md:flex items-center gap-1.5">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onGoToSlide(i)}
                            className={`
                                transition-all duration-200
                                ${i === currentSlide 
                                    ? 'w-6 h-1.5 bg-accent' 
                                    : `w-1.5 h-1.5 ${dark ? 'bg-white/30 hover:bg-white/50' : 'bg-black/30 hover:bg-black/50'}`
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Next Arrow */}
                <button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className={`
                        p-2 md:p-2.5 border transition-colors
                        ${dark 
                            ? 'border-white/20 hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white' 
                            : 'border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black'
                        }
                    `}
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Right: Index Button */}
            <button
                onClick={onOpenIndex}
                className={`
                    flex items-center gap-2 px-3 md:px-4 py-2 border font-mono text-[10px] md:text-xs uppercase tracking-widest transition-colors
                    ${dark 
                        ? 'border-white/20 hover:bg-white hover:text-black' 
                        : 'border-black hover:bg-black hover:text-white'
                    }
                `}
            >
                <span>Index</span>
                <List size={14} />
            </button>
        </div>
    );
};

// ============================================================================
// SLIDE INDEX MODAL
// ============================================================================

const SlideIndexModal = ({ isOpen, onClose, slides, currentSlide, onSelectSlide, dark = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-bone w-full max-w-lg max-h-[80vh] overflow-hidden border-2 border-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-black">
                            <h2 className="font-serif text-xl">Slide Index</h2>
                            <button
                                onClick={onClose}
                                className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Slide List */}
                        <div className="overflow-y-auto max-h-[60vh]">
                            {slides.map((slide, i) => (
                                <button
                                    key={slide}
                                    onClick={() => {
                                        haptic.medium();
                                        onSelectSlide(i);
                                        onClose();
                                    }}
                                    className={`
                                        w-full text-left px-4 py-4
                                        border-b border-black/10
                                        flex items-center justify-between gap-4
                                        transition-colors
                                        ${i === currentSlide 
                                            ? 'bg-accent text-white' 
                                            : 'hover:bg-black/5'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`font-mono text-xs ${i === currentSlide ? 'text-white/60' : 'text-black/40'}`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-serif text-lg">{slide}</span>
                                    </div>
                                    {i === currentSlide && (
                                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Current</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

export default function DeployPitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isIndexOpen, setIsIndexOpen] = useState(false);

    const handleScroll = useCallback((direction) => {
        if (isScrolling || isIndexOpen) return;
        setIsScrolling(true);
        setCurrentSlide(prev => {
            const next = direction === 'next' 
                ? Math.min(prev + 1, SLIDES.length - 1)
                : Math.max(prev - 1, 0);
            if (next !== prev) haptic.medium();
            return next;
        });
        setTimeout(() => setIsScrolling(false), 700);
    }, [isScrolling, isIndexOpen]);

    const goToPrev = () => {
        if (currentSlide > 0) {
            haptic.light();
            setCurrentSlide(prev => prev - 1);
        }
    };

    const goToNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            haptic.light();
            setCurrentSlide(prev => prev + 1);
        }
    };

    useEffect(() => {
        let touchStartY = 0;
        let touchStartX = 0;
        
        const onWheel = (e) => {
            if (Math.abs(e.deltaY) > 30) handleScroll(e.deltaY > 0 ? 'next' : 'prev');
        };
        const onKeyDown = (e) => {
            if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); handleScroll('next'); }
            if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); handleScroll('prev'); }
            if (e.key === 'Escape') setIsIndexOpen(false);
        };
        const onTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        };
        const onTouchEnd = (e) => {
            if (isIndexOpen) return;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                handleScroll(deltaY > 0 ? 'next' : 'prev');
            }
        };
        
        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [handleScroll, isIndexOpen]);

    const slideComponents = [TitleSlide, ConflictSlide, PhilosophySlide, SolutionSlide, ProductSlide, TractionSlide, MoatSlide, RoadmapSlide, TeamSlide, AskSlide];
    const CurrentSlideComponent = slideComponents[currentSlide];
    const isDarkSlide = DARK_SLIDES.includes(currentSlide);

    return (
        <div className={`font-mono min-h-screen w-screen overflow-hidden relative selection:bg-accent selection:text-white ${isDarkSlide ? 'bg-black text-white' : 'bg-bone text-black'}`}>
            <NoiseOverlay />
            {!isDarkSlide && <GridBackground />}
            
            {/* Shared Navigation Bar */}
            <Navbar dark={isDarkSlide} />

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full min-h-screen pt-14 md:pt-16 pb-14 md:pb-16"
                >
                    <CurrentSlideComponent />
                </motion.main>
            </AnimatePresence>
            
            {/* Bottom Slide Navigation */}
            <BottomSlideNav
                currentSlide={currentSlide}
                totalSlides={SLIDES.length}
                slideName={SLIDES[currentSlide]}
                onPrev={goToPrev}
                onNext={goToNext}
                onGoToSlide={(i) => { haptic.light(); setCurrentSlide(i); }}
                onOpenIndex={() => setIsIndexOpen(true)}
                dark={isDarkSlide}
            />

            {/* Slide Index Modal */}
            <SlideIndexModal
                isOpen={isIndexOpen}
                onClose={() => setIsIndexOpen(false)}
                slides={SLIDES}
                currentSlide={currentSlide}
                onSelectSlide={setCurrentSlide}
                dark={isDarkSlide}
            />
        </div>
    );
}
