"use strict";

var pug = require('pug');
var fs = require('fs');

module.exports = function(contentObject) {
  let templateName =
    (typeof contentObject.meta.template === 'undefined')
    ? null
    : `./theme/templates/${contentObject.meta.template}.pug`;

  if (templateName !== null) {
    var template = fs.readFileSync(templateName, 'utf-8');
    const processor = pug.compile(template);
    // Here we need to add a new line to the tail member to ensure that any new
    // pug or markdown is on a new line and not continuing off of the old line.
    // If this isn't done then the first line will not be parsed.
    contentObject.tail = processor(Object.assign(contentObject.meta, {tail: "\n" + contentObject.tail}));
  }

  return contentObject;
};
