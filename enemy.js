class Enemy {
	constructor(size, power, agility, health, x, y, z, r, g, b) {
		this.size = size
		this.power = power
		this.agility = agility
		this.totalHealth = health
		this.currentHealth = health

		this.dieFrame = null
		this.alive = true

		this.x = x
		this.y = y
		this.z = z

		this.r = r
		this.g = g
		this.b = b

		this.moveX = 1
		this.moveY = 0
		this.moveZ = 0

		this.moveXAlter = Math.random() - .5
		
		this.moveZAlter = Math.random() - .5

		this.lowPoint = 0
		this.highPoint = 0

		this.centerPoint = addPoint(this.x, this.y + this.size, this.z, 0, 0, 0)
		

		this.topCap = addPoint(this.x, this.size * 2, this.z, 0, 0, 0)
		this.bottomCap = addPoint(this.x, 0, this.z, 0, 0, 0)
		this.points = []
		this.pointsMove = []
		for (let i = 0; i < precision; i++) {
			this.points.push([])
			this.pointsMove.push([])
		}

		this.polyList = []
		
		this.makePolys()

		this.center = {
			x: 0,
			y: 0,
			z: 0
		}

		this.calculateExtremes()
	}

	calculateCenter() {
		
		this.center.x = point(this.centerPoint, X)
		this.center.y = point(this.centerPoint, Y)
		this.center.z = point(this.centerPoint, Z)
		
	}

	// make top points move up by various sin functions

	makePolys() {
		let precision = 20


		for (let i = 0; i < precision / 2; i++) {
			let angleX = Math.PI * ((i + 1) / (precision / 2 + 1))
			let originY = this.y + this.size * Math.cos(angleX) + this.size
			let distance = this.size * Math.sin(angleX)
			for (let j = 0; j < precision; j++) {
				let angleY = 2 * Math.PI * (j / (precision))
		
				let originX = distance * Math.cos(angleY)
				let originZ = distance * Math.sin(angleY)
		
				this.points[i][j] = addPoint(originX + this.x, originY, originZ + this.z, Math.sin(angleX), Math.cos(angleX), Math.sin(angleY))

				
					
				
				this.pointsMove[i][j] = Math.pow(Math.random() * 2, 2)
				
			}
		}
		
		
		for (let i = 1; i < this.points.length; i++) {
			for (let j = 1; j < this.points[i].length; j++) {
				this.polyList.push(addPoly(this.points[i][j], this.points[i-1][j], this.points[i-1][j-1]))
				this.polyList.push(addPoly(this.points[i-1][j-1], this.points[i][j-1], this.points[i][j]))
			}
		
		}

		for (let i = 1; i < this.points.length; i++) {
			this.polyList.push(addPoly(this.points[i][this.points[i].length - 1], this.points[i-1][this.points[i].length - 1], this.points[i-1][0]))
			this.polyList.push(addPoly(this.points[i-1][0], this.points[i][0], this.points[i][this.points[i].length - 1]))
		}
/*
		for (let j = 1; j < this.points[0].length; j++) {
			addPoly(this.points[0][j], this.points[0][j-1], this.topCap)
			addPoly(this.points[this.points.length - 1][j], this.points[this.points.length - 1][j-1], this.bottomCap)
		}

		addPoly(this.points[0][0], this.points[0][this.points[0].length - 1], this.topCap)
		addPoly(this.points[this.points.length - 1][0], this.points[this.points.length - 1][this.points[0].length - 1], this.bottomCap)
		*/
	}

	movePointFromCenter(i, j, amount) {
		let currentPoint = this.points[i][j]
		let tempPoint = [point(currentPoint, X) - this.center.x, point(currentPoint, Y) - this.center.y, point(currentPoint, Z) - this.center.z]
		tempPoint = [tempPoint[0] + (tempPoint[0] * amount), tempPoint[1] + (tempPoint[1] * amount), tempPoint[2] + (tempPoint[2] * amount)]
		changePoint(currentPoint, tempPoint[0] + this.center.x, tempPoint[1] + this.center.y, tempPoint[2] + this.center.z)
	
		movePointColor(currentPoint, amount, amount, amount)
	}

	makeSpiky() {
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				this.movePointFromCenter(i, j, this.pointsMove[i][j] * Math.sin(Math.PI * frameCounter / 20) / 100)
			}
		}
	}

	run() {
		if (this.alive) {
			this.calculateCenter()
			this.makeSpiky()
	
			this.moveX = 2 * Math.sin(frameCounter / 100) * this.moveXAlter
			this.moveZ = 2 * Math.cos(frameCounter / 100) * this.moveZAlter
	
			let rotateRatio = 1 / (Math.PI * 30)
	
			this.bounce()
	
			this.move(this.moveX, this.moveY, this.moveZ)
			this.rotate(rotateRatio * this.moveZ, rotateRatio * this.moveY, -rotateRatio * this.moveX)
		
			if (this.currentHealth <= 0) {
				if (this.dieFrame == null) {
					this.dieFrame = frameCounter
				}
					this.collapse()
			}
	
			if (this.dieFrame != null && frameCounter > this.dieFrame + 50) {
				this.alive = false
				this.apoptosis()
				console.log("dead")
			}
		}
	}

	apoptosis() {
		for (let i = 0; i < this.polyList.length; i++) {
			deletePoly(this.polyList[i])
		}
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				deletePoint(this.points[i][j])
			}
		}
	}

	bounce() {
		let currentAverage = calculateAverage()
		let xDistance = currentAverage.x - this.center.x
		let yDistance = currentAverage.y - this.center.y
		let zDistance = currentAverage.y - this.center.y
		let distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2) + Math.pow(currentAverage.z - this.center.z, 2))
		if (distance < this.size + 50) {
			//if (velocityY < 0) {
			// 30
				velocityY = yDistance / 5
				velocityX = xDistance / 5
				velocityZ = zDistance / 5

			this.currentHealth -= 20
			console.log(this.currentHealth)
		}
	}

	move(moveX, moveY, moveZ) {
		movePoint(this.centerPoint, moveX, moveY, moveZ)
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				movePoint(this.points[i][j], moveX, moveY, moveZ)
			}
		}
	}

	rotate(rotateX, rotateY, rotateZ) {
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				let currentPoint = this.points[i][j]
				//pointNum, startX, startY, startZ, anchorY, anchorZ, amount
				
				//rotatePointX(currentPoint, point(currentPoint, X), point(currentPoint, Y), point(currentPoint, Z), this.center.y, this.center.z, rotateX)
				//rotatePointY(currentPoint, point(currentPoint, X), point(currentPoint, Y), point(currentPoint, Z), this.center.z, this.center.x, rotateY)
				//rotatePointZ(currentPoint, point(currentPoint, X), point(currentPoint, Y), point(currentPoint, Z), this.center.x, this.center.y, rotateZ)

				{
					// rotate X
	
					let y = point(currentPoint, Y) - this.center.y
					let z = point(currentPoint, Z) - this.center.z
	
					changePoint(currentPoint, 
											point(currentPoint, X), 
											(y * Math.cos(rotateX) - z * Math.sin(rotateX)) + this.center.y, 
											(y * Math.sin(rotateX) + z * Math.cos(rotateX)) + this.center.z)
				}

				{
					// rotate Y
	
					let z = point(currentPoint, Z) - this.center.z
					let x = point(currentPoint, X) - this.center.x
	
					changePoint(currentPoint, 
											(z * Math.sin(rotateY) + x * Math.cos(rotateY)) + this.center.x,
											point(currentPoint, Y), 
											(z * Math.cos(rotateY) - x * Math.sin(rotateY)) + this.center.z)
				}

				{
					// rotate Z
	
					let x = point(currentPoint, X) - this.center.x
					let y = point(currentPoint, Y) - this.center.y
	
					changePoint(currentPoint, 
											(x * Math.cos(rotateZ) - y * Math.sin(rotateZ)) + this.center.x, 
											(x * Math.sin(rotateZ) + y * Math.cos(rotateZ)) + this.center.y,
											point(currentPoint, Z))
				}
			}
		}
	}

	calculateExtremes() {
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				if (point(this.points[i][j], Y) < point(this.lowPoint, Y)) this.lowPoint = this.points[i][j]
				if (point(this.points[i][j], Y) > point(this.highPoint, Y)) this.highPoint = this.points[i][j]
			}
		}
	}

	collapse() {
		let speed = 1.05
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				let currentPoint = this.points[i][j]
				let tempPoint = [point(currentPoint, X) - this.center.x, point(currentPoint, Y) - this.center.y, point(currentPoint, Z) - this.center.z]
				tempPoint = [tempPoint[0] / speed, tempPoint[1] / speed, tempPoint[2] / speed]
				changePoint(currentPoint, tempPoint[0] + this.center.x, tempPoint[1] + this.center.y, tempPoint[2] + this.center.z)
			}
		}
		
	}
	
}


