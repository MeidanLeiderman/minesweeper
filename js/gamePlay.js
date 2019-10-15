'use strict';

function safeClick() {
    if (!gGame.safeClickCount) {
        return
    }

    disableHelpBtn();
    gGame.safeClickCount--

    var safeCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                safeCells.push(gBoard[i][j])
            }
        }
    }

    renderClueCell(safeCells[getRandomInt(0, safeCells.length - 1)])
}


function findCellValue(i, j) {
    var value;
    if (gBoard[i][j].isMine) value = MINE
    else if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount !== 0) value = gBoard[i][j].minesAroundCount
    else if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount === 0) value = EMPTY
    return value;
}

function checkIfMarked(i, j) {
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markCount++
        return true
    }
    return false
}


function checkIfShownOrMarked(i, j) {
    if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        return true
    }
    return false
}

function showCell(elCell, i, j) {
    var isShown = checkIfShownOrMarked(i, j)
    if (!isShown) return

    elCell.classList.add('pressed')

    if (gBoard[i][j].isMine) {
        revealAllMines()
        displayLostFace()
        gGame.isOn = false;

    } else if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount !== 0) {
        renderCell(elCell, gBoard[i][j].minesAroundCount)

    } else if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard[i][j], i, j)
    }
}


function firstClick(i, j) {
    gGame.isOn = true
    updateCells(gBoard, i, j)
    gTimer = setInterval(countTimer, 1000);
    document.querySelector('.safe-click').disabled = false
}

function cellClicked(elCell, event, i, j) {

    if (!gGame.isOn && gGame.shownCount > 0) return
    else if (!gGame.isOn && gGame.shownCount < 1) firstClick(i, j)

    var buttonPressed = event.button
    if (!buttonPressed) showCell(elCell, i, j)
    if (buttonPressed === 2) cellMarked(elCell, i, j)

    checkGameOver();
}

function cellMarked(elCell, i, j) {
    var isNotShown = !gBoard[i][j].isShown;
    if (!gBoard[i][j].isMarked && isNotShown) {
        gBoard[i][j].isMarked = true
        gGame.markCount++
        renderCell(elCell, FLAG)
    }
    else if (gBoard[i][j].isMarked && isNotShown) {
        gBoard[i][j].isMarked = false
        gGame.markCount--
        renderCell(elCell, EMPTY)
    }
}

function enableHelpBtn() {
    document.querySelector('.safe-click').disabled = false
}

function disableHelpBtn() {
    document.querySelector('.safe-click').disabled = true
}

function displayWinBtn() {
    var elBtn = document.querySelector('.normal button');
    elBtn.innerHTML = `${WIN}`;
}

function displayLostFace() {
    var elBtn = document.querySelector('.normal button');
    elBtn.innerHTML = `${LOSE}`;
}

function expandShown(cell) {
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {

        if (i >= 0 && i < gBoard.length) {
            for (var j = cell.j - 1; j <= cell.j + 1; j++) {
                var isSameCell = i === cell.i && j === cell.j

                if (j >= 0 && j < gBoard.length && !isSameCell) {
                    expand(i, j);
                }

            }
        }


    }
}

function expand(i, j) {
    if (!gBoard[i][j].isMine) {
        var check = checkIfShownOrMarked(i, j);
        if (check) {
            var NeighboursCount = gBoard[i][j].minesAroundCount;
            var NeighboursCountLabel = NeighboursCount > 0 ? NeighboursCount : '';
            var elNeighbour = document.querySelector(`.cell${i}-${j}`);

            renderCell(elNeighbour, NeighboursCountLabel);

            elNeighbour.classList.add('pressed');

            if (NeighboursCount === 0) {
                expandShown(gBoard[i][j]);
            }
        }
    }
}
