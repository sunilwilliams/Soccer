const canvas = document.getElementById("canvas")

resizeCanvas()

function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	console.log("wow")
}


const gl = canvas.getContext("webgl")

const vShaderText = `
precision mediump float;

attribute vec4 vertPosition;
attribute vec4 aVertColor;

uniform mat4 pMatrix;
uniform mat4 tMatrix;

varying lowp vec4 vColor;

void main() {
  gl_Position = pMatrix * tMatrix * vertPosition;
  vColor = aVertColor;
}
`

const fShaderText = `
precision mediump float;

varying lowp vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`

var points = [],
		pointColors = [],
		polys = []

var openPoints = [],
		openPolys = []

var polysToBeDeleted = []

var grassBlades = []


var playerPoints = 0
{
	var precision = 50
	
	var cPoints = []
	for (let i = 0; i < precision / 2; i++) {
		cPoints.push([])
	}
	
	for (let i = 0; i < precision / 2; i++) {
		let angleX = Math.PI * (i / (precision / 2 - 1))
		let originY = 75 * Math.cos(angleX)
		let distance = 75 * Math.sin(angleX)
		for (let j = 0; j < precision; j++) {
			let angleY = 2 * Math.PI * (j / (precision - 1))
	
			let originX = distance * Math.cos(angleY)
			let originZ = distance * Math.sin(angleY)
	
			//cPoints[i][j] = addPoint(originX, originY, originZ, Math.cos(angleX) + .5, Math.cos(angleY) + .5, .25)
			//playerPoints++
		}
	}
	
	
	for (let i = 1; i < cPoints.length; i++) {
		for (let j = 1; j < cPoints[i].length; j++) {
			//addPoly(cPoints[i][j], cPoints[i-1][j], cPoints[i-1][j-1])
			//addPoly(cPoints[i-1][j-1], cPoints[i][j-1], cPoints[i][j])
		}
	
		//addPoly(cPoints[i][cPoints.length - 1], cPoints[i-1][cPoints.length - 1], cPoints[i-1][0])
		//addPoly(cPoints[i-1][0], cPoints[i][0], cPoints[i][cPoints.length - 1])
		
	}
	
	for (let j = 1; j < cPoints[0].length; j++) {
		//								top point,            last 
		//addPoly(cPoints[cPoints.length - 1][j], cPoints[cPoints.length - 2][j], cPoints[cPoints.length - 2][j-1])
		//addPoly(cPoints[0][j-1], cPoints[cPoints.length - 1][j-1], cPoints[cPoints.length - 1][j])
	} //addPoly(cPoints[cPoints.length - 1][cPoints[0].length - 1], cPoints[cPoints.length - 2][cPoints[0].length - 1], cPoints[cPoints.length - 2][0])
	
	
	for (let x = -1; x <= 1; x += 2) {
		for (let y = -1; y <= 1; y += 2) {
			for (let z = -1; z <= 1; z += 2) {
				////addPoint(50*x, 50*y, 50*z, (x+1)/2, (y+1)/2, (z+1)/2)
				addPoint(50*x, 50*y, 50*z, 1, 1, .25)
				playerPoints++
			}
		}
	}
}

//let floorPoint1 = addPoint(-10000, 0, -10000, .5, .5, 0)
//let floorPoint2 = addPoint(10000, 0, -10000, .5, 0, .5)
//let floorPoint3 = addPoint(10000, 0, 10000, .5, 0, 0)
//let floorPoint4 = addPoint(-10000, 0, 10000, .5, 1, 0)
//let floorPoint5 = addPoint(0, 0, 0, 0, .25, 0)

let floorPoint1 = addPoint(-10000, 0, -10000, 0, .25, 0)
let floorPoint2 = addPoint(10000, 0, -10000, 0, .25, 0)
let floorPoint3 = addPoint(10000, 0, 10000, 0, .25, 0)
let floorPoint4 = addPoint(-10000, 0, 10000, 0, .25, 0)

let floorPointCenter = addPoint(0, 0, 0, 0, .25, 0)

let pyramidPoint1 = addPoint(500, 0, 500, .5, .8, .3)
let pyramidPoint2 = addPoint(1000, 0, 500, 0, .8, .3)
let pyramidPoint3 = addPoint(1000, 0, 1000, .5, 1, .3)
let pyramidPoint4 = addPoint(500, 0, 1000, .5, .8, 1)
let pyramidPoint5 = addPoint(750, 500, 750, 1, 0, .3)


let centerCompass = addPoint(0, 300, 0, 1, 1, 1)

let directionX1 = addPoint(200, 300, 0, 0, 0, 1)
let directionX2 = addPoint(200, 350, 0, 0, 0, 1)

let directionY1 = addPoint(0, 500, 0, 0, 1, 0)
let directionY2 = addPoint(50, 500, 0, 0, 1, 0)

let directionZ1 = addPoint(0, 300, 200, 1, 0, 0)
let directionZ2 = addPoint(0, 350, 200, 1, 0, 0)

