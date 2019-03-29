const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = (<Window>window).innerWidth;
canvas.height = (<Window>window).innerHeight;

document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const img: HTMLImageElement = document.createElement('img');

img.src = './test/timg.png';
img.onload = () => {
  const worker = new Worker('./test/worker.js')

  worker.postMessage({
    action: 'create',
    textureInfo: {
      width: img.width,
      height: img.height
    },
    config: {
      gravity: {
        x: 10,
        y: 80
      },
      emitterX: 200,
      emitterY: -10,
      emitterXVariance: 200,
      emitterYVariance: 10,
      maxParticles: 50,
      endRotation: Math.PI * 4,
      endRotationVariance: 0,
      speed: 50,
      angle: Math.PI / 2,
      angleVariance: Math.PI / 2,
      startSize: 15,
      startSizeVariance: 5,
      lifespan: 5000
    }
  })

  // 开始
  worker.postMessage({
    action: 'start'
  })

  // 主线程监听子线程传送的数据进行渲染
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