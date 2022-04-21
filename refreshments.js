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


var onGround = false;

var lastAverage = {x: 0, y: 0, z: 0};


var then = 0;

function refresh(now) {

	let deltaTime = now - then;
	then = now;

	// apply interaction

	let speed = .75

	if (w) {
		velocityX += speed * Math.cos(angleY - (Math.PI / 2))
	  velocityZ += speed * Math.sin(angleY - (Math.PI / 2))
	}
	if (a) {
		velocityX += speed * Math.cos(angleY)
	  velocityZ += speed * Math.sin(angleY)
	}
	if (s) {
		velocityX -= speed * Math.cos(angleY - (Math.PI / 2))
	  velocityZ -= speed * Math.sin(angleY - (Math.PI / 2))
	}
	if (d) {
		velocityX -= speed * Math.cos(angleY)
	  velocityZ -= speed * Math.sin(angleY)
	}

	if (space && onGround) {
		velocityY += 50
	}
	if (shift) {
		velocityY -= speed
	}

	velocityX /= 1.1
	velocityY -= 1
	velocityZ /= 1.1

	// move cube

	

	for (let i = 0; i < 8; i++) {
		movePoint(i, 0, velocityY, 0)
	}
	

	// find lowest point

	let lowest = 0,
			secondLowest = 7,
			thirdLowest = 0,
			fourthLowest = 0,
			
			highest = 0,
			secondHighest = 0,
			thirdHighest = 0,
			fourthHighest = 0

	for (let i = 1; i < 8; i++) {
		if (point(i, Y) < point(lowest, Y)) lowest = i
		if (point(i, Y) > point(highest, Y)) highest = i
	}
	while (secondLowest == lowest) secondLowest++
	for (let i = 0; i < 8; i++) {
		if (i != lowest) {
			if (point(i, Y) < point(secondLowest, Y)) secondLowest = i
		}
	}
	while (thirdLowest == secondLowest || thirdLowest == lowest) secondLowest++
	for (let i = 0; i < 8; i++) {
		if (i != lowest && i != secondLowest) {
			if (point(i, Y) < point(thirdLowest, Y)) thirdLowest = i
		}
	}
	while (fourthLowest == thirdLowest || fourthLowest == secondLowest || fourthLowest == lowest) secondLowest++
	for (let i = 0; i < 8; i++) {
		if (i != lowest && i != secondLowest && i != thirdLowest) {
			if (point(i, Y) < point(fourthLowest, Y)) fourthLowest = i
		}
	}

	console.log(lowest + ", " + secondLowest + ", " + thirdLowest + ", " + fourthLowest)

	if (!w && !a && !s && !d && (Math.abs(point(lowest, Y) - Math.abs(point(thirdLowest, Y)))) < 2) {
		velocityX = 0
		velocityZ = 0
	}

	//console.log((Math.abs(point(lowest, Y) - Math.abs(point(fourthLowest, Y)))))
		
	if (onGround) {
		let leaningX = point(highest, X) - point(lowest, X);
		let leaningZ = point(highest, Z) - point(lowest, Z);

		let leaningTotal = Math.abs(leaningX) + Math.abs(leaningZ);

		if (leaningTotal != 0) {
			leaningX /= leaningTotal * 1
			leaningZ /= leaningTotal * 1
		}

		

		velocityX += leaningX
		velocityZ += leaningZ
		
	}
	



	


	
	rotateCubeZ(point(lowest, X), point(lowest, Y), -velocityX/100)
	rotateCubeX(point(lowest, Y), point(lowest, Z), velocityZ/100)


	if (point(lowest, Y) <= 0) {
		onGround = true
		let difference = -point(lowest, Y);
		velocityY = 0
		
		for (let i = 0; i < 8; i++) {
			movePoint(i, 0, difference, 0)
		}



		
	} else {
		onGround = false
		
		for (let i = 0; i < 8; i++) {
			movePoint(i, velocityX, 0, velocityZ)
			
			
		}
	}
	
	let average = calculateAverage()

	document.getElementById("coordinates").innerHTML = "x: " + Math.round(average.x) + "<br>y: " + Math.round(average.y) + "<br>z: " + Math.round(average.z)
	
	

	// make matrices
	
	var tMatrix = mat4.create();

	mat4.translate(tMatrix, tMatrix, [0, 0, -400])
  mat4.rotateX(tMatrix, tMatrix, angleX);
  mat4.rotateY(tMatrix, tMatrix, angleY);
	mat4.translate(tMatrix, tMatrix, [-average.x, -((average.y + lastAverage.y) / 2), -average.z]);

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

	lastAverage = average

	lastVelocityX = velocityX;
	lastVelocityY = velocityY;
	lastVelocityZ = velocityZ;
	
	// calculate lighting

	let colors = pointColors;
	
  gl.bindBuffer(gl.ARRAY_BUFFER, pointColorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

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
	


	gl.useProgram(program);



	// draw


  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, polys.length, gl.UNSIGNED_SHORT, 0);


	if (running) requestAnimationFrame(refresh)
}