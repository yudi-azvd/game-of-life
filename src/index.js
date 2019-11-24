const land = []
const landWidth = 8
const landHeight = 8
const debugMode = false
let started = false
const startButton = document.getElementById('start')
const pauseButton = document.getElementById('pause')
const nextGenerationButton = document.getElementById('getNextGeneration')

init()

function init() {
	initializeLand()
	setInterval(renderLand, 500)

	startButton.addEventListener('click', start)
	pauseButton.addEventListener('click', pause)
	nextGenerationButton.addEventListener('click', getNextGeneration)
}

function start() {
	started = true
	console.log('started')
}

function pause() {
	started = false
	console.log('paused')
}

function initializeLand() {
	for (let row = 0; row < landHeight; row++) {
		land[row] = new Array(landWidth)

		for (let column = 0; column < landWidth; column++) {
			land[row][column] = 0 //false
		}
	}
}

function renderLand() {
	var html = ''

	html += '<table cellpadding=0 cellspacing=0>'

	for(let row = 0; row < landHeight; row++) {
		html += '<tr>'

		for(let column = 0; column < landWidth; column++) {
			const cellIndex = row*landWidth + column

			if (debugMode) {
				html += `<td id=${cellIndex}>`
				html += `<div class="cell-index">${cellIndex}</div>`
				html += land[row][column] //? 1:0
				html += '</td>'
			}
			else {
				html += `<td id=${cellIndex} class="${land[row][column] ? "alive" : "dead" }">`
				html += `<div class="cell-index hidden">${cellIndex}</div>`
				html += '</td>'
			}
		}		

		html += '</tr>'
	}

	html += '</table>'

	document.querySelector('#land-canvas').innerHTML = html
	addEventListenerToCells()

	if (started) {
		getNextGeneration()
	}
}

function addEventListenerToCells() {
	const cells = document.querySelectorAll('td')
	for(let i = 0; i < cells.length; i++) {
		cells[i].addEventListener('mousedown', toggleCellContent)
		cells[i].addEventListener('wheel', clickToGetNeighborsAround)
	}
}

function toggleCellContent(e) {
	const cell = e.target
	const cellIndex = parseInt(cell.getAttribute('id'))
	const column = cellIndex % landWidth
	const row = parseInt(cellIndex/landWidth)
	console.log(row, column)

	land[row][column] = land[row][column] ? 0 : 1
}

/**
Any live cell with two or three neighbors survives.

Any dead cell with three live neighbors becomes a live cell.

All other live cells die in the next generation. 
Similarly, all other dead cells stay dead.
 */
function getNextGeneration() {
	for (let row = 0; row < landHeight; row++) {
		for (let column = 0; column < landWidth; column++) {
			const cellIsAlive = land[row][column] === 1
			const neighbors = getNeighborsAround(row, column)
			console.log('NEIGHBORS', neighbors)

			if (cellIsAlive) {
				console.log('cell is CURRENTLY ALIVE')
				console.log(row, column)
				if (neighbors === 2 || neighbors === 3) {
					land[row][column] = 1
					console.log('cell lives')
				}
				else {
					land[row][column] = 0
					console.log('cell dies')
				}
			}
			else {
				if (neighbors === 3) {
					land[row][column] = 1
					console.log('cell lives')
				}
				else {
					land[row][column] = 0
					console.log('cell dies')
				}
			}
		}
	}
}

function getNeighborsAround(row, column) {
	let neighbors = 0
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (isWithinBorders(row+dy, column+dx)) {
				if (land[row+dy][column+dx] === 1) {
					neighbors++
				}
			}
		}
	}

	return neighbors <= 0 ? 0 : neighbors-1// to discount the cell itself
}

function isWithinBorders(y, x) {
	return (0 <= y && y < landHeight) && (0 <= x && x < landWidth)
}

function clickToGetNeighborsAround(event) {
	const cell = event.target
	const cellIndex = parseInt(cell.getAttribute('id'))
	const column = cellIndex % landWidth
	const row = parseInt(cellIndex/landWidth)
	
	console.log('NEIGHBORS', getNeighborsAround(row, column))
}