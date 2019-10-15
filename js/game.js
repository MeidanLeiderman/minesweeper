'use strict';
console.log('this is Minesweeper')
// Code Review: 
// Meidan, really nice improvement!
// Code looks really good and organized.
// Nice job in design, the board itself looks good and very similar to original game (with colors too... good touch and attention to detail)
// The "exterior"; levels, background, centering - demends some more attention...
// Overall - very nice job!

var LOSE = '😩';
var WIN = '😎';
var NORMAL = '🙂';
var MINE = '💥';
var FLAG = '🚩';
var EMPTY = '';

var gTimer;

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markCount: 0,
    secsPassed: 0,
    safeClickCount: 3
};


function init() {
    gBoard = buildBoard();
    renderBoard(gBoard, '.board-container')
    resetGame();
}

function countTimer() {
    if (!gGame.isOn) return
    ++gGame.secsPassed;
    var hour = Math.floor(gGame.secsPassed / 3600);
    var minute = Math.floor((gGame.secsPassed - hour * 3600) / 60);
    var seconds = gGame.secsPassed - (hour * 3600 + minute * 60);
    document.querySelector(".timerDisplay").innerHTML = hour + ":" + minute + ":" + seconds;
}

function resetGame() {
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markCount = 0
    gGame.secsPassed = 0
    gGame.safeClickCount = 3
    clearInterval(gTimer);
    gTimer = null
    var modal = document.querySelector('.modal')
    modal.style.display = 'none'
    disableHelpBtn();
    document.querySelector('span').innerText = gGame.safeClickCount
}

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) return
        }
    }
    gGame.isOn = false;
    displayWinBtn();
}

function setLevel(elLevel) {
    var level = elLevel.innerHTML
    if (level === 'Beginner Level') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (level === 'Intermediate Level') {
        gLevel.SIZE = 8
        gLevel.MINES = 12
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 30

    }
    init();
}

function renderBoard(board, selector) {
    var strHTML = `<table class="board"><thead>
    <tr><th colspan="3" class="timerDisplay">0:0:0</th></tr>
    <tr><th class="normal" colspan="${board.length}"><button onclick="init()">${NORMAL}</button></td></tr>
    </thead><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell${i}-${j}`;
            strHTML += `<td class="${className}" onmousedown="cellClicked(this, event,${i},${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function updateCells(board, i, j) {
    generateRandomMines(i, j)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNeighboursCount(board[i][j])
        }
    }
    return board
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            }
        }
    }
    return board;
};

