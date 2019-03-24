import ParticleSystem from '../src/ParticleSystem'

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = (<Window>window).innerWidth;
canvas.height = (<Window>window).innerHeight;

document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const img: HTMLImageElement = document.createElement('img');

img.src = './src/timg.png';

ctx.fillRect(0, 0, canvas.width, canvas.height);

img.onload = () => {
  const particle = new ParticleSystem(img, {
    width: img.width,
    height: img.height
  }, {
    gravity: {
      x: 10,
      y: 80
    },
    emitterX: 100,
    emitterY: 100,
    emitterXVariance: 10,
    emitterYVariance: 10,
    maxParticles: 20,
    speed: 50,
    angle: 0,
    angleVariance: Math.PI,
    startSize: 10,
    startSizeVariance: 5,
    lifespan: 2000
  }, ctx) 

  particle.start();

  setTimeout(() => {
    particle.stop()
  }, 2000)

  document.onclick = function () {
    particle.start()
  }

  // ctx.drawImage(img, 100, 100)
}