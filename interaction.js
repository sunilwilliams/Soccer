var running = false

var w = false,
		a = false,
		s = false,
		d = false

var space = false,
		shift = false

var up = false,
		down = false,
		left = false,
		right = false

var pointerLocked = false;

document.addEventListener("keydown", function (event) {
	
	event.preventDefault();

  if (event.keyCode == 87) w = true;
  if (event.keyCode == 68) a = true;
  if (event.keyCode == 83) s = true;
  if (event.keyCode == 65) d = true;
	
  if (event.keyCode == 32) space = true;
  if (event.keyCode == 16) shift = true;
  
  if (event.keyCode == 38) up = true; // up
  if (event.keyCode == 40) down = true; // down
	if (event.keyCode == 37) left = true; // left
  if (event.keyCode == 49) right = true; // right
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 87) w = false;
  if (event.keyCode == 68) a = false;
  if (event.keyCode == 83) s = false;
  if (event.keyCode == 65) d = false;
	
  if (event.keyCode == 32) space = false;
  if (event.keyCode == 16) shift = false;

  if (event.keyCode == 38) up = false; // up
  if (event.keyCode == 40) down = false; // down

	if (event.keyCode == 37) left = false; // left
  if (event.keyCode == 49) right = false; // right


});


canvas.onclick = function() {
	canvas.requestPointerLock();
}

document.addEventListener("pointerlockchange", function () {
	if (document.pointerLockElement === canvas) {
		pointerLocked = true
		if (!running) {
			running = true
			refresh()
		}
	} else {
		pointerLocked = false
		running = false
	}
}, false)


document.addEventListener("mousemove", function (event) {
	if (pointerLocked) {
		sensitivity = Math.PI / 512;
		angleX += sensitivity * event.movementY
		angleY += sensitivity * event.movementX
	}
	
}, false)