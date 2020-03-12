// wait until the page is loaded
$(document).ready(() => {
	/////////////////////////////////////////
	// CONSTANTS
	const canvas = $('canvas')[0];
	const context = canvas.getContext('2d');
	const scale = 20;
	const DOWN = 2;
	const UP = 0;
	const RIGHT = 1;
	const LEFT = 3;

	//////////////////////////////////////////
	// VARIABLES
	let counter;
	let direction;
	let food;
	let lastPos;
	let level;
	let lastTime = 0;
	let newTail = null;
	let playerInterval;
	let score;
	let snakeArray;

	///////////////////////////////////////////
	// EVENT LISTENERS

	// key presses
	$(document).keydown((event) => {
		switch(event.keyCode) {
			// up arrow
			case 38:
			if (direction != UP && direction != DOWN)
				direction = UP;
			break;
			// right arrow
			case 39:
			if (direction != RIGHT && direction != LEFT)
				direction = RIGHT;
			break;
			// down arrow
			case 40:
			if (direction != DOWN && direction != UP)
				direction = DOWN;
			break;
			// left arrow
			case 37:
			if (direction != LEFT && direction != RIGHT)
				direction = LEFT;
			break;
		}
	});

	// clicking the game over screen
	$('#gameOver').click((event) => {
		// hiding the game over screen
		$('#gameOver').hide();

		// start a new game
		newLevel();
		
		// start the update loop
		// look for function update()
		requestAnimationFrame(update);
	});
	
	///////////////////////////////////////////
	// FUNCTIONS

	// the main draw function
	function draw() {
		$('#score').html(score);
		// create a new array to hold the new snake positions
		let newSnakeArray = [];

		// reset canvas to all black
		context.fillStyle = '#000';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// draw food
		context.fillStyle = '#00ff00';
		context.fillRect(food[0], food[1], 1, 1);

		// draw snake
		context.fillStyle = '#FFF';
		// loop over the snake array backwards (the head is at the end)
		for (var i = snakeArray.length - 1; i >= 0; i--) {
			let snakeBit = snakeArray[i];

			// we are at the head of the snake (last spot in array) so check collisions
			if (i == snakeArray.length - 1) { 
				
				// check if snake hit wall
				if (snakeBit[0] < 0 || snakeBit[0] > (canvas.width / scale) ||
					snakeBit[1] < 0 || snakeBit[1] > (canvas.height / scale)) {
					gameOver();
					return false;
				}

				// check if snake hit self
				if (snakeArray.length > 1) {
					for (var j = snakeArray.length - 2; j >= 0; j--) {
						let checkBit = snakeArray[j]; 
						if (checkBit[0] == snakeBit[0] && checkBit[1] == snakeBit[1]){
							gameOver();
							return false;
						}
					}
				}

				// check if snake ate food
				if (snakeBit[0] === food[0] && snakeBit[1] === food[1]){
					lastPos = food;
					newLevel();
				}
			}

			// actually draw the bit we are on
			context.fillRect(
				snakeBit[0],
				snakeBit[1], 
				1, 1);
			
			// shift the old positions into a new array, except for the last one
			if (i > 0) 
				newSnakeArray.unshift(snakeBit);
			
			// if we need to add the new tail, do it last
			if (i == 0 && snakeBit[0] == lastPos[0] && snakeBit[1] == lastPos[1]) {
				newSnakeArray.unshift(lastPos);
				lastPos = [-10, -10];
			}
		}

		// set up the postion for the new head
		let newPos = [];
		let snakeFront = snakeArray[snakeArray.length - 1];

		// depending on the direction to tell us where it goes
		switch(direction) {
			case UP:
			newPos.push(snakeFront[0]);
			newPos.push(snakeFront[1] - 1);
			break;
			case RIGHT:
			newPos.push(snakeFront[0] + 1);
			newPos.push(snakeFront[1]);
			break;
			case DOWN:
			newPos.push(snakeFront[0]);
			newPos.push(snakeFront[1] + 1);
			break;
			case LEFT:
			newPos.push(snakeFront[0] - 1);
			newPos.push(snakeFront[1]);
			break;
		}
		// put the new head position into the array
		newSnakeArray.push(newPos);

		// swap the new array into use
		snakeArray = newSnakeArray;
		return true;
	}

	// resetting the game
	function gameOver() {
		// show the game over screen
		$('#gameOver').show();

		// TODO: save high score locally
		score = 0;
		level = -1;
		playerInterval = 300;
		counter = 0;
		lastPos = [-10, -10];

		//TODO: make the snake start in a ranged space, going a random direction
		snakeArray = [[0,0]];
		direction = DOWN;

		food = [5, 5];
	}

	// this function advances to the next level
	function newLevel() {
		level += 1;
		score += (100 * level);
		playerInterval -= (8);

		// create a new food randomly
		// TODO: dont place a food anywhere on the snake
		food = [
			Math.floor((Math.random() * (canvas.width / scale)) + 1) -1, 
			Math.floor((Math.random() * (canvas.width / scale)) + 1) -1
		];
	}

	// this is the main game loop
	function update(time) {
		// check how long it has been since we last ran this function
		let diff = lastTime == 0 ? playerInterval : time - lastTime;
		counter += diff;
		// only update the player every playerInterval (which changes every level)
		if (counter >= playerInterval) {
			if (!draw())
				return;
			counter = 0;
		}
		// keep track of the last time
		lastTime = time;

		// loop back into this function
		requestAnimationFrame(update);
	}

	///////////////////////////////////////////


	// make the canvas context scale to get 1 pixel to look like a big square
	context.scale(scale, scale);

	// Start the game by calling gameOver();
	gameOver();

});