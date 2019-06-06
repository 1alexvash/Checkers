import React from "react";

const EndGame = ({ winner, playAgain }) => {
  let winnerScreen = "";

  if (winner) {
    winnerScreen = (
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
  }

  return winnerScreen;
};

export default EndGame;
