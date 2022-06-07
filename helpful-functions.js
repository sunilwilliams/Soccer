


function inRange(x, a, b) {
	if (a > b) {
		if (x >= b && x <= a) return true
		else return false
	} else {
		if (x >= a && x <= b) return true
		else return false
	}
}


function calculateYOfXSlope(x1, y1, x2, y2) {
	let slope = (y2 - y1) / (x1 - x2);
	return {
		slope: slope,
		intercept: y1 - (slope * x1)
	}
}

function calculateXOfYSlope(y1, x1, y2, x2) {
	let slope = (x2 - x1) / (y1 - y2);
	return {
		slope: slope,
		intercept: x1 - (slope * y1)
	}
}

function calculateZOfYSlope(y1, z1, y2, z2) {
	let slope = (z2 - z1) / (y1 - y2);
	return {
		slope: slope,
		intercept: z1 - (slope * y1)
	}
}

function calculateYOfZSlope(z1, y1, z2, y2) {
	let slope = (y2 - y1) / (z1 - z2);
	return {
		slope: slope,
		intercept: y1 - (slope * z1)
	}
}

function calculateXOfZSlope(z1, z2, x1, x2) {
	let slope = (x2 - x1) / (z1 - z2);
	return {
		slope: slope,
		intercept: x1 - (slope * z1)
	}
}

function calculateZOfXSlope(x1, x2, z1, z2) {
	let slope = (z2 - z1) / (x1 - x2);
	return {
		slope: slope,
		intercept: z1 - (slope * x1)
	}
}


function calculateSlope(independ1, depend1, independ2, depend2) {
	let slope = (depend2 - depend1) / (independ2 - independ1)
	return {
		slope: slope,
		intercept: depend1 - (slope * independ1)
	}
}


function isIntersecting() {
	
}


function addPoint(x, y, z, r, g, b) {
	if (openPoints.length > 0) {
		pointNum = openPoints[0]
		points.splice(openPoints[0] * 3, 3, x, y, z)
		pointColors.splice(openPoints[0] * 4, 4, r, g, b, 1)
		openPoints.splice(0, 1)
	} else {
		pointNum = points.length / 3
		points.push(x, y, z)
		pointColors.push(r, g, b, 1)
	}
	return pointNum
}

function addPoly(point1, point2, point3) {
	if (openPolys.length > 0) {
		polyNum = openPolys[0]
		polys.splice(openPolys[0] * 3, 3, point1, point2, point3)
		openPolys.splice(0, 1)
	} else {
		polyNum = polys.length / 3
		polys.push(point1, point2, point3)
	}
	return polyNum
}

function changePoint(pointNum, x, y, z) {
	points[pointNum*3 + 0] = x
	points[pointNum*3 + 1] = y
	points[pointNum*3 + 2] = z
}

function movePointColor(pointNum, plusR, plusG, plusB) {
	pointColors[pointNum*4 + 0] += plusR
	pointColors[pointNum*4 + 1] += plusG
	pointColors[pointNum*4 + 2] += plusB
}


function changePointColor(pointNum, r, g, b) {
	pointColors[pointNum*4 + 0] = r
	pointColors[pointNum*4 + 1] = g
	pointColors[pointNum*4 + 2] = b
}



function movePoint(pointNum, plusX, plusY, plusZ) {
	points[pointNum*3 + 0] += plusX
	points[pointNum*3 + 1] += plusY
	points[pointNum*3 + 2] += plusZ
}


function deletePoint(pointNum) {
	points.splice(pointNum * 3, 3, null, null, null)
	pointColors.splice(pointNum * 4, 4, null, null, null, null)
	openPoints.push(pointNum)
}

function deletePoly(polyNum) {
	polys.splice(polyNum * 3, 3, null, null, null)
	openPolys.push(polyNum)
}

// points are moved back and polys that have those points need to be changed

// make open points array

function deletePolyWithPoints(polyNum) {
	for (let i = 0; i < 3; i++) {
		deletePoint(polys[(polyNum * 3) + i])
	}
	polys.splice(polyNum * 3, 3, null, null, null)
	openPolys.push(polyNum)
}


function movePlayer(plusX, plusY, plusZ) {
	for (let i = 0; i < playerPoints; i++) {
		movePoint(i, plusX, plusY, plusZ)
	}
}


function rotateCubeX(anchorY, anchorZ, amount) {
	for (let i = 0; i < playerPoints; i++) {
		let y = points[i*3 + 1] - anchorY
		let z = points[i*3 + 2] - anchorZ

		points[i*3 + 1] = (y * Math.cos(amount) - z * Math.sin(amount)) + anchorY
		points[i*3 + 2] = (y * Math.sin(amount) + z * Math.cos(amount)) + anchorZ
		
	}
}


