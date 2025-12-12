import React from 'react';
import Section from './Section';

const ProductEcosystem = () => {
    return (
        <Section id="product" subtitle="4. The Product Stack" title="D-Assets and DUSD">
            <div className="mb-12">
                <h3 className="text-xl font-bold mb-4">4.1 D-Assets: The New High-Quality Collateral Standard</h3>
                <p className="mb-6">
                    A D-Asset is the tokenized representation of a user’s original deposit plus all funding-rate yield accrued over time. It is always delta-neutral, always backed one-for-one by the underlying BTC, ETH, USDC, or other supported asset, and always fully redeemable.
                </p>
                <p className="mb-6">
                    D-Assets are designed from first principles to satisfy the three criteria that actually matter for high-quality collateral in a mature financial system:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-8 marker:text-paper-muted">
                    <li><strong>Deep Liquidity:</strong> Minimal slippage even at institutional size.</li>
                    <li><strong>Lindy Properties:</strong> Social consensus that has already survived multiple cycles.</li>
                    <li><strong>Extensive Tooling:</strong> Integration across lending, borrowing, and derivatives markets.</li>
                </ul>

                <p className="mb-12">
                    Because D-Assets inherit these properties from their underlying and add continuous yield on top, they are strictly superior to idle versions of the same assets. Over time, rational markets will demand D-Assets everywhere that raw BTC or ETH is accepted today.
                </p>
            </div>

            <div className="mb-12">
                <h3 className="text-xl font-bold mb-4">4.2 dUSD: The Yield-Bearing Stablecoin That Finally Makes Sense</h3>
                <p className="mb-6">
                    dUSD is a fully collateralized, yield-bearing dollar token powered by delta-neutral strategies on Hyperliquid. It delivers sustainable 15-25% APY from real economic demand—not token emissions or T-Bill allocations.
                </p>

                <div className="p-6 bg-paper-bg border border-paper-border rounded-lg mb-8">
                    <h4 className="font-bold mb-4">How DUSD Yield Works</h4>
                    <div className="space-y-4 text-sm">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-paper-accent text-white flex items-center justify-center shrink-0 font-bold">1</div>
                            <div>
                                <span className="font-bold block">Market Demand</span>
                                When the crypto market is bullish (most of the time), longs pay shorts.
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-paper-accent text-white flex items-center justify-center shrink-0 font-bold">2</div>
                            <div>
                                <span className="font-bold block">Delta-Neutral Position</span>
                                Deploy is always short in a delta-neutral hedged position. Therefore Deploy collects.
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-paper-accent text-white flex items-center justify-center shrink-0 font-bold">3</div>
                            <div>
                                <span className="font-bold block">Direct Distribution</span>
                                DUSD holders receive the yield directly. No self-looping, no basis-trade recursion.
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mb-6">
                    Historical annualized funding rates across major venues have averaged <strong>15 to 25 percent</strong> since 2019, with frequent spikes above 50 percent during bull runs. Even after conservative slippage and operational costs, net APY to DUSD holders consistently lands in the high teens to low twenties across cycles.
                </p>
                <p>
                    Future iterations will add optional privacy layers (zk proofs or mixer integration) to meet institutional compliance requirements without sacrificing self-custody.
                </p>
            </div>
        </Section>
    );
};

export default ProductEcosystem;
