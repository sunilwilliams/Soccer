class Platform {
	constructor(x, y, z, xWidth, height, zLength) {
		this.x = x
		this.y = y
		this.z = z
		this.xWidth = xWidth
		this.height = height
		this.zLength = zLength

		this.polys = []
		this.points = []

		//this.makePolys()

		this.loadedIn = false
		
	}


	makePolys() {
		for (let a = 0; a < 2; a++) {
			this.points[a] = []
			for (let b = 0; b < 2; b++) {
				this.points[a][b] = []
				for (let c = 0; c < 2; c++) {
					let R = Math.random()
					let G = Math.random()
					let B = Math.random()
					this.points[a][b][c] = addPoint(this.x + (a * this.xWidth), 
																					this.y + (b * this.height), 
																					this.z + (c * this.zLength),
																				 	R,
																				 	G,
																				 	B)
				}
			}
		}

		this.polys.push(addPoly(this.points[0][0][0], this.points[0][0][1], this.points[0][1][1]))
		this.polys.push(addPoly(this.points[0][1][1], this.points[0][1][0], this.points[0][0][0]))
		this.polys.push(addPoly(this.points[1][0][0], this.points[1][0][1], this.points[1][1][1]))
		this.polys.push(addPoly(this.points[1][1][1], this.points[1][1][0], this.points[1][0][0]))
		
		this.polys.push(addPoly(this.points[0][0][0], this.points[0][0][1], this.points[1][0][1]))
		this.polys.push(addPoly(this.points[1][0][1], this.points[1][0][0], this.points[0][0][0]))
		this.polys.push(addPoly(this.points[0][1][0], this.points[0][1][1], this.points[1][1][1]))
		this.polys.push(addPoly(this.points[1][1][1], this.points[1][1][0], this.points[0][1][0]))
		
		this.polys.push(addPoly(this.points[0][0][0], this.points[0][1][0], this.points[1][1][0]))
		this.polys.push(addPoly(this.points[1][1][0], this.points[1][0][0], this.points[0][0][0]))
		this.polys.push(addPoly(this.points[0][0][1], this.points[0][1][1], this.points[1][1][1]))
		this.polys.push(addPoly(this.points[1][1][1], this.points[1][0][1], this.points[0][0][1]))


		
		this.nextPlatform
		
	}


	loadIn() {
		if (!this.loadedIn) {
			this.loadedIn = true
			this.makePolys()
		}
	}

	loadOut() {
		if (this.loadedIn) {
			this.loadedIn = false
			for (let i = 0; i < this.polys.length; i++) {
				deletePoly(this.polys[i])
			} this.polys = []

			for (let i = 0; i < this.points.length; i++) {
				for (let j = 0; j < this.points[i].length; j++) {
					for (let k = 0; k < this.points[i][j].length; k++) {
						deletePoint(this.points[i][j][k])
					}
				}
			} this.points = []
		}
	}
	
	

	run() {
		this.collision()
	}


	collision() {


		let x = this.x
		let y = this.y
		let z = this.z

		let farX = this.x + this.xWidth
		let farY = this.y + this.height
		let farZ = this.z + this.zLength


		
		for (let i = 0; i < playerPoints; i++) {

			// top Y
			
			let intersectsTop = this.inPlatformXZ(
				xOfY[i].slope * farY + xOfY[i].intercept, 
				zOfY[i].slope * farY + zOfY[i].intercept)

			if (intersectsTop && inRange(farY, point(i, Y), lastPoints[i][Y])) {
				movePlayer(0, farY - point(i, Y) + 1, 0)
				velocityY = 0
				onGround = true
			}

			// bottom Y
			let intersectsBottom = this.inPlatformXZ(
				xOfY[i].slope * y + xOfY[i].intercept, 
				zOfY[i].slope * y + zOfY[i].intercept)

			if (intersectsBottom && inRange(y, point(i, Y), lastPoints[i][Y])) {
				movePlayer(0, y - point(i, Y) - 1, 0)
				velocityY = 0
			}


			// low X zOfX and yOfX

			let intersectsLowX = (inRange(zOfX[i].slope * x + zOfX[i].intercept, z, farZ) && 
														inRange(yOfX[i].slope * x + yOfX[i].intercept, y, farY))

			if (intersectsLowX && inRange(x, point(i, X), lastPoints[i][X])) {
				movePlayer(x - point(i, X) - 1, 0, 0)
				velocityX = 0
			}

			// high X

			let intersectsHighX = (inRange(zOfX[i].slope * farX + zOfX[i].intercept, z, farZ) && 
														 inRange(yOfX[i].slope * farX + yOfX[i].intercept, y, farY))

			if (intersectsHighX && inRange(farX, point(i, X), lastPoints[i][X])) {
				movePlayer(farX - point(i, X) + 1, 0, 0)
				velocityX = 0
			}


			// low Z xOfZ and yOfZ

			let intersectsLowZ = (inRange(xOfZ[i].slope * z + xOfZ[i].intercept, x, farX) &&
														inRange(yOfZ[i].slope * z + yOfZ[i].intercept, y, farY))

			if (intersectsLowZ && inRange(z, point(i, Z), lastPoints[i][Z])) {
				movePlayer(0, 0, z - point(i, Z) - 1)
				velocityZ = 0
			}

			// high Z

			let intersectsHighZ = (inRange(xOfZ[i].slope * farZ + xOfZ[i].intercept, x, farX) &&
														 inRange(yOfZ[i].slope * farZ + yOfZ[i].intercept, y, farY))

			if (intersectsHighZ && inRange(farZ, point(i, Z), lastPoints[i][Z])) {
				movePlayer(0, 0, farZ - point(i, Z) + 1)
				velocityZ = 0
			}

			
		}
		
		
		
	}
	

	inPlatformXZ(x, z) {
		return (inRange(x, this.x, this.x + this.xWidth) && 
						inRange(z, this.z, this.z + this.zLength))
	}
	
	
}


