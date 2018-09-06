"use strict";

var yaml = require('js-yaml');
var marked = require('marked');

module.exports = function(content) {
  //@TODO Add template checking here. Allow meta to specify a wrapping template.
  const processed = marked(content.tail);
  content = {
    meta: content.meta,
    content: processed
  }

  return content;
};
