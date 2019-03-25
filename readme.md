### 粒子系统
一款基于canvas 2d的粒子系统，支持微信小程序
小程序不支持获取canvas对象和其他dom操作, 所有粒子系统不包含canvas和context创建过程。

### 用法
#### 命令
```bash
// 安装依赖
yarn

// 运行测试
yarn test

// 编译ts
yarn build
```

### API
导入粒子系统
```js
const ParticleSystem = require('ParticleSystem');
```

canvas创建和属性设置需要开发者自己完成

粒子系统需要接收canvas画布上下文对象ctx

```js
const ctx = canvas.getContext('2d');



```

