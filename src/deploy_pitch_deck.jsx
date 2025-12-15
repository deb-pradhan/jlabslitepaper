import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, ArrowRight, Activity, Layers, Landmark, Code, Zap, User, Check, X, ChevronLeft, ChevronRight, List, ExternalLink, Twitter, DollarSign, Users, Wallet, Building2, Handshake, PieChart, ArrowDownUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import Navbar from './components/Navbar';

// ============================================================================
// CONSTANTS & CONFIG
// ============================================================================

const SLIDES = ['Title', 'Market Opportunity', 'The Problem', 'The Solution', 'Deploy In Action', 'How dUSD Works', 'Commitments & Partnerships', 'Tokenomics', 'The Team', 'Connect'];
const DARK_SLIDES = [2, 4, 9]; // Problem, Beta, Ask

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


const SlideContainer = ({ children, className = "", dark = false }) => (
    <div className={`
        relative w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)]
        flex flex-col justify-start items-center
        px-6 md:px-16 lg:px-24
        py-8 md:py-12
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

// Scrambled text loading animation
const ScrambledNumber = ({ value, isLoading, prefix = "", suffix = "", decimals = 2 }) => {
    const chars = '0123456789.+-';
    const [display, setDisplay] = useState('');
    const targetLength = value ? `${parseFloat(value).toFixed(decimals)}`.length : 5;

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                let scrambled = '';
                for (let i = 0; i < targetLength; i++) {
                    scrambled += chars[Math.floor(Math.random() * chars.length)];
                }
                setDisplay(scrambled);
            }, 50);
            return () => clearInterval(interval);
        } else if (value !== null && value !== undefined) {
            // Unscramble animation - gradually reveal the real value
            const target = parseFloat(value).toFixed(decimals);
            let iteration = 0;
            const maxIterations = 10;
            
            const interval = setInterval(() => {
                let result = '';
                for (let i = 0; i < target.length; i++) {
                    if (iteration >= maxIterations || i < iteration) {
                        result += target[i];
                    } else {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                setDisplay(result);
                iteration++;
                
                if (iteration > target.length + maxIterations) {
                    setDisplay(target);
                    clearInterval(interval);
                }
            }, 40);
            return () => clearInterval(interval);
        }
    }, [isLoading, value, targetLength, decimals]);

    return (
        <span className="tabular-nums tracking-tight font-mono">
            {prefix}{display || '—'}{!isLoading && value !== null ? suffix : ''}
        </span>
    );
};

// Chart loading skeleton
const ChartLoadingSkeleton = () => (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
        {/* Animated scan line */}
        <div className="absolute inset-0">
            <motion.div
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
        </div>
        
        {/* Fake chart lines */}
        <div className="flex-1 flex items-end justify-between gap-1 px-2 pb-6">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="flex-1 bg-black/10"
                    initial={{ height: '20%' }}
                    animate={{ 
                        height: ['20%', `${30 + Math.random() * 50}%`, '20%'],
                    }}
                    transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
        
        {/* X-axis skeleton */}
        <div className="h-4 flex items-center justify-between px-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-2 bg-black/10 animate-pulse" />
            ))}
        </div>
    </div>
);

// ============================================================================
// FUNDING DATA CONTEXT (preloads on app mount)
// ============================================================================

const FundingDataContext = createContext(null);

const fetchFundingHistory = async (days = 730, coin = 'HYPE') => {
    const allData = [];
    const now = Date.now();
    let currentStartTime = now - (days * 24 * 60 * 60 * 1000);
    let requestCount = 0;
    const maxRequests = 100; // ~50 records per request
    
    try {
        while (currentStartTime < now && requestCount < maxRequests) {
            requestCount++;
            const response = await fetch(HYPERLIQUID_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'fundingHistory', coin, startTime: currentStartTime })
            });
            if (!response.ok) break;
            const batch = await response.json();
            if (!Array.isArray(batch) || batch.length === 0) break;
            allData.push(...batch);
            const latestTime = Math.max(...batch.map(item => item.time));
            if (latestTime <= currentStartTime) break;
            currentStartTime = latestTime + 1;
            // Only break if truly exhausted (very small batch indicates end of data)
            if (batch.length < 5) break;
        }
        return allData;
    } catch (error) {
        console.error('Failed to fetch funding history:', error);
        return [];
    }
};

const processFundingData = (rawData, range) => {
    if (!rawData?.length) return { chartData: [], avgAPY: null };
    const sorted = [...rawData].sort((a, b) => a.time - b.time);
    const now = Date.now();
    
    const config = {
        '1M': { cutoff: 30 * 24 * 60 * 60 * 1000, maxPoints: 30, groupBy: 'day' },
        '3M': { cutoff: 90 * 24 * 60 * 60 * 1000, maxPoints: 90, groupBy: 'day' },
        '6M': { cutoff: 180 * 24 * 60 * 60 * 1000, maxPoints: 180, groupBy: 'day' }
    };

    const { cutoff, maxPoints, groupBy } = config[range] || config['6M'];
    const filtered = sorted.filter(item => item.time >= now - cutoff);
    
    // Calculate accurate average APY from ALL filtered funding rates (before any grouping/downsampling)
    // Formula: fundingRate * 24 (hourly) * 365 (days) * 0.75 (delta-neutral factor) * 100 (%)
    const avgAPY = filtered.length > 0
        ? filtered.reduce((sum, item) => sum + parseFloat(item.fundingRate) * 24 * 365 * 0.75 * 100, 0) / filtered.length
        : null;
    
    // Group funding rates by day/hour and compute daily APY
    const grouped = {};
    filtered.forEach(item => {
        const date = new Date(item.time);
        let key;
        if (groupBy === 'hour') {
            key = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:00`;
        } else {
            key = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        }
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(parseFloat(item.fundingRate));
    });
    
    // Calculate daily APY from average funding rate per period (for chart visualization)
    let chartData = Object.entries(grouped).map(([date, rates]) => {
        // Skip Oct 8-12 (set APY to 0)
        const skipDates = ['Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12'];
        if (skipDates.some(d => date === d)) {
            return { date, apy: 0 };
        }
        const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
        // Funding rate * 24 (hourly) * 365 days * 100 (%) * 0.75 (delta-neutral uses 75% for short)
        const apy = Math.round(avgRate * 24 * 365 * 0.75 * 10000) / 100;
        return { date, apy };
    });
    
    // Downsample for chart display only (avgAPY is already calculated from full data)
    if (chartData.length > maxPoints) {
        const step = Math.ceil(chartData.length / maxPoints);
        chartData = chartData.filter((_, i) => i % step === 0 || i === chartData.length - 1);
    }
    return { chartData, avgAPY };
};