class Fighter {

	constructor(x, y, z, health) {
		this.x = x
		this.y = y
		this.z = z

		this.size = 100

		this.totalHealth = health
		this.currentHealth = health

		this.alive = true
		this.stillRunning = true
		

		this.width = 150

		this.centerPoint = addPoint(this.x, this.y + this.size, this.z, 0, 0, 0)

		this.topCap = addPoint(this.x, this.size * 2, this.z, 0, 0, 0)
		this.bottomCap = addPoint(this.x, 0, this.z, 0, 0, 0)
		this.points = []
		this.pointsMove = []
		for (let i = 0; i < precision; i++) {
			this.points.push([])
			this.pointsMove.push([])
		}

		this.center = {
			x: 0,
			y: 0,
			z: 0
		}




		this.polys = []

		this.makePolys()

		this.frameCounter = 0

		this.RECOVER = 0
		this.RECOIL = 1
		this.CHARGE = 2
		this.DEAD = 3
		this.currentMove = this.RECOVER

		this.startFrame = 0
		this.endFrame = 100

		// directionX^2 + directionZ^2 = 1

		this.recoilDirectionX = 0
		this.recoilDirectionZ = 0

		this.recoilVelocityX = 0
		this.recoilVelocityZ = 0

		this.chargeDirectionX = 0
		this.chargeDirectionZ = 0
		
		this.chargeVelocityX = 0
		this.chargeVelocityZ = 0
	}

	
	calculateCenter() {
		
		this.center.x = point(this.centerPoint, X)
		this.center.y = point(this.centerPoint, Y)
		this.center.z = point(this.centerPoint, Z)
		
	}