class BouncePad {

// make player bounce when hit and indent and ripple on impact
	// don't indent, jusst wave of color

	constructor(x, y, z, xWidth, yHeight, zLength) {
		this.x = x
		this.y = y
		this.z = z

		this.xWidth = xWidth
		this.yHeight = yHeight
		this.zLength = zLength

		this.farX = x + xWidth
		this.farY = y + yHeight
		this.farZ = z + zLength

		let precision = Math.round(Math.sqrt(xWidth * zLength) / 30 * detailLevel)
		this.precision = precision
		
		this.topPoints = []
		this.bottomPoints = []

		this.polys = []

		//this.makePolys()

		
		this.waveStartFrame = 0
		this.hitX = 0
		this.hitY = 0
		this.hitZ = 0

		
		this.nextPlatform

		this.loadedIn = false

		
	}

	makePolys() {
		let precision = this.precision

		for (let i = 0; i <= precision; i++) {
			this.topPoints[i] = []
			this.bottomPoints[i] = []
			for (let j = 0; j <= precision; j++) {
				this.topPoints[i][j] = {
					point: 0,
					x: 0,
					y: 0,
					z: 0,
					r: 0,
					g: 0,
					b: 0,
					waveStartFrame: 0,
					
				}
				this.bottomPoints[i][j] = {
					point: 0,
					x: 0,
					y: 0,
					z: 0,
					r: 0,
					g: 0,
					b: 0,
					waveStartFrame: 0,
					
				}
			}
		}

		let xChange = (this.farX - this.x) / precision
		let zChange = (this.farZ - this.z) / precision

		for (let i = 0; i <= precision; i++) {
			for (let j = 0; j <= precision; j++) {
				this.topPoints[i][j].r = i * (1 / precision)
				this.topPoints[i][j].g = 0
				this.topPoints[i][j].b = j * (1 / precision)
			
				this.topPoints[i][j].point = addPoint(this.x + i * xChange, this.farY, this.z + j * zChange, this.topPoints[i][j].r, this.topPoints[i][j].g, this.topPoints[i][j].b)
				this.topPoints[i][j].x = this.x + i * xChange
				this.topPoints[i][j].y = this.farY
				this.topPoints[i][j].z = this.z + j * zChange
				
				this.bottomPoints[i][j].r = j * (1 / precision)
				this.bottomPoints[i][j].g = i * (1 / precision)
				this.bottomPoints[i][j].b = 0
				
				this.bottomPoints[i][j].point = addPoint(this.x + i * xChange, this.y, this.z + j * zChange, this.bottomPoints[i][j].r, this.bottomPoints[i][j].g, this.bottomPoints[i][j].b)
				this.bottomPoints[i][j].x = this.x + i * xChange
				this.bottomPoints[i][j].y = this.y
				this.bottomPoints[i][j].z = this.z + j * zChange
				
				if (i > 0 && j > 0) {
					this.polys.push(addPoly(this.topPoints[i][j].point, this.topPoints[i-1][j].point, this.topPoints[i-1][j-1].point))
					this.polys.push(addPoly(this.topPoints[i-1][j-1].point, this.topPoints[i][j-1].point, this.topPoints[i][j].point))
					
					this.polys.push(addPoly(this.bottomPoints[i][j].point, this.bottomPoints[i-1][j].point, this.bottomPoints[i-1][j-1].point))
					this.polys.push(addPoly(this.bottomPoints[i-1][j-1].point, this.bottomPoints[i][j-1].point, this.bottomPoints[i][j].point))
				

				
				}

				
			
			}
		}

		for (let i = 1; i <= precision; i++) {
					
			this.polys.push(addPoly(this.topPoints[i][0].point, this.topPoints[i-1][0].point, this.bottomPoints[i-1][0].point))
			this.polys.push(addPoly(this.bottomPoints[i-1][0].point, this.bottomPoints[i][0].point, this.topPoints[i][0].point))

			this.polys.push(addPoly(this.topPoints[i][precision].point, this.topPoints[i-1][precision].point, this.bottomPoints[i-1][precision].point))
			this.polys.push(addPoly(this.bottomPoints[i-1][precision].point, this.bottomPoints[i][precision].point, this.topPoints[i][precision].point))


			this.polys.push(addPoly(this.topPoints[0][i].point, this.topPoints[0][i-1].point, this.bottomPoints[0][i-1].point))
			this.polys.push(addPoly(this.bottomPoints[0][i-1].point, this.bottomPoints[0][i].point, this.topPoints[0][i].point))
		
			this.polys.push(addPoly(this.topPoints[precision][i].point, this.topPoints[precision][i-1].point, this.bottomPoints[precision][i-1].point))
			this.polys.push(addPoly(this.bottomPoints[precision][i-1].point, this.bottomPoints[precision][i].point, this.topPoints[precision][i].point))

				
		}
	}


