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