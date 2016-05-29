"use strict";

let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

let routes = [
  '/hello/',
  '/world'
];

module.exports = {
  entry: {
    'index': './index.js'
  },
  output: {
    filename: "index.js",
    path: '_site',
    libraryTarget: 'umd'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'

      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },

  plugins: [
    new StaticSiteGeneratorPlugin('index', routes, { }, { })
  ]
}
