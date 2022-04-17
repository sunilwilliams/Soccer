

function addPoint(x, y, z, r, g, b) {
	pointNum = points.length / 3
	points.push(x, y, z)
	pointColors.push(r, g, b, 1)
	return pointNum
}

function changePoint(pointNum, x, y, z) {
	points[pointNum*3 + 0] = x
	points[pointNum*3 + 1] = y
	points[pointNum*3 + 2] = z
}



function movePoint(pointNum, plusX, plusY, plusZ) {
	points[pointNum*3 + 0] += plusX
	points[pointNum*3 + 1] += plusY
	points[pointNum*3 + 2] += plusZ
}



function rotateCubeZ(anchorX, anchorY, amount) {
	for (let i = 0; i < 8; i++) {
		let x = points[i*3 + 0] - anchorX
		let y = points[i*3 + 1] - anchorY

		points[i*3 + 0] = (x * Math.cos(amount) - y * Math.sin(amount)) + anchorX
		points[i*3 + 1] = (x * Math.sin(amount) + y * Math.cos(amount)) + anchorY
		
	}
}


function rotateCubeX(anchorY, anchorZ, amount) {
	for (let i = 0; i < 8; i++) {
		let y = points[i*3 + 1] - anchorY
		let z = points[i*3 + 2] - anchorZ

		points[i*3 + 1] = (y * Math.cos(amount) - z * Math.sin(amount)) + anchorY
		points[i*3 + 2] = (y * Math.sin(amount) + z * Math.cos(amount)) + anchorZ
		
	}
}
