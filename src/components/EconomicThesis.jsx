import React from 'react';
import Section from './Section';

const EconomicThesis = () => {
    return (
        <Section id="thesis" subtitle="2. Economic Thesis" title="A Modern Gresham’s Law">
            <div className="mb-12">
                <p className="mb-6">
                    History provides the clearest lens for understanding the future of money.
                </p>
                <p className="mb-6">
                    During the Wildcat Banking era of the 19th century United States, hundreds of private banks issued their own paper notes. Savvy citizens quickly learned to hoard gold and silver while spending the depreciating paper in daily commerce. Sir Thomas Gresham’s 16th century observation was proven once again: <strong>bad money drives out good.</strong>
                </p>
                <p className="mb-6">
                    Crypto is recreating the same dynamic, only in reverse.
                </p>
                <p className="mb-6">
                    Bitcoin and Ethereum have become the new gold and silver: scarce, deflationary, socially incontestable stores of value with unbreakable consensus. Fiat-pegged stablecoins are the new paper notes: infinitely printable, slowly depreciating, perfect for transactions yet terrible for long-term holding.
                </p>
                <p className="mb-8">
                    The rational strategy is therefore the exact opposite of what most participants currently do.
                </p>

                <div className="p-6 bg-paper-bg border border-paper-border rounded-lg mb-8">
                    <ul className="space-y-2 font-serif text-lg">
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-paper-accent"></span>
                            Never sell your Bitcoin or Ethereum again.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-paper-accent"></span>
                            Never hold large idle balances in inflationary fiat tokens.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-paper-accent"></span>
                            <strong>Hold wealth in the superior asset.</strong>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-paper-accent"></span>
                            <strong>Hold debt and spending power in the inferior asset.</strong>
                        </li>
                    </ul>
                </div>

                <p className="mb-12">
                    Deploy exists to make this strategy not just possible but automatic, productive, and available to everyone from retail holders to sovereign scale institutions.
                </p>

                {/* Diagram 1: The Deploy Yield Flow */}
                <figure className="my-12 border border-paper-border rounded bg-white overflow-hidden">
                    <svg viewBox="0 0 600 140" className="w-full h-auto font-sans bg-white" role="img" aria-labelledby="diagramTitle">
                        <title id="diagramTitle">The Deploy Yield Flow Diagram</title>
                        
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#1A1A1A" />
                            </marker>
                        </defs>

                        {/* Step 1: Stablecoins */}
                        <g transform="translate(20, 30)">
                            <rect x="0" y="0" width="140" height="80" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
                            <text x="70" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1A1A1A">Stablecoins</text>
                            <text x="70" y="55" textAnchor="middle" fontSize="11" fill="#666">USDC, USDT</text>
                        </g>

                        {/* Arrow 1 */}
                        <line x1="160" y1="70" x2="190" y2="70" stroke="#1A1A1A" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

                        {/* Step 2: Deploy Protocol */}
                        <g transform="translate(200, 20)">
                            <rect x="0" y="0" width="160" height="100" rx="4" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1.5" />
                            <text x="80" y="45" textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">Deploy Protocol</text>
                            <text x="80" y="65" textAnchor="middle" fontSize="11" fill="#CCC">Delta-Neutral Yield</text>
                        </g>

                        {/* Arrow 2 */}
                        <line x1="360" y1="70" x2="390" y2="70" stroke="#1A1A1A" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

                        {/* Step 3: dUSD */}
                        <g transform="translate(400, 30)">
                            <rect x="0" y="0" width="140" height="80" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
                            <text x="70" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1A1A1A">dUSD</text>
                            <text x="70" y="55" textAnchor="middle" fontSize="11" fill="#666">15-25% APY</text>
                        </g>
                    </svg>
                    <figcaption className="text-center text-sm text-paper-muted p-4 border-t border-paper-border font-medium">Figure 1: The Deploy Yield Flow</figcaption>
                </figure>
            </div>
        </Section>
    );
};

export default EconomicThesis;
