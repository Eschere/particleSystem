import ParticleSystem from '../src/ParticleSystem'

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = (<Window>window).innerWidth;
canvas.height = (<Window>window).innerHeight;

document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const img: HTMLImageElement = document.createElement('img');

img.src = './test/timg.png';

img.onload = () => {
  const particle = new ParticleSystem(img, {
    width: img.width,
    height: img.height
  }, {
    gravity: {
      x: 10,
      y: 80
    },
    emitterX: 200,
    emitterY: -10,
    emitterXVariance: 200,
    emitterYVariance: 10,
    maxParticles: 10,
    endRotation: 2,
    endRotationVariance: 50,
    speed: 50,
    angle: Math.PI / 2,
    angleVariance: Math.PI / 2,
    startSize: 15,
    startSizeVariance: 5,
    lifespan: 5000
  }, ctx) 

  particle.start();

  // setTimeout(() => {
  //   particle.stop()
  // }, 2000)

  document.onclick = function () {
    const img: HTMLImageElement = document.createElement('img');

    img.src = './test/rain.png';
    
    img.onload = () => {
      particle.changeTexture(img, {
        width: img.width,
        height: img.height,
      })

      particle.changeConfig({
        gravity: {
          x: 0,
          y: 100
        },
        emitterX: 200,
        emitterY: -50,
        emitterXVariance: 200,
        emitterYVariance: 10,
        maxParticles: 50,
        speed: 100,
        angle: Math.PI / 2,
        angleVariance: 0,
        startSize: 1,
        startSizeVariance: 2,
        lifespan: 2000
      })
    }
  }

  // ctx.drawImage(img, 100, 100)
}