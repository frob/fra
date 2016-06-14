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
    contentObject.tail = processor(Object.assign(contentObject.meta, {tail: contentObject.tail}));
  }

  return contentObject;
};
