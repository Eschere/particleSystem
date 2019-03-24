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

  private config: string | any
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
  constructor (
    texture: CanvasImageSource,
    textureInfo: {
      width: number,
      height: number
    },
    config: string | any,
    ctx?: CanvasRenderingContext2D
  ) {
    this.texture = texture;

    this.ctx = ctx;

    this.initConfig(config, textureInfo);

    this.emissionRate = this.lifespan / this.maxParticles;

    this.createParticlePool();
  }

  // 参数初始化
  private initConfig (config: any, textureInfo) {
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

    this.startSize = config.startSize;
    this.startSizeVariance = config.startSizeVariance;

    this.textureWidth = textureInfo.width;
    this.textureHeight = textureInfo.height;

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

    particle.setTextureInfo({
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

    this.pool.push(particle);
  }

  private initParticle (particle: Particle): Particle {
    particle.currentTime = 0;
    particle.lifespan = this.lifespan;

    particle.x = this.emitterX + randRange(this.emitterXVariance);

    particle.y = this.emitterY + randRange(this.emitterYVariance);

    particle.velocityX = this.speed * Math.cos(this.angle);

    particle.velocityY = this.speed * Math.sin(this.angle);

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

  private update (dt: number) {
    this.frameTime += dt;

    // 是否需要新增粒子
    while (this.frameTime > 0) {
      if (this.particleList.length < this.maxParticles) {
        this.addOneParticle()
      }

      this.frameTime -= this.emissionRate;
    }

    // 更新粒子状态或移除粒子
    this.particleList.forEach((particle: Particle) => {
      if (particle.currentTime < particle.lifespan) {
        this.updateParticle(particle, dt);
        particle.currentTime += dt;
      } else {
        this.removeOneParticle(particle);
      }
    })

    this.render();
  }

  public render () {
    this.particleList.forEach((particle: Particle) => {
      let {
        x,
        y,
        width,
        height
      } = particle;

      this.ctx.drawImage(this.texture, x, y, width, height);
    })
  }

  private circleDraw (dt: number) {
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.update(dt);

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
    this.lastTime = Date.now();
    this.circleDraw(0);
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

  private ratio: number

  // 输入的图像宽高
  private _width: number
  private _height: number

  set startSize (size: number) {
    this._startSize = size;

    this._width = size;
    this._height = size / this.ratio;
  }

  get startSize (): number {
    return this._startSize;
  }

  get progress (): number {
    return this.currentTime / this.lifespan;
  }

  public setTextureInfo (config: {
    width: number,
    height: number
  }) {
    this.ratio = config.width / config.height;
  }

  public setProperty (config: any) {    
    this.x = config.x;
    this.y = config.y;

    this.velocityX = config.velocityX;
    this.velocityY = config.velocityY;
  }

  /**
   * reset 
   */
  public reset () {
    this.startX = 0;
    this.startY = 0;

    this.x = 0;
    this.y = 0;

    this.velocityX = 0;
    this.velocityY = 0;
  }

  public get width (): number {
    return this._width;
  }

  public get height (): number {
    return this._height;
  }
}

export default ParticleSystem;
