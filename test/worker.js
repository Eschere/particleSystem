// work中使用打包的js文件请先运行yarn build
importScripts('/dist/main.js')

let particle

addEventListener('')

const particle = new ParticleSystem(
  null,
  {
    width: 100,
    height: 200
  },
  {
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
  }
)

particle.startOnlyData((ParticleList) => {
  postMessage(ParticleList)
})