polys.push(
	0, 1, 2,
	3, 2, 1,
	
	4, 5, 6,
	7, 6, 5,

	0, 1, 5,
	4, 0, 5,
	
	2, 3, 6,
	7, 6, 3,
	
	0, 4, 2,
	6, 4, 2,

	1, 3, 7,
	5, 1, 7,

	centerCompass, directionX1, directionX2,
	centerCompass, directionY1, directionY2,
	centerCompass, directionZ1, directionZ2,
	
/*
	8, 9, 12,
	9, 10, 12,
	10, 11, 12,
	11, 8, 12,
*/
	//floorPoint1, floorPoint2, floorPoint5,
	//floorPoint2, floorPoint3, floorPoint5,
	//floorPoint3, floorPoint4, floorPoint5,
	//floorPoint4, floorPoint1, floorPoint5,

	//floorPoint1, floorPoint2, floorPoint3,
	//floorPoint3, floorPoint4, floorPoint1

	floorPoint1, floorPoint2, floorPointCenter,
	floorPoint2, floorPoint3, floorPointCenter,
	floorPoint3, floorPoint4, floorPointCenter,
	floorPoint4, floorPoint1, floorPointCenter,
	
)





var pointsSize = 3,
		pointColorsSize = 4,
		polysSize = 3


var vShader = gl.createShader(gl.VERTEX_SHADER),
		fShader = gl.createShader(gl.FRAGMENT_SHADER),
		program = gl.createProgram()


var pointsBuffer = gl.createBuffer(),
		pointColorsBuffer = gl.createBuffer(),
		polysBuffer = gl.createBuffer()


// boring shader stuff

gl.shaderSource(vShader, vShaderText);
gl.shaderSource(fShader, fShaderText);

gl.compileShader(vShader);
gl.compileShader(fShader);

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.linkProgram(program);
gl.validateProgram(program);

//let grassPatch1 = new GrassPatch(75, 75, 1000, 200)
//let grassSquare1 = new GrassSquare(-2000, -750, 50, 100)


//var blades = []

//											size, power, agility, health, x, z, r, g, b
//let monster = new Enemy(100, 50, 50, 50, 600, -1000, 1, 0, 0)

var lastPoints = []
for (let i = 0; i < playerPoints; i++) {
	lastPoints.push([point(i, X), point(i, Y), point(i, Z)])
}

var yOfX = []
var zOfX = []

var zOfY = []
var xOfY = []

var xOfZ = []
var yOfZ = []


var detailLevel = Number(document.getElementById("detailSlider").value) / 20


/*
var monsters = []
for (let i = 0; i < 10; i++) {
	monsters.push(new Enemy(100, // size
													50, // power
													50, // agility
													50, // health
													(Math.random() - .5) * 5000, // x
													0, // y
													(Math.random() - .5) * 5000, // z
													1, 0, 0))
}
*/

var grassSectionSize = 300
var grassSectionNumber = 600;

var grassSections = []
var bouncePad
var coin
var respawnPoint

var currentRespawnPoint = 0


var pathPlatforms
var platforms
var bouncePads
var arenas
var respawnPoints

var constructed = false


