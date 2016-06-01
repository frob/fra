var yaml = require("js-yaml");

function splitByMeta(str, yamlBlockRegEx){

  var tailString = '';
  var cleanUp = function(str, yamlBlockRegEx){
    tailString = str.replace(yamlBlockRegEx, '');
  }

  var meta = extractMeta(str, cleanUp);

  return {
    meta: meta,
    tail: tailString
  }
}

function extractMeta(str, cb, yamlBlockRegEx)
{
  if(!yamlBlockRegEx){
     yamlBlockRegEx = /---([\s\S]*?)---/;
  }
  if(typeof(cb)=== "function"){
    cb(str, yamlBlockRegEx);
  }

  var metaData = str.match(yamlBlockRegEx);
  if(!metaData)
    return null;

  var meta = yaml.safeLoad(metaData[1]);

  return meta;
}

module.exports.splitByMeta = splitByMeta;
