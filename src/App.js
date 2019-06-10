import React, { Component } from "react";
import "./scss/main.css";

import ColumnLine from "./components/ColumnLine";
import Prealoader from "./components/Prealoader";
import EndGame from "./components/EndGame";

class App extends Component {
  state = {
    board: [],
    turn: "red",
    selectedFigure: { x: null, y: null },
    winner: null,
    path: []
  };

  wipeTheBoard() {
    let { board } = this.state;

    board.map(column => column.map(row => (row.figure = "")));

    this.setState({ board });
  }

  initBoard() {
    // Initialization of the board
    let { board } = this.state;
    for (let x = 0; x < 8; x++) {
      let row = [];
      for (let y = 0; y < 8; y++) {
        let index = x * 8 + y;
        let bg = (x + y) % 2 ? "#333" : "red";
        row.push({ x, y, index, bg, figure: "", highlighted: false });
      }
      board.push(row);
    }
    this.setState({ board });
  }

  initFigures() {
    // Initialization of the figures
    let { board } = this.state;

    let blackTeam = [
      [0, 0],
      [2, 0],
      [4, 0],
      [6, 0],

      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],

      [0, 2],
      [2, 2],
      [4, 2],
      [6, 2]
    ];

    blackTeam.forEach(figure => {
      board[figure[0]][figure[1]].figure = "black-man";
    });

    let redTeam = [
      [1, 5],
      [3, 5],
      [5, 5],
      [7, 5],

      [0, 6],
      [2, 6],
      [4, 6],
      [6, 6],

      [1, 7],
      [3, 7],
      [5, 7],
      [7, 7]
    ];

