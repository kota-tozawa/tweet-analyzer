const path = require('path');

// TODO webpackのプラグインや設定に関してもっとよく調べる
// hot module replacement を有効にするためのプラグイン
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// コンパイル時にdist配下にhtmlファイルも出力してくれるプラグイン．吐かれたhtmlをそのままpublic配下に置いて使える
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: './src/index.jsx',
  },
  output: {
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // dev実行時にのみHMRがほしい
    isDevelopment && new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html',
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    hot: true,
    port: 4000,
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
};
