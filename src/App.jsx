import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Litepaper from './pages/Litepaper';
import PitchDeck from './pages/PitchDeck';
import FAQ from './pages/FAQ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Litepaper />} />
        <Route path="/pitch" element={<PitchDeck />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;
