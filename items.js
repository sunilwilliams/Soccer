class Coin {
	constructor(x, y, z, r, g, b) {
		this.x = x
		this.y = y
		this.z = z

		this.thickness = 10 / 2
		this.radius = 25

		let precision = Math.round(20 * detailLevel)
		this.precision = precision

		this.centerPoints = [{
			point: addPoint(this.x, this.y, this.z - this.thickness, r, g, b), 
			x: this.x,
			y: this.y,
			z: this.z - 0
		}, {
			point: addPoint(this.x, this.y, this.z + this.thickness, r, g, b),
			x: this.x,
			y: this.y,
			z: this.z + 0
		}]
		
		this.points = [[], []]
		for (let i = 0; i < precision; i++) {
			let angle = (2 * Math.PI / precision) * i
			this.points[0][i] = {
				point: addPoint(this.x + this.radius * Math.cos(angle), 
												this.y + this.radius * Math.sin(angle), 
												this.z - this.thickness, r, g, b),
				x: this.x + this.radius * Math.cos(angle),
				y: this.y + this.radius * Math.sin(angle),
				z: this.z - this.thickness
		}
			
			this.points[1][i] = {
				point: addPoint(this.x + this.radius * Math.cos(angle), 
												this.y + this.radius * Math.sin(angle), 
												this.z + this.thickness, r, g, b),
				x: this.x + this.radius * Math.cos(angle),
				y: this.y + this.radius * Math.sin(angle),
				z: this.z + this.thickness
			}
		}

		this.polys = []
		for (let i = 1; i < precision; i++) {
			this.polys.push(addPoly(this.points[0][i].point, this.points[0][i-1].point, this.points[1][i-1].point))
			this.polys.push(addPoly(this.points[1][i-1].point, this.points[1][i].point, this.points[0][i].point))

			this.polys.push(addPoly(this.points[0][i].point, this.points[0][i-1].point, this.centerPoints[0].point))
			this.polys.push(addPoly(this.points[1][i].point, this.points[1][i-1].point, this.centerPoints[1].point))
		}
		this.polys.push(addPoly(this.points[0][precision - 1].point, this.points[0][0].point, this.points[1][0].point))
		this.polys.push(addPoly(this.points[1][0].point, this.points[1][precision - 1].point, this.points[0][precision - 1].point))

		this.polys.push(addPoly(this.points[0][precision - 1].point, this.points[0][0].point, this.centerPoints[0].point))
		this.polys.push(addPoly(this.points[1][precision - 1].point, this.points[1][0].point, this.centerPoints[1].point))
		
		this.rotation = 0
	}

	run() {
		this.rotation += Math.PI / 30
		// rotate
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < this.points[0].length; j++) {
				//pointNum, startX, startY, startZ, anchorZ, anchorX, amount
				let current = this.points[i][j]
				//rotatePointY(current.point, current.x, current.y, current.z, this.z, this.x, this.rotation)

				let tempZ = current.z - this.z
				let tempX = current.x - this.x

				changePoint(current.point,
										this.x + ((tempZ * Math.sin(this.rotation)) + (tempX * Math.cos(this.rotation))), 
										current.y, 
									 	this.z + ((tempZ * Math.cos(this.rotation)) - (tempX * Math.sin(this.rotation))))
			}
		}
	}
}



class RespawnPoint {

	constructor(x, y, z) {
		this.x = x
		this.y = y
		this.z = z

		this.minusR = Math.pow(Math.random() * 2 + .5, 2)
		this.minusG = Math.pow(Math.random() * 2 + .5, 2)
		this.minusB = Math.pow(Math.random() * 2 + .5, 2)

		this.innerWidth = 150
		this.outerWidth = 110

		this.outerPoints = []
		this.innerPoints = []
		this.polys = []

		this.makePolys()

		this.loadedIn = true

		this.discoveredStartFrame = 0
		this.discoveredEndFrame = 0
		this.respawnEndFrame = 0 // go up and down when respawn
		this.resetEndFrame = 0 // go back up when player exits respawn point
	}