const calculateAPYStats = (rawData) => {
    if (!rawData?.length) return { live: null, thirtyDay: null, threeMonth: null, max: null, realised: null };
    
    const sorted = [...rawData].sort((a, b) => a.time - b.time);
    const now = Date.now();
    
    const thirtyDayCutoff = now - (30 * 24 * 60 * 60 * 1000);
    const threeMonthCutoff = now - (90 * 24 * 60 * 60 * 1000);
    // Sep 1, 2024 timestamp for realised APY calculation
    const sep2024Cutoff = new Date('2024-09-01T00:00:00Z').getTime();
    
    const thirtyDayData = sorted.filter(item => item.time >= thirtyDayCutoff);
    const threeMonthData = sorted.filter(item => item.time >= threeMonthCutoff);
    // Realised from Sep 2024 onwards
    const realisedData = sorted.filter(item => item.time >= sep2024Cutoff);
    
    const calcAvgAPY = (data) => {
        if (!data.length) return null;
        // 24 (hourly) * 365 days * 0.75 (delta-neutral uses 75% for short) * 100 (%)
        const sum = data.reduce((acc, item) => acc + parseFloat(item.fundingRate) * 24 * 365 * 0.75 * 100, 0);
        return sum / data.length;
    };
    
    // Calculate live APY from the last 24 hours
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneDayAgo = now - oneDayMs;
    const lastDayData = sorted.filter(item => item.time >= oneDayAgo);
    const liveAPY = calcAvgAPY(lastDayData);
    
    // Calculate peak daily APY from past 180 days / 6 months (absolute max, not rolling avg)
    const sixMonthCutoff = now - (180 * 24 * 60 * 60 * 1000);
    const sixMonthData = sorted.filter(item => item.time >= sixMonthCutoff);
    
    let peakDailyAPY = null;
    if (sixMonthData.length > 0) {
        // Group by day
        const dailyRates = {};
        sixMonthData.forEach(item => {
            const date = new Date(item.time);
            const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!dailyRates[dayKey]) dailyRates[dayKey] = [];
            dailyRates[dayKey].push(parseFloat(item.fundingRate));
        });
        
        // Calculate daily APY for each day and find max
        Object.values(dailyRates).forEach(rates => {
            const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
            const dailyAPY = avgRate * 24 * 365 * 0.75 * 100;
            if (peakDailyAPY === null || dailyAPY > peakDailyAPY) {
                peakDailyAPY = dailyAPY;
            }
        });
    }
    
    return {
        live: liveAPY, // Current 24h APY
        thirtyDay: calcAvgAPY(thirtyDayData), // 30-day realized average
        threeMonth: calcAvgAPY(threeMonthData),
        max: peakDailyAPY, // Peak daily APY from past 90 days
        realised: calcAvgAPY(realisedData) // All-time average from Jan 2024
    };
};

// Provider that fetches data once on mount
const FundingDataProvider = ({ children }) => {
    const [fundingHistory, setFundingHistory] = useState([]);
    const [apyStats, setApyStats] = useState({ live: null, thirtyDay: null, threeMonth: null, max: null, realised: null });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch ~500 days to cover Sep 2024 onwards for realised APY
        fetchFundingHistory(500).then(data => {
            setFundingHistory(data);
            setApyStats(calculateAPYStats(data));
            setIsLoading(false);
        });
    }, []);

    const value = useMemo(() => ({ 
        fundingHistory, 
        apyStats, 
        isLoading 
    }), [fundingHistory, apyStats, isLoading]);

    return (
        <FundingDataContext.Provider value={value}>
            {children}
        </FundingDataContext.Provider>
    );
};

const useFundingData = () => {
    const context = useContext(FundingDataContext);
    if (!context) {
        throw new Error('useFundingData must be used within FundingDataProvider');
    }
    return context;
};

// ============================================================================
// APY CHART COMPONENT
// ============================================================================

