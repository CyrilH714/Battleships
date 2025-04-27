/*
THEME: DINO DIGGER
-Want to hide our dino fossils from rival paleontologist
-Choose where to bury fossils (can add rotation option later).
-Randomly generate where enemy buries theirs (hide from user)
-Take turns with rival to guess their fossil location on site/grid
-Correct guess means go again. Boobytrap means dig on your own site/grid
*/



/*----- constants -----*/
const COLOURS ={
    "1": "orange",
    "-1": "white",
    "null" : "none",
    "0": "black",
}

const NAME ={
    "1": "Your turn",
    "-1": "Rival's turn",
    "null": "Hide your fossils",
}

const INSTRUCT ={
   "null": "Hide your fossils here!",
    "1": "Choose a spot to dig!",
    "-1":"Your rival is digging!",
    
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
let fossils;


/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const InstructMeEl= document.querySelector("#my-message");
const InstructRivalEl=document.querySelector("#rival-message")

/*----- event listeners -----*/


/*----- functions -----*/
init() 

function init(){
    winner=null;
    turn=null;
    myBoard=[
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
    ];
    rivalBoard=[
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
    ]
        


    render();

}

function render(){
    renderMyBoard();
    renderRivalBoard();
    renderMessageTurn();
    renderMessageInstruct();
    // renderControls();
}

function renderMyBoard(){
    myBoard.forEach((colArr,colIdx)=>{
        colArr.forEach((cellVal,rowIdx)=>{
            const cellEl=document.getElementById(`c${colIdx}r${rowIdx}`)
            cellEl.style.backgroundColor=COLOURS[cellVal];
        })
       

    })
}

function renderRivalBoard(){
    rivalBoard.forEach((colArr,colIdx)=>{
        colArr.forEach((cellVal,rowIdx)=>{
            const cellEl=document.getElementById(`cc${colIdx}r${rowIdx}`)
            cellEl.style.backgroundColor=COLOURS[cellVal];
        })
       

    })
}

function renderMessageTurn(){
    msgEl.textContent=NAME[turn];
}

function renderMessageInstruct(){
    if (turn === 1) {
        InstructRivalEl.textContent=INSTRUCT[turn]
        InstructMeEl.textContent=null;
    }
    else{
        InstructRivalEl.textContent=null;
        InstructMeEl.textContent=INSTRUCT[turn];
    }
}