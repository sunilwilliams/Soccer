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



for (let x = -1; x <= 1; x += 2) {
	for (let y = -1; y <= 1; y += 2) {
		for (let z = -1; z <= 1; z += 2) {
			addPoint(50*x, 50*y, 50*z, (x+1)/2, (y+1)/2, (z+1)/2)
		}
	}
}

addPoint(-10000, 0, -10000, .5, .5, 0)
addPoint(10000, 0, -10000, .5, 0, .5)
addPoint(10000, 0, 10000, .5, 0, 0)
addPoint(-10000, 0, 10000, .5, 1, 0)
addPoint(0, 0, 0, .5, .6, 0)

addPoint(500, 0, 500, .5, .8, .3)
addPoint(1000, 0, 500, 0, .8, .3)
addPoint(1000, 0, 1000, .5, 1, .3)
addPoint(500, 0, 1000, .5, .8, 1)
addPoint(750, 500, 750, 1, 0, .3)



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

	8, 9, 12,
	9, 10, 12,
	10, 11, 12,
	11, 8, 12,

	13, 14, 17,
	14, 15, 17,
	15, 16, 17,
	16, 13, 17,
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


// set polys to buffer

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polysBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(polys), gl.STATIC_DRAW);






refresh()