import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import EconomicThesis from '../components/EconomicThesis';
import TechnicalArchitecture from '../components/TechnicalArchitecture';
import ProductEcosystem from '../components/ProductEcosystem';
import RiskManagement from '../components/RiskManagement';
import EfficiencyPerformance from '../components/EfficiencyPerformance';
import Transparency from '../components/Transparency';
import Roadmap from '../components/Roadmap';
import Conclusion from '../components/Conclusion';

function Litepaper() {
  return (
    <Layout>
      <Hero />
      <Introduction />
      <EconomicThesis />
      <TechnicalArchitecture />
      <ProductEcosystem />
      <RiskManagement />
      <EfficiencyPerformance />
      <Transparency />
      <Roadmap />
      <Conclusion />
    </Layout>
  );
}

export default Litepaper;

