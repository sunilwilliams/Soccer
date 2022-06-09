class Grass {
	constructor(x, y, z, height) {
		this.x = x
		this.y = y
		this.z = z
		this.height = height

		// make points and polys

		// 20
		let bladeWidth = 50
		
		this.basePoint1 = addPoint(this.x + ((Math.random() - .5) * bladeWidth), this.y, this.z + ((Math.random() - .5) * bladeWidth), 0, .25, 0)
		this.basePoint2 = addPoint(this.x + ((Math.random() - .5) * bladeWidth), this.y, this.z + ((Math.random() - .5) * bladeWidth), 0, .25, 0)
		this.topPoint = addPoint(this.x, this.y + this.height, this.z, .5, 1, .5)

		
		this.poly1 = addPoly(this.basePoint1, this.basePoint2, this.topPoint)


		this.deleted = false


		this.windMove = 0
		
		
	}

	smush() {
		let minY = 500
		
		let distanceX = average.x - this.x
		let distanceY = average.y - this.y
		let distanceZ = average.z - this.z
		
		let minDist = 150
		let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceZ, 2))

		let moveAmount = Math.PI / 2.5;
		// 150 for movement
		// Math.PI / 3 for rotation
		
		if (distanceY < minY && average.y > this.y) {
			if (distance < minDist) {
				let moveX = moveAmount / distance * distanceX * Math.pow(((minY) - distanceY) / (minY + this.y), 2) * Math.pow((minDist - distance) / minDist, 1)
				let moveZ = moveAmount / distance * distanceZ * Math.pow(((minY) - distanceY) / (minY + this.y), 2) * Math.pow((minDist - distance) / minDist, 1)
			
				//changePoint(this.topPoint, this.x - moveX, this.height, this.z - moveZ)
			
				rotatePointZ(this.topPoint, this.x, this.y + this.height, this.z, this.x, 0, moveX)
				rotatePointX(this.topPoint, point(this.topPoint, X), point(this.topPoint, Y), this.z, 0, this.z, -moveZ)


				
				movePoint(this.topPoint, this.windMove, 0, 0)

				
				let minShadeY = 100
				

				if (distanceY < minShadeY) {
					let colorChange = Math.pow((distance / minDist), 2)
					
					// move towards 0, .25, 0
					//changePointColor(this.topPoint,  lerp(0, .5, colorChange), lerp(.25, 1, colorChange), lerp(0, .5, colorChange))

					
				}
				
			}
		}
		
		
	}


	wave() {
		this.windMove = (40 * (Math.sin((frameCounter - (this.x / 3)) / 30) + .5))
		changePoint(this.topPoint, this.x + this.windMove, this.y + this.height, this.z)
	}
	
	

	delete() {
		let minY = 200
		
		let distanceX = average.x - this.x
		let distanceY = average.y
		let distanceZ = average.z - this.z
		
		let minDist = 100
		let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceZ, 2))

		let moveAmount = 100;
		// 150 for movement
		// Math.PI / 3 for rotation
		
		if (distanceY < minY) {
			if (distance < minDist) {
				let moveX = moveAmount / distance * distanceX * Math.pow((minY - distanceY) / minY, .5) * (minDist - distance) / minDist
				let moveZ = moveAmount / distance * distanceZ * Math.pow((minY - distanceY) / minY, .5) * (minDist - distance) / minDist

				//console.log(1 / (moveX / moveAmount) * (moveZ / moveAmount))
				let colorCange = Math.pow(distance / minDist, 2)
				
				// move towards 0, .25, 0
				changePointColor(this.topPoint,  colorCange * .5, colorCange, colorCange * .5)

				
				changePoint(this.topPoint, this.x - moveX, this.height, this.z - moveZ)
			
				//rotatePointZ(this.topPoint, this.x, this.height, this.z, this.x, 0, moveX)
				//rotatePointX(this.topPoint, point(this.topPoint, X), point(this.topPoint, Y), this.z, 0, this.z, -moveZ)

				if (distance < 50) {
					//changePoint(this.topPoint, this.x, -10, this.z)
					//deletePolyWithPoints(this.poly1)
					deletePoly(this.poly1)
					deletePoint(this.basePoint1)
					deletePoint(this.basePoint2)
					deletePoint(this.topPoint)

					
					this.deleted = true
				}
				
			}
		}
		
		return this.deleted
	}

	deletePoly() {
		deletePoly(this.poly1)
		deletePoint(this.basePoint1)
		deletePoint(this.basePoint2)
		deletePoint(this.topPoint)
	}


	setTopColor(r, g, b) {
		changePointColor(this.topPoint, r, g, b)
	}
}

