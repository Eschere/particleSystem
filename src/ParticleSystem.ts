class ParticleSystem {
  private texture: string
  private config: string | any
  private ctx?: CanvasRenderingContext2D

  // 粒子发射时间间隔
  private emissionRate: number

  // 发射位置
  private emitterX: number
  private emitterY: number
  
  // 粒子生命周期
  private lifespan: number

  // 最大粒子数
  private maxParticles: number

  constructor (
    texture: string,
    config: string | any,
    ctx?: CanvasRenderingContext2D
  ) {
    this.texture = texture;

    this.ctx = ctx;

    this.initConfig(config);

    this.emissionRate = this.lifespan / this.maxParticles;
  }

  private initConfig (config: any) {
    this.emitterX = config.emitterX;
    this.emitterY = config.emitterY;
  }
}

export default ParticleSystem;
