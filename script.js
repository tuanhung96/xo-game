const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const gridWidth = 400;
const gridHeight = 400;
const squareSize = 20;
const result = Array.from(
  Array(gridWidth / squareSize),
  () => new Array(gridHeight / squareSize)
);

let circleTurn = true;
let gameOver = false;
let firstWinPosition;
let secondWinPosition;

newBoard();

function newBoard() {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  for (let c = 1; c < gridWidth / squareSize; c++) {
    ctx.beginPath();
    ctx.moveTo(c * squareSize, 0);
    ctx.lineTo(c * squareSize, gridHeight);
    ctx.stroke();
  }
  for (let r = 1; r < gridHeight / squareSize; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * squareSize);
    ctx.lineTo(gridWidth, r * squareSize);
    ctx.stroke();
  }
}

document.addEventListener("click", (e) => {
  if (!e.target.matches("canvas")) return;
  if (gameOver) return;

  const x = Math.floor(e.offsetX / squareSize);
  const y = Math.floor(e.offsetY / squareSize);
  const radius = getRadius(x, y);

  if (result[x][y] === undefined) {
    if (circleTurn) {
      drawCircle(radius);
      result[x][y] = 0;
    } else {
      drawCross(radius);
      result[x][y] = 1;
    }

    // swap turn
    circleTurn = !circleTurn;
  }

  if (checkWin(x, y)) {
    drawLine();
    gameOver = true;
  }
});

function getRadius(x, y) {
  return {
    x: x * squareSize + squareSize / 2,
    y: y * squareSize + squareSize / 2,
  };
}

function drawCircle(radius) {
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(radius.x, radius.y, squareSize / 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCross(radius) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(radius.x - squareSize / 4, radius.y - squareSize / 4);
  ctx.lineTo(radius.x + squareSize / 4, radius.y + squareSize / 4);
  ctx.moveTo(radius.x - squareSize / 4, radius.y + squareSize / 4);
  ctx.lineTo(radius.x + squareSize / 4, radius.y - squareSize / 4);
  ctx.stroke();
}

function checkWin(x, y) {
  return (
    checkHorizontal(x, y) ||
    checkVertical(x, y) ||
    checkCross1(x, y) ||
    checkCross2(x, y)
  );
}

function checkHorizontal(x, y) {
  let max = 1;

  for (let i = x + 1; i < gridWidth / squareSize; i++) {
    if (result[i][y] === result[x][y]) max++;
    else {
      firstWinPosition = { x: i - 1, y: y };
      break;
    }
  }

  for (let i = x - 1; i > 0; i--) {
    if (result[i][y] === result[x][y]) max++;
    else {
      secondWinPosition = { x: i + 1, y: y };
      break;
    }
  }

  return max === 5;
}

function checkVertical(x, y) {
  let max = 1;

  for (let i = y + 1; i < gridHeight / squareSize; i++) {
    if (result[x][i] === result[x][y]) max++;
    else {
      firstWinPosition = { x: x, y: i - 1 };
      break;
    }
  }

  for (let i = y - 1; i > 0; i--) {
    if (result[x][i] === result[x][y]) max++;
    else {
      secondWinPosition = { x: x, y: i + 1 };
      break;
    }
  }

  return max === 5;
}

function checkCross1(x, y) {
  let max = 1;

  let i = x + 1;
  let j = y + 1;
  while (i < gridWidth / squareSize && j < gridHeight / squareSize) {
    if (result[i][j] === result[x][y]) {
      max++;
      i++;
      j++;
    } else {
      firstWinPosition = { x: i - 1, y: j - 1 };
      break;
    }
  }

  i = x - 1;
  j = y - 1;
  while (i > 0 && j > 0) {
    if (result[i][j] === result[x][y]) {
      max++;
      i--;
      j--;
    } else {
      secondWinPosition = { x: i + 1, y: j + 1 };
      break;
    }
  }

  return max === 5;
}

function checkCross2(x, y) {
  let max = 1;

  let i = x - 1;
  let j = y + 1;
  while (i > 0 && j < gridHeight / squareSize) {
    if (result[i][j] === result[x][y]) {
      max++;
      i--;
      j++;
    } else {
      firstWinPosition = { x: i + 1, y: j - 1 };
      break;
    }
  }

  i = x + 1;
  j = y - 1;
  while (i < gridWidth / squareSize && j > 0) {
    if (result[i][j] === result[x][y]) {
      max++;
      i++;
      j--;
    } else {
      secondWinPosition = { x: i - 1, y: j + 1 };
      break;
    }
  }

  return max === 5;
}

function drawLine() {
  const cx1 = firstWinPosition.x * squareSize + squareSize / 2;
  const cy1 = firstWinPosition.y * squareSize + squareSize / 2;
  const cx2 = secondWinPosition.x * squareSize + squareSize / 2;
  const cy2 = secondWinPosition.y * squareSize + squareSize / 2;
  ctx.strokeStyle = "rgba(0,0,0,0.75)";
  ctx.lineWidth = squareSize / 10;
  ctx.beginPath();
  ctx.moveTo(cx1, cy1);
  ctx.lineTo(cx2, cy2);
  ctx.stroke();
}
