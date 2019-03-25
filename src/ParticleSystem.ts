function rand (min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randRange (range: number): number {
  range = Math.abs(range);
  return Math.random() * range * 2 - range;
}

class ParticleSystem {
  private texture: CanvasImageSource
  private textureWidth: number
  private textureHeight: number

  private canvasWidth: number
  private canvasHeight: number

  private ctx?: CanvasRenderingContext2D

  // 加速度
  private gravityX: number
  private gravityY: number

  // 粒子发射时间间隔
  private emissionRate: number

  // 发射位置
  private emitterX: number
  private emitterY: number

  // 发射位置浮动值
  private emitterXVariance: number
  private emitterYVariance: number

  // 粒子发射速度
  private speed: number

  // 粒子发射角度
  private angle: number
  private angleVariance: number

  // 旋转角度区间
  private endRotation: number
  private endRotationVariance: number

  // 开始大小
  private startSize: number
  private startSizeVariance: number
  
  // 粒子生命周期
  private lifespan: number

  // 最大粒子数
  private maxParticles: number

  // 当前粒子列表
  private particleList: Array<Particle> = []

  // 对象池粒子
  private pool: Array<Particle> = []

  // 计时器
  private frameTime: number = 0

  private dt: number = 0
  private lastTime: number

  private $stopping: boolean = false
  private $stopped: boolean = true

  public onstopped: () => undefined
  constructor (
    texture: CanvasImageSource,
    textureInfo: {
      width: number,
      height: number
    },
    config: string | any,
    ctx?: CanvasRenderingContext2D,
    canvasInfo?: {
      width: number,
      height: number
    }
  ) {
    if (canvasInfo) {
      this.canvasWidth = canvasInfo.width;
      this.canvasHeight = canvasInfo.height;
    }
    this.ctx = ctx;

    this.changeTexture(texture, textureInfo);

    this.changeConfig(config);

    this.emissionRate = this.lifespan / this.maxParticles;

    this.createParticlePool();
  }

  // 参数初始化
  public changeConfig (config: any) {
    this.gravityX = config.gravity.x;
    this.gravityY = config.gravity.y;

    this.emitterX = config.emitterX;
    this.emitterXVariance = config.emitterXVariance;
    this.emitterYVariance = config.emitterYVariance;
    this.emitterY = config.emitterY;

    this.lifespan = config.lifespan;
    this.maxParticles = config.maxParticles;

    this.speed = config.speed;

    this.angle = config.angle;
    this.angleVariance = config.angleVariance;

    this.endRotation = config.endRotation;
    this.endRotationVariance = config.endRotationVariance;

    this.startSize = config.startSize;
    this.startSizeVariance = config.startSizeVariance;
  }

  // 生成粒子
  private createParticlePool () {
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool.push(new Particle);
    }
  }

  // 加入一个粒子
  private addOneParticle () {
    let particle: Particle;

    if (this.pool.length) {
      particle = this.pool.pop();
    } else {
      particle = new Particle;
    }

    particle.setTextureInfo(this.texture, {
      width: this.textureWidth,
      height: this.textureHeight
    })

    this.initParticle(particle);

    this.particleList.push(particle);
  }

  // 去掉一个粒子
  private removeOneParticle (particle: Particle) {
    let index: number = this.particleList.indexOf(particle);

    this.particleList.splice(index, 1);

    particle.texture = null;

    this.pool.push(particle);
  }

  private initParticle (particle: Particle): Particle {
    particle.currentTime = 0;
    particle.lifespan = this.lifespan;

    particle.x = this.emitterX + randRange(this.emitterXVariance);

    particle.y = this.emitterY + randRange(this.emitterYVariance);

    particle.endRotation = this.endRotation + randRange(this.endRotationVariance);

    let angle = this.angle + randRange(this.angleVariance);

    particle.velocityX = this.speed * Math.cos(angle);

    particle.velocityY = this.speed * Math.sin(angle);

    particle.startSize = this.startSize + randRange(this.startSizeVariance);

    particle.startSize < 0 ? particle.startSize = 0.01 : null;

    particle.scale = particle.startSize / this.startSize

    particle.startSizeVariance = this.startSizeVariance;

    return particle;
  }

  public updateParticle (particle: Particle, dt: number) {
    dt = dt / 1000;

    particle.velocityX += this.gravityX * particle.scale * dt;

    particle.velocityY += this.gravityY * particle.scale * dt;
    particle.x += particle.velocityX * dt;

    particle.y += particle.velocityY * dt;
  }

  public render (dt: number) {
    this.frameTime += dt;

    // 是否需要新增粒子
    if (!this.$stopping) {
      while (this.frameTime > 0) {
        if (this.particleList.length < this.maxParticles) {
          this.addOneParticle()
        }

        this.frameTime -= this.emissionRate;
      }
    }

    // 更新粒子状态或移除粒子
    let temp: Array<Particle> = [...this.particleList];

    temp.forEach((particle: Particle) => {
      if (particle.currentTime < particle.lifespan) {
        this.updateParticle(particle, dt);
        particle.currentTime += dt;
      } else {
        this.removeOneParticle(particle);

        if (this.$stopping && this.particleList.length === 0) {
          this.$stopped = true;
          this.onstopped && this.onstopped();
        }
      }
    })

    this.draw();

    // 兼容小程序
    (<any>this.ctx).draw && (<any>this.ctx).draw();
  }

  private draw () {
    this.particleList.forEach((particle: Particle) => {
      let {
        texture,
        x,
        y,
        width,
        height,
        alpha,
        rotation
      } = particle;

      let halfWidth = width / 2,
        halfHeight = height /2;

      this.ctx.save();

      this.ctx.translate(x + halfWidth, y + halfHeight);

      this.ctx.rotate(rotation);

      if (alpha !== 1) {
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(texture, -halfWidth, -halfHeight, width, height);
      } else {
        this.ctx.drawImage(texture, -halfWidth, -halfHeight, width, height);
      }

      this.ctx.restore();
    })
  }

  public changeTexture (texture: CanvasImageSource, textureInfo: {
    width: number,
    height: number
  }) {
    this.texture = texture;

    this.textureWidth = textureInfo.width;
    this.textureHeight = textureInfo.height;
  }

  // 周期性调用
  private circleDraw (dt: number) {
    if (this.$stopped) {
      return;
    }

    let width: number, height: number;
    if (this.canvasWidth) {
      width = this.canvasWidth;
      height = this.canvasHeight;
    } else if (this.ctx.canvas) {
      width  = this.ctx.canvas.width;
      height = this.ctx.canvas.width;
    }

    this.ctx.clearRect(0, 0, width, height);
    this.render(dt);

    if (requestAnimationFrame) {
      requestAnimationFrame((dt: number) => {
        this.circleDraw(dt - this.dt);
        this.dt = dt;
      })
    } else {
      setTimeout(() => {
        let now = Date.now();
        this.circleDraw(now - this.lastTime);
        this.lastTime = now;
      }, 17)
    }
  }

  public start () {
    this.$stopping = false;

    if (!this.$stopped) {
      return;
    }

    this.lastTime = Date.now();

    this.$stopped = false;
    this.circleDraw(0);
  }

  public stop () {
    this.$stopping = true;
  }

  get isStop () {
    return this.$stopped;
  }
}

class Particle {
  public startX: number
  public startY: number

  public lifespan: number

  public velocityX: number
  public velocityY: number

  public x: number
  public y: number

  public currentTime: number

  private _startSize: number
  public startSizeVariance: number
  public scale: number

  public endRotation: number

  private ratio: number

  // 输入的图像宽高
  private _width: number
  private _height: number

  // 
  private _rotation: number

  public texture: CanvasImageSource

  set startSize (size: number) {
    this._startSize = size;

    this._width = size;
    this._height = size / this.ratio;
  }

  get startSize (): number {
    return this._startSize;
  }

  private get progress (): number {
    return this.currentTime / this.lifespan;
  }

  get alpha (): number {
    let progress = this.progress;

    if (progress > .8) {
      let alpha: number = (1 - progress) / 0.2;
      return alpha > 0 ? alpha : 0
    }
    return 1;
  }

  get rotation (): number {
    return this.endRotation * this.progress;
  }

  public setTextureInfo (texture: CanvasImageSource, config: {
    width: number,
    height: number
  }) {
    this.texture = texture;
    this.ratio = config.width / config.height;
  }

  public get width (): number {
    return this._width;
  }

  public get height (): number {
    return this._height;
  }
}

export default ParticleSystem;
