require('./logger');
// let yamlParse = require('./_lib/loaders/yaml-head-loader.js');
let content = require('./content/index.content');
console.log(content);
// console.log(yamlParse(stuff));
// Exported static site renderer:
module.exports = function render(locals, callback) {
  let data = {
    localJS: 'index.js',
    body: content.tail,
    vars: 'stuff',
    js: "stuff"
  };
  var template = require('./theme/templates/html.pug');
  callback(null, template(data));
};
