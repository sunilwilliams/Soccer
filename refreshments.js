const X = 0,
			Y = 1,
			Z = 2

var posX = 0,
		posY = 0,
		posZ = 0

var angleX = 0,
		angleY = 0,
		angleZ = 0

var velocityX = 0,
		velocityY = 0,
		velocityZ = 0

var lastVelocityX = 0,
		lastVelocityY = 0,
		lastVelocityZ = 0




// waddle values

var bounceX = 0,
		bounceZ = 0,
		waddleY = .025,
		bounceDirection = 1,
		switchDirectionFrame = 0,
		waddleAnchorPoint = 0
		

var low = [0, 0, 0, 0],
		high = [0, 0, 0, 0]


var lowestX = 0,
		highestX = 0,
		lowestZ = 0,
		highestZ = 0
	
var lastLow = [0, 0, 0, 0],
		lastHigh = [0, 0, 0, 0]

var crouchFrameStart = 0,
		crouchFrameEnd = 0,
		uncrouchFrameStart = 0,
		uncrouchFrameEnd = 0

var average = {x: 0, y: 0, z: 0}


var onGround = false,
		layingFlat = false

var lastAverages = [{x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}]

// number of grass that are loaded in
var inWidthFloat = 5

var lastFrameRates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var rollingFrameRate = 0

var displayFrameRate = 0

var frameCounter = 0;

var then = 0;

var cameraDistance = 400
var cameraDistanceChange = 0


