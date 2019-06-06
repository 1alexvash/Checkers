import React, { useState } from "react";

const Prealoader = () => {
  const [readyToPlay, setReadyToPlay] = useState(true); // @dev only

  setTimeout(() => setReadyToPlay(true), 7000);

  return (
    <>
      {readyToPlay ? null : (
        <div className="Prealoader">
          <div className="content">
            <img src="images/mobile-icon.png" className="logo" alt="horse" />
            <p className="author">
              Author: <em>Alexander Vashchuk</em>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Prealoader;
