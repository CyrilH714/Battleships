/*
THEME: DINO DIGGER
-Want to hide our dino fossils from rival paleontologist
-Choose where to bury fossils. Make images draggable,
on board convert to coloured cells.
-Randomly generate where enemy buries theirs (hide from user)
-Take turns with rival to guess their fossil location on site/grid.
-Miss makes grid go a colour, hit makes it white.
-bonus: hit boobytrap means red.
-Correct guess means go again. Boobytrap means dig on other's own site/grid
Once all pieces hit, end game and declare winner.
*/

/*----- classes -----*/

class MyFossilClass {
  constructor(id, name, shape, image, coordinates, buried, rotation) {
    this.id = id;
    this.name = name;
    this.shape = shape;
    this.image = image;
    this.coordinates = null;
    this.rotation = "horizontal";
    this.buried = false;
  }

  get width() {
    return this.shape[0].length;
  }
  get height() {
    return this.shape.length;
  }
  getElement() {
    return document.querySelector(`#${this.id}`);
  }
  moveFossil(x, y) {
    this.position = { x, y };
  }
  returnFossil() {
    this.coordinates = null;
    this.buried = false;
    this.rotation = "horizontal";
  }
}

class RivalFossilClass {
  constructor(id, name, shape, image) {
    this.id = id;
    this.name = name;
    this.shape = shape;
    this.image = image;
    this.coordinates = null;
    this.rotation = "horizontal";
    this.buried = false;
  }
  get width() {
    return this.shape[0].length;
  }
  get height() {
    return this.shape.length;
  }
  returnRivalFossil() {
    this.coordinates = null;
    this.buried = false;
    this.rotation = "horizontal";
  }
}

/*----- constants -----*/
const fossils = [
  new MyFossilClass(
    "my-fossil-head-1",
    "My carnivore head",
    [
      [1, 1],
      [1, 1],
    ],
    "images/dino-head-1.png"
  ),
  new MyFossilClass(
    "my-fossil-head-2",
    "My herbivore head",
    [
      [1, 1],
      [1, 1],
    ],
    "images/dino-head-2.png"
  ),
  new MyFossilClass(
    "my-fossil-body",
    "My dino body",
    [
      [1, 0, 1, 0],
      [1, 1, 1, 1],
    ],
    "images/dino-body.png"
  ),
  new MyFossilClass(
    "my-fossil-full-body",
    "My dino full body",
    [
      [0, 1, 1],
      [0, 1, 1],
      [1, 1, 0],
    ],
    "images/dino-full-body.png"
  ),
  new MyFossilClass(
    "my-fossil-egg",
    "My dino egg",
    [
      [1, 0],
      [1, 0],
    ],
    "images/dino-egg.png"
  ),
  new MyFossilClass(
    "my-fossil-boobytrap",
    "My boobytrap",
    [[1]],
    "images/boobytrap.png"
  ),
];
const rivalFossils = [
  new RivalFossilClass(
    "rival-fossil-head-1",
    "Rival carnivore head",
    [
      [1, 1],
      [1, 1],
    ],
    "images/dino-head-1.png"
  ),
  new RivalFossilClass(
    "rival-fossil-head-2",
    "Rival herbivore head",
    [
      [1, 1],
      [1, 1],
    ],
    "images/dino-head-2.png"
  ),
  new RivalFossilClass(
    "rival-fossil-body",
    "Rival dino body",
    [
      [1, 0, 1, 0],
      [1, 1, 1, 1],
    ],
    "images/dino-body.png"
  ),
  new RivalFossilClass(
    "rival-fossil-full-body",
    "Rival dino full body",
    [
      [0, 1, 1],
      [0, 1, 1],
      [1, 1, 0],
    ],
    "images/dino-full-body.png"
  ),
  new RivalFossilClass(
    "rival-fossil-egg",
    "Rival dino egg",
    [
      [1, 0],
      [1, 0],
    ],
    "images/dino-egg.png"
  ),
  new RivalFossilClass(
    "rival-fossil-boobytrap",
    "Rival boobytrap",
    [[1]],
    "images/boobytrap.png"
  ),
];

// Use image for one "colour": need to create element and append later.

imgSandTransparent = document.createElement("img");
imgSandTransparent.src = "images/sand.png";
imgSandTransparent.setAttribute("class", "sand");
imgSandTransparent.style.opacity = "0.6";


const CELLSTATUS = {
  Empty: null,
  My_fossil: 1,
  My_boobytrap: 1,
  Rival_fossil: 3,
  Rival_boobytrap: 3,
  Dug: -1,
};

