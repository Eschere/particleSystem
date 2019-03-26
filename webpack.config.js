const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => ({
  entry: env.TEST ? './test/main.ts' : './src/ParticleSystem.ts',
  output: {
    filename: 'main.js',
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
        loader: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map',
  plugins: env.PRO ? [] : [new HtmlWebpackPlugin({
    template: './index.html'
  })]
});
