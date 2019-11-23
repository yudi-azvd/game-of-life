const land = [[]]
const landWidth = 5
const landHeight = 2

start()

function start() {
	initializeLand()
}

function initializeLand() {
	for (let row = 0; row < landHeight; row++) {
		for (let column = 0; column < landWidth; column++)
			land[row][column] = 0
	}
}

