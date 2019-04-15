const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => ({
  entry: env.TEST ? './test/main.ts' : './src/ParticleSystem.ts',
  output: {
    filename: env.TEST ? 'main.js' : 'ParticleSystem.js',
    libraryTarget: env.PRO ? 'umd' : 'var',
    globalObject:  env.PRO ? 'this' : 'window'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          "compilerOptions": {
            "target": "es5",
            "outDir": "dist",
            "sourceMap": true,
            "lib": [
              "es6",
              "dom"
            ],
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: env.PRO ? [] : [new HtmlWebpackPlugin({
    template: './index.html'
  })]
});