	loadIn() {
		if (!this.loadedIn) {
			this.loadedIn = true
			this.makePolys()
		}
	}

	loadOut() {
		if (this.loadedIn) {
			this.loadedIn = false

			this.waveStartFrame = 0

			for (let i = 0; i < this.polys.length; i++) {
				deletePoly(this.polys[i])
			} this.polys = []

			for (let i = 0; i < this.topPoints.length; i++) {
				for (let j = 0; j < this.topPoints[i].length; j++) {
					deletePoint(this.topPoints[i][j].point)
				}
			} this.topPoints = []

			
			for (let i = 0; i < this.bottomPoints.length; i++) {
				for (let j = 0; j < this.bottomPoints[i].length; j++) {
					deletePoint(this.bottomPoints[i][j].point)
				}
			} this.bottomPoints = []

			
		}
	}
	
	run() {
		this.collision()


		if (this.waveStartFrame != 0) {
			let waveAmplitude = 75

			for (let i = 0; i <= this.precision; i++) {
				for (let j = 0; j <= this.precision; j++) {
					{
						let currentPoint = this.topPoints[i][j]
						// calculate distance of point to the hit point
						let distance = Math.sqrt(Math.pow(this.hitX - currentPoint.x, 2) + Math.pow(this.hitY - currentPoint.y, 2) + Math.pow(this.hitZ - currentPoint.z, 2))
	
	
						let waveFrame = (frameCounter - this.waveStartFrame - (distance / 10)) / 10 + 3
	
						let waveAmount = 0
						if (waveFrame >= 1) waveAmount = waveAmplitude * Math.sin(Math.PI * (waveFrame)) / (Math.pow(waveFrame, 1.5))
						
						changePoint(currentPoint.point, currentPoint.x, currentPoint.y + waveAmount, currentPoint.z)
						
						changePointColor(currentPoint.point, currentPoint.r, currentPoint.g + (1 * waveAmount / waveAmplitude), currentPoint.b)
					}

					
					{
						let currentPoint = this.bottomPoints[i][j]
						// calculate distance of point to the hit point
						let distance = Math.sqrt(Math.pow(this.hitX - currentPoint.x, 2) + Math.pow(this.hitY - currentPoint.y, 2) + Math.pow(this.hitZ - currentPoint.z, 2))
	
	
						let waveFrame = (frameCounter - this.waveStartFrame - (distance / 10)) / 10 + 1
	
						let waveAmount = 0
						if (waveFrame >= 1) waveAmount = waveAmplitude * Math.sin(Math.PI * (waveFrame)) / (Math.pow(waveFrame, 1.5))
						
						changePoint(currentPoint.point, currentPoint.x, currentPoint.y + waveAmount, currentPoint.z)
						
						changePointColor(currentPoint.point, currentPoint.r, currentPoint.g + (1 * waveAmount / waveAmplitude), currentPoint.b)
					}
				}
			}
			
		}
		
	}

