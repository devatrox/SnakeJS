const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    compress: false,
    port: 9000,
    disableHostCheck: true
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [{
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }]
  }
}
