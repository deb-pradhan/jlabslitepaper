import React from 'react';
import Section from './Section';

const Conclusion = () => {
    return (
        <Section id="invitation" subtitle="9. An Open Invitation" title="Real Yield, Finally">
            <div className="mb-12">
                <p className="mb-6">
                    Deploy is not launching another short-lived 30 percent APY token that will rug when emissions end.
                </p>
                <p className="mb-8">
                    We are building the financial infrastructure that will still be standing in 2030 and beyond: self-custodial by design, battle-tested through half a decade of chaos, ruthlessly focused on real yield that compounds whether markets are up, down, or sideways.
                </p>

                <div className="space-y-4 mb-12">
                    <div className="p-4 border-l-2 border-paper-accent bg-paper-bg/50">
                        If you're tired of watching CEX yields compress while counterparty risk remains...
                    </div>
                    <div className="p-4 border-l-2 border-paper-accent bg-paper-bg/50">
                        If you're an institution seeking sustainable, risk-adjusted returns above the T-Bill rate...
                    </div>
                    <div className="p-4 border-l-2 border-paper-accent bg-paper-bg/50">
                        If you want delta-neutral yields with on-chain transparency and no custody transfer...
                    </div>
                    <div className="p-4 border-l-2 border-paper-accent bg-paper-bg/50">
                        If you believe the alpha has moved to Perp DEXes and want exposure to Hyperliquid funding rates...
                    </div>
                    <div className="mt-4 font-bold pl-4">
                        ...then Deploy was built for you.
                    </div>
                </div>

                <div className="text-center py-12 border-t border-paper-border">
                    <h3 className="text-2xl font-serif font-bold mb-6">Welcome to Deploy.</h3>

                    <div className="flex flex-col gap-2 text-lg mb-8">
                        <span>Hedge the volatility.</span>
                        <span className="font-bold">Unlock more yield.</span>
                    </div>

                    <a href="https://app.deploy.finance/dashboard?ref=MBRY6BF8" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-paper-accent text-white font-medium rounded hover:bg-black transition-colors">
                        Launch App
                    </a>
                </div>
            </div>
        </Section>
    );
};

export default Conclusion;
