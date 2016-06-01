"use strict";

let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

let routes = [
  '/'
  // '404.html',
  // '/about/',
  // '/resume/',
  // '/web-development/web-portfolio/'
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
    // preLoaders: [
    //   {
    //     // test: /\.js$/,
    //     // exclude: /node_modules/,
    //     // loader: 'jshint-loader'
    //
    //   }
    // ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        include: /\.jade$|\.pug$/,
        loader: 'jade-loader'
      },
      {
        test: /\.content$/,
        loaders: ['raw', './_lib/loaders/yaml-head-loader']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6', '.content'],
    modulesDirectories: ["src/scripts", "web_modules", "bower_components", "node_modules"]
  },
  target: 'node',
  debug: true,
  plugins: [
    new StaticSiteGeneratorPlugin('index', routes, { }, { })
  ]
}
