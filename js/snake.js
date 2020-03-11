$(document).ready(() => {
	let score = 0;
	const canvas = $('canvas')[0];
	const context = canvas.getContext('2d');
	const scale = 20;
	context.scale(scale, scale);

	let level = -1;
	//let snakeArray = [[(canvas.width / scale) / 2, (canvas.height / scale) / 2]];
	//               back           front
	let snakeArray = [[0,0]];
	let direction = 2;
	let food = [5, 5];
	let lastPos = [-10, -10];
	let newTail = null;
	let newSnakeArray = [];
	
	function draw() {
		$('#score').html(score);

		newSnakeArray = [];
		// reset canvas
		context.fillStyle = '#000';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// draw food
		context.fillStyle = '#00ff00';
		context.fillRect(food[0], food[1], 1, 1);

		// draw snake
		context.fillStyle = '#FFF';
		
		for (var i = snakeArray.length - 1; i >= 0; i--) {
			let snakeBit = snakeArray[i];

			// first snake spot
			if (i == snakeArray.length - 1) { 
				
				// hit wall
				if (snakeBit[0] < 0 || snakeBit[0] > (canvas.width / scale) ||
					snakeBit[1] < 0 || snakeBit[1] > (canvas.height / scale)) {
					gameOver();
					return false;
				}

				// hit self
				if (snakeArray.length > 1) {
					for (var j = snakeArray.length - 2; j >= 0; j--) {
						let checkBit = snakeArray[j]; 
						if (checkBit[0] == snakeBit[0] && checkBit[1] == snakeBit[1]){
							gameOver();
							return false;
						}
					}
				}

				// eat food
				if (snakeBit[0] === food[0] && snakeBit[1] === food[1]){
					lastPos = food;
					newLevel();
				}
			}

			context.fillRect(
				snakeBit[0],
				snakeBit[1], 
				1, 1);
			
			// start setting up new positions
			if (i > 0) 
				newSnakeArray.unshift(snakeBit);
			
			// add the new tail
			if (i == 0 && snakeBit[0] == lastPos[0] && snakeBit[1] == lastPos[1]) {
				newSnakeArray.unshift(lastPos);
				lastPos = [-10, -10];
			}
		}

		let newPos = [];
		let snakeFront = snakeArray[snakeArray.length - 1];

		switch(direction) {
			//up
			case 0:
			newPos.push(snakeFront[0]);
			newPos.push(snakeFront[1] - 1);
			break;
			//right
			case 1:
			newPos.push(snakeFront[0] + 1);
			newPos.push(snakeFront[1]);
			break;
			//down
			case 2:
			newPos.push(snakeFront[0]);
			newPos.push(snakeFront[1] + 1);
			break;
			//left
			case 3:
			newPos.push(snakeFront[0] - 1);
			newPos.push(snakeFront[1]);
			break;
		}
		newSnakeArray.push(newPos);

		snakeArray = newSnakeArray;
		return true;
	}

	function newLevel() {
		level += 1;
		score += (100 * level);
		interval -= (8);
		console.log(interval);
		food = [
			Math.floor((Math.random() * (canvas.width / scale)) + 1) -1, 
			Math.floor((Math.random() * (canvas.width / scale)) + 1) -1
		];
	}

	let counter = 0;
	let lastTime = 0;
	let interval = 300;
	function update(time) {
		let diff = lastTime == 0 ? interval : time - lastTime;
		counter += diff;
		if (counter >= interval) {
			if (!draw())
				return;
			counter = 0;
		}
		lastTime = time;
		requestAnimationFrame(update);
	}

	$(document).keydown((event) => {
		switch(event.keyCode) {
			case 38:
			if (direction != 0 && direction != 2)
				direction = 0;
			break;
			case 39:
			if (direction != 1 && direction != 3)
				direction = 1;
			break;
			case 40:
			if (direction != 2 && direction != 0)
				direction = 2;
			break;
			case 37:
			if (direction != 3 && direction != 1)
				direction = 3;
			break;
		}
	});

	function gameOver() {
		level = -1;
		snakeArray = [[0,0]];
		direction = 2;
		$('#gameOver').show();
	}

	$('#startGame').click((event) => {
		newLevel();
		$('#gameOver').hide();
		requestAnimationFrame(update);
	});
	gameOver();

});