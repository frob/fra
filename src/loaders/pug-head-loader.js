"use strict";

var yaml = require('js-yaml');
var pug = require('pug');

module.exports = function(content) {
  let processor = pug.compile(content.tail);
  content = processor(content.meta);

  return content;
};
