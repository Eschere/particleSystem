// work中使用打包的js文件，请先运行yarn build
importScripts('/dist/main.js')

let particle

addEventListener('message', (event) => {
  let data = event.data;

  let action = data.action;

  switch (action) {
    case 'create':
      create(data.textureInfo, data.config);
      break;
    case 'start':
      particle.startOnlyData(postMessage);
      break;
    case 'stop':
      particle.stop();
  }
})

function create (textureInfo, config) {
  particle = new ParticleSystem(
    null,
    textureInfo,
    config
  )
}

// particle.startOnlyData((ParticleList) => {
//   postMessage(ParticleList)
// })