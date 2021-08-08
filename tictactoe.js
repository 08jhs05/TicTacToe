// ================= values that control the behavior of the app =================

let isBlueTurn = true;
let playerEnteredInput = false;     // true when user entered an input
let clickedCell = 0;                // this variable records the current button just clicked, used by onclick functions below
let cells = [[0, 0, 0],             // this 2D array represents the tictactoe board.
            [0, 0, 0],              // 0 if cell is not touched yet
            [0, 0, 0]];             // 1 if touched by blue, -1 if yellow
let boardSize = cells.length;
let turns = 0;
let gameLoop = null;
let randomMode = false;
let keyboardPlay = false;
let keyboardControlRow = 0;         // if user is on "keyboardPlay" mode, this variable keeps track of the current row&col values
let keyboardControlCol = 0;         // controlled by keyboard input
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
const fbButton = document.getElementById('fb-share-button');
const twButton = document.getElementById('tw-share-button');

// ================= add listners to buttons =================

document.addEventListener("keyup", (event) => {             // add a listener to the entire window that listens to key inputs
    if(keyboardPlay) {
        document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth="2px";    //removes focus on cell
        switch (event.code) {
            case "ArrowDown":
                if(keyboardControlRow < (boardSize - 1)){       // checks board boundary
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
                playerEnteredInput = true;              // this will trigger the "gameLoopFunction" below
                break;
            default:
                break;
        }
    }
});

for(let j = 0; j < boardCellButtons.length; j++){       // add listeners to all 9 tictacto cell buttons
    boardCellButtons[j].addEventListener("click", (res) => {
        clickedCell = res.target.value;
        playerEnteredInput = true;
    });
};

playAgainBtn.addEventListener("click", () => {          // add listner when "play again" button is clicked
    initializeGame();
    playAgainBtn.blur();                                // blured after initializing to prevent conflicting with keyboard input mode
});

randomOnRadioBtn.addEventListener("change", () => {     // radio button that turns on random mode
    randomMode = true;
    randomOnRadioBtn.blur();
});

randomOffRadioBtn.addEventListener("change", () => {
    randomMode = false;
    randomOffRadioBtn.blur();
});

keyboardOnRadioBtn.addEventListener("change", () => {   // radio button that turns on keyboard input mode
    keyboardPlay = true;
    document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth = "6px";    // give focus on the current cell
    keyboardOnRadioBtn.blur();
});

keyboardOffRadioBtn.addEventListener("change", () => {
    keyboardPlay = false;
    document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth = "2px";
    keyboardOffRadioBtn.blur();
});

fbButton.addEventListener('click', function() {         // add listener to facebook share button
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + "https://github.com/08jhs05/TicTacToe",   // this will open a new window and redirect user to fb share page
        'facebook-share-dialog',
        'width=800,height=600'
    );
    return false;
});

twButton.addEventListener('click', function() {         // add listener to twitter share button
    window.open("https://twitter.com/intent/tweet?text=I%20won%20TicTacToe%20game!",
        'twitter-share-dialog',
        'width=800,height=600'
    );
    return false;
});

// ================= initialize values and start the game =================

initializeGame();

// ================= functions =================

// initializeGame: resets all variables and starts iterating "game loop".

function initializeGame(){
    blueStatus.innerHTML = "Blue's turn!";              // initalize status messages
    yellowStatus.innerHTML = "";
    gameStatus.innerHTML = "";
    shareButtons.style.visibility = "hidden";           // hide sns share buttons

    for(let j = 0; j < boardCellButtons.length; j++){
        boardCellButtons[j].style.backgroundColor = "#FFFFFF";      // reset tictacto cell buttons
        boardCellButtons[j].innerHTML = "";
    }

    isBlueTurn = true;
    playerEnteredInput = false;
    turns = 0;
    cells = [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]];

    gameLoop = setInterval(gameLoopFunction, 100);      // repeats game loop for every 100 ms.
};

// gameLoopFunction: 

function gameLoopFunction(){
    
    if(keyboardPlay) {          // give focus to current cell when on keyboard input mode
        document.getElementById(`cell-${keyboardControlRow},${keyboardControlCol}`).style.borderWidth="6px";
    }

    if(playerEnteredInput){
        gameStatus.innerHTML = "";

        let buttonRow = keyboardPlay ? keyboardControlRow : Math.floor(clickedCell / 3);        // clickedcell will have a value between 0-8, this is received from cell buttons html dom
        let buttonCol = keyboardPlay ? keyboardControlCol : clickedCell % 3;                    // divid clickedcell into row col values
                                                                                                // use keyboardControlRow & col when on keyboard input mode
        if(randomMode) {            // if random mode is on, set row and col as random numbers 
            do {
                buttonRow = Math.floor(Math.random() * 3);
                buttonCol = Math.floor(Math.random() * 3);
            } while (cells[buttonRow][buttonCol] !== 0);    // randomize again if the cell with random row&col is occupied
        }

        if(cells[buttonRow][buttonCol] !== 0){              // checked if cell is occupied
            gameStatus.innerHTML = "CELL IS OCCUPIED!";
        } else{
            turns++;

            document.getElementById(`status-${isBlueTurn ? "yellow" : "blue"}`).innerHTML = isBlueTurn ? "Yellow's turn!" : "Blue's turn!";
            document.getElementById(`status-${isBlueTurn ? "blue" : "yellow"}`).innerHTML = "";
            cells[buttonRow][buttonCol] = isBlueTurn ? 1 : -1;
            document.getElementById(`cell-${buttonRow},${buttonCol}`).style.backgroundColor = isBlueTurn ? "#679BF1" : "#FFC40A";
            document.getElementById(`cell-${buttonRow},${buttonCol}`).innerHTML  = isBlueTurn ? "X" : "O";
            if(checkIfWin(buttonRow, buttonCol, isBlueTurn)){       // checks if winning condition is made

                gameStatus.innerHTML = `${isBlueTurn ? "BLUE" : "YELLOW"} WINS!`
                gameStatus.style.color = isBlueTurn ? "#679BF1" : "#FFC40A";
                shareButtons.style.visibility = "visible";
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
            }else if(turns === boardSize * boardSize) {         // checks if tictactoe board is all occupied but there's still no winners
                gameStatus.innerHTML = "DRAW";
                blueStatus.innerHTML = "";
                yellowStatus.innerHTML = "";
                clearInterval(gameLoop);                // stop the gameloop
            }
            isBlueTurn = !isBlueTurn;
        }
        playerEnteredInput = false;
    }
};

// checkIfWin: check current tictactoe board, then returns true if winning condition is made.

function checkIfWin(row, col, color){       // color is true if it's blue's turn, false if yellow's turn

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

    let winningCondition = color ? 3 : -3;      // either player wins if the sum of any line(vertical, horizontal, diagonal, anti-diagonal)
                                                // is 3 or -3
    return (rowSum === winningCondition) || (colSum === winningCondition) || (diagonalSum === winningCondition) || (antiDiagonalSum === winningCondition);
};
