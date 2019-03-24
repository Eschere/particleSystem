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
      y: 10
    },
    emitterX: -canvas.width / 2,
    emitterXVariance: canvas.width / 2,
    emitterYVariance: 200,
    emitterY: -100,
    maxParticles: 100,
    speed: 10,
    angle: Math.PI / 4,
    startSize: 10,
    startSizeVariance: 20,
    lifespan: 10000
  }, ctx) 

  particle.start();

  // ctx.drawImage(img, 100, 100)
}