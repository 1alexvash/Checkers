import React, { Component } from "react";
import "./scss/main.css";

import ColumnLine from "./components/ColumnLine";
import Prealoader from "./components/Prealoader";
import RescueWindow from "./components/RescueWindow";
import EndGame from "./components/EndGame";

class App extends Component {
  state = {
    board: [],
    turn: "white",
    selectedFigure: { x: null, y: null },
    winner: null,
    showRescueWindow: false,
    whitesDead: [],
    blacksDead: []
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
        let bg = (x + y) % 2 ? "#333" : "white";
        row.push({ x, y, index, bg, figure: "", highlighted: false });
      }
      board.push(row);
    }
    this.setState({ board });
  }

  initFigures() {
    // Initialization of the figures
    let { board } = this.state;
    let figures = [
      "rock",
      "horse",
      "bishop",
      "queen",
      "king",
      "bishop",
      "horse",
      "rock"
    ];
    figures.forEach((figure, index) => {
      board[index][1].figure = "pawn-black";
      board[index][6].figure = "pawn-white";
      board[index][0].figure = figure + "-black";
      board[index][7].figure = figure + "-white";
    });
    this.setState({ board });
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
      if (board[x][y].figure.indexOf(turn) <= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  pawnWhite(x, y) {
    let { board } = this.state;

    if (this.doesCellEmpty(x, y - 1)) {
      board[x][y - 1].highlighted = true;
      if (y === 6 && this.doesCellEmpty(x, y - 2)) {
        board[x][y - 2].highlighted = true;
      }
    }
    if (this.doesEnemyAtCell(x - 1, y - 1)) {
      board[x - 1][y - 1].highlighted = true;
    }
    if (this.doesEnemyAtCell(x + 1, y - 1)) {
      board[x + 1][y - 1].highlighted = true;
    }

    this.setState({ board });
  }
  pawnBlack(x, y) {
    let { board } = this.state;

    if (this.doesCellEmpty(x, y + 1)) {
      board[x][y + 1].highlighted = true;
      if (y === 1 && this.doesCellEmpty(x, y + 2)) {
        board[x][y + 2].highlighted = true;
      }
    }
    if (this.doesEnemyAtCell(x - 1, y + 1)) {
      board[x - 1][y + 1].highlighted = true;
    }
    if (this.doesEnemyAtCell(x + 1, y + 1)) {
      board[x + 1][y + 1].highlighted = true;
    }

    this.setState({ board });
  }
  rock(x, y) {
    const { board } = this.state;

    let i;

    // Move To Top
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x, y - i)) {
        board[x][y - i].highlighted = true;
      } else if (this.doesEnemyAtCell(x, y - i)) {
        board[x][y - i].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    // Move To Bottom
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x, y + i)) {
        board[x][y + i].highlighted = true;
      } else if (this.doesEnemyAtCell(x, y + i)) {
        board[x][y + i].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    // Move To Left
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x - i, y)) {
        board[x - i][y].highlighted = true;
      } else if (this.doesEnemyAtCell(x - i, y)) {
        board[x - i][y].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    // Move To Rigth
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x + i, y)) {
        board[x + i][y].highlighted = true;
      } else if (this.doesEnemyAtCell(x + i, y)) {
        board[x + i][y].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    this.setState({ board });
  }
  horse(x, y) {
    const { board } = this.state;
    const values = [
      { x: x - 2, y: y - 1 },
      { x: x + 2, y: y - 1 },
      { x: x - 2, y: y + 1 },
      { x: x + 2, y: y + 1 },
      { x: x - 1, y: y - 2 },
      { x: x + 1, y: y - 2 },
      { x: x - 1, y: y + 2 },
      { x: x + 1, y: y + 2 }
    ];

    values.forEach(value => {
      if (
        this.doesCellEmpty(value.x, value.y) ||
        this.doesEnemyAtCell(value.x, value.y)
      ) {
        board[value.x][value.y].highlighted = true;
      }
    });
    this.setState({ board });
  }
  bishop(x, y) {
    const { board } = this.state;

    let i;

    // Move To Top Left
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x - i, y - i)) {
        board[x - i][y - i].highlighted = true;
      } else if (this.doesEnemyAtCell(x - i, y - i)) {
        board[x - i][y - i].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    // Move To Top Right
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x + i, y - i)) {
        board[x + i][y - i].highlighted = true;
      } else if (this.doesEnemyAtCell(x + i, y - i)) {
        board[x + i][y - i].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    // Move To Bottom Left
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x - i, y + i)) {
        board[x - i][y + i].highlighted = true;
      } else if (this.doesEnemyAtCell(x - i, y + i)) {
        board[x - i][y + i].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    // Move To Bottom Right
    i = 1;
    while (i <= 7) {
      if (this.doesCellEmpty(x + i, y + i)) {
        board[x + i][y + i].highlighted = true;
      } else if (this.doesEnemyAtCell(x + i, y + i)) {
        board[x + i][y + i].highlighted = true;
        break;
      } else {
        break;
      }
      i++;
    }

    this.setState({ board });
  }
  queen(x, y) {
    this.rock(x, y);
    this.bishop(x, y);
  }
  king(x, y) {
    let { board } = this.state;

    const values = [
      { x: x - 1, y: y - 1 },
      { x: x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
      { x: x, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y: y }
    ];

    values.forEach(value => {
      if (
        this.doesCellEmpty(value.x, value.y) ||
        this.doesEnemyAtCell(value.x, value.y)
      ) {
        board[value.x][value.y].highlighted = true;
      }
    });

    this.setState({ board });
  }

  selectCell = (x, y, figure) => {
    let { board, selectedFigure, turn, whitesDead, blacksDead } = this.state;
    if (figure && figure.indexOf(turn) >= 0) {
      selectedFigure.x = x;
      selectedFigure.y = y;
      this.clearTable();
      this.setState({ selectedFigure });
      if (figure.indexOf("pawn-black") >= 0) {
        this.pawnBlack(x, y);
      }
      if (figure.indexOf("pawn-white") >= 0) {
        this.pawnWhite(x, y);
      }
      if (figure.indexOf("rock") >= 0) {
        this.rock(x, y);
      }
      if (figure.indexOf("horse") >= 0) {
        this.horse(x, y);
      }
      if (figure.indexOf("bishop") >= 0) {
        this.bishop(x, y);
      }
      if (figure.indexOf("queen") >= 0) {
        this.queen(x, y);
      }
      if (figure.indexOf("king") >= 0) {
        this.king(x, y);
      }
    }
    // Clicked cell
    if (board[x][y].highlighted) {
      if (board[x][y].figure !== "") {
        if (board[x][y].figure.indexOf("pawn") !== 0) {
          let { whitesDead, blacksDead } = this.state;
          let victim = board[x][y].figure;
          if (board[x][y].figure.indexOf("white") >= 0) {
            whitesDead.push(victim);
            this.setState({ whitesDead });
          } else {
            blacksDead.push(victim);
            this.setState({ blacksDead });
          }
        }
      }

      if (board[x][y].figure === "king-black") {
        this.setState({ winner: "White" });
      }
      if (board[x][y].figure === "king-white") {
        this.setState({ winner: "Black" });
      }
      turn = turn === "white" ? "black" : "white"; // change turn after the move
      board[x][y].figure = board[selectedFigure.x][selectedFigure.y].figure;
      board[selectedFigure.x][selectedFigure.y].figure = "";

      // White pawn reached the end of the board
      if (
        board[x][y].figure.indexOf("pawn-white") >= 0 &&
        board[x][y].y === 0 &&
        whitesDead.length > 0
      ) {
        this.setState({ showRescueWindow: true, selectedFigure: { x, y } });
        this.clearTable();
        return;
      }

      // Black pawn reached the end of the board
      if (
        board[x][y].figure.indexOf("pawn-black") >= 0 &&
        board[x][y].y === 7 &&
        blacksDead.length > 0
      ) {
        this.setState({ showRescueWindow: true, selectedFigure: { x, y } });
        this.clearTable();
        return;
      }

      this.clearTable();
      this.setState({ turn, board, selectedFigure: { x: null, y: null } });
    }
  };

  playAgain = () => {
    this.wipeTheBoard();
    this.initFigures();
    this.setState({
      winner: null,
      turn: "white",
      whitesDead: [],
      blacksDead: []
    });
  };

  rescueFigure = (x, y, figure) => {
    let { board, selectedFigure, turn, whitesDead, blacksDead } = this.state;

    board[selectedFigure.x][selectedFigure.y].figure = figure;

    // Removing the figure from the dead list after the rescuing
    if (turn === "white") {
      whitesDead.splice(whitesDead.indexOf(figure), 1);
    } else {
      blacksDead.splice(blacksDead.indexOf(figure), 1);
    }

    turn = turn === "white" ? "black" : "white"; // change turn after the rescuing

    this.setState({
      showRescueWindow: false,
      board,
      selectedFigure: { x: null, y: null },
      turn,
      whitesDead,
      blacksDead
    });
  };

  render() {
    let {
      turn,
      board,
      selectedFigure,
      winner,
      showRescueWindow,
      whitesDead,
      blacksDead
    } = this.state;

    return (
      <div className="App">
        <Prealoader />
        {showRescueWindow ? (
          <RescueWindow
            turn={turn}
            whitesDead={whitesDead}
            blacksDead={blacksDead}
            onClick={this.rescueFigure}
            selectedFigure={selectedFigure}
          />
        ) : null}
        {winner ? <EndGame winner={winner} playAgain={this.playAgain} /> : null}
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
