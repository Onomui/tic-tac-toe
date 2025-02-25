const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let nextSymbol = CROSS;
let turnsLeft;
let endGame = false;
let dimensionGlobal;

startGame();
addResetListener();

function startGame () {
    let dim = prompt("Размер сетки", 3);
    if (dim < 3 || dim === undefined) {
        alert("Сликшом мало! Делаем сетку из 3");
        dim = 3;
    }
    renderGrid(Number(dim));
    
}

function renderGrid (dimension) {
    dimensionGlobal = dimension;
    let gridData = [];
    turnsLeft = dimension ** 2;
    container.innerHTML = '';
    
    for (let i = 0; i < dimension; i++) {
        gridData.push([]);
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            gridData[i].push(EMPTY);
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(gridData, i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}


function cellClickHandler (gridData, row, col) {
    
    if (!endGame && gridData[row][col] === EMPTY) {
        renderSymbolInCell(nextSymbol, row, col);
        gridData[row][col] = nextSymbol;

        if (isWinner(gridData, nextSymbol)) {
            setTimeout(alert, 0.1, `${nextSymbol} win`);
            endGame = true;
        }


        nextSymbol = nextSymbol === CROSS ? ZERO : CROSS;
        turnsLeft--;

        if (turnsLeft == 0) {
            setTimeout(alert, 0.1, "Победила дружба");
            endGame = true;
        }
    }
    
    console.log(`Clicked on cell: ${row}, ${col}`);
}


function isWinner (gridData, player) {
    let winCells = []; 
    
    let horizontalWin = 0;
    for (let row = 0; row < dimensionGlobal; row++) {
        for (let col = 0; col < dimensionGlobal; col++) {
            if (gridData[row][col] === player) {
                horizontalWin++;
                winCells.push([row, col]);
                if (horizontalWin === dimensionGlobal) {
                    paintCells(player, winCells);
                    return true;
                }
            }
        }
        winCells = [];
        horizontalWin = 0;
    }

    let verticalWin = 0;
    for (let i = 0; i < dimensionGlobal; i++) {
        for (let j = 0; j < dimensionGlobal; j++) {
            if (gridData[j][i] === player) {
                verticalWin++;
                winCells.push([j, i]);
            }
            if (verticalWin === dimensionGlobal) {
                paintCells(player, winCells);
                return true;
            }
        }   
        winCells = [];
        verticalWin = 0;
    }

    let diagonalWin = 0;
    for (let i = 0; i < dimensionGlobal; i++) {
        if (gridData[i][i] === player) {
            diagonalWin++;
            winCells.push([i, i]);
        }
    }
    if (diagonalWin === dimensionGlobal) {
        paintCells(player, winCells);
        return true;
    }
    winCells = [];
    diagonalWin = 0;

    for (let i = 0; i < dimensionGlobal; i++) {
        for (let j = 0; j < dimensionGlobal; j++) {
            if (i + j === dimensionGlobal - 1 && gridData[i][j] == player) {
                winCells.push([i, j]);
                diagonalWin++;
            }
        }
    }
    if (diagonalWin === dimensionGlobal) {
        paintCells(player, winCells);
        return true;
    }

    return false;
}

function paintCells(player, winCells) {
    for (const cell of winCells) {
        renderSymbolInCell(player, cell[0], cell[1], "#FF0000");
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    endGame = false;
    startGame();
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
