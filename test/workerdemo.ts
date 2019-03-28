import ParticleSystem from '../src/ParticleSystem'

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = (<Window>window).innerWidth;
canvas.height = (<Window>window).innerHeight;

document.body.appendChild(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const img: HTMLImageElement = document.createElement('img');

img.src = './test/timg.png';
img.onload = () => {
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