	collision() {


		let x = this.x
		let y = this.y
		let z = this.z

		let farX = this.x + this.xWidth
		let farY = this.y + this.yHeight
		let farZ = this.z + this.zLength



		
		for (let i = 0; i < playerPoints; i++) {

			// top Y
			
			let intersectsTop = this.inPlatformXZ(
				xOfY[i].slope * farY + xOfY[i].intercept, 
				zOfY[i].slope * farY + zOfY[i].intercept)

			if (intersectsTop && inRange(farY, point(i, Y), lastPoints[i][Y])) {
				movePlayer(0, farY - point(i, Y) + 1, 0)
				velocityY = 30

				this.waveStartFrame = frameCounter
				this.hitX = point(i, X)
				this.hitY = point(i, Y)
				this.hitZ = point(i, Z)
			}

			// bottom Y
			let intersectsBottom = this.inPlatformXZ(
				xOfY[i].slope * y + xOfY[i].intercept, 
				zOfY[i].slope * y + zOfY[i].intercept)

			if (intersectsBottom && inRange(y, point(i, Y), lastPoints[i][Y])) {
				movePlayer(0, y - point(i, Y) - 1, 0)
				velocityY = 0
			}

			// low X zOfX and yOfX
			let intersectsLowX = (inRange(zOfX[i].slope * x + zOfX[i].intercept, z, farZ) && 
														inRange(yOfX[i].slope * x + yOfX[i].intercept, y, farY))

			if (intersectsLowX && inRange(x, point(i, X), lastPoints[i][X])) {
				movePlayer(x - point(i, X) - 1, 0, 0)
				velocityX = 0
			}

			// high X
			let intersectsHighX = (inRange(zOfX[i].slope * farX + zOfX[i].intercept, z, farZ) && 
														 inRange(yOfX[i].slope * farX + yOfX[i].intercept, y, farY))

			if (intersectsHighX && inRange(farX, point(i, X), lastPoints[i][X])) {
				movePlayer(farX - point(i, X) + 1, 0, 0)
				velocityX = 0
			}


			// low Z xOfZ and yOfZ
			let intersectsLowZ = (inRange(xOfZ[i].slope * z + xOfZ[i].intercept, x, farX) &&
														inRange(yOfZ[i].slope * z + yOfZ[i].intercept, y, farY))

			if (intersectsLowZ && inRange(z, point(i, Z), lastPoints[i][Z])) {
				movePlayer(0, 0, z - point(i, Z) - 1)
				velocityZ = 0
			}

			// high Z
			let intersectsHighZ = (inRange(xOfZ[i].slope * farZ + xOfZ[i].intercept, x, farX) &&
														 inRange(yOfZ[i].slope * farZ + yOfZ[i].intercept, y, farY))

			if (intersectsHighZ && inRange(farZ, point(i, Z), lastPoints[i][Z])) {
				movePlayer(0, 0, farZ - point(i, Z) + 1)
				velocityZ = 0
			}

		}
		
	}
	

	inPlatformXZ(x, z) {
		return (inRange(x, this.x, this.x + this.xWidth) && 
						inRange(z, this.z, this.z + this.zLength))
	}

	
}








class Arena {
	// cicular platform with walls and grass
	// when you hit a side of it the wall jiggles in retaliation and you bounce back
	// white trim around outside
	
	
	constructor(x, y, z, radius) {
		this.x = x
		this.y = y
		this.z = z
		this.radius = radius

		this.r = 0
		this.g = .25
		this.b = 0

		this.thickness = 20

		this.precision = Math.round(24 * detailLevel)
		
		this.wallPrecision = Math.round(23 * detailLevel)

		this.trimHeight = 20
		this.wallHeight = 500

		this.points = []
		this.polys = []
		
		this.trimPoints = [[], []] // index 0 = inside, index 1 = outside
		this.trimPolys = []
		
		//this.makePolys()

		this.loadedIn = false

		this.blades = []

		
		this.active = true
		
		this.inArena = false
		this.animationTime = 100
		this.wallsUpEndFrame = 0

		this.wallsDownEndFrame = 0


		this.hitX
		this.hitY
		this.hitZ

		this.waveStartFrame = 0


		this.enemy
		this.enemySpawned = false


		this.nextPlatform
		
		
	}

	loadIn() {
		if (!this.loadedIn) {
			this.loadedIn = true

			this.makePolys()
			
			for (let i = 0; i < .002 * this.radius * this.radius * detailLevel * detailLevel; i++) {
				let offsetX = (Math.random() - .5) * 2 * this.radius
				let offsetZ = (Math.random() - .5) * 2 * this.radius
				while (offsetX*offsetX + offsetZ*offsetZ > this.radius*this.radius) {
					offsetX = (Math.random() - .5) * 2 * this.radius
					offsetZ = (Math.random() - .5) * 2 * this.radius
				}
				this.blades.push(new Grass(this.x + offsetX, this.y, this.z + offsetZ, (Math.random() + .5) * 100))
			}
			
		}

	}