    redTeam.forEach(figure => {
      board[figure[0]][figure[1]].figure = "red-man";
    });
  }

  componentWillMount = () => {
    this.initBoard();
    this.initFigures();
  };

  clearTable() {
    let { board } = this.state;
    board.map(columns => columns.map(cell => (cell.highlighted = false)));
    this.setState({ board });
  }

  doesCellExist(x, y) {
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
      return true;
    } else {
      return false;
    }
  }

  doesCellEmpty(x, y) {
    const { board } = this.state;
    if (this.doesCellExist(x, y)) {
      if (board[x][y].figure === "") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  doesEnemyAtCell(x, y) {
    const { board, turn } = this.state;
    if (this.doesCellExist(x, y) && !this.doesCellEmpty(x, y)) {
      if (board[x][y].figure.indexOf(turn) < 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  drawHighlighting() {
    const { board, path } = this.state;
    path.forEach(point => {
      if (this.doesCellEmpty(point.x, point.y)) {
        board[point.x][point.y].highlighted = true;
      }
    });

    this.setState({ board, path });
  }

  pawnContinuePath(x, y, checkFrom) {
    const { path } = this.state;

    let initialRef = path.find(p => p.x === x && p.y === y);
    // Checking from Top Left
    if (checkFrom !== "Top Left") {
      if (
        this.doesEnemyAtCell(x - 1, y - 1) &&
        this.doesCellEmpty(x - 2, y - 2)
      ) {
        const index = path.push({ x: x - 1, y: y - 1, ref: initialRef });
        path.push({ x: x - 2, y: y - 2, ref: path[index - 1] });

        this.pawnContinuePath(x - 2, y - 2, "Bottom Right");
      }
    }
    // Checking from Top Right
    if (checkFrom !== "Top Right") {
      if (
        this.doesEnemyAtCell(x + 1, y - 1) &&
        this.doesCellEmpty(x + 2, y - 2)
      ) {
        const index = path.push({ x: x + 1, y: y - 1, ref: initialRef });
        path.push({ x: x + 2, y: y - 2, ref: path[index - 1] });
        this.pawnContinuePath(x + 2, y - 2, "Bottom Left");
      }
    }
    // Checking from Bottom Left
    if (checkFrom !== "Bottom Left") {
      if (
        this.doesEnemyAtCell(x - 1, y + 1) &&
        this.doesCellEmpty(x - 2, y + 2)
      ) {
        const index = path.push({ x: x - 1, y: y + 1, ref: initialRef });
        path.push({ x: x - 2, y: y + 2, ref: path[index - 1] });
        this.pawnContinuePath(x - 2, y + 2, "Top Right");
      }
    }
    // Checking from Bottom Right
    if (checkFrom !== "Bottom Right") {
      if (
        this.doesEnemyAtCell(x + 1, y + 1) &&
        this.doesCellEmpty(x + 2, y + 2)
      ) {
        const index = path.push({ x: x + 1, y: y + 1, ref: initialRef });
        path.push({ x: x + 2, y: y + 2, ref: path[index - 1] });
        this.pawnContinuePath(x + 2, y + 2, "Top Left");
      }
    }

    this.drawHighlighting();
  }

  pawnCheckDirection(x, y, path, direction) {
    // Top Left
    if (direction === "Top Left") {
      if (this.doesCellEmpty(x - 1, y - 1)) {
        path.push({ x: x - 1, y: y - 1, ref: { x, y, ref: "" } });
      } else if (
        this.doesEnemyAtCell(x - 1, y - 1) &&
        this.doesCellEmpty(x - 2, y - 2)
      ) {
        const index = path.push({ x: x - 1, y: y - 1, ref: { x, y, ref: "" } });
        path.push({ x: x - 2, y: y - 2, ref: path[index - 1] });
        this.setState({ path }, () =>
          this.pawnContinuePath(x - 2, y - 2, "Bottom Right")
        );
      }
    }
    // Top Right
    if (direction === "Top Right") {
      if (this.doesCellEmpty(x + 1, y - 1)) {
        path.push({ x: x + 1, y: y - 1, ref: { x, y, ref: "" } });
      } else if (
        this.doesEnemyAtCell(x + 1, y - 1) &&
        this.doesCellEmpty(x + 2, y - 2)
      ) {
        const index = path.push({ x: x + 1, y: y - 1, ref: { x, y, ref: "" } });
        path.push({ x: x + 2, y: y - 2, ref: path[index - 1] });
        this.setState({ path }, () =>
          this.pawnContinuePath(x + 2, y - 2, "Bottom Left")
        );
      }
    }
    // Top Left
    if (direction === "Bottom Left") {
      if (this.doesCellEmpty(x - 1, y + 1)) {
        path.push({ x: x - 1, y: y + 1, ref: { x, y, ref: "" } });
      } else if (
        this.doesEnemyAtCell(x - 1, y + 1) &&
        this.doesCellEmpty(x - 2, y + 2)
      ) {
        const index = path.push({ x: x - 1, y: y + 1, ref: { x, y, ref: "" } });
        path.push({ x: x - 2, y: y + 2, ref: path[index - 1] });
        this.setState({ path }, () =>
          this.pawnContinuePath(x - 2, y + 2, "Top Right")
        );
      }
    }
    // Top Left
    if (direction === "Bottom Right") {
      if (this.doesCellEmpty(x + 1, y + 1)) {
        path.push({ x: x + 1, y: y + 1, ref: { x, y, ref: "" } });
      } else if (
        this.doesEnemyAtCell(x + 1, y + 1) &&
        this.doesCellEmpty(x + 2, y + 2)
      ) {
        const index = path.push({ x: x + 1, y: y + 1, ref: { x, y, ref: "" } });
        path.push({ x: x + 2, y: y + 2, ref: path[index - 1] });
        this.setState({ path }, () =>
          this.pawnContinuePath(x + 2, y + 2, "Top Left")
        );
      }
    }
  }

  pawnRed(x, y) {
    let path = [];

    this.pawnCheckDirection(x, y, path, "Top Left");
    this.pawnCheckDirection(x, y, path, "Top Right");

    this.setState({ path }, () => this.drawHighlighting());
  }
  pawnBlack(x, y) {
    let path = [];

    this.pawnCheckDirection(x, y, path, "Bottom Left");
    this.pawnCheckDirection(x, y, path, "Bottom Right");

    this.setState({ path }, () => this.drawHighlighting());
  }

  king(x, y) {
    let path = [];

    this.pawnCheckDirection(x, y, path, "Top Left");
    this.pawnCheckDirection(x, y, path, "Top Right");
    this.pawnCheckDirection(x, y, path, "Bottom Left");
    this.pawnCheckDirection(x, y, path, "Bottom Right");

    this.setState({ path }, () => this.drawHighlighting());
  }

  selectCell = (x, y, figure) => {
    let { board, selectedFigure, turn, path } = this.state;
    if (figure && figure.indexOf(turn) >= 0) {
      selectedFigure.x = x;
      selectedFigure.y = y;
      this.clearTable();
      this.setState({ selectedFigure });
      switch (figure) {
        case "red-man":
          this.pawnRed(x, y);
          break;
        case "black-man":
          this.pawnBlack(x, y);
          break;
        case "red-king":
          this.king(x, y);
          break;
        case "black-king":
          this.king(x, y);
          break;
        default:
          break;
      }
    }
    // Clicked cell
    if (board[x][y].highlighted) {
      // Kill figures
      let myPoint = path.find(point => point.x === x && point.y === y);
      board[myPoint.x][myPoint.y].figure = "";
      if (this.doesEnemyAtCell(myPoint.x, myPoint.y)) {
        board[myPoint.x][myPoint.y].figure = "";
      }

      // from pawn to king
      if (
        myPoint.y === 0 &&
        board[selectedFigure.x][selectedFigure.y].figure.indexOf("red-man") >= 0
      ) {
        board[selectedFigure.x][selectedFigure.y].figure = "red-king";
      }
      if (
        myPoint.y === 7 &&
        board[selectedFigure.x][selectedFigure.y].figure.indexOf("black-man") >=
          0
      ) {
        board[selectedFigure.x][selectedFigure.y].figure = "black-king";
      }

      while (myPoint.ref) {
        myPoint = myPoint.ref;

        // from pawn to king
        if (
          myPoint.y === 0 &&
          board[selectedFigure.x][selectedFigure.y].figure.indexOf("red-man") >=
            0
        ) {
          board[selectedFigure.x][selectedFigure.y].figure = "red-king";
        }
        if (
          myPoint.y === 7 &&
          board[selectedFigure.x][selectedFigure.y].figure.indexOf(
            "black-man"
          ) >= 0
        ) {
          board[selectedFigure.x][selectedFigure.y].figure = "black-king";
        }

        if (this.doesEnemyAtCell(myPoint.x, myPoint.y)) {
          board[myPoint.x][myPoint.y].figure = "";
        }
      }

      // Win Case
      let redFigures = 0;
      let blackFigures = 0;
      board.forEach(column =>
        column.forEach(row => {
          if (row.figure.indexOf("red") >= 0) {
            redFigures++;
          }
          if (row.figure.indexOf("black") >= 0) {
            blackFigures++;
          }
        })
      );

      if (redFigures === 0) {
        this.setState({ winner: "black" });
      }
      if (blackFigures === 0) {
        this.setState({ winner: "red" });
      }

      turn = turn === "red" ? "black" : "red"; // change turn after the move
      board[x][y].figure = board[selectedFigure.x][selectedFigure.y].figure;
      board[selectedFigure.x][selectedFigure.y].figure = "";

      this.clearTable();
      this.setState({ turn, board, selectedFigure: { x: null, y: null } });
    }
  };

  playAgain = () => {
    this.wipeTheBoard();
    this.initFigures();
    this.setState({
      winner: null,
      turn: "red"
    });
  };

  render() {
    let { board, selectedFigure, winner } = this.state;

    return (
      <div className="App">
        <Prealoader />
        <EndGame winner={winner} playAgain={this.playAgain} />
        <div className="grid">
          {board.map((column, columnIndex) => (
            <ColumnLine
              key={columnIndex}
              column={column}
              selectedFigure={selectedFigure}
              onClick={this.selectCell}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
