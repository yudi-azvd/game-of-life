let cells = []
// let cellsInTableArray // declare only once
const landHeight = 40
const landWidth = 50
let timeInterval = 200
const debugMode = false
let paused = true
const startButton = document.getElementById('start')
const pauseButton = document.getElementById('pause')
const resetButton = document.getElementById('reset')
const nextGenerationButton = document.getElementById('getNextGeneration')

init()

function init() {
	initializeLand()
	renderInitialTable()
	const gameIntervalId = setInterval(updateCells, timeInterval)

	startButton.addEventListener('click', start)
	pauseButton.addEventListener('click', pause)
	resetButton.addEventListener('click', reset)
	nextGenerationButton.addEventListener('click', getNextGeneration)
}

function start() {
	paused = false
}

function pause() {
	paused = true
}

function reset(arg) {
	init()
	paused = true
}

function initializeLand() {
	for (let row = 0; row < landHeight; row++) {
		cells[row] = new Array(landWidth)

		for (let column = 0; column < landWidth; column++) {
			cells[row][column] = 0 //false
		}
	}
}

function renderInitialTable() {
	let html = '<table cellpadding=0 cellspacing=0>'

	for(let row = 0; row < landHeight; row++) {
		html += '<tr>'

		for(let column = 0; column < landWidth; column++) {
			const cellIndex = row*landWidth + column

			if (debugMode) {
				html += `<td id=${cellIndex} class="${cells[row][column] ? "alive" : "dead" }">`
				html += `<div class="cell-index">${cellIndex}</div>`
				html += cells[row][column] //? 1:0
				html += '</td>'
			}
			else {
				html += `<td id=${cellIndex} class="${cells[row][column] ? "alive" : "dead" }">`
				html += `<div class="cell-index hidden">${cellIndex}</div>`
				html += '</td>'
			}
		}		

		html += '</tr>'
	}

	html += '</table>'

	document.querySelector('#cells-canvas').innerHTML = html
	addMouseDownListenerToCells()
}

function updateCells() {
	const cellsInTableArray = document.querySelectorAll('td')
	let cellIndex, cellIsAlive
	for(let row = 0; row < landHeight; row++) {
		for(let column = 0; column < landWidth; column++) {
			cellIndex = row*landWidth + column
			cellIsAlive = cells[row][column] === 1
			
			cellsInTableArray[cellIndex].classList = ''

			if (cellIsAlive) {
				cellsInTableArray[cellIndex].classList.add('alive')
			}
			else {
				cellsInTableArray[cellIndex].classList.add('dead')
			}
		}
	}

	if (!paused) {
		getNextGeneration()
	}
}

function addMouseDownListenerToCells() {
	const cells = document.querySelectorAll('td')
	for(let i = 0; i < cells.length; i++) {
		cells[i].addEventListener('mousedown', toggleCellContent)
		// cells[i].addEventListener('dragstart', toggleCellContent)
		cells[i].addEventListener('wheel', clickToGetNeighborsAround)
	}
}

function toggleCellContent(e) {
	const cell = e.target
	const cellIndex = parseInt(cell.getAttribute('id'))
	
	const column = cellIndex % landWidth
	const row = parseInt(cellIndex/landWidth)

	cells[row][column] = cells[row][column] === 1 ? 0 : 1
}

/**
Any live cell with two or three neighbors survives.

Any dead cell with three live neighbors becomes a live cell.

All other live cells die in the next generation. 
Similarly, all other dead cells stay dead.
 */
function getNextGeneration() {
	const newCells = shallowCopyOf(cells)

	for (let row = 0; row < landHeight; ++row) {
		for (let column = 0; column < landWidth; ++column) {
			const cellIsAlive = cells[row][column] === 1
			const neighbors = getNeighborsAround(row, column)

			if (cellIsAlive) {
				if (neighbors === 2 || neighbors === 3) {
					newCells[row][column] = 1
				}
				else {
					newCells[row][column] = 0
				}
			}
			else {
				if (neighbors === 3) {
					newCells[row][column] = 1
				}
				else {
					newCells[row][column] = 0
				}
			}
		}
	}

	cells = shallowCopyOf(newCells)
}

function getNeighborsAround(row, column) {
	let neighbors = 0
	const cellIsAlive = cells[row][column] === 1
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (isWithinBorders(row+dy, column+dx)) {
				if (cells[row+dy][column+dx] === 1) {
					neighbors++
				}
			}
		}
	}

	return cellIsAlive ? neighbors-1 : neighbors // to discount the cell itself
}

function isWithinBorders(y, x) {
	return (0 <= y && y < landHeight) && (0 <= x && x < landWidth)
}

function clickToGetNeighborsAround(event) {
	const cell = event.target
	const cellIndex = parseInt(cell.getAttribute('id'))
	const column = cellIndex % landWidth
	const row = parseInt(cellIndex/landWidth)
	const cellIsAlive = newCells[row][column] === 1
	const neighbors = getNeighborsAround(row, column)

	// console.log(`${neighbors} NEIGHBORS around ${cellIsAlive ? 'living' : 'dead'} cell at (${row}, ${column})`)
}

function shallowCopyOf(array) {
	// https://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
	const shallowCopy = []
	for (let i = 0; i < array.length; i++)
		shallowCopy[i] = array[i].slice(0)
	return shallowCopy
}