	makePolys() {
		for (let i = 0; i <= 2; i++) {
			this.outerPoints[i] = []
			this.innerPoints[i] = []

			let xPoint = this.x + ((i - .5) * this.innerWidth)
			for (let j = 0; j <= 2; j++) {
				this.outerPoints[i][j] = []
				this.innerPoints[i][j] = []
				
				let zPoint = this.z + ((j - .5) * this.innerWidth)
				for (let k = 0; k <= 8; k += 2) {
					let yPoint = this.y + (k * 11)
					this.outerPoints[i][j][k] = {
						point: addPoint(xPoint, yPoint, zPoint, 1, 1, 1),
						x: xPoint,
						y: yPoint,
						z: zPoint
					}
					this.outerPoints[i][j][k+1] = {
						point: addPoint(xPoint, yPoint + 10, zPoint, 1, 1, 1),
						x: xPoint,
						y: yPoint + 10,
						z: zPoint
					}
					
					
				}
			}
		}

		for (let k = 0; k <= 8; k += 2) {
			this.polys.push(addPoly(this.outerPoints[0][0][k].point, this.outerPoints[1][0][k].point, this.outerPoints[1][0][k+1].point))
			this.polys.push(addPoly(this.outerPoints[1][0][k+1].point, this.outerPoints[0][0][k+1].point, this.outerPoints[0][0][k].point))
			
			this.polys.push(addPoly(this.outerPoints[0][0][k].point, this.outerPoints[0][1][k].point, this.outerPoints[0][1][k+1].point))
			this.polys.push(addPoly(this.outerPoints[0][1][k+1].point, this.outerPoints[0][0][k+1].point, this.outerPoints[0][0][k].point))
			
			this.polys.push(addPoly(this.outerPoints[0][1][k].point, this.outerPoints[1][1][k].point, this.outerPoints[1][1][k+1].point))
			this.polys.push(addPoly(this.outerPoints[1][1][k+1].point, this.outerPoints[0][1][k+1].point, this.outerPoints[0][1][k].point))
			
			this.polys.push(addPoly(this.outerPoints[1][0][k].point, this.outerPoints[1][1][k].point, this.outerPoints[1][1][k+1].point))
			this.polys.push(addPoly(this.outerPoints[1][1][k+1].point, this.outerPoints[1][0][k+1].point, this.outerPoints[1][0][k].point))
			
			}
		
	}

	respawnPlayerHere() {
		for (let i = 0; i < lastPoints.length; i++) {
			lastPoints[i] = [this.x, this.y + 100, this.z]
		}

		velocityY = 0
		
		let currentPoint = 0
		for (let x = -1; x <= 1; x += 2) {
			for (let y = -1; y <= 1; y += 2) {
				for (let z = -1; z <= 1; z += 2) {
					changePoint(currentPoint, this.x + 50*x, this.y + 100 + 50*y, this.z + 50*z)
					currentPoint++
				}
			}
		}
	}

															
	run() {

		if (this.discoveredStartFrame < frameCounter) {
			
			for (let i = 0; i < this.outerPoints.length; i++) {
				for (let j = 0; j < this.outerPoints[i].length; j++) {
					for (let k = 0; k < this.outerPoints[i][j].length; k++) {
						let current = this.outerPoints[i][j][k]

						let animationFrame = frameCounter - (k * 2)
			
						if (animationFrame > this.discoveredStartFrame) {
							animationFrame -= this.discoveredEndFrame

							let speed = 100
						
							let changeY = k * (-speed * Math.cos(Math.PI * animationFrame / 35) + speed) / 20
							//let changeY = 100 * Math.cos(animationFrame / speed)
							
							
							//if () console.log(changeY)
						
							changePoint(current.point, current.x, current.y + changeY, current.z)

							let colorChange = changeY / speed
							
							changePointColor(current.point, 1 - (colorChange / this.minusR), 1 - (colorChange / this.minusG), 1 - (colorChange / this.minusB))
						}
					}
				}
			}
		}
		
	}
	
}

