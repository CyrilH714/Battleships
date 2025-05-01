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
};


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
}}








/*----- constants -----*/
const fossils = [
    new MyFossilClass("my-fossil-head-1", "My carnivore head", [[1, 1], [1, 1]], "images/dino-head-1.png"),
    new MyFossilClass("my-fossil-head-2", "My herbivore head", [[1, 1], [1, 1]], "images/dino-head-2.png"),
    new MyFossilClass("my-fossil-body", "My dino body", [[1, 0, 1, 0], [1, 1, 1, 1]], "images/dino-body.png"),
    new MyFossilClass("my-fossil-full-body", "My dino full body", [[0, 1, 1], [0, 1, 1], [1, 1, 0]], "images/dino-full-body.png"),
    new MyFossilClass("my-fossil-egg", "My dino egg", [[1]], "images/dino-egg.png"),
    new MyFossilClass("my-fossil-boobytrap", "My boobytrap", [[1]], "images/boobytrap.png"),
]
const rivalFossils = [
    new RivalFossilClass("rival-fossil-head-1", "Rival carnivore head", [[1, 1], [1, 1]], "images/dino-head-1.png"),
    new RivalFossilClass("rival-fossil-head-2", "Rival herbivore head", [[1, 1], [1, 1]], "images/dino-head-2.png"),
    new RivalFossilClass("rival-fossil-body", "Rival dino body", [[1, 0, 1, 0], [1, 1, 1, 1]], "images/dino-body.png"),
    new RivalFossilClass("rival-fossil-full-body", "Rival dino full body", [[0, 1, 1], [0, 1, 1], [1, 1, 0]], "images/dino-full-body.png"),
    new RivalFossilClass("rival-fossil-egg", "Rival dino egg", [[1]], "images/dino-egg.png"),
    new RivalFossilClass("rival-fossil-boobytrap", "Rival boobytrap", [[1]], "images/boobytrap.png"),
]

// Use image for one "colour": need to create element and append later.
// const imgSand = document.createElement("img");
// imgSand.src = "images/sand.png";
// imgSand.setAttribute("class", "sand");
// imgSand.style.zIndex=1;
// imgSand.style.position="relative"

imgSandTransparent = document.createElement("img");
imgSandTransparent.src = "images/sand.png";
imgSandTransparent.setAttribute("class", "sand");
imgSandTransparent.style.opacity = "0.6";

const CELLSTATUS={
    Empty:null,
    My_fossil:1,
    My_boobytrap:2,
    Rival_fossil:3,
    Rival_boobytrap:4,
    Dug:-1
}

const imgCrack = document.createElement("img");
imgCrack.src = "images/crack.png";
imgCrack.setAttribute("class","crack");


const DIGCOLOURS = {
    "1": "#E3DAC9",
    "2": "black",
    "null":imgSandTransparent,
    "3":"none",
};

const DUGCOLOURS = {
    [CELLSTATUS.My_fossil]: imgCrack,
    [CELLSTATUS.Rival_fossil]: imgCrack,
    [CELLSTATUS.My_boobytrap]: "red",
    [CELLSTATUS.Rival_boobytrap]: "red",
    [CELLSTATUS.Empty]:"brown",
}

// const FOSSILCOLOURS={
//     "my-fossil-boobytrap": "black",
//     "my-fossil-head-1": "#E3DAC9",
//     "my-fossil-head-2":"#E3DAC9",
//     "my-fossil-body":"#E3DAC9",
//     "my-fossil-full-body":"#E3DAC9",
//     "my-fossil-egg":"#E3DAC9"

// };

const NAME = {
    "1": "Your turn",
    "-1": "Rival's turn",
    "null": "Hide your fossils",
};

const INSTRUCT = {
    "null": "Hide your fossils here!",
    "1": "Choose a spot to dig!",
    "-1": "Your rival is digging!",

};
const RESULT = {
    "1": "You win!",
    "-1": "You lost!",
}


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

/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const instructMeEl = document.querySelector("#my-message");
const instructRivalEl = document.querySelector("#rival-message")
const fossilImages = document.querySelectorAll("#my-fossil-images")
const playAgainBtn = document.getElementById("play-again");
const myBoardCells =document.querySelectorAll("#my-board-wrap .cell");
const rivalBoardCells= document.querySelectorAll("#rival-board-wrap .cell");
/*----- event listeners -----*/
playAgainBtn.addEventListener("click", init);

