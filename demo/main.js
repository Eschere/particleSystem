(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ParticleSystem.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ParticleSystem.ts":
/*!*******************************!*\
  !*** ./src/ParticleSystem.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function randRange(range) {
    range = Math.abs(range);
    return Math.random() * range * 2 - range;
}
var ParticleSystem = /** @class */ (function () {
    function ParticleSystem(texture, textureInfo, config, ctx, canvasInfo) {
        // 当前粒子列表
        this.particleList = [];
        // 对象池粒子
        this.pool = [];
        // 计时器
        this.frameTime = 0;
        this.dt = 0;
        this.$stopping = false;
        this.$stopped = true;
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
    ParticleSystem.prototype.changeConfig = function (config) {
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
    };
    // 生成粒子
    ParticleSystem.prototype.createParticlePool = function () {
        for (var i = 0; i < this.maxParticles; i++) {
            this.pool.push(new Particle);
        }
    };
    // 加入一个粒子
    ParticleSystem.prototype.addOneParticle = function () {
        var particle;
        if (this.pool.length) {
            particle = this.pool.pop();
        }
        else {
            particle = new Particle;
        }
        particle.setTextureInfo(this.texture, {
            width: this.textureWidth,
            height: this.textureHeight
        });
        this.initParticle(particle);
        this.particleList.push(particle);
    };
    // 去掉一个粒子
    ParticleSystem.prototype.removeOneParticle = function (particle) {
        var index = this.particleList.indexOf(particle);
        this.particleList.splice(index, 1);
        particle.texture = null;
        this.pool.push(particle);
    };
    ParticleSystem.prototype.initParticle = function (particle) {
        particle.currentTime = 0;
        particle.lifespan = this.lifespan;
        particle.x = this.emitterX + randRange(this.emitterXVariance);
        particle.y = this.emitterY + randRange(this.emitterYVariance);
        particle.endRotation = this.endRotation + randRange(this.endRotationVariance);
        var angle = this.angle + randRange(this.angleVariance);
        particle.velocityX = this.speed * Math.cos(angle);
        particle.velocityY = this.speed * Math.sin(angle);
        particle.startSize = this.startSize + randRange(this.startSizeVariance);
        if (particle.startSize < 0) {
            particle.startSize = 0.01;
        }
        particle.scale = particle.startSize / this.startSize;
        particle.startSizeVariance = this.startSizeVariance;
        return particle;
    };
    ParticleSystem.prototype.updateParticle = function (particle, dt) {
        dt = dt / 1000;
        particle.velocityX += this.gravityX * particle.scale * dt;
        particle.velocityY += this.gravityY * particle.scale * dt;
        particle.x += particle.velocityX * dt;
        particle.y += particle.velocityY * dt;
    };
    ParticleSystem.prototype.render = function (dt) {
        var _this = this;
        // 是否需要新增粒子
        if (!this.$stopping) {
            this.frameTime += dt;
            while (this.frameTime > 0) {
                if (this.particleList.length < this.maxParticles) {
                    this.addOneParticle();
                }
                this.frameTime -= this.emissionRate;
            }
        }
        // 更新粒子状态或移除粒子
        var temp = this.particleList.slice();
        temp.forEach(function (particle) {
            if (particle.currentTime < particle.lifespan) {
                _this.updateParticle(particle, dt);
                particle.currentTime += dt;
            }
            else {
                _this.removeOneParticle(particle);
                if (_this.$stopping && _this.particleList.length === 0) {
                    _this.$stopped = true;
                    _this.onstopped && _this.onstopped();
                }
            }
        });
        this.draw();
        // 兼容小程序
        this.ctx.draw && this.ctx.draw();
    };
    ParticleSystem.prototype.draw = function () {
        var _this = this;
        this.particleList.forEach(function (particle) {
            var texture = particle.texture, x = particle.x, y = particle.y, width = particle.width, height = particle.height, alpha = particle.alpha, rotation = particle.rotation;
            // 粒子旋转和透明之后画上画布
            var halfWidth = width / 2, halfHeight = height / 2;
            _this.ctx.save();
            _this.ctx.translate(x + halfWidth, y + halfHeight);
            _this.ctx.rotate(rotation);
            if (alpha !== 1) {
                _this.ctx.globalAlpha = alpha;
                _this.ctx.drawImage(texture, -halfWidth, -halfHeight, width, height);
            }
            else {
                _this.ctx.drawImage(texture, -halfWidth, -halfHeight, width, height);
            }
            _this.ctx.restore();
        });
    };
    ParticleSystem.prototype.changeTexture = function (texture, textureInfo) {
        this.texture = texture;
        this.textureWidth = textureInfo.width;
        this.textureHeight = textureInfo.height;
    };
    // 周期性调用
    ParticleSystem.prototype.circleDraw = function (dt) {
        var _this = this;
        if (this.$stopped) {
            return;
        }
        var width, height;
        if (this.canvasWidth) {
            width = this.canvasWidth;
            height = this.canvasHeight;
        }
        else if (this.ctx.canvas) {
            width = this.ctx.canvas.width;
            height = this.ctx.canvas.width;
        }
        this.ctx.clearRect(0, 0, width, height);
        this.render(dt);
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(function () {
                var now = Date.now();
                _this.circleDraw(now - _this.lastTime);
                _this.lastTime = now;
            });
        }
        else {
            setTimeout(function () {
                var now = Date.now();
                _this.circleDraw(now - _this.lastTime);
                _this.lastTime = now;
            }, 17);
        }
    };
    ParticleSystem.prototype.start = function () {
        this.$stopping = false;
        if (!this.$stopped) {
            return;
        }
        this.lastTime = Date.now();
        this.$stopped = false;
        this.circleDraw(0);
    };
    ParticleSystem.prototype.stop = function () {
        this.$stopping = true;
    };
    Object.defineProperty(ParticleSystem.prototype, "isStop", {
        get: function () {
            return this.$stopped;
        },
        enumerable: true,
        configurable: true
    });
    return ParticleSystem;
}());
exports.ParticleSystem = ParticleSystem;
var Particle = /** @class */ (function () {
    function Particle() {
    }
    Object.defineProperty(Particle.prototype, "startSize", {
        get: function () {
            return this._startSize;
        },
        set: function (size) {
            this._startSize = size;
            this._width = size;
            this._height = size / this.ratio;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "progress", {
        get: function () {
            return this.currentTime / this.lifespan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "alpha", {
        get: function () {
            var progress = this.progress;
            if (progress > .8) {
                var alpha = (1 - progress) / 0.2;
                return alpha > 0 ? alpha : 0;
            }
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "rotation", {
        get: function () {
            return this.endRotation * this.progress;
        },
        enumerable: true,
        configurable: true
    });
    Particle.prototype.setTextureInfo = function (texture, config) {
        this.texture = texture;
        this.ratio = config.width / config.height;
    };
    Object.defineProperty(Particle.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    return Particle;
}());
exports.default = ParticleSystem;


/***/ })

/******/ });
});
//# sourceMappingURL=main.js.map