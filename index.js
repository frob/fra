"use static";

require('./logger');

// Exported static site renderer:
module.exports = function render(locals, callback) {
  const fs = require('fs');
  let contentObject = '';
  let configuration = {};

  // The route is the path that is currently being processed.
  const route = locals.path;
  // The contentPath is the path to the actual file that represents the content.
  const contentPath = '/' + locals.routesMap[route];

  // The configurationFiles are passed to our entry via the locals object from
  // the webpack static site generator.
  const configurationFiles = locals.configurationFiles;

  // For each configuration file passed in, the configuration must be loaded and
  // if the config file exists, then the properties of the file are added to the
  // configuration object.
  configurationFiles.forEach((configFile, i, array) => {
    // Some bug in the way require is resolving the files forces us to rewrite
    // the names of the files in order to pass dynamic files to require().
    configFile = configFile.replace('./config', '');

    // This must be a sync method call or the object may not exist later when it
    // is being used.
    const stat = fs.statSync(`./config${configFile}`);
    if (stat.isFile()) {
      const configObject = require(`./config${configFile}`);
      configuration = Object.assign(configuration, configObject);
    }
  });

  // Start the route resolution.
  // Just like with the configuration, the content path is being pulled in as a
  // partial path that is being concatenated with the rest of the path. Unlike
  // the configuration loader, this parsing happens in the webpack config where
  // the rest of the parsing (including the path mapping) happens.
  fs.stat(`./content${contentPath}`, function (err, stat) {
    if (err === null) {
      // If there is no error, then continue to load the rest of the
      // contentObject.
      try {
        contentObject = require(`./content${contentPath}`);
      }
      catch (e) {
        // @TODO: need to figure out error handling for this. Error handling will be nessesary for UX/DX.
        console.error(e);
        return;
      }

      // In order to support content being parsed from straigt markdown/pug or
      // content requiring frontmatter, the content is staight assigned if
      // there is no 'content' member of the contentObject.
      const content = (typeof contentObject.content === 'undefined') ? contentObject : contentObject.content;

      // This is default configuration that would be needed for the generation
      // of the site.
      // @TODO: define real defaults. What ever is nessesary for generation.
      const defaultData = (typeof configuration.defaultData === 'undefined') ? {
        localJS: 'index.js',
        vars: 'stuff',
        js: 'stuff'
      } : configuration.defaultData;

      // The data is what is needed for the pug template to generate the page.
      // Data is made up of the defaultData, configuration, and contentObject
      // object members all smashed together. Priority is given to the
      // contentObject metadata.
      const data = Object.assign(defaultData, configuration, contentObject.meta);

      // The two things that cannot have default fallbacks are the route and the
      // body content.
      data.route = route;
      data.body = content;

      // Everything is wrapped in a pug generated html file.
      const template = require('./theme/templates/html.pug');
      callback(null, template(data));
    }
    // I was tierd when I wrote this. Obvoisely, this is a static site generator
    // and there is no need to handle dynamic get 404 requests. I remembered
    // this when I started to work on the 403 functionallity. Now this serves as
    // a reminder that I should get a good nights sleep.
    else if(err.code == 'ENOENT') {
      // @TODO handle this gracefully, don't freakout and fail hard if, for some
      // reason the file stopped existing between the initial glob search and
      // the actual generation of the site. @TODO just move along.
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