const imgCrack = document.createElement("img");
imgCrack.src = "images/crack.png";
imgCrack.setAttribute("class", "crack");


const DIGCOLOURS = {
  1: "#E3DAC9",
  2: "black",
  null: imgSandTransparent,
  3: "none",
};

const DUGCOLOURS = {
  [CELLSTATUS.My_fossil]: imgCrack,
  [CELLSTATUS.Rival_fossil]: imgCrack,
  [CELLSTATUS.My_boobytrap]: "red",
  [CELLSTATUS.Rival_boobytrap]: "red",
  [CELLSTATUS.Empty]: "#BE6400",
};

// const FOSSILCOLOURS={
//     "my-fossil-boobytrap": "black",
//     "my-fossil-head-1": "#E3DAC9",
//     "my-fossil-head-2":"#E3DAC9",
//     "my-fossil-body":"#E3DAC9",
//     "my-fossil-full-body":"#E3DAC9",
//     "my-fossil-egg":"#E3DAC9"

// };

const NAME = {
  1: "Your turn",
  "-1": "Rival's turn",
  null: "Hide your fossils",
};

const INSTRUCT = {
  null: "Drag your fossils onto your site!",
  1: "Choose a spot to dig!",
  "-1": "Your rival is digging!",
};
const RESULT = {
  1: "You win!",
  "-1": "You lost!",
};

/*----- state variables -----*/
// My Board. Array of arrays. Nested arrays represent columns
// 1 for player in position, -1 for dug position, null for empty
let myBoard;

// rival Board. Array of arrays. Nested arrays represent columns
// 1/-1 for player in position, null for empty
let rivalBoard;

// Winner. values: null=no winner/no tie, in progress,
//  1/-1=winner, "Draw"= tied game
let winner;

// Turn. 1/-1 for turn. null for initial stage of placing pieces
let turn;

// fossils. 1/-1 for intact/dug. null for not on board yet.
let fossilState;

// For dragging fossil and adding highlight temporarily:
let draggedFossil = null;

// For rival search for adjacent cells after a successful hit:
let rivalSuccessfulHits = [];

/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const instructMeEl = document.querySelector("#my-message");
const instructRivalEl = document.querySelector("#rival-message");
const fossilImages = document.querySelectorAll("#my-fossil-images");
const playAgainBtn = document.getElementById("play-again");
const myBoardCells = document.querySelectorAll("#my-board-wrap .cell");
const rivalBoardCells = document.querySelectorAll("#rival-board-wrap .cell");
/*----- event listeners -----*/
playAgainBtn.addEventListener("click", init);

/*----- functions -----*/
init();

function init() {
  winner = null;
  turn = null;
  myBoard = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ];
  rivalBoard = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ];
  rivalSuccessfulHits = [];
  draggedFossil = null;
  fossilState = null;
  fossils.forEach((fossil) => {
    fossil.returnFossil();
    fossil.getElement().style.display = "block";
  });
  rivalFossils.forEach((fossil) => {
    fossil.returnRivalFossil();
  });

  msgEl.textContent = "";
  instructMeEl.textConent = "";
  instructRivalEl.textContent = "";

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.querySelectorAll("img").forEach((img) => {
      img.remove();
    });
    cell.style.backgroundColor = "";
    // cell.removeAttribute();
    cell.classList.remove("tempHighlight");
    cell.appendChild(imgSandTransparent.cloneNode());
  });

  render();
}

function render() {
  renderMyBoard();
  renderRivalBoard();
  renderMessageTurn();
  renderMessageInstruct();
  renderControls();
  renderHandleClick();
  if (turn === -1 && winner === null) {
    renderRivalDig();
  }
}


// render pllayer board in current state. Remove old images 9not crack), add new images 
function renderMyBoard() {
  myBoard.forEach((colArr, colIdx) => {
    colArr.forEach((cellVal, rowIdx) => {
      if (cellVal === 0) return;
      const cellEl = document.getElementById(`c${colIdx}r${rowIdx}`);
      if (typeof DIGCOLOURS[cellVal] === "object") {
        {
          cellEl.querySelectorAll("img:not(.crack)").forEach((img) => {
            img.remove();
          });

          cellEl.appendChild(DIGCOLOURS[cellVal].cloneNode());
        }
      } else {
        cellEl.style.backgroundColor = DIGCOLOURS[cellVal];
      }
    });
  });
}

