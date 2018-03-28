var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// Declarations
var FALL_SPEED;
var DRIFT_SPEED;
var ROTATE_SPEED;
var FLIP_SPEED;
var CONFETTI_LIMIT;
var CONFETTI_SIZE;
var CONFETTI_INTERVAL;
var RESOLUTION = 1;
var FPS = 60;

function initialize () {
  canvas.width = canvas.clientWidth/RESOLUTION;
  canvas.height = canvas.clientHeight/RESOLUTION;
  FALL_SPEED = 2*60/FPS;
  DRIFT_SPEED = 1*60/FPS;
  ROTATE_SPEED = 0.02*60/FPS;
  FLIP_SPEED = 0.2*60/FPS;
  CONFETTI_LIMIT = canvas.width/20;
  CONFETTI_SIZE = 4/RESOLUTION;
  CONFETTI_INTERVAL = (canvas.height*1000)/(FALL_SPEED*60*CONFETTI_LIMIT);
}

initialize();

var confettiList = [];

function Confetti () {
  this.yPosition = 0;
  this.xPosition = canvas.width*Math.random();
  this.rotation = 0;
  this.flip = 0;
  this.ySpeed = (Math.random()*0.5+0.5)*FALL_SPEED;
  this.xSpeed = (Math.random()*2-1)*DRIFT_SPEED;
  this.rotationSpeed = (Math.random()*2-1)*ROTATE_SPEED;
  this.flipSpeed = (Math.random()*2-1)*FLIP_SPEED;
  this.hue = Math.random()*360;
}

Confetti.prototype.step = function () {
  this.yPosition += this.ySpeed;
  this.xPosition += this.xSpeed;
  this.rotation += this.rotationSpeed;
  this.flip += this.flipSpeed;
}

Confetti.prototype.visible = function () {
  return this.xPosition > 0 && this.yPosition > 0 && this.xPosition < canvas.width && this.yPosition < canvas.height;
}

Confetti.prototype.color = function () {
  alpha = (1-(this.yPosition/canvas.height));
  saturation = (Math.pow(Math.sin(this.flip), 20)*0.5+0.5)*100
  return "hsla(" + this.hue + ", 100%, " + saturation + "%, " + alpha + ")";
}

Confetti.prototype.draw = function () {
  context.fillStyle = this.color();
  context.resetTransform();
  context.translate(this.xPosition+CONFETTI_SIZE/2, this.yPosition+CONFETTI_SIZE/2);
  context.scale(Math.sin(this.flip), 1);
  context.rotate(Math.PI*2*this.rotation);
  context.fillRect(-CONFETTI_SIZE/2, -CONFETTI_SIZE/2, CONFETTI_SIZE, CONFETTI_SIZE);
}

var lastTime = Date.now();
var lastMakeTime = lastTime;
// Animation Loop
function animate() {
  var nextTime = Date.now();
  requestAnimationFrame(animate);
  if (nextTime - lastTime < 1000 / FPS ) {
    return;
  }
  lastTime = nextTime;
  context.resetTransform();
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (confettiList.length < CONFETTI_LIMIT && (nextTime - lastMakeTime) > CONFETTI_INTERVAL) {
    confettiList.push(new Confetti());
    lastMakeTime = nextTime;
  }
  confettiList.forEach(function (confetti) {
    confetti.step();
    confetti.draw();
  });
  confettiList = confettiList.filter(function (confetti) {
    return confetti.visible();
  });
}

window.addEventListener('resize', initialize);

animate();
