import ParticleSystem from '../src/ParticleSystem'

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = (<Window>window).innerWidth;
canvas.height = (<Window>window).innerHeight;

document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const img: HTMLImageElement = document.createElement('img');

img.src = './test/timg.png';
img.onload = () => {
  // const particle = new ParticleSystem(
  //   img,
  //   {
  //     width: img.width,
  //     height: img.height
  //   },
  //   {
  //     gravity: {
  //       x: 10,
  //       y: 80
  //     },
  //     emitterX: 200,
  //     emitterY: -10,
  //     emitterXVariance: 200,
  //     emitterYVariance: 10,
  //     maxParticles: 10,
  //     endRotation: 2,
  //     endRotationVariance: 50,
  //     speed: 50,
  //     angle: Math.PI / 2,
  //     angleVariance: Math.PI / 2,
  //     startSize: 15,
  //     startSizeVariance: 5,
  //     lifespan: 5000
  //   },
  //   ctx
  // ) 

  // particle.start();

  // document.onclick = function () {
  //   const img: HTMLImageElement = document.createElement('img');

  //   img.src = './test/rain.png';
    
  //   img.onload = () => {
  //     particle.changeTexture(img, {
  //       width: img.width,
  //       height: img.height,
  //     })

  //     particle.changeConfig({
  //       gravity: {
  //         x: 0,
  //         y: 100
  //       },
  //       emitterX: 200,
  //       emitterY: -50,
  //       emitterXVariance: 200,
  //       emitterYVariance: 10,
  //       maxParticles: 50,
  //       speed: 100,
  //       angle: Math.PI / 2,
  //       angleVariance: 0,
  //       startSize: 1,
  //       startSizeVariance: 2,
  //       lifespan: 2000
  //     })
  //   }
  // }

  const worker = new Worker('./test/worker.js')

  worker.addEventListener('message', (data) => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    data.data.forEach(particle => {
      let {
        x,
        y,
        width,
        height,
        alpha,
        rotation
      } = particle;

      let texture = img;

      // 粒子旋转和透明之后画上画布
      let halfWidth = width / 2,
        halfHeight = height /2;

      ctx.save();

      ctx.translate(x + halfWidth, y + halfHeight);

      ctx.rotate(rotation);

      if (alpha !== 1) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(texture, -halfWidth, -halfHeight, width, height);
      } else {
        ctx.drawImage(texture, -halfWidth, -halfHeight, width, height);
      }

      ctx.restore();
    })
  })
}