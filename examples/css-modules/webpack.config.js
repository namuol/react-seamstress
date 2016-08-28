var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.join(__dirname, 'src'), path.join(__dirname, '..', '..', 'src')],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ),
      },
    ],
  },
  resolve: {
    root: [path.join(__dirname, 'node_modules'), path.join(__dirname, '..', '..', 'node_modules')],
    alias: {
      'react-seamstress': path.join(__dirname, '..', '..', 'src', 'index.js'),
    },
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
};
