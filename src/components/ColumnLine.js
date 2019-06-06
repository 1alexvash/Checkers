import React from "react";
import classnames from "classnames";
import CellItem from "./CellItem";

const ColumnLine = ({ column, selectedFigure, onClick }) => (
  <section>
    {column.map(cell => (
      <CellItem
        key={cell.index}
        className={classnames(
          { black: cell.bg === "#333" },
          {
            red: selectedFigure.x === cell.x && selectedFigure.y === cell.y
          },
          { yellow: cell.highlighted }
        )}
        onClick={() => onClick(cell.x, cell.y, cell.figure)}
        cell={cell}
      />
    ))}
  </section>
);

export default ColumnLine;
