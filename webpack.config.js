const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/todotxt.js',
  devtool: 'source-map',
  output: {
    filename: 'todotxt.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'TodoTxt',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  plugins: [
      new UnminifiedWebpackPlugin()
  ]
};