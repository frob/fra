"use static";

require('./logger');

// Exported static site renderer:
module.exports = function render(locals, callback) {
  let contentObject = '';
  const fs = require('fs');

  const route = locals.path;
  const contentPath = '/' + locals.routesMap[route];

  const configurationFiles = locals.configurationFiles;
  let configuration = {};
  configurationFiles.forEach((configFile, i, array) => {
    configFile = configFile.replace('./config', '/');
    fs.stat(`./${configFile}`, (err, stat) => {
      if (err === null) {
        const configObject = require(`./config${configFile}`);
        configuration = Object.assign(configuration, configObject);
      }
      else if (err.code === 'ENOENT') {
        console.warn('Couldn\' find configuration file: ./' + configFile);
      }
    });
  });
  console.log(configuration);

  // Start the route resolution.
  fs.stat('./content/' + contentPath, function (err, stat) {
    if (err === null) {
      contentObject = require(`./content${contentPath}`);

      const content = (typeof contentObject.content === 'undefined') ? contentObject : contentObject.content;

      let data = {
        localJS: 'index.js',
        body: content,
        vars: 'stuff',
        js: 'stuff'
      };
      const template = require('./theme/templates/html.pug');
      callback(null, template(data));
    }
    else if(err.code == 'ENOENT') {
      // @TODO check for other versions. For now just 404.
      console.log("NO PAGE FOR YOU");
      content = require('./content/404.pug.content');

      let data = {
        localJS: 'index.js',
        body: content,
        vars: 'stuff',
        js: 'stuff'
      };
      var template = require('./theme/templates/html.pug');
      callback(null, template(data));
    }
    else {
      console.log('Honestly I am not sure how you got here. You might be a dirty hacker. ', err.code);
    }
  });
};