// render rival board current state. Removes old images each time (not crack), add new images
function renderRivalBoard() {
  rivalBoard.forEach((colArr, colIdx) => {
    colArr.forEach((cellVal, rowIdx) => {
      const cellEl = document.getElementById(`cc${colIdx}r${rowIdx}`);
      if (typeof DIGCOLOURS[cellVal] === "object") {
        if (turn === 0) {
          cellEl.querySelectorAll("img:not(.crack)").forEach((img) => {
            img.remove();
          });
        } else {
          cellEl.querySelectorAll("img:not(.crack)").forEach((img) => {
            img.remove();
          });

          cellEl.appendChild(DIGCOLOURS[cellVal].cloneNode());
        }
      } else {
        cellEl.style.backgroundColor = DIGCOLOURS[cellVal];
      }
    });
  });
}


// Display messages about turn and instruct 
function renderMessageTurn() {
  if (winner != null) {
    msgEl.textContent = RESULT[winner];
  } else {
    msgEl.textContent = NAME[turn];
  }
}

function renderMessageInstruct() {
  if (turn === 1) {
    instructRivalEl.textContent = INSTRUCT[turn];
    instructMeEl.textContent = null;
  } else {
    instructRivalEl.textContent = null;
    instructMeEl.textContent = INSTRUCT[turn];
  }
}

// Show/hide play again button if game has ended or not
function renderControls() {
  playAgainBtn.style.visibility = winner ? "visible" : "hidden";
}

// Moving fossil functions: made images draggable in HTML first
// Store fossil ID when moved
fossils.forEach((fossil) => {
  const imageEl = fossil.getElement().querySelector("img");
  if (imageEl) {
    imageEl.addEventListener("dragstart", (event) => {
      draggedFossil = fossil;
      event.dataTransfer.setData("text/plain", fossil.id);
    });
  }
});

// Make board cells listen to drag drop of fossil
// dragover highlights possible drop targets
// dragleave removes highlight when fossil not over cell
// drop places the fossil on board
myCells = document.querySelectorAll("#my-board-wrap > .cell");
myCells.forEach((cell) => {
  cell.addEventListener("dragover", (event) => {
    event.preventDefault();

    // temporarily highlight cells where hovered over

    if (!draggedFossil) return;

    clearTempHighlight();

    const match = cell.id.match(/^c(\d+)r(\d+)$/);
    if (!match) return;
    const colIdx = parseInt(match[1]);
    const rowIdx = parseInt(match[2]);

    for (let y = 0; y < draggedFossil.shape.length; y++) {
      for (let x = 0; x < draggedFossil.shape[0].length; x++) {
        if (draggedFossil.shape[y][x] === 1) {
          const targetCell = document.getElementById(
            `c${colIdx + x}r${rowIdx + y}`
          );
          if (targetCell) {
            targetCell.classList.add("tempHighlight");
          }
        }
      }
    }
  });
  cell.addEventListener("dragleave", (event) => {
    if (!draggedFossil) return;
    clearTempHighlight();
  });
  cell.addEventListener("drop", (event) => {
    event.preventDefault();
    clearTempHighlight();

    if (!draggedFossil) return;
    if (draggedFossil) {
      const fossilEl = draggedFossil.getElement();
      const match = cell.id.match(/^c(\d+)r(\d+)$/);
      const colIdx = parseInt(match[1]);
      const rowIdx = parseInt(match[2]);
      let canPlace = true;
      for (let y = 0; y < draggedFossil.shape.length; y++) {
        for (let x = 0; x < draggedFossil.shape[0].length; x++) {
          if (draggedFossil.shape[y][x] === 1) {
            const targetCol = colIdx + x;
            const targetRow = rowIdx + y;
            if (
              targetCol < 0 ||
              targetCol > 9 ||
              targetRow < 0 ||
              targetRow > 9 ||
              myBoard[targetCol][targetRow] != CELLSTATUS.Empty
            ) {
              canPlace = false;
              break;
            }
          }
        }
      }
      if (canPlace === false) return;

      for (let y = 0; y < draggedFossil.shape.length; y++) {
        for (let x = 0; x < draggedFossil.shape[0].length; x++) {
          if (draggedFossil.shape[y][x] === 1) {
            const targetCol = colIdx + x;
            const targetRow = rowIdx + y;
            const targetCell = document.getElementById(
              `c${targetCol}r${targetRow}`
            );

            if (targetCell) {
              targetCell.dataset.fossilId = draggedFossil.id;
              const sandImage = targetCell.querySelector("img");
              if (sandImage) {
                targetCell.removeChild(sandImage);
              }
              fossilEl.style.display = "none";
              if (myBoard[targetCol][targetRow] != CELLSTATUS.Empty) {
                canPlace = false;
                return;
              }
              myBoard[targetCol][targetRow] = CELLSTATUS.My_fossil;
              if (fossilEl.id === "my-fossil-boobytrap") {
                myBoard[targetCol][targetRow] = CELLSTATUS.My_fossil;
              }
              targetCell.style.backgroundColor =
                DIGCOLOURS[myBoard[targetCol][targetRow]] || "yellow";
            }
          }
        }
      }
    }
    draggedFossil.buried = true;

    if (areMyFossilsPlaced()) {
      turn = 1;
      placeRivalFossils();
      render();
    }
    draggedFossil = null;
  });
});

