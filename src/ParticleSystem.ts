function randRange (range: number): number {
  range = Math.abs(range);
  return Math.random() * range * 2 - range;
}

function twoDecimal (number: number) {
  return Number(number.toFixed(2));
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

  // 粒子上次重绘的时间
  private lastTime: number

  private $stopping: boolean = false
  private $stopped: boolean = true

  // 力量体列表
  private bodyList: Array<Body> = []

  // 完全停止时的回调
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

    this.emissionRate = this.lifespan / this.maxParticles;
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

    if (particle.startSize < 0) {
      particle.startSize = 0.01
    }

    particle.scale = particle.startSize / this.startSize;

    return particle;
  }

  public updateParticle (particle: Particle, dt: number) {
    dt = dt / 1000;

    if (this.bodyList.length) {
      this.bodyList.forEach(body => {
        let {
          forceX,
          forceY,
          stop
        } = body.getAcceleration(particle);

        if (stop) {
          particle.velocityX = 0
          particle.velocityY = 0
        } else {
          particle.velocityX += (this.gravityX * particle.scale + forceX) * dt;
          particle.velocityY += (this.gravityY * particle.scale + forceY)* dt;
        }
      })
    } else {
      particle.velocityX += this.gravityX * particle.scale * dt;
      particle.velocityY += this.gravityY * particle.scale * dt;
    }

    particle.x += particle.velocityX * dt;

    particle.y += particle.velocityY * dt;
  }

  public update (dt: number) {
    // 是否需要新增粒子
    if (!this.$stopping) {
      this.frameTime += dt;
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
  }

  public render (dt: number, clear: boolean = false) {

    this.update(dt);

    if (typeof (<any>this.ctx).draw !== 'undefined') {
      
      if (clear) {
        this.draw();
        (<any>this.ctx).draw();
      } else {
        this.draw();
        (<any>this.ctx).draw(true);
      }
    } else {
      if (clear) {
        let width: number, height: number;
        if (this.canvasWidth) {
          width = this.canvasWidth;
          height = this.canvasHeight;
        } else if (this.ctx.canvas) {
          width  = this.ctx.canvas.width;
          height = this.ctx.canvas.height;
        }
        this.ctx.clearRect(0, 0, width, height);
        this.draw();
      } else {
        this.draw();
      }
    }
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

      // 粒子旋转和透明之后画上画布
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

    this.render(dt, true);

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        let now = Date.now();
        this.circleDraw(now - this.lastTime);
        this.lastTime = now;
      })
    } else {
      setTimeout(() => {
        let now = Date.now();
        this.circleDraw(now - this.lastTime);
        this.lastTime = now;
      }, 17)
    }
  }

  // 循环更新数据
  private circleData (dt: number, onupdate: ([]: Array<any>) => void) {
    if (this.$stopped) {
      return;
    }

    this.update(dt);

    let data = this.particleList.map((particle: Particle) => {
      let {
        texture,
        x,
        y,
        width,
        height,
        alpha,
        rotation
      } = particle;

      return {
        texture,
        x,
        y,
        width,
        height,
        alpha,
        rotation
      }
    })

    onupdate(data);

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        let now = Date.now();
        this.circleData(now - this.lastTime, onupdate);
        this.lastTime = now;
      })
    } else {
      setTimeout(() => {
        let now = Date.now();
        this.circleData(now - this.lastTime, onupdate);
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

  // 启动仅更新数据模式
  public startOnlyData (onupdate: ([]:Array<any>) => void) {
    this.$stopping = false;

    if (!this.$stopped) {
      return;
    }

    this.lastTime = Date.now();

    this.$stopped = false;
    this.circleData(0, onupdate);
  }

  // 增加力量体
  public addBody (x: number, y: number, widened: number, scale: number, attract: boolean = false) {
    let body = new Body(x, y, widened, scale, attract);

    this.bodyList.push(body)

    return body;
  }

  public removeBody (body: Body) {
    if (body instanceof Body) {
      let index = this.bodyList.findIndex(item => {
        return item === body;
      })

      if (index > -1) {
        this.bodyList.splice(index, 1);
      }
    } else {
      throw Error('The first argment is not instanceof Body');
    }
  }
}

class Particle {
  public lifespan: number

  public velocityX: number
  public velocityY: number

  public x: number
  public y: number

  public currentTime: number

  private _startSize: number
  public scale: number

  public endRotation: number

  private ratio: number

  // 输入的图像宽高
  private _width: number
  private _height: number

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

class Body {
  private widened: number

  private innerWidened: number

  private attract: boolean = true

  private x: number

  private y: number

  private scale: number

  /**
   * 
   * @param x 位置x
   * @param y 位置y
   * @param widened 作用范围
   * @param scale 力量系数
   * @param attract 作用力类型 默认false，吸引力
   */
  constructor (x: number, y: number, widened: number, scale: number, attract: boolean = false) {
    this.setbody(x, y, widened, scale, attract);
  }

  public setbody (x: number, y: number, widened: number, scale: number, attract: boolean = false) {
    this.x = x;
    this.y = y;

    this.widened = widened;

    this.innerWidened = widened * 0.1;
    this.scale = scale;
    this.attract = attract;
  }

  public getAcceleration (particle: Particle) {
    let {
      scale,
      x,
      y
    } = particle;

    // 将受力模型简化
    let distanceX: number = twoDecimal(this.x - x);
    if (Number.isNaN(distanceX)) {
      debugger
    }

    let dDistanceX: number = twoDecimal(Math.pow(distanceX, 2));

    let distanceY: number = twoDecimal(this.y - y);
    let dDistanceY: number = twoDecimal(Math.pow(distanceY, 2));

    let distance = Math.sqrt(dDistanceX + dDistanceY);

    if (this.widened < distance) {
      return {
        forceX: 0,
        forceY: 0
      }
    }

    if (this.attract && this.innerWidened > distance) {
      return {
        stop: true,
        forceX: 0,
        forceY: 0
      }
    }

    let m: number = twoDecimal((dDistanceX + dDistanceY) * distance);

    let forceX: number = twoDecimal(5000 * scale * this.scale * distanceX / m);
    let forceY: number = twoDecimal(5000 * scale * this.scale * distanceY / m);

    // console.log(dDistanceX, dDistanceY, m, forceX, forceY)

    if (this.attract) {
      return {
        forceX,
        forceY
      }
    }

    return {
      forceX: -forceX,
      forceY: -forceY
    }

  }
}

export default ParticleSystem;

export {
  ParticleSystem
}
