"use static";

require('./logger');

// Exported static site renderer:
module.exports = function render(locals, callback) {
  let content = '';
  const fs = require('fs');

  const route = /*(locals.path === '/') ? '/index' :*/ locals.path;
  const contentPath = '/' + locals[locals.path];
  console.log(contentPath);

  // Start the route resolution.
  fs.stat('./content/' + contentPath, function (err, stat) {
    if (err === null) {
      console.log('File exists ./content' + contentPath);

      content = require(`./content${contentPath}`);

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
