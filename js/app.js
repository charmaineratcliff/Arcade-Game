let startModal = document.querySelector(".start-modal");
let overlay = document.querySelector(".overlay");
let gameend = document.querySelector(".gameend");
let winningModal = document.querySelector(".winner-modal");

var gamePoints = 0;
var gameLives = 3;

// Starts the game and hides the starter modal
function startGame() {
  startModal.classList.add("hide");
  overlay.classList.add("hide");
  gamePoints = 0;
}

// Resets game
function gameOver() {
  gameend.classList.add("show");
  overlay.classList.add("show");
};

function resetGame(){
  window.location.reload(true);
}

function resetGameWon(){
    gameend.classList.add("hide");
    overlay.classList.add("hide");
    gamePoints = 0;
    gameLives = 3;
}

function checkLives() {
  if(allLives.length === 0) {
    gameOver();
  }
}

function youWon(){
  overlay.classList.add("show");
  winningModal.classList.add("show");
}

///// Enemies

// Enemies the player must avoid
var Enemy = function() {
  // Randomly sets the speed for each enemy
  this.sprite = 'images/enemy-bug.png';
  this.speed = Math.round(Math.random() * 3) +1;

  // Sets position of the enemy.
  // X coordinate ensures the enemy is off of the screen when it starts.
  // Y coordinate ensures they land on grass parts of the game.
  // Sprite is the image of the enemy.
  setTimeout(()=> {
    this.x = -50
    this.y = [66, 149, 232] [Math.round(Math.random() * 2)];
  }, this.speed * 100);
  };

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Multiplies any movement to ensure that the game runs at the same speed
// for all computers.

Enemy.prototype.update = function(dt) {
  this.x = (this.x + dt * this.speed * 150) % (500);
  checkLives();
};

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Resets the game and changes the speed
Enemy.prototype.reset = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Positions the player
var Player = function (x, y) {
  this.sprite = 'images/char-boy.png';
  this.x = x;
  this.y = y;
}

var playerX
var playerY

Player.prototype.update = function() {
  playerX = this.x;
  playerY = this.y;
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Positions player according to the boundaries.
Player.prototype.handleInput = function(move) {
  var xMove = 101;
  var yMove = 83;
  if(move === 'left') {
    this.x -= this.x >= xMove ? xMove : 0;
  }
  if(move === 'right') {
    this.x += this.x < 4 * xMove ? 101 : 0;
  }
  if(move === 'down') {
    this.y += this.y < 5 * 80 ? yMove : 0;
  }
  if(move === 'up' && this.y > 18) {
    this.y -= 83;
    }
};

Player.prototype.reset = function() {
  this.x = 2 * 101;
  this.y = 5 * 80;
}

////// Lives
var Lives = function(x, y){
  this.sprite = 'images/Heart.png';
  this.x = x;
  this.y = y;
}

Lives.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 28, 42);
}

/////// Gems
var Gem = function(x, y){
  this.sprite = 'images/Gem-Orange.png';
  this.x = x;
  this.y = y;
}

Gem.prototype.render = function (){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 85, 145);
}

/////// Winner
var Winner = function(x, y) {
  this.x = x;
  this.y = y;
}

var winnerX
var winnerY

Winner.prototype.update = function(){
  winnerX = this.x;
  winnerY = this.y;

  if ((-Math.abs(winnerY)) == playerY && winnerX == playerX) {
    allGems.push(new Gem(winnerX, winnerY));
    gamePoints += 100;
    player.reset();
  }
  if (allGems.length == 3) {
    youWon();
  }
}

/////// points
var Points = function(x, y, score) {
  this.x = x;
  this.y = y;
  this.score = "Points: " + gamePoints;
}

Points.prototype.render = function() {
  ctx.font = '20px sans-serif';
  ctx.fillText(this.score, this.x, this.y);
}

Points.prototype.update = function() {
  this.score = "Points: " + gamePoints;
};

// Places all enemies into an array
var allEnemies = [];

for(var i = 0; i < 3; i++) {
  allEnemies[i] = new Enemy();
  setInterval(()=> {
    if(allEnemies[0].x > 450) {
      allEnemies[allEnemies.length] = new Enemy();
      allEnemies.splice(0, 1);
    }
  }, 200)
}

var allEnemies = [new Enemy(-50, 60), new Enemy(-50, 140), new Enemy(-50, 300)];

var player = new Player(202, 400);

var allLives = [new Lives(410, 540), new Lives(440, 540), new Lives(470, 540)];

var allGems = [];

var winnerSquares = [new Winner(0, -15), new Winner(101, -15), new Winner(202, -15), new Winner(303, -15), new Winner(404, -15)];

var scores = new Points(10, 570)

// This listens for key presesses and send the keys to the Player.handleInput()
// method.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
