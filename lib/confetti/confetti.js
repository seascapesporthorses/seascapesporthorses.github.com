var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

function initialize () {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

var confettiList = [];

FALL_SPEED = 2;
DRIFT_SPEED = 1;
ROTATE_SPEED = 0.02;
FLIP_SPEED = 0.2;
CONFETTI_LIMIT = 200;
CONFETTI_SIZE = 4;
CONFETTI_INTERVAL = 20;

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
  saturation = (Math.random()*0.5+0.5)*100;
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
// Animation Loop
function animate() {
  var nextTime = Date.now();
  requestAnimationFrame(animate);
  context.resetTransform();
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (confettiList.length < CONFETTI_LIMIT && (nextTime - lastTime) > CONFETTI_INTERVAL) {
    confettiList.push(new Confetti());
    lastTime = Date.now();
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

initialize();
animate();