	loadOut() {
		if (this.loadedIn) {
			this.loadedIn = false

			
			for (let i = 0; i < this.polys.length; i++) {
				deletePoly(this.polys[i])
			} this.polys = []

			for (let i = 0; i < this.points.length; i++) {
				deletePoint(this.points[i])
			} this.points = []


			for (let i = 0; i < this.trimPolys.length; i++) {
				deletePoly(this.trimPolys[i])
			} this.trimPolys = []

			for (let i = 0; i < this.trimPoints; i++) {
				for (let j = 0; j < this.trimPoints[i].length; j++) {
					for (let k = 0; k < this.trimPoints[i][j].length; k++) {
						deletePoint(this.trimPoints[i][j][k].point)
					}
				}
			} this.trimPoints = [[], []]
			
			
			for (let i = 0; i < this.blades.length; i++) {
				this.blades[i].deletePoly()
			}
	
			this.blades = []

		}
	}

	// could make rings

	// first just make trim with three wall points (below, ground-leve, above)
	// when armed, remake wall points 3 up

	makePolys() {
		this.centerPoint = addPoint(this.x, this.y, this.z, this.r, this.g, this.b)

			for (let j = 0; j < this.precision; j++) {
				let angle = 2 * Math.PI / this.precision * j
				this.points[j] = addPoint(
					this.x + (this.radius * Math.sin(angle)),
					this.y,
					this.z + (this.radius * Math.cos(angle)),
					this.r, this.g, this.b
				)
			}

		
		for (let j = 1; j < this.precision; j++) {
			this.polys.push(addPoly(this.points[j], this.points[j-1], this.centerPoint))
		}
		this.polys.push(addPoly(this.points[0], this.points[this.precision - 1], this.centerPoint))
	

		// make trim
		// rises up when player enters arena
		// bounces with rainbow when player hits sides



		// first one is bottom one (index 0)
		// second one is at circle level

		let insideRadius = this.radius
		let wallThickness = 20

		for (let i = 0; i < 2; i++) {
			let currentRadius = this.radius + (i * wallThickness)
			for (let j = 0; j < this.precision; j++) {
				this.trimPoints[i][j] = []
				let angle = 2 * Math.PI / this.precision * j

				for (let k = 0; k < 3; k++) {
					let x = this.x + (currentRadius * Math.sin(angle))
					let y
					if (k == 0) y = this.y - this.trimHeight
					else if (k == 1) y = this.y
					//else y = this.y + (k - 1) * (this.trimHeight / (this.wallPrecision - 2))
					else y = this.y + this.trimHeight
					let z = this.z + (currentRadius * Math.cos(angle))

					let r
					let g
					let b
					if (k < 3) {
						r = 1
						g = 1
						b = 1
					} else {
						r = lerp(1, 0, (y - this.y) / this.trimHeight)
						g = lerp(1, .25, (y - this.y) / this.trimHeight)
						b = lerp(1, 0, (y - this.y) / this.trimHeight)
					}

					r = 1
					g = 1
					b = 1

					this.trimPoints[i][j][k] = {
						point: addPoint(x, y, z, r, g, b),
						x: x,
						y: y,
						z: z,
						r: r,
						g: g,
						b: b
					}

				}
			}
		}

		
		for (let i = 0; i < 2; i++) {
			for (let j = 1; j < this.precision; j++) {
				for (let k = 1; k < 3; k++) {
					this.trimPolys.push(addPoly(this.trimPoints[i][j][k].point, this.trimPoints[i][j-1][k].point, this.trimPoints[i][j-1][k-1].point))
					this.trimPolys.push(addPoly(this.trimPoints[i][j-1][k-1].point, this.trimPoints[i][j][k-1].point, this.trimPoints[i][j][k].point))
				}
			}
			
		}

		for (let i = 0; i < 2; i++) {
			for (let k = 1; k < 3; k++) {
				this.trimPolys.push(addPoly(this.trimPoints[i][0][k].point, this.trimPoints[i][this.precision-1][k].point, this.trimPoints[i][this.precision-1][k-1].point))
				this.trimPolys.push(addPoly(this.trimPoints[i][this.precision-1][k-1].point, this.trimPoints[i][0][k-1].point, this.trimPoints[i][0][k].point))
			}
		}

		for (let k = 1; k < 3; k++) {
			for (let j = 1; j < this.precision; j++) {
				this.trimPolys.push(addPoly(this.trimPoints[1][j][0].point, this.trimPoints[0][j][0].point, this.trimPoints[0][j-1][0].point))
				this.trimPolys.push(addPoly(this.trimPoints[0][j-1][0].point, this.trimPoints[1][j-1][0].point, this.trimPoints[1][j][0].point))
				
				this.trimPolys.push(addPoly(this.trimPoints[1][j][2].point, this.trimPoints[0][j][2].point, this.trimPoints[0][j-1][2].point))
				this.trimPolys.push(addPoly(this.trimPoints[0][j-1][2].point, this.trimPoints[1][j-1][2].point, this.trimPoints[1][j][2].point))
			}
			
			this.trimPolys.push(addPoly(this.trimPoints[1][0][0].point, this.trimPoints[0][0][0].point, this.trimPoints[0][this.precision-1][0].point))
			this.trimPolys.push(addPoly(this.trimPoints[0][this.precision-1][0].point, this.trimPoints[1][this.precision-1][0].point, this.trimPoints[1][0][0].point))
			
			this.trimPolys.push(addPoly(this.trimPoints[1][0][2].point, this.trimPoints[0][0][2].point, this.trimPoints[0][this.precision-1][2].point))
			this.trimPolys.push(addPoly(this.trimPoints[0][this.precision-1][2].point, this.trimPoints[1][this.precision-1][2].point, this.trimPoints[1][0][2].point))
		}
		
		

		console.log("made arena polys")
		/*
		for (let j = 1; j < this.points[0].length; j++) {
			this.polys.push(addPoly(this.points[1][j], this.points[1][j-1], this.points[0][j-1]))
			this.polys.push(addPoly(this.points[0][j-1], this.points[0][j], this.points[1][j]))
		}
		this.polys.push(addPoly(this.points[1][0], this.points[1][precision-1], this.points[0][precision-1]))
		this.polys.push(addPoly(this.points[0][precision-1], this.points[0][0], this.points[1][0]))
		*/

	}

