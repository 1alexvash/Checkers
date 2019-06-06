import React from "react";

const EndGame = ({ winner, playAgain }) => (
  <div className="End-Game">
    <div className="content">
      <div className="end-game-text">
        {winner} Team Won:
        <p className="small">click down bellow to play again</p>
      </div>
      <button onClick={() => playAgain()} className="play-again-button">
        Play Again
      </button>
    </div>
  </div>
);

export default EndGame;