// else {
//     myBoardCells.removeEventListener("click", renderRivalDig);
//     rivalBoardCells.removeEventListener("click", renderMyDig); 




/*----- functions -----*/
init()

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
draggedFossil=null;
fossilState=null;
fossils.forEach((fossil)=>{
    fossil.returnFossil();
    fossil.getElement().style.display="block";
})
rivalFossils.forEach((fossil)=>{
    fossil.returnRivalFossil()
})

msgEl.textContent="";
instructMeEl.textConent="";
instructRivalEl.textContent="";

document.querySelectorAll(".cell").forEach(cell=>{
    cell.querySelectorAll("img").forEach((img)=>{
        img.remove()
    })
    cell.style.backgroundColor="";
    // cell.removeAttribute();
    cell.classList.remove("tempHighlight");
    cell.appendChild(imgSandTransparent.cloneNode());
})
    render();

}

function render() {
    renderMyBoard();
    renderRivalBoard();
    renderMessageTurn();
    renderMessageInstruct();
    renderControls();
    renderHandleClick();
    if (turn===-1 && winner===null){
        renderRivalDig();
    }

}

function renderMyBoard() {
    myBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            if (cellVal === 0) return;
            const cellEl = document.getElementById(`c${colIdx}r${rowIdx}`);
            if (typeof DIGCOLOURS[cellVal] === "object") {
                // if (turn===null){
                //     const existingImg = cellEl.querySelector('img');
                //     if (existingImg) {
                //         cellEl.removeChild(existingImg);
                // } 
                //  } else 
                {
                    const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);
                    }
                    cellEl.appendChild(DIGCOLOURS[cellVal].cloneNode());
                }
            } else {
                cellEl.style.backgroundColor = DIGCOLOURS[cellVal];
            }
        });


    });
}

function renderRivalBoard() {
    rivalBoard.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const cellEl = document.getElementById(`cc${colIdx}r${rowIdx}`)
            if (typeof DIGCOLOURS[cellVal] === "object") {
                if (turn === 0) {
                    const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);
                    }
                } else {
                    const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);
                    }
                    cellEl.appendChild(DIGCOLOURS[cellVal].cloneNode());
                }
            } else {
                cellEl.style.backgroundColor = DIGCOLOURS[cellVal];
            }
        });


    });
}

function renderMessageTurn() {
    if (winner != null) {
        msgEl.textContent = RESULT[winner];
    }
    else {
        msgEl.textContent = NAME[turn]
    };
}

function renderMessageInstruct() {
    if (turn === 1) {
        instructRivalEl.textContent = INSTRUCT[turn]
        instructMeEl.textContent = null;
    }
    else {
        instructRivalEl.textContent = null;
        instructMeEl.textContent = INSTRUCT[turn];
    }
}

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
})

// Make board cells listen to drag drop of fossil
myCells = document.querySelectorAll("#my-board-wrap > .cell");
myCells.forEach(cell => {
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
                    const targetCell = document.getElementById(`c${colIdx + x}r${rowIdx + y}`);
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
    })
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
                        const targetCell = document.getElementById(`c${colIdx + x}r${rowIdx + y}`);
                        if (!targetCell) {
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
                        const targetCell = document.getElementById(`c${targetCol}r${targetRow}`);

                        if (targetCell) {
                            targetCell.dataset.fossilId = draggedFossil.id;
                            const sandImage = targetCell.querySelector("img");
                            if (sandImage) {
                                targetCell.removeChild(sandImage);
                            };
                            fossilEl.style.display = "none";

                            myBoard[targetCol][targetRow] = CELLSTATUS.My_fossil;
                            if (fossilEl.id === "my-fossil-boobytrap") { myBoard[targetCol][targetRow] = CELLSTATUS.My_boobytrap};
                            targetCell.style.backgroundColor = DIGCOLOURS[myBoard[targetCol][targetRow]] || "yellow";

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



function clearTempHighlight() {
    document.querySelectorAll(".tempHighlight").forEach(cell => {
        cell.classList.remove("tempHighlight")
    })
}



function areMyFossilsPlaced() {
    return fossils.every(fossil => fossil.buried);
}

// Rival randomly places pieces after we've buried all of ours:
// Random coordinate generator for board
function generateRandomXY() {
    const minValue = 0;
    const maxValue = 10;
    const randomColumn = Math.floor(Math.random() * maxValue);
    const randomRow = Math.floor(Math.random() * maxValue);
    console.log(randomColumn, randomRow)
    return [randomColumn, randomRow];
}
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
    })
    turn = 1;

}

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


