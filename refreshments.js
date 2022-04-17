var posX = 0,
		posY = 0,
		posZ = 0

var angleX = 0,
		angleY = 0,
		angleZ = 0

var velocityX = 0,
		velocityY = 0,
		velocityZ = 0


var then = 0;

function refresh(now) {

	let deltaTime = now - then;
	then = now;

	// apply interaction

	let speed = 1

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

	if (space) {
		velocityY += speed
	}
	if (shift) {
		velocityY -= speed
	}

	velocityX /= 1.5
	velocityY /= 1.5
	velocityZ /= 1.5

	posX += velocityX
	posY += velocityY
	posZ += velocityZ




	// move cube

	let totalX = 0,
			totalY = 0,
			totalZ = 0

	for (let i = 0; i < 8; i++) {
		movePoint(i, velocityX, velocityY, velocityZ)
		
		totalX += points[i*3 + 0]
		totalY += points[i*3 + 1]
		totalZ += points[i*3 + 2]
		
		
	}

	let averageX = totalX / 8,
			averageY = totalY / 8,
			averageZ = totalZ / 8
			

	rotateCubeZ(averageX, averageY, -velocityX/50)
	rotateCubeX(averageY, averageZ, velocityZ/50)



	

	// make matrices
	
	var tMatrix = mat4.create();

	mat4.translate(tMatrix, tMatrix, [0, 0, -200])
  mat4.rotateX(tMatrix, tMatrix, angleX);
  mat4.rotateY(tMatrix, tMatrix, angleY);
	mat4.translate(tMatrix, tMatrix, [-averageX, -averageY, -averageZ]);

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