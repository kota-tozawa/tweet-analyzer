const webpack = require('webpack')

module.exports = {
  output: {
    // Serve the bundle from /static
    publicPath: '/static/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    hot: true,
    port: 4000,
    // proxyに関して、shinyアプリのバンドルは除いている
    proxy: {
      '/': {
        target: 'http://localhost:3000',
      },
      '/websocket': {
        target: 'ws://localhost:3000',
        ws: true,
      },
      '/autoreload': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
}
