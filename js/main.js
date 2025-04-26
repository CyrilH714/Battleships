/*
THEME: DINO DIGGER
-Want to hide our dino fossils from rival paleontologist
-Choose where to bury fossils (can add rotation option later).
-Randomly generate where enemy buries theirs (hide from user)
-Take turns with rival to guess their fossil location on site/grid
-Correct guess means go again. Boobytrap means dig on your own site/grid
*/



/*----- constants -----*/


/*----- state variables -----*/
// My Board. Array of arrays. Nested arrays represent columns
// 1/-1 for player in position, null for empty
let myBoard;

// rival Board. Array of arrays. Nested arrays represent columns
// 1/-1 for player in position, null for empty
let rivalBoard;

// Winner. values: null=no winner/no tie, in progress,
//  1/-1=winner, "Draw"= tied game
let winner;

// Turn. 1/-1 for turn
let turn;

// fossils. 1/-1 for intact/dug. null for not on board yet.
let fossils;


/*----- cached elements  -----*/


/*----- event listeners -----*/


/*----- functions -----*/