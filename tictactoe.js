// ================= values that control the behavior of the app =================

let isBlueTurn = true;
let playerEnteredInput = false;
let clickedCell = 0;
let cells = [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]];
let boardSize = cells.length;
let turns = 0;
let gameLoop = null;
let randomMode = false;
let keyboardPlay = false;
let keyboardControlRow = 0;
let keyboardControlCol = 0;
let blueWinCount = 0;
let yellowWinCount = 0;

// ================= get element DOM references =================

const boardCellButtons = document.getElementsByClassName("tictactoe-cell");
const gameStatus = document.getElementById("game-status");
const blueStatus = document.getElementById("status-blue");
const blueWins = document.getElementById("wins-blue");
const yellowStatus = document.getElementById("status-yellow");
const yellowWins = document.getElementById("wins-yellow");
const playAgainBtn = document.getElementById("play-again-button");
const randomOnRadioBtn = document.getElementById("random-control-on");
const randomOffRadioBtn = document.getElementById("random-control-off");
const keyboardOnRadioBtn = document.getElementById("playkeyboard-control-on");
const keyboardOffRadioBtn = document.getElementById("playkeyboard-control-off");
const shareButtons = document.getElementById("share-buttons");

// ================= add listners to buttons =================

document.addEventListener("keyup", (event) => {
    if(keyboardPlay) {
        document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth="2px";
        switch (event.code) {
            case "ArrowDown":
                if(keyboardControlRow < (boardSize - 1)){
                    keyboardControlRow++;
                }
                break;
            case "ArrowUp":
                if(keyboardControlRow > 0){
                    keyboardControlRow--;
                }
                break;
            case "ArrowRight":
                if(keyboardControlCol < (boardSize - 1)){
                    keyboardControlCol++;
                }
                break;
            case "ArrowLeft":
                if(keyboardControlCol > 0){
                    keyboardControlCol--;
                }
                break;
            case "Enter":
                playerEnteredInput = true;
                break;
            default:
                break;
        }
    }
});

for(let j = 0; j < boardCellButtons.length; j++){
    boardCellButtons[j].addEventListener("click", (res) => {
        clickedCell = res.target.value;
        playerEnteredInput = true;
    });
};

playAgainBtn.addEventListener("click", () => {
    initializeGame();
    playAgainBtn.blur();
});

randomOnRadioBtn.addEventListener("change", () => {
    randomMode = true;
    randomOnRadioBtn.blur();
});

randomOffRadioBtn.addEventListener("change", () => {
    randomMode = false;
    randomOffRadioBtn.blur();
});

keyboardOnRadioBtn.addEventListener("change", () => {
    keyboardPlay = true;
    document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth="6px";
    keyboardOnRadioBtn.blur();
});

keyboardOffRadioBtn.addEventListener("change", () => {
    keyboardPlay = false;
    document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth="2px";
    keyboardOffRadioBtn.blur();
});

// ================= initialize values and start the game =================

initializeGame();

// ================= functions =================

function initializeGame(){
    blueStatus.innerHTML = "Blue's turn!";
    yellowStatus.innerHTML = "";
    gameStatus.innerHTML = "";
    // shareButtons.style.display = "none";

    for(let j = 0; j < boardCellButtons.length; j++){
        boardCellButtons[j].style.backgroundColor = "#FFFFFF";
        boardCellButtons[j].innerHTML = "";
    }

    isBlueTurn = true;
    playerEnteredInput = false;
    turns = 0;
    cells = [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]];

    gameLoop = setInterval(gameLoopFunction, 100);      // repeats game loop for every 100 ms
};

function gameLoopFunction(){
    
    if(keyboardPlay) {
        document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth="6px";
    }

    if(playerEnteredInput){
        gameStatus.innerHTML = "";

        let buttonRow = keyboardPlay ? keyboardControlRow : Math.floor(clickedCell / 3);
        let buttonCol = keyboardPlay ? keyboardControlCol : clickedCell % 3;

        if(randomMode) {            // if random mode is on, set row and col as random numbers 
            do {
                buttonRow = Math.floor(Math.random() * 3);
                buttonCol = Math.floor(Math.random() * 3);
            } while (cells[buttonRow][buttonCol] !== 0);    // randomize again if the cell with random row&col is not empty
        }

        if(cells[buttonRow][buttonCol] !== 0){
            gameStatus.innerHTML = "CELL IS OCCUPIED!";
        } else{
            turns++;

            document.getElementById(`status-${isBlueTurn ? "yellow" : "blue"}`).innerHTML = isBlueTurn ? "Yellow's turn!" : "Blue's turn!";
            document.getElementById(`status-${isBlueTurn ? "blue" : "yellow"}`).innerHTML = "";
            cells[buttonRow][buttonCol] = isBlueTurn ? 1 : -1;
            document.getElementById(`cell-${buttonRow},${buttonCol}`).style.backgroundColor = isBlueTurn ? "#679BF1" : "#FFC40A";
            document.getElementById(`cell-${buttonRow},${buttonCol}`).innerHTML  = isBlueTurn ? "X" : "O";
            if(checkIfWin(buttonRow, buttonCol, isBlueTurn)){

                gameStatus.innerHTML = `${isBlueTurn ? "BLUE" : "YELLOW"} WINS!`
                gameStatus.style.color = isBlueTurn ? "#679BF1" : "#FFC40A";
                shareButtons.style.visibility = "hidden";
                blueStatus.innerHTML = "";
                yellowStatus.innerHTML = "";
                clearInterval(gameLoop);

                if(isBlueTurn){
                    blueWinCount++;
                    blueWins.innerHTML = `WINS: ${blueWinCount}`
                } else {
                    yellowWinCount++;
                    yellowWins.innerHTML = `WINS: ${yellowWinCount}`
                }
            }else if(turns === boardSize * boardSize) {
                gameStatus.innerHTML = "DRAW";
                blueStatus.innerHTML = "";
                yellowStatus.innerHTML = "";
                clearInterval(gameLoop);
            }
            isBlueTurn = !isBlueTurn;
        }
        playerEnteredInput = false;
    }
};

function checkIfWin(row, col, color){       // returns true if winning condition is made
                                            // color is true if it's blue's turn, false if yellow's turn
    let rowSum = 0;
    let colSum = 0;
    let diagonalSum = 0;
    let antiDiagonalSum = 0;

    for(let i = 0; i < boardSize; i++) {
        rowSum += cells[row][i];
        colSum += cells[i][col];
        diagonalSum += cells[i][i];
        antiDiagonalSum += cells[i][boardSize - i - 1];
    }

    let winningCondition = color ? 3 : -3;

    return (rowSum === winningCondition) || (colSum === winningCondition) || (diagonalSum === winningCondition) || (antiDiagonalSum === winningCondition);
};

//============== load twitter JS api //==============
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
  
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
  
    return t;
  }(document, "script", "twitter-wjs"));