// After releasing fossil, highlight disappears
function clearTempHighlight() {
  document.querySelectorAll(".tempHighlight").forEach((cell) => {
    cell.classList.remove("tempHighlight");
  });
}


// Check for if player has placed all fossils
function areMyFossilsPlaced() {
  return fossils.every((fossil) => fossil.buried);
}


// Random coordinate generator for board
function generateRandomXY() {
  const minValue = 0;
  const maxValue = 10;
  const randomColumn = Math.floor(Math.random() * maxValue);
  const randomRow = Math.floor(Math.random() * maxValue);
  console.log(randomColumn, randomRow);
  return [randomColumn, randomRow];
}

// Randomly places rival fossil on board after we've buried ours
function placeRivalFossils() {
  rivalFossils.forEach((rivalFossil) => {
    let placed = false;
    while (placed === false) {
      const [newCol, newRow] = generateRandomXY();
      if (rivalFossilFitsOnBoard(rivalFossil, newCol, newRow)) {
        rivalFossil.coordinates = { newCol, newRow };
        rivalFossil.buried = true;
        placeOnRivalBoard(rivalFossil, newCol, newRow);
        placed = true;
      }
    }
  });
  turn = 1;
}

// Fill cell with fossil marker (crack) after drop
function placeOnRivalBoard(fossil, column, row) {
  for (let y = 0; y < fossil.shape.length; y++) {
    for (let x = 0; x < fossil.shape[0].length; x++) {
      if (fossil.shape[y][x] === 1) {
        const targetCol = column + x;
        const targetRow = row + y;
        rivalBoard[targetCol][targetRow] = CELLSTATUS.Rival_fossil;
      }
    }
  }
}

// Confirms that dropped fossil fits entirely on board before dropping
function rivalFossilFitsOnBoard(fossil, column, row) {
  for (let y = 0; y < fossil.shape.length; y++) {
    for (let x = 0; x < fossil.shape[0].length; x++) {
      if (fossil.shape[y][x] === 1) {
        const targetCol = column + x;
        const targetRow = row + y;
        if (
          targetCol > 9 ||
          targetRow > 9 ||
          targetCol < 0 ||
          targetRow < 0 ||
          rivalBoard[targetCol][targetRow] !== null ||
          !rivalBoard[targetCol]
        ) {
          return false;
        }
      }
    }
  }
  return true;
}


// For digging/clicking on rival board
function renderHandleClick() {
  rivalBoardCells.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
  if (turn === 1) {
    rivalBoardCells.forEach((cell) => {
      cell.addEventListener("click", handleClick);
    });
  }
}

//Gets clicked cell, updates, ends turn
function handleClick(event) {
  if (turn != 1) return;

  const cellElement = event.target.closest(".cell");
  if (!cellElement) return;

  const match = cellElement.id.match(/^cc(\d+)r(\d+)$/);
  if (!match) return;
  const colIdx = parseInt(match[1]);
  const rowIdx = parseInt(match[2]);
  const cell = rivalBoard[colIdx][rowIdx];
  if (cell === CELLSTATUS.Dug) return;
  else if (
    cell === CELLSTATUS.Rival_fossil ||
    cell === CELLSTATUS.Rival_boobytrap
  ) {
    rivalBoard[colIdx][rowIdx] = CELLSTATUS.Dug;
    cellFading(cellElement, imgCrack, null);
  } else {
    rivalBoard[colIdx][rowIdx] = CELLSTATUS.Dug;
    cellFading(cellElement, null, DUGCOLOURS[CELLSTATUS.Empty]);
    if (cell === CELLSTATUS.Empty) {
      turn *= -1;
    }
  }
  console.log(cell);
  winner = getWinner();
  if (winner === null && turn === -1) {
    renderRivalDig();
  }
  render();
}



