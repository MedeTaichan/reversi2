const board = document.getElementById("board");
const cells = [];

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const directions = [
  { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
  { row: 0, col: -1 },                     { row: 0, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
];

let currentPlayer = BLACK;

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.dataset.state = EMPTY;
  cell.addEventListener("click", () => handleCellClick(row, col));
  board.appendChild(cell);
  return cell;
}

function initializeBoard() {
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      const cell = createCell(i, j);
      row.push(cell);
    }
    cells.push(row);
  }
  cells[3][3].dataset.state = WHITE;
  cells[3][4].dataset.state = BLACK;
  cells[4][3].dataset.state = BLACK;
  cells[4][4].dataset.state = WHITE;
}

function isValidMove(row, col) {
  if (cells[row][col].dataset.state !== EMPTY) {
    return false;
  }
  for (const dir of directions) {
    let newRow = row + dir.row;
    let newCol = col + dir.col;
    if (isValidPosition(newRow, newCol) && cells[newRow][newCol].dataset.state === getOpponent()) {
      while (isValidPosition(newRow, newCol) && cells[newRow][newCol].dataset.state === getOpponent()) {
        newRow += dir.row;
        newCol += dir.col;
      }
      if (isValidPosition(newRow, newCol) && cells[newRow][newCol].dataset.state === currentPlayer) {
        return true;
      }
    }
  }
  return false;
}

function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getOpponent() {
  return currentPlayer === BLACK ? WHITE : BLACK;
}

function flipTiles(row, col) {
  for (const dir of directions) {
    let newRow = row + dir.row;
    let newCol = col + dir.col;
    const tilesToFlip = [];
    while (isValidPosition(newRow, newCol) && cells[newRow][newCol].dataset.state === getOpponent()) {
      tilesToFlip.push(cells[newRow][newCol]);
      newRow += dir.row;
      newCol += dir.col;
    }
    if (isValidPosition(newRow, newCol) && cells[newRow][newCol].dataset.state === currentPlayer) {
      for (const tile of tilesToFlip) {
        tile.dataset.state = currentPlayer;
      }
    }
  }
}

function handleCellClick(row, col) {
  if (isValidMove(row, col)) {
    cells[row][col].dataset.state = currentPlayer;
    flipTiles(row, col);
    currentPlayer = getOpponent();
  }
}

initializeBoard();