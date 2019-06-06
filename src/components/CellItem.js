import React from "react";

const CellItem = ({ onClick, cell, className }) => (
  <div className={className} onClick={onClick}>
    {cell.figure ? (
      <img src={`images/${cell.figure}.png`} alt="figure" />
    ) : null}
  </div>
);

export default CellItem;
