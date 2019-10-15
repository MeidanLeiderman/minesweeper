
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);

    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderClueCell(location) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.classList.add('clue')
  document.querySelector('span').innerText = gGame.safeClickCount
  setTimeout(function () {
    elCell.classList.remove('clue')
    if (gGame.safeClickCount > 0) enableHelpBtn();
  }, 2000)
}

function renderCell(elCell, value) {
  elCell.innerHTML = value;
  
  if (!isNaN(parseInt(value))) {
    elCell.classList.add(`count${value}`)
  }
}
