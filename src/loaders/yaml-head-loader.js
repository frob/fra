"use strict";

var yaml = require('js-yaml');

module.exports = function(content) {
  if (typeof content.replace === 'undefined') {
    content = '';
  }
  const data = splitByMeta(content);
  content = data;
  return content;
};

function splitByMeta (str, yamlBlockRegEx) {
  yamlBlockRegEx = (typeof yamlBlockRegEx === 'undefined') ? /---([\s\S]*?)---/ : yamlBlockRegEx;

  let tailString = '';
  const cleanUp = function (str, yamlBlockRegEx) {
    tailString = str.replace(yamlBlockRegEx, '');
  }

  const meta = extractMeta(str, cleanUp);

  return {
    meta: meta,
    tail: tailString
  }
}

function extractMeta (str, callback, yamlBlockRegEx) {
  yamlBlockRegEx = (typeof yamlBlockRegEx === 'undefined') ? /---([\s\S]*?)---/ : yamlBlockRegEx;

  if (typeof callback === 'function'){
    callback(str, yamlBlockRegEx);
  }

  var metaData = str.match(yamlBlockRegEx);
  if (!metaData)
    return null;

  var meta = yaml.safeLoad(metaData[1]);

  return meta;
}
