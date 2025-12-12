import React, { useEffect } from 'react';
import DeployPitchDeck from '../deploy_pitch_deck';

function PitchDeck() {
  useEffect(() => {
    document.title = 'Deploy Deck';
  }, []);

  return (
    <div className="pitch-deck-container">
      <DeployPitchDeck />
    </div>
  );
}

export default PitchDeck;

