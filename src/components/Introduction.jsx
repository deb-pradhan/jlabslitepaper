import React from 'react';
import Section from './Section';

const Introduction = () => {
    return (
        <Section id="intro" subtitle="1. The Market Opportunity" title="The $160B+ Yield Gap">
            <div className="mb-8">
                <p className="mb-6">
                    In 2025, decentralized finance possesses the most sophisticated financial primitives ever created: instant global settlement, programmable money, deep liquidity across thousands of assets. Yet capital efficiency remains shockingly low.
                </p>
                <p className="mb-6">
                    More than 80 percent of all stablecoin supply earns zero yield. USDC alone holds $43B, USDT over $115B—and growing 25% YoY. Institutions allocate cautiously, repelled by the recurring blowups of over-leveraged, self-looping stablecoin experiments.
                </p>
                <p className="mb-6 font-bold">
                    Three structural failures keep the majority of capital idle.
                </p>

                <ul className="list-disc pl-6 space-y-4 mb-8 marker:text-paper-muted">
                    <li>
                        <strong>CEX Yield Compression:</strong> Funding rate arbitrage yields have compressed to 3-5% on major centralized exchanges. Overcrowded trades and institutional capital flooding in have eroded alpha, plus counterparty risk remains.
                    </li>
                    <li>
                        <strong>The T-Bill Trap:</strong> Largest delta-neutral platforms like Ethena allocate heavily to T-Bills, capping yields at ~4.5% risk-free rate. Not truly maximizing crypto-native yield opportunities.
                    </li>
                    <li>
                        <strong>Fake Yields:</strong> Most visible DeFi yields come from token inflation rather than genuine economic demand. When emissions stop, the yield vanishes and the price collapses. Users distrust any APY above treasury-bill rates.
                    </li>
                </ul>

                <p className="text-lg font-serif italic text-paper-muted border-l-2 border-paper-accent pl-4">
                    The alpha has moved to Perpetual DEXes. Higher funding rates, deeper liquidity, and on-chain transparency.
                </p>
            </div>
        </Section>
    );
};

export default Introduction;