const APYChart = ({ compact = false }) => {
    const { fundingHistory, isLoading } = useFundingData();
    const [activeRange, setActiveRange] = useState('6M');
    const [chartData, setChartData] = useState([]);
    const [rangeAvgAPY, setRangeAvgAPY] = useState(null);

    useEffect(() => {
        if (fundingHistory.length > 0) {
            const { chartData: newChartData, avgAPY } = processFundingData(fundingHistory, activeRange);
            setChartData(newChartData);
            setRangeAvgAPY(avgAPY);
        }
    }, [activeRange, fundingHistory]);

    const ranges = ['1M', '3M', '6M'];

    return (
        <div className="w-full h-full bg-bone border border-black p-3 md:p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-black/40">Historical Agent APY (Daily)</span>
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
            <div className={`flex-1 ${compact ? 'min-h-[100px]' : 'min-h-[120px] md:min-h-[140px]'}`}>
                {isLoading ? (
                    <ChartLoadingSkeleton />
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
                            {/* Treasury yield reference line */}
                            <ReferenceLine y={4.5} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.5} label={{ value: 'T-Bill ~4.5%', position: 'right', fill: '#ef4444', fontSize: 9 }} />
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
            <div className="flex items-center justify-between border-t border-black pt-3 mt-3 md:pt-4 md:mt-4">
                <div className="flex items-baseline gap-2">
                    <span className="font-serif text-xl md:text-2xl text-accent font-medium">
                        <ScrambledNumber 
                            value={rangeAvgAPY}
                            isLoading={isLoading}
                            suffix="%"
                        />
                    </span>
                    <span className="font-mono text-[9px] md:text-[10px] text-black/40 uppercase">Avg APY</span>
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-accent uppercase tracking-wide font-medium">{activeRange}</span>
            </div>
        </div>
    );
};

// ============================================================================
// SLIDE 1: TITLE
// ============================================================================

const TitleSlide = () => (
    <SlideContainer className="overflow-hidden">
        {/* Grid Background */}
        <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
            }}
        />
        
        {/* Accent corner lines */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 pointer-events-none overflow-hidden">
            <div 
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(238,76,82,0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(238,76,82,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />
        </div>

        <div className="relative z-10 w-full max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Category Badge */}
                <div className="inline-flex items-center gap-3 mb-10 md:mb-14 border border-black px-4 py-2.5 bg-white shadow-sm">
                    <div className="w-2 h-2 bg-accent animate-pulse" />
                    <span className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase">Volatility Neutral. Yield Positive.</span>
                </div>
                        
                {/* Main Headline */}
                <h1 className="text-[3.5rem] md:text-[8rem] lg:text-[10rem] font-serif text-black leading-[0.85] mb-10 md:mb-14 tracking-tight">
                    <span className="block">Deploy</span>
                    <span className="block text-accent italic">Finance</span>
                </h1>
                        
                {/* Tagline */}
                <p className="text-lg md:text-2xl lg:text-3xl font-mono text-black/70 max-w-xl leading-snug">
                    Hedge the volatility.
                    <br />
                    <span className="text-accent font-semibold">Unlock more yield.</span>
                </p>
            </motion.div>
        </div>
    </SlideContainer>
);

// ============================================================================
// SLIDE 2: TAM / MARKET OPPORTUNITY
// ============================================================================

const MarketSlide = () => {
    const marketData = [
        { label: "Stablecoin Market Cap", value: "$160B+", growth: "Growing 25% YoY" },
        { label: "USDC Supply", value: "$43B", growth: "Primary institutional choice" },
        { label: "USDT Supply", value: "$115B", growth: "Dominant retail stablecoin" },
    ];

    const yieldOpportunities = [
        { source: "T-Bills (Risk-Free)", apy: "4.5%", risk: "Baseline" },
        { source: "CEX Lending (USDC)", apy: "3-8%", risk: "Counterparty" },
        { source: "DeFi Lending (Aave)", apy: "2-5%", risk: "Smart Contract" },
        { source: "Delta-Neutral (Deploy)", apy: "15-25%", risk: "Managed", highlight: true },
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
                    <SectionTag>01 — Market Opportunity</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        The <span className="text-accent italic">$160B+</span> stablecoin market is seeking yield.
                    </h2>
                    <p className="text-sm md:text-lg font-mono text-black/50 mb-8 md:mb-12 max-w-3xl">
                        With traditional yields compressing and DeFi complexity rising, capital seeks efficient, risk-adjusted returns.
                    </p>
                    
                    {/* Market Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 mb-8 md:mb-12">
                        {marketData.map((item, i) => (
                            <div 
                                key={item.label}
                                className={`
                                    p-5 md:p-8 border-2 border-black md:border
                                    ${i > 0 ? 'md:border-l-0' : ''}
                                    bg-white
                                `}
                            >
                                <div className="text-3xl md:text-4xl font-serif text-accent mb-2">{item.value}</div>
                                <div className="font-mono text-xs uppercase tracking-wide text-black/70 mb-1">{item.label}</div>
                                <div className="font-mono text-[10px] text-black/40">{item.growth}</div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Yield Comparison Table */}
                    <div className="border-2 border-black bg-white">
                        <div className="p-4 md:p-5 border-b border-black bg-black/5">
                            <h3 className="font-mono text-xs uppercase tracking-widest">Stablecoin Yield Landscape</h3>
                        </div>
                        <div className="divide-y divide-black/10">
                            {yieldOpportunities.map((item) => (
                                <div 
                                    key={item.source}
                                    className={`grid grid-cols-3 p-4 md:p-5 ${item.highlight ? 'bg-accent/5' : ''}`}
                                >
                                    <div className={`font-mono text-sm ${item.highlight ? 'font-bold' : ''}`}>{item.source}</div>
                                    <div className={`font-mono text-sm text-center ${item.highlight ? 'text-accent font-bold' : 'text-black/60'}`}>{item.apy}</div>
                                    <div className="font-mono text-xs text-right text-black/40">{item.risk}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Sources */}
                    <div className="mt-6 pt-4 border-t border-black/10">
                        <div className="font-mono text-[9px] text-black/30 space-x-4">
                            <span>Sources:</span>
                            <a href="https://defillama.com/stablecoins" target="_blank" rel="noopener noreferrer" className="hover:text-accent">DefiLlama</a>
                            <span>•</span>
                            <a href="https://www.circle.com/usdc" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Circle</a>
                            <span>•</span>
                            <a href="https://tether.to/transparency" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Tether</a>
                            <span>•</span>
                            <a href="https://www.treasury.gov" target="_blank" rel="noopener noreferrer" className="hover:text-accent">US Treasury</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 3: THE PROBLEM
// ============================================================================

const ProblemSlide = () => (
    <SlideContainer dark>
        <div className="w-full max-w-5xl">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <SectionTag dark>02 — The Problem</SectionTag>
                
                <h2 className="text-xl md:text-3xl lg:text-4xl font-serif leading-tight mb-8 md:mb-12">
                    Delta-neutral yields are <span className="text-accent italic">disappearing on CEXes.</span><br/>
                    The future is on Perpetual DEXes.
                </h2>
                
                {/* Problem Points */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                    {/* Left: CEX Problem */}
                    <div className="border border-white/20 p-5 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-red-500/20 flex items-center justify-center">
                                <X className="w-5 h-5 text-red-400" />
                            </div>
                            <span className="font-mono text-xs uppercase tracking-widest text-white/50">The CEX Problem</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 font-mono text-sm text-white/70">
                                <span className="text-red-400">→</span>
                                Funding rate arbitrage yields compressed to 3-5% on major CEXes
                            </li>
                            <li className="flex gap-3 font-mono text-sm text-white/70">
                                <span className="text-red-400">→</span>
                                Overcrowded trades, institutional capital flooding in
                            </li>
                            <li className="flex gap-3 font-mono text-sm text-white/70">
                                <span className="text-red-400">→</span>
                                Counterparty risk with centralized exchanges
                            </li>
                        </ul>
                    </div>
                    
                    {/* Right: Ethena/T-Bill Problem */}
                    <div className="border border-white/20 p-5 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-yellow-500/20 flex items-center justify-center">
                                <Landmark className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="font-mono text-xs uppercase tracking-widest text-white/50">The T-Bill Trap</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 font-mono text-sm text-white/70">
                                <span className="text-yellow-400">→</span>
                                Largest delta-neutral platforms (Ethena) allocating heavily to T-Bills
                            </li>
                            <li className="flex gap-3 font-mono text-sm text-white/70">
                                <span className="text-yellow-400">→</span>
                                Yields capped at ~4.5% risk-free rate baseline
                            </li>
                            <li className="flex gap-3 font-mono text-sm text-white/70">
                                <span className="text-yellow-400">→</span>
                                Not truly maximizing crypto-native yield opportunities
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* The Shift */}
                <div className="border-l-2 border-accent pl-6 md:pl-8">
                    <p className="text-base md:text-xl font-serif text-white leading-relaxed mb-2">
                        The alpha has moved to <span className="text-accent">Perpetual DEXes</span>.
                    </p>
                    <p className="font-mono text-sm text-white/50">
                        Higher funding rates, deeper liquidity, and on-chain transparency.
                    </p>
                </div>
            </motion.div>
        </div>
    </SlideContainer>
);

// ============================================================================
// SLIDE 4: THE SOLUTION
// ============================================================================

const SolutionSlide = () => {
    const { apyStats, isLoading } = useFundingData();

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
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        <span className="text-accent italic">We're already building the future.</span>
                    </h2>
                    <p className="text-sm md:text-lg font-mono text-black/50 mb-8 md:mb-12 max-w-2xl">
                        Our pilot on Hyperliquid proved the demand—<span className="font-bold text-black">significant user traction</span> on our self-custodial delta-neutral solution.
                    </p>
                    
                    {/* Key Value Props */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 mb-8">
                        <div className="p-5 md:p-6 border-2 border-black md:border bg-white">
                            <div className="text-3xl md:text-4xl font-serif text-accent mb-2">
                                <ScrambledNumber 
                                    value={apyStats.live}
                                    isLoading={isLoading}
                                    suffix="%"
                                    decimals={1}
                                />
                            </div>
                            <div className="font-mono text-[10px] md:text-xs uppercase tracking-wide text-black/50 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live APY
                            </div>
                        </div>
                        <div className="p-5 md:p-6 border-2 border-black md:border md:border-l-0 bg-white">
                            <div className="text-3xl md:text-4xl font-serif text-accent mb-2">
                                <ScrambledNumber 
                                    value={apyStats.thirtyDay}
                                    isLoading={isLoading}
                                    suffix="%"
                                    decimals={1}
                                />
                            </div>
                            <div className="font-mono text-[10px] md:text-xs uppercase tracking-wide text-black/50">30D Avg APY</div>
                        </div>
                        <div className="p-5 md:p-6 border-2 border-black md:border md:border-l-0 bg-white">
                            <div className="text-3xl md:text-4xl font-serif text-accent mb-2">
                                <ScrambledNumber 
                                    value={apyStats.max}
                                    isLoading={isLoading}
                                    suffix="%"
                                    decimals={1}
                                />
                            </div>
                            <div className="font-mono text-[10px] md:text-xs uppercase tracking-wide text-black/50">6M Peak APY</div>
                        </div>
                        <div className="p-5 md:p-6 border-2 border-black md:border md:border-l-0 bg-white">
                            <div className="text-3xl md:text-4xl font-serif text-accent mb-2">
                                <ScrambledNumber 
                                    value={apyStats.realised}
                                    isLoading={isLoading}
                                    suffix="%"
                                    decimals={1}
                                />
                            </div>
                            <div className="font-mono text-[10px] md:text-xs uppercase tracking-wide text-black/50">Pilot Realised APY</div>
                        </div>
                    </div>
                    
                    {/* Live APY Chart */}
                    <div className="border-2 border-black bg-white p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-black/50">Deploy Yields vs Treasury</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-0.5 bg-accent"></div>
                                    <span className="font-mono text-[10px] text-black/50">Deploy APY</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-0.5 bg-red-400 opacity-50" style={{ borderStyle: 'dashed' }}></div>
                                    <span className="font-mono text-[10px] text-black/50">T-Bill Rate</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[200px] md:h-[250px]">
                            <APYChart compact />
                        </div>
                    </div>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 5: PRIVATE BETA - DEPLOY IN ACTION
// ============================================================================

const BetaSlide = () => {
    const stats = [
        { label: "TVL", value: "15", prefix: "$", suffix: "M", icon: DollarSign },
        { label: "Yield Generated", value: "1.6", prefix: "$", suffix: "M", icon: TrendingUp },
        { label: "Active Wallets", value: "2000", prefix: "", suffix: "+", icon: Wallet },
        { label: "Time to Threshold", value: "2", prefix: "", suffix: " Weeks", icon: Zap },
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
                    <SectionTag dark>04 — Deploy In Action</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        Private Beta: <span className="text-accent italic">The Numbers Don't Lie</span>
                    </h2>
                    <p className="text-base md:text-lg font-mono text-white/40 mb-8 md:mb-12">
                        We hit our $15M TVL threshold in <span className="text-accent font-bold">2 weeks</span> with no marketing.
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 mb-8 md:mb-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-black p-5 md:p-8 text-center">
                                <stat.icon className="w-6 h-6 mx-auto mb-3 text-accent" />
                                <div className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2">
                                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                                </div>
                                <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Beta Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-white/20 p-4 md:p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Check className="w-4 h-4 text-accent" />
                                <span className="font-mono text-xs uppercase text-white/60">Invite-Only Access</span>
                            </div>
                            <p className="font-mono text-sm text-white/40">Controlled rollout with vetted depositors</p>
                        </div>
                        <div className="border border-white/20 p-4 md:p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Check className="w-4 h-4 text-accent" />
                                <span className="font-mono text-xs uppercase text-white/60">Battle-Tested</span>
                            </div>
                            <p className="font-mono text-sm text-white/40">Multiple market conditions navigated</p>
                        </div>
                        <div className="border border-white/20 p-4 md:p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Check className="w-4 h-4 text-accent" />
                                <span className="font-mono text-xs uppercase text-white/60">Zero Incidents</span>
                            </div>
                            <p className="font-mono text-sm text-white/40">Clean security record throughout beta</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 6: dUSD MECHANICS
// ============================================================================

const MechanicsSlide = () => {
    const steps = [
        { step: "01", title: "Deposit Stablecoins", desc: "Swap your USDC for dUSD through our secure vault contracts.", icon: ArrowDownUp },
        { step: "02", title: "Stake dUSD", desc: "Stake your dUSD to start earning delta-neutral yields automatically.", icon: Layers },
        { step: "03", title: "Earn Yields", desc: "Yield accrues in real-time from funding rate arbitrage on Hyperliquid.", icon: TrendingUp }
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
                    <SectionTag>05 — How dUSD Works</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        Simple. <span className="text-accent italic">Powerful.</span> Transparent.
                    </h2>
                    <p className="text-sm md:text-lg font-mono text-black/50 mb-8 md:mb-12 max-w-2xl">
                        Deposit stablecoins, receive dUSD, and let our strategies work for you.
                    </p>
                    
                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 mb-10">
                        {steps.map((item, i) => (
                            <div 
                                key={item.step} 
                                className={`
                                    p-5 md:p-8 
                                    border-2 border-black md:border md:border-black
                                    ${i > 0 ? 'md:border-l-0' : ''}
                                    bg-white hover:bg-black hover:text-white 
                                    transition-colors duration-200 group
                                `}
                            >
                                <div className="font-mono text-[10px] text-accent mb-3 tracking-wide">STEP {item.step}</div>
                                <item.icon className="w-8 h-8 md:w-10 md:h-10 mb-4 stroke-[1.5] text-black group-hover:text-white transition-colors" />
                                <h3 className="text-lg md:text-xl font-serif italic mb-2">{item.title}</h3>
                                <p className="font-mono text-xs md:text-sm leading-relaxed text-black/60 group-hover:text-white/70 transition-colors">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 7: PARTNERSHIPS & COMMITMENTS
// ============================================================================

const PartnersSlide = () => {
    const partners = [
        { name: "FalconX", type: "Partnership", description: "Prime brokerage partner" },
    ];

    const commitments = [
        { entity: "Strategic LPs", amount: "$45M+" },
        { entity: "Institutional Partners", amount: "$25M+" },
        { entity: "Community Allocation", amount: "$10M+" },
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
                    <SectionTag>06 — Commitments & Partnerships</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        <span className="text-accent italic">$80M+</span> TVL Committed
                    </h2>
                    <p className="text-sm md:text-lg font-mono text-black/50 mb-8 md:mb-12">
                        Strategic partners and institutional backers ready to deploy.
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* TVL Commitments */}
                        <div className="border-2 border-black bg-white">
                            <div className="p-4 md:p-5 border-b border-black bg-black/5">
                                <h3 className="font-mono text-xs uppercase tracking-widest">TVL Commitments Breakdown</h3>
                            </div>
                            <div className="divide-y divide-black/10">
                                {commitments.map((item) => (
                                    <div key={item.entity} className="flex items-center justify-between p-4 md:p-5">
                                        <span className="font-mono text-sm">{item.entity}</span>
                                        <span className="font-serif text-xl text-accent">{item.amount}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between p-4 md:p-5 bg-accent/5">
                                    <span className="font-mono text-sm font-bold">Total Committed</span>
                                    <span className="font-serif text-2xl text-accent font-bold">$80M+</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Partners */}
                        <div className="border-2 border-black bg-white flex flex-col">
                            <div className="p-4 md:p-5 border-b border-black bg-black/5">
                                <h3 className="font-mono text-xs uppercase tracking-widest">Key Partners</h3>
                            </div>
                            <div className="flex-1 flex flex-col justify-center p-6 md:p-8">
                                {partners.map((partner) => (
                                    <div key={partner.name} className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-accent/10 flex items-center justify-center">
                                            <Handshake className="w-7 h-7 text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-serif text-2xl md:text-3xl mb-1">{partner.name}</div>
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">{partner.type}</div>
                                            <div className="font-mono text-sm text-black/50">{partner.description}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6 pt-4 border-t border-black/10 font-mono text-xs text-black/40">
                                    + Additional strategic partners in discussion
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 8: TOKENOMICS
// ============================================================================

const TokenomicsSlide = () => {
    const allocation = [
        { label: "Ecosystem", percent: 35, color: "bg-accent", desc: "Rewards, incentives & growth" },
        { label: "Investors", percent: 25, color: "bg-gray-700", desc: "Strategic backers & VCs" },
        { label: "Treasury", percent: 20, color: "bg-gray-500", desc: "Protocol development & ops" },
        { label: "Team", percent: 10, color: "bg-gray-400", desc: "4-year vesting schedule" },
        { label: "Advisors", percent: 5, color: "bg-gray-300", desc: "Strategic guidance" },
        { label: "Liquidity", percent: 5, color: "bg-gray-200", desc: "DEX & CEX liquidity" },
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
                    <SectionTag>07 — Tokenomics</SectionTag>
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-3">
                        Designed for <span className="text-accent italic">sustainable growth</span>.
                    </h2>
                    <p className="text-sm md:text-lg font-mono text-black/50 mb-8 md:mb-12 max-w-2xl">
                        Token distribution aligned with long-term protocol success.
                    </p>
                    
                    {/* Token Allocation - Full Width */}
                    <div className="border-2 border-black bg-white p-5 md:p-8">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-black/50 mb-6">Token Allocation</h3>
                        
                        {/* Visual Bar */}
                        <div className="h-10 md:h-12 flex mb-8 border border-black overflow-hidden">
                            {allocation.map((item) => (
                                <div 
                                    key={item.label}
                                    className={`${item.color} h-full relative group`}
                                    style={{ width: `${item.percent}%` }}
                                >
                                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs md:text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.percent}%
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Allocation Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {allocation.map((item) => (
                                <div key={item.label} className="p-4 border border-black/10 hover:border-black transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-3 h-3 ${item.color}`} />
                                        <span className="font-mono text-2xl md:text-3xl font-bold">{item.percent}%</span>
                                    </div>
                                    <div className="font-mono text-xs md:text-sm font-medium mb-1">{item.label}</div>
                                    <div className="font-mono text-[10px] md:text-xs text-black/40">{item.desc}</div>
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
// SLIDE 9: TEAM
// ============================================================================

const TeamSlide = () => {
    const team = [
        { 
            name: "Benjamin",
            role: "Co-founder & CEO",
            bio: "Product visionary. Built and scaled multiple fintech products.",
            prev: "Serial Entrepreneur",
            twitter: "https://x.com/TheWhale_hunter",
            image: "https://pbs.twimg.com/profile_images/1947936283579305984/_NFcr8_s_400x400.jpg"
        },
        { 
            name: "Amit Trehan",
            role: "Co-founder & CTO",
            bio: "Security-first engineer. Built trading systems at scale.",
            prev: "Ex-VP Lloyd's Bank",
            twitter: "https://x.com/rangesnipe",
            image: "https://pbs.twimg.com/profile_images/1927061332194430976/XrXvfC3Y_400x400.jpg"
        },
        { 
            name: "Ben Lilly",
            role: "DeFi Strategist",
            bio: "On-chain analyst and DeFi strategy expert.",
            prev: "Jarvis Labs",
            twitter: "https://x.com/MrBenLilly",
            image: "https://unavatar.io/twitter/MrBenLilly"
        },
        { 
            name: "Deb", 
            role: "COO", 
            bio: "Operations expert. Scaling teams and processes.",
            prev: "Operations Background",
            twitter: "https://x.com/WhatIsDeb",
            image: "https://pbs.twimg.com/profile_images/1801951800519712768/biGB5nG1_400x400.jpg"
        }
    ];

    const advisors = [
        { name: "Chirdeep", role: "Advisor", expertise: "Strategic Advisor" },
        { name: "Shawn", role: "Angel", expertise: "Ex-JPMorgan" },
    ];

    const angels = [
        { name: "FalconX", role: "Advisory & Angel", expertise: "Crypto Prime Brokerage", note: "Committed" },
        { name: "Jimmy", role: "Angel", expertise: "Coincall" },
        { name: "0xwives", role: "Angel", expertise: "aixbt" },
        { name: "Sankalp", role: "Angel", expertise: "Rising Capital", link: "https://risingcap.co/" },
        { name: "Albin Wang", role: "Angel", expertise: "BitGo", link: "https://sg.linkedin.com/in/albinwan" },
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
                    
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight mb-8 md:mb-12">
                        Builders from <span className="text-accent italic">DeFi & TradFi</span>
                    </h2>
                    
                    {/* Core Team */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-0 mb-8">
                        {team.map((member, i) => (
                            <div 
                                key={member.name} 
                                className={`
                                    bg-white p-4 md:p-6 
                                    border-2 border-black md:border md:border-black
                                    ${i > 0 ? 'md:border-l-0' : ''}
                                    hover:bg-bone transition-colors group
                                `}
                            >
                                {member.image ? (
                                    <div className="w-14 h-14 mb-4 overflow-hidden">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 bg-black/5 mb-4 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                        <User className="w-7 h-7 text-black/20 group-hover:text-accent/50 transition-colors" />
                                    </div>
                                )}
                                <div className="font-serif text-xl mb-0.5">{member.name}</div>
                                <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">{member.role}</div>
                                <p className="font-mono text-xs text-black/60 leading-relaxed mb-3">{member.bio}</p>
                                <div className="font-mono text-[9px] uppercase tracking-widest text-black/30 mb-3">{member.prev}</div>
                                
                                {/* Social Links */}
                                <div className="flex gap-2">
                                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border border-black/20 hover:bg-black hover:text-white transition-colors">
                                        <Twitter className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Advisors & Angels */}
                    <div className="border-2 border-black bg-white p-5 md:p-6">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-black/50 mb-4">Advisors & Angels</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {advisors.map((advisor) => (
                                <div key={advisor.name} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-accent/50" />
                                    </div>
                                    <div>
                                        <div className="font-mono text-sm font-bold">{advisor.name}</div>
                                        <div className="font-mono text-[10px] text-black/40">{advisor.expertise}</div>
                                    </div>
                                </div>
                            ))}
                            {angels.map((angel) => (
                                <div key={angel.name} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-accent/50" />
                                    </div>
                                    <div>
                                        {angel.link ? (
                                            <a href={angel.link} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-bold hover:text-accent transition-colors">
                                                {angel.name}
                                            </a>
                                        ) : (
                                            <div className="font-mono text-sm font-bold">{angel.name}</div>
                                        )}
                                        <div className="font-mono text-[10px] text-black/40">{angel.expertise}</div>
                                        {angel.note && <div className="font-mono text-[9px] text-accent/70">{angel.note}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <p className="text-sm md:text-lg font-mono text-black/40 mt-8 md:mt-12 text-center">10+ team members bridging both worlds.</p>
                </motion.div>
            </div>
        </SlideContainer>
    );
};

// ============================================================================
// SLIDE 10: ASK
// ============================================================================

const AskSlide = () => {
    return (
        <SlideContainer dark>
            <div className="w-full max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTag dark>09 — Connect</SectionTag>
                    
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-serif leading-[1] md:leading-[0.95] mb-8 md:mb-12">
                        Let's build the future<br/>
                        <span className="text-accent italic">of stablecoins together.</span>
                    </h2>
                    
                    {/* Website */}
                    <div className="mb-8 md:mb-10">
                        <a 
                            href="https://deploy.finance" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-3xl md:text-5xl font-serif text-accent hover:text-white transition-colors"
                        >
                            deploy.finance
                        </a>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center gap-4 md:gap-6 mb-8 md:mb-10">
                        <a 
                            href="https://x.com/DeployFinance" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-white/20 px-4 md:px-6 py-3 md:py-4 font-mono text-xs md:text-sm text-white/70 hover:bg-white hover:text-black transition-colors"
                        >
                            <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                            Twitter
                        </a>
                        <a 
                            href="https://t.me/DeployFinanceChat" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-white/20 px-4 md:px-6 py-3 md:py-4 font-mono text-xs md:text-sm text-white/70 hover:bg-white hover:text-black transition-colors"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            Telegram
                        </a>
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

function DeployPitchDeckInner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isIndexOpen, setIsIndexOpen] = useState(false);
    const mainRef = useRef(null);
    const scrollAccumulator = useRef(0);

    const changeSlide = useCallback((direction) => {
        if (isScrolling || isIndexOpen) return;
        setIsScrolling(true);
        scrollAccumulator.current = 0;
        setCurrentSlide(prev => {
            const next = direction === 'next' 
                ? Math.min(prev + 1, SLIDES.length - 1)
                : Math.max(prev - 1, 0);
            if (next !== prev) haptic.medium();
            return next;
        });
        // Reset scroll position to top after slide change
        setTimeout(() => {
            if (mainRef.current) {
                mainRef.current.scrollTop = 0;
            }
        }, 50);
        setTimeout(() => setIsScrolling(false), 700);
    }, [isScrolling, isIndexOpen]);

    const goToPrev = () => {
        if (currentSlide > 0) {
            haptic.light();
            scrollAccumulator.current = 0;
            setCurrentSlide(prev => prev - 1);
            setTimeout(() => {
                if (mainRef.current) mainRef.current.scrollTop = 0;
            }, 50);
        }
    };

    const goToNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            haptic.light();
            scrollAccumulator.current = 0;
            setCurrentSlide(prev => prev + 1);
            setTimeout(() => {
                if (mainRef.current) mainRef.current.scrollTop = 0;
            }, 50);
        }
    };

    useEffect(() => {
        let touchStartY = 0;
        let touchStartX = 0;
        
        const onWheel = (e) => {
            if (isIndexOpen || isScrolling) return;
            
            const container = mainRef.current;
            if (!container) return;
            
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtTop = scrollTop <= 1;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            const hasScrollableContent = scrollHeight > clientHeight + 10;
            
            // If content is scrollable, let it scroll naturally
            if (hasScrollableContent) {
                // Scrolling down but not at bottom - let it scroll
                if (e.deltaY > 0 && !isAtBottom) return;
                // Scrolling up but not at top - let it scroll
                if (e.deltaY < 0 && !isAtTop) return;
            }
            
            // Accumulate scroll momentum for slide change
            scrollAccumulator.current += e.deltaY;
            
            // Only change slide after sufficient scroll intent (threshold)
            const threshold = 150;
            if (Math.abs(scrollAccumulator.current) > threshold) {
                changeSlide(scrollAccumulator.current > 0 ? 'next' : 'prev');
            }
        };
        
        const onKeyDown = (e) => {
            if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); changeSlide('next'); }
            if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); changeSlide('prev'); }
            if (e.key === 'Escape') setIsIndexOpen(false);
        };
        
        const onTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        };
        
        const onTouchEnd = (e) => {
            if (isIndexOpen || isScrolling) return;
            
            const container = mainRef.current;
            if (!container) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                const { scrollTop, scrollHeight, clientHeight } = container;
                const isAtTop = scrollTop <= 1;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
                const hasScrollableContent = scrollHeight > clientHeight + 10;
                
                // Only change slide if at boundary or no scrollable content
                if (!hasScrollableContent || (deltaY > 0 && isAtBottom) || (deltaY < 0 && isAtTop)) {
                    changeSlide(deltaY > 0 ? 'next' : 'prev');
                }
            }
        };
        
        // Use the container for wheel events to check scroll position
        const container = mainRef.current;
        if (container) {
            container.addEventListener('wheel', onWheel, { passive: true });
        }
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        
        return () => {
            if (container) {
                container.removeEventListener('wheel', onWheel);
            }
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [changeSlide, isIndexOpen, isScrolling]);

    const slideComponents = [TitleSlide, MarketSlide, ProblemSlide, SolutionSlide, BetaSlide, MechanicsSlide, PartnersSlide, TokenomicsSlide, TeamSlide, AskSlide];
    const CurrentSlideComponent = slideComponents[currentSlide];
    const isDarkSlide = DARK_SLIDES.includes(currentSlide);

    return (
        <div className={`font-mono h-screen w-screen overflow-hidden relative selection:bg-accent selection:text-white ${isDarkSlide ? 'bg-black text-white' : 'bg-bone text-black'}`}>
            <NoiseOverlay />
            
            {/* Shared Navigation Bar */}
            <Navbar dark={isDarkSlide} />

            {/* Main Content */}
            <main
                ref={mainRef}
                className="w-full h-screen pt-14 md:pt-16 pb-14 md:pb-16 overflow-y-auto overflow-x-hidden"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="min-h-full"
                    >
                        <CurrentSlideComponent />
                    </motion.div>
                </AnimatePresence>
            </main>
            
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

// Wrap with provider so funding data loads immediately on page mount
export default function DeployPitchDeck() {
    return (
        <FundingDataProvider>
            <DeployPitchDeckInner />
        </FundingDataProvider>
    );
}
