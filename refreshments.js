var X = 0,
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

var fallRotateZ = 0,
		fallRotateX = 0

var onGround = false;


var then = 0;

function refresh(now) {

	let deltaTime = now - then;
	then = now;

	// apply interaction

	let speed = .5

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
	
	let average = calculateAverage();
	


	// find lowest point

	let lowest = [0, 0, 0, 0]
	let highest = [0, 0, 0, 0]

	for (let i = 1; i < 8; i++) {
		if (point(i, Y) < point(lowest[0], Y)) lowest[0] = i
		if (point(i, Y) > point(highest[0], Y)) highest[0] = i
	}
	for (let i = 1; i < 8; i++) {
		if (i != lowest[0]) {
			if (point(i, Y) < point(lowest[1], Y)) lowest[1] = i
			if (point(i, Y) > point(highest[1], Y)) highest[1] = i
		}
	}
	for (let i = 1; i < 8; i++) {
		if (i != lowest[0] && i != lowest[1]) {
			if (point(i, Y) < point(lowest[2], Y)) lowest[2] = i
			if (point(i, Y) > point(highest[3], Y)) highest[2] = i
		}
	}
	for (let i = 1; i < 8; i++) {
		if (i != lowest[0] && i != lowest[1] && i != lowest[2]) {
			if (point(i, Y) < point(lowest[3], Y)) lowest[3] = i
			if (point(i, Y) > point(highest[3], Y)) highest[3] = i
		}
	}

	let fallSpeed = .005

	if (onGround) {
		let leaningX = point(highest[0], X) - point(lowest[0], X);
		let leaningZ = point(highest[0], Z) - point(lowest[0], Z);

		let leaningTotal = Math.abs(leaningX) + Math.abs(leaningZ);

		if (leaningTotal != 0) {
			leaningX /= leaningTotal * 2
			leaningZ /= leaningTotal * 2
		}

		//console.log(leaningX + leaningZ)
	
	
		//if (leaningX > 0) leaningX = fallSpeed;
		//if (leaningX < 0) leaningX = -fallSpeed;
		
		//if (leaningZ > 0) leaningZ = fallSpeed;
		//if (leaningZ < 0) leaningZ = -fallSpeed;
		
	
		//fallRotateX += leaningX
		//fallRotateZ += leaningZ

		velocityX += leaningX
		velocityZ += leaningZ
	}
	
	//if (Math.abs(fallRotateX) < .001) fallRotateX = 0;
	//if (Math.abs(fallRotateZ) < .001) fallRotateZ = 0;


	fallRotateX /= 1.05
	fallRotateZ /= 1.05

	


	


	
	rotateCubeZ(point(lowest[0], X), point(lowest[0], Y), -velocityX/100 - fallRotateX)
	rotateCubeX(point(lowest[0], Y), point(lowest[0], Z), velocityZ/100 + fallRotateZ)


	if (points[lowest[0]*3 + 1] <= 0) {
		onGround = true
		let difference = -point(lowest[0], Y);
		velocityY = 0
		
		for (let i = 0; i < 8; i++) {
			movePoint(i, 0, difference, 0)
			
			
		}


		// if bottommost non-anchor point is above anchor point
		
		// rotate fall

		fallRotateSpeed = .1
		
		//if (highAverageZ < lowAverageZ) fallRotateZ -= .001
		//if (highAverageZ > lowAverageZ) fallRotateZ += .001
		
		//if (highAverageX < highAverageX) fallRotateX -= .001
		//if (highAverageX > highAverageX) fallRotateX += .001

		
		
	} else {
		onGround = false
		
		for (let i = 0; i < 8; i++) {
			movePoint(i, velocityX, 0, velocityZ)
			
			
		}
	}
	average = calculateAverage()

	document.getElementById("coordinates").innerHTML = "x: " + Math.round(average.x) + "<br>y: " + Math.round(average.y) + "<br>z: " + Math.round(average.z)
	
	

	// make matrices
	
	var tMatrix = mat4.create();

	mat4.translate(tMatrix, tMatrix, [0, 0, -300])
  mat4.rotateX(tMatrix, tMatrix, angleX);
  mat4.rotateY(tMatrix, tMatrix, angleY);
	mat4.translate(tMatrix, tMatrix, [-average.x, -50, -average.z]);

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


	requestAnimationFrame(refresh)
}