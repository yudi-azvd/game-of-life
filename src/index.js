const land = []
const landWidth = 8
const landHeight = 8
const debugMode = false



start()

function start() {
	initializeLand()
	setInterval(renderLand, 500)
	// renderLand()
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
}

function addEventListenerToCells() {
	const cells = document.querySelectorAll('td')
	for(let i = 0; i < cells.length; i++) {
		cells[i].addEventListener('click', toggleCellContent)
	}
}

function toggleCellContent(e) {
	const cell = e.target
	const cellIndex = parseInt(cell.getAttribute('id'))
	const column = cellIndex % landWidth
	const row = parseInt(cellIndex/landWidth)

	land[row][column] = land[row][column] ? 0 : 1
}

