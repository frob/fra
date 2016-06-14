"use strict";

let glob = require('glob');

let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

let routes = [];
let routesMap = {};
const files = glob.sync('./content/**/*.content');

files.forEach((element, index, array) => {
  let route = array[index].replace('./content/', '');

  if (route.includes('index')) {
    routes.push('/' + route.replace(/(\.pug|\.md)\.content/, '').replace('index', ''));
    routesMap['/' + route.replace(/(\.pug|\.md)\.content/, '').replace('index', '')] = route;
  }
  else {
    routes.push('/' + route.replace(/(\.pug|\.md)\.content/, '.html').replace('index', ''));
    routesMap['/' + route.replace(/(\.pug|\.md)\.content/, '.html').replace('index', '')] = route;
  }
});

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
        test: /\.pug\.content$/,
        loaders: ['raw', './src/loaders/pug-head-loader', './src/template-wrapper', './src/loaders/yaml-head-loader']
      },
      {
        test: /\.md\.content$/,
        loaders: ['raw', './src/loaders/markdown-head-loader', './src/loaders/yaml-head-loader']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6', 'pug', 'jade', 'pug.content', 'md.content'],
    modulesDirectories: ["src/scripts", "web_modules", "bower_components", "node_modules"]
  },
  target: 'node',
  debug: true,
  plugins: [
    new StaticSiteGeneratorPlugin('index', routes, routesMap, { })
  ]
}
