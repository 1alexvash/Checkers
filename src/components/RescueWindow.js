import React from "react";

const RescueWindow = ({
  turn,
  whitesDead,
  blacksDead,
  selectedFigure,
  onClick
}) => (
  <div className="RescueWindow">
    <div className="content">
      <h1>Pick up a figure to rescue:</h1>
      <div className="list-of-figures">
        {turn === "white" ? (
          <>
            {whitesDead.map((figure, index) => (
              <section
                key={index}
                onClick={() =>
                  onClick(selectedFigure.x, selectedFigure.y, figure)
                }
              >
                <img
                  title="Rescue this figure"
                  src={`images/${figure}.png`}
                  alt="figure"
                />
              </section>
            ))}
          </>
        ) : (
          <>
            {blacksDead.map((figure, index) => (
              <section
                key={index}
                onClick={() =>
                  onClick(selectedFigure.x, selectedFigure.y, figure)
                }
              >
                <img
                  title="Rescue this figure"
                  src={`images/${figure}.png`}
                  alt="figure"
                />
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
);

export default RescueWindow;
