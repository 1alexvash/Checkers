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
    winner: null
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

    let figures = [
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

    figures.forEach(figure => {
      board[figure[0]][figure[1]].figure = "black-man";
      board[figure[0]][figure[1] + 5].figure = "red-man";
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
      if (board[x][y].figure.indexOf(turn) < 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  pawnRed(x, y) {
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
    let { board, selectedFigure, turn } = this.state;
    if (figure && figure.indexOf(turn) >= 0) {
      selectedFigure.x = x;
      selectedFigure.y = y;
      this.clearTable();
      this.setState({ selectedFigure });
      switch (figure) {
        case "black-man":
          this.pawnBlack(x, y);
          break;
        case "red-man":
          console.log("hm");
          this.pawnRed(x, y);
          break;
        case "black-king":
          this.king(x, y);
          break;
        case "red-king":
          this.king(x, y);
          break;
        default:
          break;
      }
    }
    // Clicked cell
    if (board[x][y].highlighted) {
      // CHESS WIN CASE TURN IT INTO CHECKERS WIN CASE
      // if (board[x][y].figure === "king-black") {
      //   this.setState({ winner: "red" });
      // }
      // if (board[x][y].figure === "king-red") {
      //   this.setState({ winner: "Black" });
      // }
      turn = turn === "red" ? "black" : "red"; // change turn after the move
      board[x][y].figure = board[selectedFigure.x][selectedFigure.y].figure;
      board[selectedFigure.x][selectedFigure.y].figure = "";

      // REWORK THOSE FUNCTINOS too
      // // red pawn reached the end of the board
      // if (
      //   board[x][y].figure.indexOf("pawn-red") >= 0 &&
      //   board[x][y].y === 0
      // ) {
      //   this.setState({ selectedFigure: { x, y } });
      //   this.clearTable();
      //   return;
      // }

      // // Black pawn reached the end of the board
      // if (
      //   board[x][y].figure.indexOf("pawn-black") >= 0 &&
      //   board[x][y].y === 7
      // ) {
      //   this.setState({ selectedFigure: { x, y } });
      //   this.clearTable();
      //   return;
      // }

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
    let { turn, board, selectedFigure, winner } = this.state;

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
