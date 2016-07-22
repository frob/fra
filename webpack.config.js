"use strict";

let glob = require('glob');

let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

// Setup automatic route configuration.
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

// Setup Configuraion Variables.
const configurationFiles = glob.sync('./config/**.yml');

module.exports = {
  // context: process.cwd(),
  entry: './index.js',
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
        exclude: /node_modules|~|_./,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        include: /\.yml$|\.yaml$/,
        exclude: /node_modules|\/~\//,
        loaders: ['json-loader', 'yaml-loader']
      },
      {
        include: /\.jade$|\.pug$/,
        exclude: /node_modules|~/,
        loader: 'jade-loader'
      },
      {
        test: /\.pug\.content$/,
        exclude: /node_modules|~/,
        loaders: ['raw', './src/loaders/pug-head-loader', './src/loaders/template-wrapper-loader', 'yaml-head-loader']
      },
      {
        test: /\.md\.content$/,
        exclude: /node_modules|~/,
        loaders: ['raw', './src/loaders/markdown-head-loader', 'yaml-head-loader']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6', 'pug', 'jade', 'pug.content', 'md.content'],
    modulesDirectories: ["web_modules", "bower_components", "node_modules"]
  },
  target: 'node',
  debug: true,
  cache: false,
  devtool: 'eval',
  plugins: [
    new StaticSiteGeneratorPlugin('index.js', routes, { "routesMap": routesMap, "configurationFiles": configurationFiles})
  ]
}
