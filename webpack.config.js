const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => ({
  entry: env.TEST ? './test/main.ts' : './src/main.ts',
  output: {
    filename: 'main.js'
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
  plugins: [new HtmlWebpackPlugin({
    template: './index.html'
  })]
});
