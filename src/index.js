const land = []
const landWidth = 10
const landHeight = 10

start()

function start() {
	initializeLand()
	renderLand()
}

function initializeLand() {
	for (let row = 0; row < landHeight; row++) {
		land[row] = new Array(landWidth)

		for (let column = 0; column < landWidth; column++) {
			land[row][column] = 0
		}
	}
}

function renderLand() {
	var html = ''

	html += '<table cellpadding=0 cellspacing=0>'

	for(let row = 0; row < landHeight; row++) {
		html += '<tr>'

		for(let column = 0; column < landWidth; column++) {
			html += '<td>'
			html += row*landWidth+column
			html += '</td>'
		}		

		html += '</tr>'
	}

	html += '</table>'

	document.querySelector('#land-canvas').innerHTML = html
}

