import ParticleSystem from '../src/ParticleSystem'

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = (<Window>window).innerWidth;
canvas.height = (<Window>window).innerHeight;

document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const img: HTMLImageElement = document.createElement('img');

img.src = './test/timg.png';
img.onload = () => {
  const particle = new ParticleSystem(
    img,
    {
      width: img.width,
      height: img.height
    },
    {
      gravity: {
        x: 0,
        y: 0
      },
      emitterX: 200,
      emitterY: 0,
      emitterXVariance: 200,
      emitterYVariance: 0,
      maxParticles: 50,
      endRotation: 2,
      endRotationVariance: 50,
      speed: 100,
      angle: Math.PI / 2,
      angleVariance: 0,
      startSize: 15,
      startSizeVariance: 5,
      lifespan: 10000
    },
    ctx
  )

  particle.start();

  particle.addBody(300, 300, 150, 150);

  // particle.addBody(100, 500, 150, 200);

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
        emitterY: 30,
        emitterXVariance: 200,
        emitterYVariance: 10,
        endRotation: 0,
        endRotationVariance: 0,
        maxParticles: 100,
        speed: 100,
        angle: Math.PI / 2,
        angleVariance: 0,
        startSize: 2,
        startSizeVariance: 0,
        lifespan: 2000
      })
    }
  }
}