function rivalFossilFitsOnBoard(fossil, column, row) {
    for (let y = 0; y < fossil.shape.length; y++) {
        for (let x = 0; x < fossil.shape[0].length; x++) {
            if (fossil.shape[y][x] === 1) {
                const targetCol = column + x;
                const targetRow = row + y;
                if (targetCol > 9 || targetRow > 9 || targetCol < 0 || targetRow < 0 || rivalBoard[targetCol][targetRow] !== null || !rivalBoard[targetCol]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function renderHandleClick(){
    rivalBoardCells.forEach((cell)=>{
        cell.removeEventListener("click",handleClick);
    })
    if (turn===1){
    rivalBoardCells.forEach((cell)=>{
        cell.addEventListener("click", handleClick)})
    }
    }

function handleClick(event){
    if (turn!=1) return; 
    

    const cellElement=event.target.closest(".cell");
    if (!cellElement) return;

    const match = cellElement.id.match(/^cc(\d+)r(\d+)$/);
    if (!match) return;
    const colIdx = parseInt(match[1]);
    const rowIdx = parseInt(match[2]);
    const cell= rivalBoard[colIdx][rowIdx];
    if (cell===CELLSTATUS.Dug) return;
    else if (cell===CELLSTATUS.Rival_fossil||cell===CELLSTATUS.Rival_boobytrap){
        rivalBoard[colIdx][rowIdx]=CELLSTATUS.Dug;
        cellElement.appendChild(imgCrack.cloneNode());
        const isThereASandImage = cellElement.querySelector('img.sand');
if (isThereASandImage) {
    cellElement.removeChild(isThereASandImage);
}
       
    }
    else {
        rivalBoard[colIdx][rowIdx]=CELLSTATUS.Dug;
        cellElement.style.backgroundColor=DUGCOLOURS[cell];
        if (cell===CELLSTATUS.Empty){turn*=-1}
    
        
    }
    console.log(cell);
    winner = getWinner();
    if (winner===null&&turn===-1){
        renderRivalDig();
    }
    render()
}

function renderRivalDig(){
if (turn != -1) return;
// find and hit first null with successful hit adjacent. 
// If not possible, else{}.
// if(){

// } 
// else {
        // rival guessing code (random, then closer)
        const[newCol, newRow] = generateRandomXY();
        const cell=myBoard[newCol][newRow];
        const cellElement=document.getElementById(`c${newCol}r${newRow}`);

        if (cell===CELLSTATUS.Dug) {
            renderRivalDig()
         return;
        }
        
        else if (cell===CELLSTATUS.My_fossil){
        myBoard[newCol][newRow]=CELLSTATUS.Dug;
        cellElement.appendChild(imgCrack.cloneNode());
        renderRivalDig();
        return;
    }
    else {
        myBoard[newCol][newRow]=-1;
        cellElement.style.backgroundColor=DUGCOLOURS[cell];
        if (cell===CELLSTATUS.Empty){turn*=-1}

        
    }  
 
    winner = getWinner();
    render()
}

function getWinner() {
    // find 1 in myBoard or rivalBoard.
    // If not found, player wins/loses. getWinner becomes 1 or -1.
    // If 1 found in both boards, continues.
    
    const rivalFossilRemains= rivalBoard.some((array) => {
       return array.some((cell) => {
             return cell=== CELLSTATUS.Rival_fossil;
        })
    })
    const myFossilRemains=myBoard.some((array) => {
        return array.some((cell) => {
            return cell===CELLSTATUS.My_fossil;
        })
    })


    if (!rivalFossilRemains) { return 1 }
    if (!myFossilRemains) { return -1 }
    else return null;
}


// TODO;

// if complete fossil hit, turn icon red
// make rival guess randomly, but if hit then search neighbours
// make button reset game properly 
// make boobytrap affect rival space
// Prevent overlapping placement of fossils
// Write out README;

// Bonus:
// Animation for digging- sound effect, mouse to shovel?
// make a fossil value where transparency increases
//  after placeRivalFossils
// Allow rotation of fossils
// Prevent overlapping placement of fossils
// gap reduction between h4 and grid
// make markers grow when relevant cell hovered
// "your fossils" prevent overlap with board