gl.clearColor(0, .25, 0, 1);
gl.clearDepth(1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

document.getElementById("play").onclick = function () {
	if (!constructed) {
		detailLevel = Number(document.getElementById("detailSlider").value) / 20

		document.getElementById("detailSlider").style = "z-index: -5"
		document.getElementById("play").style = "z-index: -5"
		constructed = true

		
		for (let i = 0; i < grassSectionNumber; i++) {
			grassSections.push([])
			for (let j = 0; j < grassSectionNumber; j++) {
				grassSections[i].push(new GrassSection((i - (grassSectionNumber / 2)) * grassSectionSize, (j - (grassSectionNumber / 2)) * grassSectionSize, grassSectionSize, 150))
			}
		}
		
		
		//var platform = new Platform(100, 200, 100, 500, 500, 200)
		
		//var bouncePads = []
		//bouncePads.push(new BouncePad(700, 300, 500, 400, 100, 500))
		
		bouncePad = new BouncePad(-1500, 200, -500, 500, 100, 500)
		
		coin = new Coin(200, 200, 0, 1, 1, 0)
		
		//var arena = new Arena(1750, 500, 500, 750)
		

		//respawnPoint = new RespawnPoint(0, 0, 0)
		
		
		// make path
		// each joint is a small path that ends with an arena
		// each joint goes up and in a random direction
		
		pathPlatforms = []

		platforms = []
		bouncePads = []
		arenas = []
		respawnPoints = []
		respawnPoints.push(new RespawnPoint(0, 0, 0))
		
		const START = 0
		const STAIRS = 1
		const BOUNCY_STAIRS = 2

		
		
		
		let currentJoint = START
		let currentX = 0
		let currentY = 0
		let currentZ = 200
		
		let platformWidth = 200
		let platformHeight = 75
		let platformLength = 300
		
		let numberOfLevels = 20

		let lastDirectionX = 0
		let lastDirectionZ = 1
		
		let directionX = 0
		let directionZ = 1
		
		for (let i = 0; i < numberOfLevels; i++) {


			let pathChooser = Math.random()


			//while (directionX == lastDirectionX && directionX)
			
			let directionChooser = Math.random()

			
			if (directionChooser < .25) {
				directionX = 1
				directionZ = 0
			} else if (directionChooser < .5) {
				directionX = 1
				directionZ = 0
			} else if (directionChooser < .75) {
				directionX = 0
				directionZ = -1
			} else if (directionChooser < 1) {
				directionX = 0
				directionZ = -1
			}

			if (pathChooser < 1) {
				// normal big platform with respawn point and 
				//possible diverging paths with coins

				// *staircase to big platform

				
				currentX += directionX * 100
				currentZ += directionZ * 100
				

				for (let i = 0; i < 3; i++) {
					currentX += directionX * 750 + randomOffset(100)
					currentY += 200
					currentZ += directionZ * 750 + randomOffset(100)
					
					let width = 400
					pathPlatforms.push(new Platform(currentX - width/2, currentY, currentZ - width/2, 
																					width, 100, width))
					platforms.push(pathPlatforms[pathPlatforms.length-1])
				}

				// big platform

				currentX += directionX * 800 + randomOffset(200)
				currentY += 200
				currentZ += directionZ * 800 + randomOffset(200)
				
				let bigWidth = 1000
				pathPlatforms.push(new Platform(currentX - bigWidth/2, currentY, currentZ - bigWidth/2, 
																				bigWidth, 100, bigWidth))
				platforms.push(pathPlatforms[pathPlatforms.length-1])

				//respawnPoints.push(new RespawnPoint(currentX - bigWidth/2 + (bigWidth * Math.round(Math.random())), currentY + 100, currentZ - bigWidth/2 + (bigWidth * Math.round(Math.random()))))
				respawnPoints.push(new RespawnPoint(currentX, currentY + 100, currentZ))
				
				// diverging path
				let divergingPathPicker = Math.random()

				let dDirectionX
				let dDirectionZ

				let dDirectionChooser = Math.random()
			
				if (dDirectionChooser < .25) {
					dDirectionX = 1
					dDirectionZ = 0
				} else if (dDirectionChooser < .5) {
					dDirectionX = 1
					dDirectionZ = 0
				} else if (dDirectionChooser < .75) {
					dDirectionX = 0
					dDirectionZ = 1
				} else if (dDirectionChooser < 1) {
					dDirectionX = 0
					dDirectionZ = 1
				}

				let dCurrentX = currentX + dDirectionX * 600
				let dCurrentY = currentY
				let dCurrentZ = currentZ + dDirectionZ * 600

				
				if (divergingPathPicker < 1) {
					// diverging bouncy path with coins
					for (let i = 0; i < 3; i++) {
						dCurrentX += dDirectionX * 900 + randomOffset(100)
						dCurrentY += 100
						dCurrentZ += dDirectionZ * 900 + randomOffset(100)
						
						let dWidth = 400
						pathPlatforms.push(new BouncePad(dCurrentX - dWidth/2, dCurrentY, dCurrentZ - dWidth/2, 
																						dWidth, 50, dWidth))
						bouncePads.push(pathPlatforms[pathPlatforms.length-1])
					}
				}

				
				directionChooser = Math.random()
	
				
				if (directionChooser < .25) {
					directionX = 1
					directionZ = 0
				} else if (directionChooser < .5) {
					directionX = 1
					directionZ = 0
				} else if (directionChooser < .75) {
					directionX = 0
					directionZ = -1
				} else if (directionChooser < 1) {
					directionX = 0
					directionZ = -1
				}
				
				currentX += directionX * 1000
				currentY += 200
				currentZ += directionZ * 1000

				pathPlatforms.push(new Arena(currentX, currentY, currentZ, 500))
				arenas.push(pathPlatforms[pathPlatforms.length-1])
				
				
				
			} else if (pathChooser < 1) {

				
			} else if (pathChooser < 1) {

				
			} else if (pathChooser < .99) {


				
			} else {

				
			}

			
			//let jointChooser = Math.random()
			//if (jointChooser < .5) currentJoint = STAIRS
			//else currentJoint = BOUNCY_STAIRS
		/*
			pathPlatforms.push(new Platform(currentX - (platformWidth/2), currentY, currentZ - (platformLength/2), platformWidth, platformHeight, platformLength))
			
			
			currentX += 500
			currentY += 100
		
			pathPlatforms.push(new BouncePad(currentX - (platformWidth/2), currentY, currentZ - (platformLength/2), platformWidth, platformHeight, platformLength))
		
			currentX += 1000
			currentY += 100
		
			pathPlatforms.push(new Arena(currentX, currentY, currentZ, 750))
			arenas.push(pathPlatforms[pathPlatforms.length-1])
			
			
			currentX += 1000
			currentY += 100*/
		}
	}
	
	canvas.requestPointerLock();
}



	


//refresh()