	makePolys() {

		let precision = 20


		for (let i = 0; i < precision / 2; i++) {
			let angleX = Math.PI * ((i + 1) / (precision / 2 + 1))
			let originY = this.y + this.size * Math.cos(angleX) + this.size
			let distance = this.size * Math.sin(angleX)
			for (let j = 0; j < precision; j++) {
				let angleY = 2 * Math.PI * (j / (precision))
		
				let originX = distance * Math.cos(angleY)
				let originZ = distance * Math.sin(angleY)
		
				this.points[i][j] = addPoint(originX + this.x, originY, originZ + this.z, Math.sin(angleX), Math.cos(angleX), Math.sin(angleY))

				
					
				
				this.pointsMove[i][j] = Math.pow(Math.random() * 2, 2)
				
			}
		}
		
		
		for (let i = 1; i < this.points.length; i++) {
			for (let j = 1; j < this.points[i].length; j++) {
				this.polys.push(addPoly(this.points[i][j], this.points[i-1][j], this.points[i-1][j-1]))
				this.polys.push(addPoly(this.points[i-1][j-1], this.points[i][j-1], this.points[i][j]))
			}
		
		}

		for (let i = 1; i < this.points.length; i++) {
			this.polys.push(addPoly(this.points[i][this.points[i].length - 1], this.points[i-1][this.points[i].length - 1], this.points[i-1][0]))
			this.polys.push(addPoly(this.points[i-1][0], this.points[i][0], this.points[i][this.points[i].length - 1]))
		}
		/*this.points[0] = [[], []]
		this.points[1] = [[], []]

		for (let i = 0; i < 2; i++) {
			let xValue = this.x + (i - .5) * this.width
			for (let j = 0; j < 2; j++) {
				let yValue = this.y + (j - .5) * this.width
				for (let k = 0; k < 2; k++) {
					let zValue = this.z + (k - .5) * this.width
					this.points[i][j][k] = {
						point: addPoint(xValue, yValue, zValue, 1, 1, 1),
						x: xValue,
						y: yValue,
						z: zValue
					}
				}
			}

			


		
		
		}

		this.polys.push(addPoly(this.points[0][0][0].point, this.points[0][0][1].point, this.points[0][1][1].point))
		this.polys.push(addPoly(this.points[0][1][1].point, this.points[0][1][0].point, this.points[0][0][0].point))
		this.polys.push(addPoly(this.points[1][0][0].point, this.points[1][0][1].point, this.points[1][1][1].point))
		this.polys.push(addPoly(this.points[1][1][1].point, this.points[1][1][0].point, this.points[1][0][0].point))
		
		this.polys.push(addPoly(this.points[0][0][0].point, this.points[0][0][1].point, this.points[1][0][1].point))
		this.polys.push(addPoly(this.points[1][0][1].point, this.points[1][0][0].point, this.points[0][0][0].point))
		this.polys.push(addPoly(this.points[0][1][0].point, this.points[0][1][1].point, this.points[1][1][1].point))
		this.polys.push(addPoly(this.points[1][1][1].point, this.points[1][1][0].point, this.points[0][1][0].point))
		
		this.polys.push(addPoly(this.points[0][0][0].point, this.points[0][1][0].point, this.points[1][1][0].point))
		this.polys.push(addPoly(this.points[1][1][0].point, this.points[1][0][0].point, this.points[0][0][0].point))
		this.polys.push(addPoly(this.points[0][0][1].point, this.points[0][1][1].point, this.points[1][1][1].point))
		this.polys.push(addPoly(this.points[1][1][1].point, this.points[1][0][1].point, this.points[0][0][1].point))
		*/
		}
	

