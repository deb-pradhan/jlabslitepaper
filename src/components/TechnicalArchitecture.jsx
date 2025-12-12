import React from 'react';
import Section from './Section';

const TechnicalArchitecture = () => {
    return (
        <Section id="overview" subtitle="3. What Deploy Actually Is" title="Infrastructure, Not Speculation">
            <p className="mb-8">
                Deploy is not a lending protocol, not a centralized exchange wrapper, and not another algorithmic stablecoin backed by hope and governance tokens.
            </p>
            <p className="mb-8">
                Deploy is <strong>self-custodial financial infrastructure</strong>. Users retain full control of their private keys at all times. The protocol receives only limited, revocable signing permissions to execute delta-neutral perpetual futures trades within strict risk parameters defined by the user. Nothing else.
            </p>

            <div className="mb-12">
                <h3 className="text-xl font-bold mb-6">Battle-Tested Since 2020</h3>
                <p className="mb-6">
                    The system has been live and battle-tested since the 2020–2021 cycle. As of November 2025:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-paper-bg border border-paper-border rounded">
                        <div className="text-3xl font-serif font-bold mb-2">$15M</div>
                        <div className="text-sm text-paper-muted uppercase tracking-wider">TVL (in 2 weeks)</div>
                    </div>
                    <div className="p-6 bg-paper-bg border border-paper-border rounded">
                        <div className="text-3xl font-serif font-bold mb-2">$1.6M</div>
                        <div className="text-sm text-paper-muted uppercase tracking-wider">Yield Generated</div>
                    </div>
                    <div className="p-6 bg-paper-bg border border-paper-border rounded">
                        <div className="text-3xl font-serif font-bold mb-2">2,000+</div>
                        <div className="text-sm text-paper-muted uppercase tracking-wider">Active Wallets</div>
                    </div>
                    <div className="p-6 bg-paper-bg border border-paper-border rounded">
                        <div className="text-3xl font-serif font-bold mb-2">0</div>
                        <div className="text-sm text-paper-muted uppercase tracking-wider">Security Incidents</div>
                    </div>
                </div>

                <div className="p-6 border-l-4 border-green-600 bg-green-50/50">
                    <p className="text-sm text-green-900">
                        <strong>Proven Resilience:</strong> Positive returns generated for users during every significant crash, including a documented <strong>1.3% profit on October 10th 2025</strong> when markets flash-dropped 12% in hours.
                    </p>
                </div>

                <p className="mt-8">
                    No direct competitor combines true self-custody with institutional-grade automation and verifiable real yield. Deploy is unique.
                </p>
            </div>
        </Section>
    );
};

export default TechnicalArchitecture;