// Rival guess logic + follow up guess for next door cells to fossil.
// Updates rivalSuccessfulHits array if finds a fossil
function renderRivalDig() {
  if (turn != -1) return;

  const newGuess = findNextDoorHit() || generateRandomXY();
  const [newCol, newRow] = newGuess;
  const cell = myBoard[newCol][newRow];
  const cellElement = document.getElementById(`c${newCol}r${newRow}`);

  if (cell === CELLSTATUS.Dug) {
    renderRivalDig();
    return;
  } else if (cell === CELLSTATUS.My_fossil) {
    myBoard[newCol][newRow] = CELLSTATUS.Dug;
    cellFading(cellElement, imgCrack, null);
    const tried = rivalSuccessfulHits.find(
      (hit) => hit.column === newCol && hit.row === newRow
    );
    if (!tried) {
      rivalSuccessfulHits.push({
        column: newCol,
        row: newRow,
        tried: { above: false, below: false, left: false, right: false },
      });
    }
    renderRivalDig();
    return;
  } else {
    myBoard[newCol][newRow] = CELLSTATUS.Dug;
    cellFading(cellElement, null, DUGCOLOURS[CELLSTATUS.Empty]);
    turn = 1;

    winner = getWinner();
    render();
  }
}

// rival decision to search around fossil cell or go back to random guess
function rivalDigDecision() {
  const nextHit = findNextDoorHit();
  if (nextHit) return [nextHit.column, nextHit.row];
  else return generateRandomXY();
}


// After rival guesses crack cell, checks  next door cells
function findNextDoorHit() {
  for (let i = 0; i < rivalSuccessfulHits.length; i++) {
    const currentCell = rivalSuccessfulHits[i];
    const { column, row, tried } = currentCell;

    const neighbouringCells = [
      { direction: "above", col: column, row: row - 1 },
      { direction: "right", col: column + 1, row: row },
      { direction: "below", col: column, row: row + 1 },
      { direction: "left", col: column - 1, row: row },
    ];
    for (const neighbour of neighbouringCells) {
      if (!tried[neighbour.direction]) {
        tried[neighbour.direction] = true;
        if (
          neighbour.col >= 0 &&
          neighbour.col <= 9 &&
          neighbour.row >= 0 &&
          neighbour.row <= 9
        ) {
          const cell = myBoard[neighbour.col][neighbour.row];
          if (cell != CELLSTATUS.Dug) {
            return [neighbour.col, neighbour.row];
          }
        }
      }
    }
    rivalSuccessfulHits.splice(i, 1);
    i = i - 1;
  }
  return null;
}

function getWinner() {
  // find 1 in myBoard or rivalBoard.
  // If not found, player wins/loses. getWinner becomes 1 or -1.
  // If 1 found in both boards, continues.

  const rivalFossilRemains = rivalBoard.some((array) => {
    return array.some((cell) => {
      return cell === CELLSTATUS.Rival_fossil;
    });
  });
  const myFossilRemains = myBoard.some((array) => {
    return array.some((cell) => {
      return cell === CELLSTATUS.My_fossil;
    });
  });

  if (!rivalFossilRemains) {
    return 1;
  }
  if (!myFossilRemains) {
    return -1;
  } else return null;
}

// For sand image fade out and crack image/brown colour fade in
function cellFading(cellEl, newImage, newColour) {
  const sand = cellEl.querySelector("img.sand");
  if (sand) {
    sand.classList.add("fading-out");
    setTimeout(() => {
      if (sand && sand.parentNode) {
        sand.remove();
      }
    }, 800);
  }

  if (newImage instanceof HTMLImageElement) {
    const crackImg = newImage.cloneNode();
    crackImg.classList.add("crack");
    // crackImg.style.opacity=0;
    cellEl.appendChild(crackImg);
    setTimeout(() => {
      crackImg.classList.add("fading-in");
    });
  } else if (typeof newColour === "string") {
    setTimeout(() => {
      cellEl.style.backgroundColor = newColour;
      cellEl.classList.remove("fading-in-brown");
    });
  }
}

// TODO;
// make boobytrap act separately to fossil,
// affecting rival space

// Bonus:
// sound effect for digging,
// make a fossil value where transparency increases.
//  if complete fossil hit, turn icon red
//  after placeRivalFossils
// Allow rotation of fossils
// Make the rival guesses for adjacent squares a random direction
// instead of always trying in clockwise direction
