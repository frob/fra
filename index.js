require('./logger');
// let yamlParse = require('./_lib/loaders/yaml-head-loader.js');
let content = require('./content/index.pug.content');
console.log(content);

// Exported static site renderer:
module.exports = function render(locals, callback) {
  let data = {
    localJS: 'index.js',
    body: content,
    vars: 'stuff',
    js: 'stuff'
  };
  var template = require('./theme/templates/html.pug');
  callback(null, template(data));
};
