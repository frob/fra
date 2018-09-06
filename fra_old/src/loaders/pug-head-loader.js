"use strict";

var yaml = require('js-yaml');
var pug = require('pug');

module.exports = function(content) {
  const processor = pug.compile(content.tail);
  content.content = processor(content.meta);
  return content;
};
