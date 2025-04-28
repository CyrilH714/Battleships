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
constructor(id, name,size, image, coordinates, buried, rotation){
    this.id=id;
    this.name=name;
    this.size=size;
    this.image=image;
    this.coordinates=null;
    this.rotation="horizontal";
    this.buried=false;
}
    getElement(){
    return document.querySelector(`#${this.id}`);
}
    moveFossil(x,y){
    this.position = {x, y};
}
    returnFossil(){
    this.coordinates= null;
    this.buried=false;
    this.rotation= "horizontal";
}
};





const fossils = [
    new MyFossilClass("my-fossil-head-1", "My carnivore head", 2, "images/dino-head-1.png"),
    new MyFossilClass("my-fossil-head-2", "My herbivore head", 2, "images/dino-head-2.png"),
    new MyFossilClass("my-fossil-body", "My dino body", 4, "images/dino-body.png"),
    new MyFossilClass("my-fossil-full-body", "My dino full body", 5, "images/dino-full-body.png"),
    new MyFossilClass("my-fossil-egg", "My dino egg", 1, "images/dino-egg.png"),
    new MyFossilClass("my-fossil-boobytrap", "My boobytrap", 1, "images/boobytrap.png"),

]
/*----- constants -----*/

// Use image for one "colour": need to create element and append later.
const imgSand=document.createElement("img");
imgSand.src="images/sand.png";
imgSand.setAttribute("id","sand");

const COLOURS ={
    "1": "orange",
    "-1": "white",
    "null" : imgSand,
    "0": "grey",
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
let fossilState;


/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const instructMeEl= document.querySelector("#my-message");
const instructRivalEl=document.querySelector("#rival-message")
const fossilImages= document.querySelectorAll("#my-fossil-images")
const playAgainBtn=document.getElementById("play-again");

/*----- event listeners -----*/
playAgainBtn.addEventListener("click", init);


// Make board cells listen to drag drop of fossil
myCells=document.querySelectorAll("#my-board-wrap > .cell");
myCells.forEach(cell =>{
    cell.addEventListener("dragover", (event)=>{
        event.preventDefault();
});
    cell.addEventListener("drop", (event)=>{
        event.preventDefault();
        const fossilId=event.dataTransfer.getData("text");
        const fossil = fossils.find(fossil=>fossil.id===fossilId);
        if (fossil){
            const fossilEl = fossil.getElement();
            cell.appendChild(fossilEl);
            fossilEl.style.position="absolute";
            fossilEl.style.left="0";
            fossilEl.style.top="0";
        }
    });
});


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
    renderControls();
}

function renderMyBoard(){
    myBoard.forEach((colArr,colIdx)=>{
        colArr.forEach((cellVal,rowIdx)=>{
            const cellEl=document.getElementById(`c${colIdx}r${rowIdx}`);
            if (typeof COLOURS[cellVal]==="object"){
                if (turn===0){
                    const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);
                } 
             } else { const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);}
                cellEl.appendChild(COLOURS[cellVal].cloneNode());  
                    } 
            } else {
                cellEl.style.backgroundColor = COLOURS[cellVal];
            }
        });
       

    });
}

function renderRivalBoard(){
    rivalBoard.forEach((colArr,colIdx)=>{
        colArr.forEach((cellVal,rowIdx)=>{
            const cellEl=document.getElementById(`cc${colIdx}r${rowIdx}`)
            if (typeof COLOURS[cellVal]==="object"){
                if (turn===0){
                    const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);
                } 
             } else { const existingImg = cellEl.querySelector('img');
                    if (existingImg) {
                        cellEl.removeChild(existingImg);}
                cellEl.appendChild(COLOURS[cellVal].cloneNode());  
                    } 
            } else {
                cellEl.style.backgroundColor = COLOURS[cellVal];
            }
        });
       

    });
}

function renderMessageTurn(){
    msgEl.textContent=NAME[turn];
}

function renderMessageInstruct(){
    if (turn === 1) {
        instructRivalEl.textContent=INSTRUCT[turn]
        instructMeEl.textContent=null;
    }
    else{
        instructRivalEl.textContent=null;
        instructMeEl.textContent=INSTRUCT[turn];
    }
}

function renderControls(){
    playAgainBtn.style.visibility= winner ? "visible":"hidden";
}




// Moving fossil functions: made images draggable in HTML first
// Store fossil ID when moved
fossils.forEach((fossil)=>{
    const imageEl=fossil.getElement().querySelector("img");
    if (imageEl){
        imageEl.addEventListener("dragstart", (event)=>{
            event.dataTransfer.setData("text", fossil.id);
        })
    }
})

// Make board cells receptive to image:



// TODO;
// ghost image following mouse; 
// semi transparency when fossil placed in sand
// gap reduction between h4 and grid
// make markers grow when relevant cell hovered