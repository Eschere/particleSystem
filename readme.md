### 粒子系统
一款基于canvas 2d的粒子系统，支持微信小程序。  
小程序不支持获取canvas对象和其他dom操作, 所以粒子系统不包含canvas和context创建过程。

### 命令
```bash
// 安装依赖
yarn

// 运行测试
yarn test

// 编译ts
yarn build

// 打包umd版本
yarn build:umd
```
### 用法
#### 导入粒子系统
```js
const ParticleSystem = require('ParticleSystem');
```
也可以直接`<script src="ParticleSystem.js"></script>`形式引入，可以获取全局变量`ParticleSystem`


#### 基础用法
canvas创建和属性设置需要开发者自己完成，粒子系统需要接收canvas画布上下文对象ctx

```js
const ctx = canvas.getContext('2d');
const img = new Image();

img.src = './snow.png';
img.onload = function () {
  // 创建一个粒子系统
  const particle = new ParticleSystem(
    img,
    {
      width: img.width,
      height: img.height
    },
    config // 粒子系统的具体配置
  );

  // 开始
  particle.start();

  // 结束
  particle.stop();
};
```
#### 构造函数

`new ParticleSystem(texture, textureInfo, config, [ctx, [canvasInfo]])`。 

`texture`: 粒子纹理，在浏览器环境中为具体的图形对象`Image`,在微信小程序环境为本地图片路径。 

`textureInfo`: `{width: number, height: number}` 粒子系统不提供兼容性的图片属性获取方法，所以需要手动传入图片的尺寸，以便进行等比例缩放。 

`config`:
```js
{
  gravity: {
    x: 10, // 横向加速度
    y: 80 // 纵向加速度
  },
  emitterX: 200, // 发射位置x坐标
  emitterY: -10, // 发射位置y坐标
  emitterXVariance: 200, // 发射位置x方向变化范围
  emitterYVariance: 10, // 发射位置y方向变化范围
  maxParticles: 10, // 最大粒子数
  endRotation: Math.PI * 4, // 结束时粒子旋转角度
  endRotationVariance: Math.PI * 2, // 结束时粒子旋转角度变化范围
  speed: 50, // 发射速度
  angle: Math.PI / 2, // 发射角度
  angleVariance: Math.PI / 2, // 发射角度变化范围
  startSize: 15, // 开始大小
  startSizeVariance: 5, // 开始大小变化范围
  lifespan: 5000 // 单个粒子生命周期
}
```
以上参数皆为必填项。 

`ctx`: 画布上下文对象，以下情况可以不传该参数：
1. 使用`particle.startOnlyData(cb)`方式启动仅获取数据模式。

`canvasInfo`: `{width: number, height: number}`canvas尺寸信息，以确保画布能被整体刷新，以下情况可以省略此参数：
1. 你使用`particle.update(dt)`的方式重绘画布，而不是`particle.start()`
2. 你的运行环境中支持`ctx.clearRect(0, 0)`清除画布内容
3. 微信小程序中支持ctx.draw()清楚上次绘制的画布信息，所以也不需要传

### 开始运行
```js
particle.start()
```

### 结束运行
```js
particle.stop()
```

### 回调函数
```js
particle.onstopped
```
