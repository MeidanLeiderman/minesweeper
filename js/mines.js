'use strict';



function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                var elMine = document.querySelector(`.cell${i}-${j}`);
                renderCell(elMine, MINE)
                elMine.classList.add('pressed')
            }
        }
    }
}

function setMinesNeighboursCount(cell) {
    var mineCount = 0;
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === cell.i && j === cell.j) continue;

            if (gBoard[i][j].isMine) mineCount++;
        }
    }
    return mineCount;
}


function generateRandomMines(i, j) {
    var mineCount = 0
    while (mineCount < gLevel.MINES) {
        var a = getRandomInt(0, gBoard.length - 1);
        var b = getRandomInt(0, gBoard.length - 1);

        if (a === i && b === j) continue

        if (!gBoard[a][b].isMine) {
            gBoard[a][b].isMine = true
            mineCount++
        }
    }
}
