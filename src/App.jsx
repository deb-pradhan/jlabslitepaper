import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Litepaper from './pages/Litepaper';
import PitchDeck from './pages/PitchDeck';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Litepaper />} />
        <Route path="/pitch" element={<PitchDeck />} />
      </Routes>
    </Router>
  );
}

export default App;