function refresh(now) {
	frameCounter++

	let deltaTime = now - then;
	then = now;

	// apply interaction

	// .75
	let speed = 1
	let halfSpeed = speed / Math.sqrt(2)

	if (!crouching) {

		if (w & a) {
			
			velocityX += halfSpeed * Math.cos(angleY - (Math.PI / 2))
		  velocityZ += halfSpeed * Math.sin(angleY - (Math.PI / 2))

			
			velocityX += halfSpeed * Math.cos(angleY)
		  velocityZ += halfSpeed * Math.sin(angleY)
		}
		else if (a && s) {
			
			velocityX += halfSpeed * Math.cos(angleY)
		  velocityZ += halfSpeed * Math.sin(angleY)

			
			velocityX -= halfSpeed * Math.cos(angleY - (Math.PI / 2))
		  velocityZ -= halfSpeed * Math.sin(angleY - (Math.PI / 2))
		}
		else if (s && d) {
			
			velocityX -= halfSpeed * Math.cos(angleY - (Math.PI / 2))
		  velocityZ -= halfSpeed * Math.sin(angleY - (Math.PI / 2))
			
			velocityX -= halfSpeed * Math.cos(angleY)
		  velocityZ -= halfSpeed * Math.sin(angleY)
		}
		else if (d && w) {
			
			velocityX -= halfSpeed * Math.cos(angleY)
		  velocityZ -= halfSpeed * Math.sin(angleY)
			
			velocityX += halfSpeed * Math.cos(angleY - (Math.PI / 2))
		  velocityZ += halfSpeed * Math.sin(angleY - (Math.PI / 2))
		}

		
		else if (w) {
			velocityX += speed * Math.cos(angleY - (Math.PI / 2))
		  velocityZ += speed * Math.sin(angleY - (Math.PI / 2))
		}
		else if (a) {
			velocityX += speed * Math.cos(angleY)
		  velocityZ += speed * Math.sin(angleY)
		}
		else if (s) {
			velocityX -= speed * Math.cos(angleY - (Math.PI / 2))
		  velocityZ -= speed * Math.sin(angleY - (Math.PI / 2))
		}
		else if (d) {
			velocityX -= speed * Math.cos(angleY)
		  velocityZ -= speed * Math.sin(angleY)
		}

		
		if (space && onGround) {
			velocityY += 30
		}
		if (shift) {
		}
	} else {
		if (w && layingFlat && onGround) {
			//velocityX = 6 * Math.cos(angleY - (Math.PI / 2))
		  //velocityZ = 6 * Math.sin(angleY - (Math.PI / 2))
		}
	}
	
	

	velocityX /= 1.1
	velocityY -= 1
	velocityZ /= 1.1

	let maxSpeed = 40

	//console.log((Math.abs(velocityX) + Math.abs(velocityZ)))

	/*
	if ((Math.abs(velocityX) + Math.abs(velocityZ)) > maxSpeed) {
		let slowDown = (Math.abs(velocityX) + Math.abs(velocityZ)) / maxSpeed
		velocityX /= slowDown
		velocityZ /= slowDown
	}
	*/

	// (x/a) + (z/a) = 4
	// (x+z) / a = 4
	// (x+z)/4 = a

	// move cube

	

	for (let i = 0; i < playerPoints; i++) {
		movePoint(i, 0, velocityY, 0)
	}
	

	// find lowest and highest points
	
	low = [0, 0, 7, 0]
	high = [0, 0, 0, 0]
	for (let i = 0; i < 4; i++) {
		low[i] = 0
		high[i] = 0
	}

	for (let i = 1; i < playerPoints; i++) {
		if (point(i, Y) < point(low[0], Y)) low[0] = i
		if (point(i, Y) > point(high[0], Y)) high[0] = i
	}
	while (low[1] == low[0]) low[1]++
	while (high[1] == high[0]) high[1]++
	for (let i = 0; i < playerPoints; i++) {
		if (i != low[0]) {
			if (point(i, Y) < point(low[1], Y)) low[1] = i
		}
		if (i != high[0]) {
			if (point(i, Y) > point(high[1], Y)) high[1] = i
		}
	}
	while (low[2] == low[1] || low[2] == low[0]) low[2]++
	while (high[2] == high[1] || high[2] == high[0]) high[2]++
	for (let i = 0; i < playerPoints; i++) {
		if (i != low[0] && i != low[1]) {
			if (point(i, Y) < point(low[2], Y)) low[2] = i
		}
		if (i != high[0] && i != high[1]) {
			if (point(i, Y) > point(high[2], Y)) high[2] = i
		}
	}
	while (low[3] == low[2] || low[3] == low[1] || low[3] == low[0]) low[3]++
	while (high[3] == high[2] || high[3] == high[1] || high[3] == high[0]) high[3]++
	for (let i = 0; i < playerPoints; i++) {
		if (i != low[0] && i != low[1] && i != low[2]) {
			if (point(i, Y) < point(low[3], Y)) low[3] = i
		}
		if (i != high[0] && i != high[1] && i != high[2]) {
			if (point(i, Y) > point(high[3], Y)) high[3] = i
		}
	}

	
	for (let i = 1; i < playerPoints; i++) {
		if (point(i, X) < point(lowestX, X)) lowestX = i
		if (point(i, X) > point(highestX, X)) highestX = i
		if (point(i, Z) < point(lowestZ, Z)) lowestZ = i
		if (point(i, Z) > point(highestZ, Z)) highestZ = i
	}

	
	if (frameCounter > crouchFrameStart && frameCounter <= crouchFrameEnd) crouch(high, low)
	if (frameCounter > uncrouchFrameStart && frameCounter <= uncrouchFrameEnd) uncrouch(high, low)
	if (frameCounter == crouchFrameStart || frameCounter == uncrouchFrameEnd) setFlat(low)


	// tilt
	
	if (onGround) {
			let leaningX = point(high[0], X) - point(low[0], X);
			let leaningZ = point(high[0], Z) - point(low[0], Z);
	
			let leaningTotal = Math.abs(leaningX) + Math.abs(leaningZ);

		
			if (leaningTotal != 0) {
				leaningX /= leaningTotal * 1
				leaningZ /= leaningTotal * 1
			}

			if (crouching) {
				leaningX /= 5
				leaningZ /= 5
			}
	
			velocityX += leaningX
			velocityZ += leaningZ
			
	}


	let minimumFlatness = 3
	
	if (!crouching && (Math.abs(point(low[0], Y) - Math.abs(point(low[3], Y)))) < minimumFlatness) {
		layingFlat = true
		if (!w && !a && !s && !d) {
			velocityX = 0
			velocityZ = 0
		}
	} else {
		layingFlat = false
	}

		
	//if (!crouching && frameCounter > crouchFrameEnd && frameCounter > uncrouchFrameEnd) {}
		
		
		
	if (onGround) {
		rotateCubeZ(point(low[0], X), point(low[0], Y), -velocityX/100)
		rotateCubeX(point(low[0], Y), point(low[0], Z), velocityZ/100)
	} else {
		
		rotateCubeZ(average.x, average.y, -velocityX/100)
		rotateCubeX(average.y, average.z, velocityZ/100)
	
		for (let i = 0; i < playerPoints; i++) {
			movePoint(i, velocityX, 0, velocityZ)
		}
	}


	
	
		// waddle
	if (crouching) {
		/*let z = point(low[0], Z) - average.z
		let x = point(low[0], X) - average.x
		let rotatedLowPoint = {
			x: (z * Math.sin(-angleY) + x * Math.cos(-angleY)), 
			y: point(low[0], Y), 
			z: (z * Math.cos(-angleY) - x * Math.sin(-angleY))
		}*/

		// furthest z of bottom 2 points
	
		let rotatePointY = mat4.create()
		mat4.rotateY(rotatePointY, rotatePointY, angleY)
	
		let lowRotated = []
		for (let i = 0; i < low.length; i++) {
			lowRotated[i] = []
			vec4.transformMat4(lowRotated[i], [point(low[i], X) - average.x, point(low[i], Y) - average.y, point(low[i], Z) - average.z, 1], rotatePointY)
			
		}
	
		let farthestLow = 0
		for (let i = 1; i < lowRotated.length; i++) {
			if (lowRotated[i][Z] < lowRotated[farthestLow][Z]) {
				farthestLow = i
			}
		}
	
		//console.log(lowRotated[farthestLow][X])

		
		if (frameCounter == switchDirectionFrame) {
			console.log("switch: " + frameCounter)
			
			if (waddleAnchorPoint != farthestLow) {
				if (false && frameCounter > crouchFrameEnd) {
					if (lowRotated[waddleAnchorPoint][X] < 0) {
						velocityX = 5 * Math.cos(angleY)
					  velocityZ = 5 * Math.sin(angleY)
					}
					else {
						velocityX = -5 * Math.cos(angleY)
					  velocityZ = -5 * Math.sin(angleY)
					}
				}
				waddleY *= -1
				waddleAnchorPoint = farthestLow
			}
			switchDirectionFrame += 20
		}

		
		rotateCubeY(point(low[waddleAnchorPoint], Z), point(low[waddleAnchorPoint], X), waddleY)
	}

			
		
	
	if (point(low[0], Y) <= 0) {

		
		if (velocityY < -40) {
			console.log("respawn")
			respawnPoints[currentRespawnPoint].respawnPlayerHere()
		} else {
			
			onGround = true
			let difference = -point(low[0], Y);
			velocityY = 0
			
			for (let i = 0; i < playerPoints; i++) {
				movePoint(i, 0, difference, 0)
			}
		}
		
	} else {
		onGround = false

		
	}

	// calculate last points slopes
							//independ1, depend1, independ2, depend2

	// "OfX" means independ is x
	
	

	for (let i = 0; i < playerPoints; i++) {
		yOfX[i] = calculateSlope(lastPoints[i][X], lastPoints[i][Y], point(i, X), point(i, Y))
		zOfX[i] = calculateSlope(lastPoints[i][X], lastPoints[i][Z], point(i, X), point(i, Z))
	
		zOfY[i] = calculateSlope(lastPoints[i][Y], lastPoints[i][Z], point(i, Y), point(i, Z))
		xOfY[i] = calculateSlope(lastPoints[i][Y], lastPoints[i][X], point(i, Y), point(i, X))
	
		xOfZ[i] = calculateSlope(lastPoints[i][Z], lastPoints[i][X], point(i, Y), point(i, X))
		yOfZ[i] = calculateSlope(lastPoints[i][Z], lastPoints[i][Y], point(i, Y), point(i, Y))
	}

	
	
	//platform.collision()

	//arena.run()

	for (let i = 0; i < pathPlatforms.length; i++) {
		if (pathPlatforms[i].loadedIn) pathPlatforms[i].run()
	}

	//for (let i = 0; i < bouncePads.length; i++) bouncePads[i].run()
	bouncePad.run()

	coin.run()

	for (let i = 0; i < lastPoints.length; i++) {
		lastPoints[i] = [point(i, X), point(i, Y), point(i, Z)]
	}

	for (let i = 0; i < low.length; i++) lastLow[i] = low[i]
	for (let i = 0; i < high.length; i++) lastHigh[i] = high[i]
	
	
	average = calculateAverage()

	//grassPatch1.rustle()
	//grassSquare1.eliminate()

	let grassX = Math.round(average.x / grassSectionSize) + (grassSectionNumber / 2)
	let grassZ = Math.round(average.z / grassSectionSize) + (grassSectionNumber / 2)

	for (let i = 0; i < grassSectionNumber; i++) {
		for (let j = 0; j < grassSectionNumber; j++) {
			grassSections[i][j].loadedInTemp = false
		}
	}

	//inWidthFloat = Math.round(rollingFrameRate / 4)
	//inWidth = Number(document.getElementById("inWidthSlider").value)

	//if ((1000 / deltaTime) < 60) inWidthFloat -= .1
	//if ((1000 / deltaTime) >= 60) inWidthFloat += .1

	//inWidthFloat = 10

	//let inWidth = Math.round(rollingFrameRate / 3.25)

	inWidth = 4


	for (let i = 0; i < arenas.length; i++) {
		let distance = Math.sqrt(Math.pow(arenas[i].x - average.x , 2) + Math.pow(arenas[i].z - average.z, 2))
		if (!arenas[i].loadedIn) {
			//console.log(distance)
			if (distance < (inWidth * grassSectionSize) + arenas[i].radius) {
				arenas[i].loadIn()
			}
			
		} else {
			if (distance > (inWidth * grassSectionSize) + arenas[i].radius) {
				arenas[i].loadOut()
			}
		}
	}

	for (let i = 0; i < bouncePads.length; i++) {
		let distance = Math.sqrt(Math.pow(bouncePads[i].x + (bouncePads[i].xWidth/2) - average.x , 2) + Math.pow(bouncePads[i].z + (bouncePads[i].zLength/2) - average.z, 2))
		if (!bouncePads[i].loadedIn) {
			//console.log(distance)
			if (distance < (inWidth * grassSectionSize)) {
				bouncePads[i].loadIn()
				console.log("loaded in bouncePad")
			}
			
		} else {
			if (distance > (inWidth * grassSectionSize)) {
				bouncePads[i].loadOut()
				console.log("loaded out bouncePad")
			}
		}
	}

	
	for (let i = 0; i < platforms.length; i++) {
		let distance = Math.sqrt(Math.pow(platforms[i].x + (platforms[i].xWidth/2) - average.x , 2) + Math.pow(platforms[i].z + (platforms[i].zLength/2) - average.z, 2))
		if (!platforms[i].loadedIn) {
			//console.log(distance)
			if (distance < (inWidth * grassSectionSize)) {
				platforms[i].loadIn()
				console.log("loaded in platform")
			}
			
		} else {
			if (distance > (inWidth * grassSectionSize)) {
				platforms[i].loadOut()
				console.log("loaded out platform")
			}
		}
	}

	for (let i = currentRespawnPoint+1; i < respawnPoints.length; i++) {
		let current = respawnPoints[i]
		let distance = Math.sqrt(Math.pow(current.x - average.x, 2) + Math.pow(current.z - average.z, 2))

		if (distance < 500) {
			currentRespawnPoint = i
			console.log(currentRespawnPoint)

		}
		
	}

	for (let i = 0; i < respawnPoints.length; i++) {
		if (respawnPoints[i].loadedIn) respawnPoints[i].run()
	}

	
	
	let grassXInStart = grassX - inWidth
	if (grassXInStart < 0) grassXInStart = 0
	let grassXInEnd = grassX + inWidth
	if (grassXInStart >= grassSections.length) grassXInStart = grassSections.length - 1

	let grassZInStart = grassZ - inWidth
	if (grassZInStart < 0) grassZInStart = 0
	let grassZInEnd = grassZ + inWidth
	if (grassZInStart >= grassSections[0].length) grassZInStart = grassSections[0].length - 1

	
	for (let i = grassXInStart; i <= grassXInEnd; i++) {
		for (let j = grassZInStart; j <= grassZInEnd; j++) {
			grassSections[i][j].loadedInTemp = true
			grassSections[i][j].wind()
		}
	}


	
	for (let i = 0; i < grassSectionNumber; i++) {
		for (let j = 0; j < grassSectionNumber; j++) {
			if (grassSections[i][j].loadedInTemp != grassSections[i][j].loadedIn) {
				
				if (grassSections[i][j].loadedIn) {
					grassSections[i][j].loadOut()
				}
				else {
					grassSections[i][j].loadIn()
				}
			}

		}
	}

	let floorSize = grassSectionSize * inWidth + 10000

	changePoint(floorPoint1, average.x - floorSize, 0, average.z - floorSize)
	changePoint(floorPoint2, average.x + floorSize, 0, average.z - floorSize)
	changePoint(floorPoint3, average.x + floorSize, 0, average.z + floorSize)
	changePoint(floorPoint4, average.x - floorSize, 0, average.z + floorSize)
	changePoint(floorPointCenter, average.x, 0, average.z)

	
	for (let i = grassX - 3; i <= grassX + 3; i++) {
		for (let j = grassZ - 3; j <= grassZ + 3; j++) {
			if (i >= 0 && i < grassSections.length && j >= 0 && j < grassSections[i].length)
				if (!grassSections[i][j].loadedIn) grassSections[i][j].loadIn()
				grassSections[i][j].rustle()
		}
	}
	
	/*
	if (average.x > 0) {
		if (average.z > 0) {
			let grassX = Math.round(average.x / grassSectionSize)
			let grassZ = Math.round(average.z / grassSectionSize)
			grassSections1[][].rustle()
		} else {
			let grassX = Math.round(average.x / grassSectionSize)
			let grassZ = Math.round(-average.z / grassSectionSize)
			grassSections2[][].rustle()
		}
	} else {
		if (average.z > 0) {
			let grassX = Math.round(-average.x / grassSectionSize)
			let grassZ = Math.round(average.z / grassSectionSize)
			grassSections3[][].rustle()
		} else {
			let grassX = Math.round(-average.x / grassSectionSize)
			let grassZ = Math.round(-average.z / grassSectionSize)
			grassSections4[][].rustle()
		}
	}
	*/
	
	//monster.run()

	//for (let i = 0; i < monsters.length; i++) {
		//monsters[i].run()
	//}

	cameraDistanceChange /= 1.5
	cameraDistance *= 1 + cameraDistanceChange
	

	let frameRateTotal = 0

	for (let i = lastFrameRates.length - 1; i > 0; i--) {
		lastFrameRates[i] = lastFrameRates[i-1]
		if (!isNaN(lastFrameRates[i])) frameRateTotal += lastFrameRates[i]
	} lastFrameRates[0] = 1000 / deltaTime
		if (!isNaN(lastFrameRates[0])) frameRateTotal += lastFrameRates[0]


	rollingFrameRate = frameRateTotal / lastFrameRates.length

	if (frameCounter % 20 == 0) displayFrameRate = Math.round(rollingFrameRate)

	document.getElementById("info").innerHTML = (
		//Math.round(1000 / deltaTime) + 
		displayFrameRate + 
		"<br>x: " + Math.round(average.x) + 
		"<br>y: " + Math.round(average.y) + 
		"<br>z: " + Math.round(average.z) + 
		"<br>Points: " + points.length / 3 + 
		"<br>Polys: " + polys.length / 3
	)
	

	// make matrices

	let rollingAverageY = 0
	for (let i = 0; i < lastAverages.length; i++) {
		rollingAverageY += lastAverages[i].y
	} rollingAverageY /= lastAverages.length
	
	var tMatrix = mat4.create();

	mat4.translate(tMatrix, tMatrix, [0, 0, -cameraDistance])
  mat4.rotateX(tMatrix, tMatrix, angleX);
  mat4.rotateY(tMatrix, tMatrix, angleY);
	mat4.translate(tMatrix, tMatrix, [-average.x, -rollingAverageY, -average.z]);

	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");
  gl.uniformMatrix4fv(tMatrixLocation, false, tMatrix);

  

	
	var pMatrix = mat4.create();

	let fov = Math.PI / 2;
	let aspect = canvas.width / canvas.height;
	let near = .1;
	let far = 100000

  mat4.perspective(pMatrix, fov, aspect, near, far);
	
  var pMatrixLocation = gl.getUniformLocation(program, "pMatrix");
  gl.uniformMatrix4fv(pMatrixLocation, false, pMatrix);



	
	for (let i = lastAverages.length - 1; i > 0; i--) {
		lastAverages[i] = lastAverages[i-1]
	} lastAverages[0] = average

	lastVelocityX = velocityX;
	lastVelocityY = velocityY;
	lastVelocityZ = velocityZ;



	// omit deleted points from final point array
	// also maybe delete any points that are outside of inWidth

	let finalPoints = []
	let finalPolys = []

	for (let i = 0; i < polys.length; i++) {
		finalPolys.push(polys[i])
	}

	for (let i = 0; i < openPolys.length; i++) {
		//finalPolys.splice(openPolys[i] * 3, 3)
	}

	//finalPolys.splice(1*3, 3)


	openPoints.sort(function (a, b){return a - b})

	// openPoints = [5, 6, 7, 10, 12]

	for (let i = 0; i < openPoints; i++) {
		

		for (let j = 0; j < polys.length / 3; j++) {
			
		}
	}
	
	// use final point array (NEEDS SWITCHING)
	
	// calculate lighting

	let shadedColors = []

	for (let i = 0; i < playerPoints; i++) {
		let yDistFromAverage = (point(i, Y) - average.y + 10) / 200
		shadedColors.push(pointColors[i*4 + 0] + yDistFromAverage / 2,
											pointColors[i*4 + 1] + yDistFromAverage,
											pointColors[i*4 + 2] + yDistFromAverage,
											1)
	}
	
	for (let i = playerPoints; i < pointColors.length / 4; i++) {
		let pointX = point(i, X) - average.x
		let pointZ = point(i, Z) - average.z
		let distanceSquared = pointX * pointX + pointZ * pointZ

		
		let distToDarken = 600
		distToDarken = distToDarken * distToDarken
		
		let minDistSquared = inWidth * grassSectionSize * inWidth * grassSectionSize - distToDarken


		let darken = 1

		if (distanceSquared > minDistSquared && i != floorPoint1 && i != floorPoint2 && i != floorPoint3 && i != floorPoint4) {
			let darkenDistance = distanceSquared - minDistSquared

			darken = (distToDarken - darkenDistance) / distToDarken

			
			if (distanceSquared > (minDistSquared + distToDarken)) {
				darken = 0
			}

			
		shadedColors.push(pointColors[i*4 + 0] * darken,
											lerp(.25, pointColors[i*4 + 1], darken),
											pointColors[i*4 + 2] * darken,
											1)
			
		} else {
			
			shadedColors.push(pointColors[i*4 + 0],
												pointColors[i*4 + 1],
												pointColors[i*4 + 2],
												1)
		}



		
	}

	

	

  gl.bindBuffer(gl.ARRAY_BUFFER, pointColorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shadedColors), gl.DYNAMIC_DRAW);

  var colorAttribLocation = gl.getAttribLocation(program, "aVertColor");
  gl.vertexAttribPointer(colorAttribLocation, pointColorsSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttribLocation);



	// set points to buffer

	gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.DYNAMIC_DRAW);
	
	// tell points location in vertex shader
	
	var posAttribLocation = gl.getAttribLocation(program, "vertPosition");
	gl.vertexAttribPointer(posAttribLocation, pointsSize, gl.FLOAT, false, pointsSize * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(posAttribLocation);
	

	// set polys to buffer
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polysBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(finalPolys), gl.STATIC_DRAW);


	gl.useProgram(program);



	// draw


  gl.clearColor(0, .25, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, polys.length, gl.UNSIGNED_SHORT, 0);


	if (running) requestAnimationFrame(refresh)
}