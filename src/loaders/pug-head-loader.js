"use strict";

var yaml = require('js-yaml');
var pug = require('pug');

module.exports = function(content) {
  //@TODO Add template checking here. Allow meta to specify a wrapping template.
  const processor = pug.compile(content.tail);
  content.content = processor(content.meta);
  return content;
};