	run() {

		currentEnemyHealth = this.currentHealth

		if (this.alive && this.currentHealth <= 0) {
			this.alive = false
			this.currentMove = this.DEAD
			this.startFrame = this.frameCounter
			this.endFrame = this.frameCounter + 100

			console.log("died")
		}
		
		this.frameCounter++
		
		let slowSpeed = 1.05
		this.recoilVelocityX /= slowSpeed
		this.recoilVelocityZ /= slowSpeed
		
		this.chargeVelocityX /= slowSpeed
		this.chargeVelocityZ /= slowSpeed

		if (this.frameCounter < this.endFrame) {
			if (this.currentMove == this.RECOIL) {
				this.changeColor(1, 0, 0)
				
			}

			else if (this.currentMove == this.CHARGE) {
				this.changeColor(.35, .3, 1)

				if (this.frameCounter < this.startFrame + 14) {
					let backupSpeed = -3
					this.chargeVelocityX += backupSpeed * this.chargeDirectionX
					this.chargeVelocityZ += backupSpeed * this.chargeDirectionZ

					this.makeSpiky((this.startFrame + 15 - this.frameCounter) / 500)
				}
				else if (this.frameCounter < this.startFrame + 25) {
					let chargeSpeed = 10
					this.chargeVelocityX += chargeSpeed * this.chargeDirectionX
					this.chargeVelocityZ += chargeSpeed * this.chargeDirectionZ
					
				}

				if (this.frameCounter > this.endFrame - 15) {
					this.makeSpiky((this.endFrame - 15 - this.frameCounter) / 500)
				}
			}

			else if (this.currentMove == this.RECOVER) {
				this.changeColor(1, 1, (Math.sin(this.frameCounter / 10) + 1) / 2)
				
			}

			if (this.currentMove == this.DEAD) {
				this.collapse()

				
				this.chargeVelocityX = 0
				this.chargeVelocityz = 0

				// move to center of arena
				this.recoilVelocityX = 0
				this.recoilVelocityZ = 0

				
				
				console.log("dead")
			}
			
		} else this.changeColor(1, 1, 1)

		this.move(this.recoilVelocityX, 0, this.recoilVelocityZ)
		this.move(this.chargeVelocityX, 0, this.chargeVelocityZ)

		let rotateRatio = .01
		this.rotate(this.recoilVelocityZ * rotateRatio, 0, -this.recoilVelocityX * rotateRatio)
		this.rotate(this.chargeVelocityZ * rotateRatio, 0, -this.chargeVelocityX * rotateRatio)

		
		let distance = Math.sqrt(Math.pow(average.x - this.x, 2) + Math.pow(average.y - this.y, 2) + Math.pow(average.z - this.z, 2))


		// recoil
		if (distance < 150 && (this.currentMove == this.RECOVER || this.currentMove == this.RECOIL)) {
			this.currentHealth -= 10
			
			this.currentMove = this.RECOIL
			this.startFrame = this.frameCounter
			this.endFrame = this.frameCounter + 10

			this.recoilVelocityX = -(average.x - this.x)
			this.recoilVelocityZ = -(average.z - this.z)

			let recoilVelocityTotal = Math.abs(this.recoilVelocityX) + Math.abs(this.recoilVelocityZ)

			this.recoilVelocityX /= recoilVelocityTotal / 50
			this.recoilVelocityZ /= recoilVelocityTotal / 50

			//this.recoilVelocityX = Math.sqrt(this.recoilVelocityX)
			//this.recoilVelocityZ = Math.sqrt(this.recoilVelocityZ)

		}

		// charge
		if (this.currentMove == this.RECOVER && this.frameCounter > this.endFrame) {
			// switch to charging

			this.chargeDirectionX = average.x - this.x
			this.chargeDirectionZ = average.z - this.z

			let chargeDirectionTotal = Math.abs(this.chargeDirectionX) + Math.abs(this.chargeDirectionZ)

			this.chargeDirectionX /= chargeDirectionTotal
			this.chargeDirectionZ /= chargeDirectionTotal

			this.currentMove = this.CHARGE
			this.startFrame = this.frameCounter
			this.endFrame = this.frameCounter + 50
			
		}

		if (distance < 200 && this.currentMove == this.CHARGE) {
			playerHealth--
			velocityX = this.chargeVelocityX * 2
			velocityY = 20
			velocityZ = this.chargeVelocityZ * 2

		}

		// recover
		if ((this.currentMove == this.CHARGE && this.frameCounter > this.endFrame) || (this.currentMove == this.RECOIL && this.frameCounter > this.endFrame)) {
			this.currentMove = this.RECOVER
			this.startFrame = this.frameCounter
			this.endFrame = this.frameCounter + 75
		}

		
	}


