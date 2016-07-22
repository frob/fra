/**
 * @file Checks the content Object for a wrapping template file name and
 *   attempts to wrap the content tail in that pug template. This is intended to
 *   be a loader for webpack.
 * @author Frank Robert Anderson
 */

"use strict";

const pug = require('pug');
const fs = require('fs');

/**
 * Returns content wrapped in template (if) specified in meta.template.
 *
 * @param {Object} contentObject
 *  Content Object, thing getting processed by loader.
 *
 * @param {Object} [contentObject.meta]
 *  Object that contains meta information and variable for use in the template.
 *
 * @param {String} [contentObject.meta.template=undefined]
 *  Optional name of the template that the content will be wrapped.
 *
 * @param {String} [contentObject.tail]
 *  Tail content that will be processed in the next pass, could be pug/markdown.
 *
 * @return {String}
 */
module.exports = function(contentObject) {
  // Get the name of the template from the meta data.
  const templateName =
    (typeof contentObject.meta.template === 'undefined')
    ? null
    : `./theme/templates/${contentObject.meta.template}.pug`;

  if (templateName !== null) {
    const template = fs.readFileSync(templateName, 'utf-8');
    const processor = pug.compile(template);
    // Here we need to add a new line to the tail member to ensure that any new
    // pug or markdown is on a new line and not continuing off of the old line.
    // If this isn't done then the first line will not be parsed.
    contentObject.tail = processor(Object.assign(contentObject.meta, {tail: "\n" + contentObject.tail}));
  }

  return contentObject;
};