function rotateCubeY(anchorZ, anchorX, amount) {
	for (let i = 0; i < playerPoints; i++) {
		let z = points[i*3 + 2] - anchorZ
		let x = points[i*3 + 0] - anchorX

		points[i*3 + 2] = (z * Math.cos(amount) - x * Math.sin(amount)) + anchorZ
		points[i*3 + 0] = (z * Math.sin(amount) + x * Math.cos(amount)) + anchorX
		
	}
}


function rotateCubeZ(anchorX, anchorY, amount) {
	for (let i = 0; i < playerPoints; i++) {
		let x = points[i*3 + 0] - anchorX
		let y = points[i*3 + 1] - anchorY

		points[i*3 + 0] = (x * Math.cos(amount) - y * Math.sin(amount)) + anchorX
		points[i*3 + 1] = (x * Math.sin(amount) + y * Math.cos(amount)) + anchorY
		
	}
}

function rotatePointX(pointNum, startX, startY, startZ, anchorY, anchorZ, amount) {
	let y = startY - anchorY
	let z = startZ - anchorZ
	
	changePoint(pointNum, 
							startX, 
							(y * Math.cos(amount) - z * Math.sin(amount)) + anchorY, 
							(y * Math.sin(amount) + z * Math.cos(amount)) + anchorZ)
}


function rotatePointY(pointNum, startX, startY, startZ, anchorZ, anchorX, amount) {
	let z = startZ - anchorZ
	let x = startX - anchorX
	
	changePoint(pointNum, 
							(z * Math.sin(amount)) + (x * Math.cos(amount)) + anchorX), 
							startY, 
							(z * Math.cos(amount)) - (x * Math.sin(amount)) + anchorZ
}



function rotatePointZ(pointNum, startX, startY, startZ, anchorX, anchorY, amount) {
	let x = startX - anchorX
	let y = startY - anchorY
	
	changePoint(pointNum, 
							(x * Math.cos(amount) - y * Math.sin(amount)) + anchorX, 
							(x * Math.sin(amount) + y * Math.cos(amount)) + anchorY, 
							startZ)
}



function calculateAverage() {
	let totalX = 0,
			totalY = 0,
			totalZ = 0

	for (let i = 0; i < playerPoints; i++) {
		totalX += points[i*3 + 0]
		totalY += points[i*3 + 1]
		totalZ += points[i*3 + 2]
		
		
	}

	return {
		x: totalX / playerPoints,
		y: totalY / playerPoints,
		z: totalZ / playerPoints
	}
}


function point(num, which) {
	return points[num*3 + which]
}

function poly(num, which) {
	if (num <= polys.length / 3 && which <= 3) {
		return polys[num*3 + which]
	}
	if (num > polys.length / 3) throw("fetch a poly within polys bounds")
	if (which > 3) throw("fetch a poly with 3 or less sides")
}

function setFlat(low) {
	// calculate Y angle
	let a = point(low[1], X) - point(low[0], X)
	let b = point(low[1], Z) - point(low[0], Z)
	let angle = Math.atan(b / a)
	
	let currentPoint = 0
	for (let x = -1; x <= 1; x += 2) {
		for (let y = -1; y <= 1; y += 2) {
			for (let z = -1; z <= 1; z += 2) {
				changePoint(currentPoint, average.x + 50*x, average.y + 50*y, average.z + 50*z)
				currentPoint++
			}
		}
	}

	rotateCubeY(average.z, average.x, -angle)
	
}

function crouch(high, low) {
	// * (100 - point(high[0], Y))
	let lowerSpeed = (50 - point(high[0], Y)) / 10
	for (let i = 0; i < high.length; i++) {
		movePoint(high[i], 0, lowerSpeed, 0)
	}
	
	lowerSpeed = (0 - point(low[0], Y)) / 10
	for (let i = 0; i < low.length; i++) {
		movePoint(low[i], 0, lowerSpeed, 0)
	}
}

function uncrouch(high, low) {
	let lowerSpeed = (100 - point(high[0], Y)) / 5
	for (let i = 0; i < high.length; i++) {
		movePoint(high[i], 0, lowerSpeed, 0)
	}
	
	lowerSpeed = (0 - point(low[0], Y)) / 5
	for (let i = 0; i < low.length; i++) {
		movePoint(low[i], 0, lowerSpeed, 0)
	}
}

function lerp(a, b, x) {
	if (inRange(x, 0, 1)) {
		let difference = b - a

		return a + (difference * x)
	}
	throw "lerp a value from 0 to 1"
}