	move(xMove, yMove, zMove) {
		this.x += xMove
		this.y += yMove
		this.z += zMove
		movePoint(this.centerPoint, xMove, yMove, zMove)
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				movePoint(this.points[i][j], xMove, yMove, zMove)
			}
		}
		
		/*this.x += xMove
		this.y += yMove
		this.z += zMove
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				for (let k = 0; k < this.points[i][j].length; k++) {
					let current = this.points[i][j][k]

					movePoint(current.point, xMove, yMove, zMove)
					current.x += xMove
					current.y += yMove
					current.z += zMove
					
				}
			}
		}*/
	}

	rotate(rotateX, rotateY, rotateZ) {
		this.calculateCenter()
		
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				let currentPoint = this.points[i][j]
				{
					// rotate X
	
					let y = point(currentPoint, Y) - this.center.y
					let z = point(currentPoint, Z) - this.center.z
	
					changePoint(currentPoint, 
											point(currentPoint, X), 
											(y * Math.cos(rotateX) - z * Math.sin(rotateX)) + this.center.y, 
											(y * Math.sin(rotateX) + z * Math.cos(rotateX)) + this.center.z)
				}

				{
					// rotate Y
	
					let z = point(currentPoint, Z) - this.center.z
					let x = point(currentPoint, X) - this.center.x
	
					changePoint(currentPoint, 
											(z * Math.sin(rotateY) + x * Math.cos(rotateY)) + this.center.x,
											point(currentPoint, Y), 
											(z * Math.cos(rotateY) - x * Math.sin(rotateY)) + this.center.z)
				}

				{
					// rotate Z
	
					let x = point(currentPoint, X) - this.center.x
					let y = point(currentPoint, Y) - this.center.y
	
					changePoint(currentPoint, 
											(x * Math.cos(rotateZ) - y * Math.sin(rotateZ)) + this.center.x, 
											(x * Math.sin(rotateZ) + y * Math.cos(rotateZ)) + this.center.y,
											point(currentPoint, Z))
				}
			}
		}

	}
	
	changeColor(r, g, b) {
		this.calculateCenter()
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {

				let distFromCenter = Math.sqrt(Math.pow(point(this.points[i][j], X) - this.center.x, 2) + Math.pow(point(this.points[i][j], Y) - this.center.y, 2) + Math.pow(point(this.points[i][j], Z) - this.center.z, 2))
				distFromCenter /= this.size
				changePointColor(this.points[i][j], r * distFromCenter, g * distFromCenter, b * distFromCenter)
			}
		}
		
		/*
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				for (let k = 0; k < this.points[i][j].length; k++) {
					changePointColor(this.points[i][j][k].point, r, g, b)
					
				}
			}
		}*/
	}

	
	movePointFromCenter(i, j, amount) {
		let currentPoint = this.points[i][j]
		let tempPoint = [point(currentPoint, X) - this.center.x, point(currentPoint, Y) - this.center.y, point(currentPoint, Z) - this.center.z]
		tempPoint = [tempPoint[0] + (tempPoint[0] * amount), tempPoint[1] + (tempPoint[1] * amount), tempPoint[2] + (tempPoint[2] * amount)]
		changePoint(currentPoint, tempPoint[0] + this.center.x, tempPoint[1] + this.center.y, tempPoint[2] + this.center.z)
	
		movePointColor(currentPoint, amount, amount, amount)
	}

	makeSpiky(amount) {
		this.calculateCenter()
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				this.movePointFromCenter(i, j, this.pointsMove[i][j] * amount)
			}
		}
	}


	
	collapse() {
		this.calculateCenter()
		
		let speed = 1.05
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.points[i].length; j++) {
				let currentPoint = this.points[i][j]
				let tempPoint = [point(currentPoint, X) - this.center.x, point(currentPoint, Y) - this.center.y, point(currentPoint, Z) - this.center.z]
				tempPoint = [tempPoint[0] / speed, tempPoint[1] / speed, tempPoint[2] / speed]
				changePoint(currentPoint, tempPoint[0] + this.center.x, tempPoint[1] + this.center.y, tempPoint[2] + this.center.z)
			}
		}
		
	}

	deletePolys() {
		for (let i = 0; i < this.polys.length; i++) {
			deletePoly(this.polys[i])
		}
	
		for (let i = 0; i < this.points.length; i++) {
			for (let j = 0; j < this.polys[i].length; j++) {
				deletePoint(this.points[i][j])
			}
		}
	}
	
	
}