class GrassPatch {
	constructor(x, z, size, grassHeight) {
		this.x = x
		this.z = z
		this.size = size
		this.grassHeight = grassHeight


		this.blades = []

		for(let i = 0; i < Math.pow(size, 1.1); i++) {
			let angle = Math.random() * 2 * Math.PI
			let randDistance = size / 2 * Math.random()
			let xFromCenter = this.x + (randDistance * Math.sin(angle))
			let zFromCenter = this.z + (randDistance * Math.cos(angle))
			this.blades.push(new Grass(xFromCenter, 0, zFromCenter, this.grassHeight * (Math.random() + 1) / 2))
			
		}

		
	}

	rustle() {
		for (let i = 0; i < this.blades.length; i++) {
			this.blades[i].smush()
		}
	}
	
}


class GrassSquare {
	constructor(x, z, size, grassHeight) {
		this.x = x
		this.z = z
		this.size = size
		this.grassHeight = grassHeight


		this.blades = []

		for (let i = 0; i < Math.pow(size, 2); i++) {	
			let xDistance = (Math.random() - .5) * size
			let zDistance = (Math.random() - .5) * size
			if (xDistance*xDistance + zDistance*zDistance < Math.pow(size, 1.5))
			this.blades.push(new Grass(xDistance + this.x, 0, zDistance + this.z, this.grassHeight * (Math.random() + 1) / 2))
		}
		
	}
// 2b*b = r*r
	// b*b = r*r/2
	// b = sqrt(r*r/2)
	// b = r/sqrt(2)
	
	eliminate() {
		let radius = 200
		for (let i = 0; i < this.blades.length; i++) {
			if (this.blades[i].delete()) {
				let x = (Math.random() - .5) * 2 * Math.sqrt(radius*radius / 2)
				let z = (Math.random() - .5) * 2 * Math.sqrt(radius*radius / 2)
				while (x*x + z*z > 10000) {
					x = (Math.random() - .5) * 2 * Math.sqrt(radius*radius / 2)
					z = (Math.random() - .5) * 2 * Math.sqrt(radius*radius / 2)
				}
				this.blades[i] = new Grass(average.x + x, 0, average.z + z, this.grassHeight * (Math.random() + 1) / 2)
			}
		}
	}
	
}



class GrassSection {
	constructor(x, z, size, grassHeight) {
		this.x = x
		this.z = z
		this.size = size
		this.grassHeight = grassHeight


		this.blades = []

		this.loadedIn = false
		this.loadedInTemp = false

		
		this.topColorR = .5
		this.topColorG = 1
		this.topColorB = .5

		
	}

	refresh() {
		if (this.topColorR < .5) this.topColorR += .05
		if (this.topColorG < 1) this.topColorG += .05
		if (this.topColorB < .5) this.topColorB += .05
		for (let i = 0; i < this.blades.length; i++) {
			//this.blades[i].setTopColor(this.topColorR, this.topColorG, this.topColorB)
		}

		this.rustle()
	}
	
	rustle() {
		for (let i = 0; i < this.blades.length; i++) {
			this.blades[i].smush()
		}
	}


	wind() {
		for (let i = 0; i < this.blades.length; i++) {
			this.blades[i].wave()
		}
	}


	
	eliminate() {
		for (let i = 0; i < this.blades.length; i++) {
			this.blades[i].delete()
		}
	}

	loadIn () {
		if (!this.loadedIn) {
			let bladeNumber = Math.round(.0002 * this.size * this.size * detailLevel)
			for (let i = 0; i < bladeNumber; i++) {	
				let xDistance = (Math.random() - .5) * this.size
				let zDistance = (Math.random() - .5) * this.size
				this.blades.push(new Grass(xDistance + this.x, 0, zDistance + this.z, this.grassHeight * (Math.random() + 1) / 2))
				this.blades[i].setTopColor(this.topColorR, this.topColorG, this.topColorB)
			}
			this.loadedIn = true
		}
	}

	loadOut() {
		if (this.loadedIn) {
			for (let i = 0; i < this.blades.length; i++) {
				this.blades[i].deletePoly()
			}
			this.blades.splice(0, this.blades.length)
			this.loadedIn = false
		}
	}
}