	run() {
		this.collision() // PROBLEM WITH BOTTOM COLLISION MUST FIX

		for (let i = 0; i < this.blades.length; i++) {
			this.blades[i].wave()
			this.blades[i].smush()
		}

		if (this.enemySpawned && this.enemy.stillRunning) this.enemy.run()

		if (this.inArena) {

			let enemyDistFromCenter = Math.sqrt(Math.pow(this.x - this.enemy.x, 2) + Math.pow(this.z - this.enemy.z, 2))

			if (enemyDistFromCenter > this.radius - this.enemy.size) {
				this.hitX = this.enemy.x
				this.hitY = this.enemy.y
				this.hitZ = this.enemy.z

				this.waveStartFrame = frameCounter
				
				let distX = this.enemy.x - this.x
				let distZ = this.enemy.z - this.z

				let distTotal = Math.abs(distX) + Math.abs(distZ)

				if (this.enemy.currentMove == 0 || this.enemy.currentMove == 1) { // if recovering or recoiling
					this.enemy.recoilVelocityX = -(distX / distTotal) * 20
					this.enemy.recoilVelocityZ = -(distZ / distTotal) * 20

					this.enemy.chargeVelocityX = 0
					this.enemy.chargeVelocityZ = 0
				}
				
				if (this.enemy.currentMove == 2) { // if charging
					this.enemy.chargeVelocityX = -(distX / distTotal) * 20
					this.enemy.chargeVelocityZ = -(distZ / distTotal) * 20

					this.enemy.recoilVelocityX = 0
					this.enemy.recoilVelocityZ = 0
				}
			}

			if (!this.enemy.alive) {
				this.disarmArena()
			}
		}


		if (frameCounter < this.wallsUpEndFrame) {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < this.precision; j++) {
					for (let k = 2; k < this.wallPrecision; k++) {
						let pointHeight = (k - 1) * (this.wallHeight / (this.wallPrecision - 2))

						let newY = lerp(this.y + pointHeight, point(this.trimPoints[i][j][k].point, Y), (this.wallsUpEndFrame - frameCounter) / this.animationTime)
						
						changePoint(this.trimPoints[i][j][k].point,
												point(this.trimPoints[i][j][k].point, X),
												newY,
												point(this.trimPoints[i][j][k].point, Z))

						this.trimPoints[i][j][k].y = newY
						
					}
				}
			}
		}

		if (frameCounter < this.wallsDownEndFrame) {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < this.precision; j++) {
					for (let k = 2; k < this.wallPrecision; k++) {
						let pointHeight = (k - 1) * (this.trimHeight / (this.wallPrecision - 2))

						let newY = lerp(this.y + pointHeight, point(this.trimPoints[i][j][k].point, Y), (this.wallsDownEndFrame - frameCounter) / this.animationTime)
						
						changePoint(this.trimPoints[i][j][k].point,
												point(this.trimPoints[i][j][k].point, X),
												newY,
												point(this.trimPoints[i][j][k].point, Z))

						this.trimPoints[i][j][k].y = newY
						
					}
				}
			}
		}

		if (frameCounter == this.wallsDownEndFrame) {
			for (let i = 0; i < this.trimPolys.length; i++) {
				deletePoly(this.trimPolys[i])
			} this.trimPolys = []

			for (let i = 0; i < this.trimPoints.length; i++) {
				for (let j = 0; j < this.trimPoints[i].length; j++) {
					for (let k = 0; k < this.trimPoints[i][j].length; k++) {
						deletePoint(this.trimPoints[i][j][k].point)
					}
				}
			}

			this.makePolys()
			console.log("walls down")
		}

		let waveAmplitude = 200


		if (this.waveStartFrame != 0 && (this.wallsDownEndFrame == 0 || frameCounter < this.wallsDownEndFrame)) {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < this.precision; j++) {
					for (let k = 0; k < this.wallPrecision; k++) {

						let currentPoint = this.trimPoints[i][j][k]

						// calculate distance of point to the hit point
						let distance = Math.sqrt(Math.pow(this.hitX - currentPoint.x, 2) + Math.pow(this.hitY - currentPoint.y, 2) + Math.pow(this.hitZ - currentPoint.z, 2))
	
	
						let waveFrame = (frameCounter - this.waveStartFrame - (distance / 50)) / 10 + 3
	
						let waveAmount = 0
						if (waveFrame >= 1) waveAmount = waveAmplitude * Math.sin(Math.PI * (waveFrame)) / (Math.pow(waveFrame, 1.5))

						//waveAmount *= k / this.wallPrecision
						
						let distX = Math.pow(currentPoint.x - this.x, 2)
						let distZ = Math.pow(currentPoint.z - this.z, 2)
						
						let moveX = (distX / (distX + distZ)) * waveAmount
						let moveZ = (distZ / (distX + distZ)) * waveAmount
						
						changePoint(currentPoint.point, currentPoint.x + moveX, currentPoint.y, currentPoint.z + moveZ)

						let colorChange = (2.5 * waveAmount / waveAmplitude)
						
						changePointColor(currentPoint.point, currentPoint.r, currentPoint.g - colorChange, currentPoint.b - colorChange)
					}
				}
			}
						
		}
		

	}


	collision() {
		let y = this.y

		
		for (let i = 0; i < playerPoints; i++) {

			// bottom Y
			let intersectsBottom = this.inPlatformXZ(
				xOfY[i].slope * y + xOfY[i].intercept, 
				zOfY[i].slope * y + zOfY[i].intercept)

			if (intersectsBottom && inRange(y, point(i, Y), lastPoints[i][Y])) {
				if (point(i, Y) < lastPoints[i][Y]) {
					movePlayer(0, y - point(i, Y) + 1, 0)
					velocityY = 0
					onGround = true

					if (!this.inArena) {
						this.armArena()
					}
				}
				if (point(i, Y) > lastPoints[i][Y] && velocityY > 0) {
					movePlayer(0, y - point(i, Y) - 1, 0)
					velocityY = 0
					console.log("hitting bottom of arena")
				}
			}

			if (this.inArena && !this.inPlatformXZ(point(i, X), point(i, Z))) {
				

				this.hitX = point(i, X)
				this.hitY = point(i, Y)
				this.hitZ = point(i, Z)

				this.waveStartFrame = frameCounter
				
				let angle = Math.atan((this.hitX - this.x) / (this.hitZ - this.z))

				let distX = point(i, X) - this.x
				let distZ = point(i, Z) - this.z

				velocityX = -(distX / this.radius) * 100
				velocityZ = -(distZ / this.radius) * 100

			}
		}
	}

	armArena() {
		if (this.active) {
			this.inArena = true
			this.wallsUpEndFrame = frameCounter + this.animationTime
	
			// size, power, agility, health, x, z, r, g, b
			//this.enemy = new Enemy(125, 100, 100, 100, this.x, this.y, this.z)
			this.enemy = new Fighter(this.x, this.y, this.z, 100)
			this.enemySpawned = true
			
			// make wall polys with wallprecision

			

			for (let i = 0; i < this.trimPolys.length; i++) {
				deletePoly(this.trimPolys[i])
			}
			this.trimPolys = []

			for (let i = 0; i < this.trimPoints.length; i++) {
				for (let j = 0; j < this.trimPoints[i].length; j++) {
					for (let k = 0; k < this.trimPoints[i][j].length; k++) {
						deletePoint(this.trimPoints[i][j][k].point)
					}
				}
			}

			this.trimPoints = [[], []]
			
			let wallThickness = 20

			for (let i = 0; i < 2; i++) {
				let currentRadius = this.radius + (i * wallThickness)
				for (let j = 0; j < this.precision; j++) {
					this.trimPoints[i][j] = []
					let angle = 2 * Math.PI / this.precision * j
	
					for (let k = 0; k < this.wallPrecision; k++) {
						let x = this.x + (currentRadius * Math.sin(angle))
						let y
						if (k == 0) y = this.y - this.trimHeight
						else if (k == 1) y = this.y
						else y = this.y + (k - 1) * (this.trimHeight / (this.wallPrecision - 2))
						let z = this.z + (currentRadius * Math.cos(angle))
	
	
						this.trimPoints[i][j][k] = {
							point: addPoint(x, y, z, 1, 1, 1),
							x: x,
							y: y,
							z: z,
							r: 1,
							g: 1,
							b: 1
						}
	
					}
				}
			}

			for (let i = 0; i < 2; i++) {
				for (let j = 1; j < this.precision; j++) {
					for (let k = 1; k < this.wallPrecision; k += 3) {
						this.trimPolys.push(addPoly(this.trimPoints[i][j][k].point, this.trimPoints[i][j-1][k].point, this.trimPoints[i][j-1][k-1].point))
						this.trimPolys.push(addPoly(this.trimPoints[i][j-1][k-1].point, this.trimPoints[i][j][k-1].point, this.trimPoints[i][j][k].point))
					}
				}
				
			}
	
			for (let i = 0; i < 2; i++) {
				for (let k = 1; k < this.wallPrecision; k += 3) {
					this.trimPolys.push(addPoly(this.trimPoints[i][0][k].point, this.trimPoints[i][this.precision-1][k].point, this.trimPoints[i][this.precision-1][k-1].point))
					this.trimPolys.push(addPoly(this.trimPoints[i][this.precision-1][k-1].point, this.trimPoints[i][0][k-1].point, this.trimPoints[i][0][k].point))
				}
			}
	
			for (let j = 1; j < this.precision; j++) {
				this.trimPolys.push(addPoly(this.trimPoints[1][j][0].point, this.trimPoints[0][j][0].point, this.trimPoints[0][j-1][0].point))
				this.trimPolys.push(addPoly(this.trimPoints[0][j-1][0].point, this.trimPoints[1][j-1][0].point, this.trimPoints[1][j][0].point))
				
				this.trimPolys.push(addPoly(this.trimPoints[1][j][this.wallPrecision-1].point, this.trimPoints[0][j][this.wallPrecision-1].point, this.trimPoints[0][j-1][this.wallPrecision-1].point))
				this.trimPolys.push(addPoly(this.trimPoints[0][j-1][this.wallPrecision-1].point, this.trimPoints[1][j-1][this.wallPrecision-1].point, this.trimPoints[1][j][this.wallPrecision-1].point))
			}
			
			this.trimPolys.push(addPoly(this.trimPoints[1][0][0].point, this.trimPoints[0][0][0].point, this.trimPoints[0][this.precision-1][0].point))
			this.trimPolys.push(addPoly(this.trimPoints[0][this.precision-1][0].point, this.trimPoints[1][this.precision-1][0].point, this.trimPoints[1][0][0].point))
			
			this.trimPolys.push(addPoly(this.trimPoints[1][0][this.wallPrecision-1].point, this.trimPoints[0][0][this.wallPrecision-1].point, this.trimPoints[0][this.precision-1][this.wallPrecision-1].point))
			this.trimPolys.push(addPoly(this.trimPoints[0][this.precision-1][this.wallPrecision-1].point, this.trimPoints[1][this.precision-1][this.wallPrecision-1].point, this.trimPoints[1][0][this.wallPrecision-1].point))
		
			
			console.log("arena armed")
		}
	}

	disarmArena() {
		this.active = false
		
		this.inArena = false
		this.wallsDownEndFrame = frameCounter + this.animationTime

		console.log("arena disarmed")
	
	}

	inPlatformXZ(x, z) {
		let distSquared = Math.pow(x - this.x, 2) + Math.pow(z - this.z, 2)
		return (distSquared < Math.pow(this.radius, 2))
	}
	
}