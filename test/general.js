'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('gulp-express-webapp:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ features: [] })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.editorconfig',
      '.bowerrc',
      '.gitignore',
      '.gitattributes',
      'bower.json',
      'package.json',
      'gulpfile.js',
      'gulp',
      'server',
      'app.js',
      'app/favicon.ico',
      'app/index.html',
      'app/js/main.js',
      'app/styles/main.scss',
      'app/images',
      'app/fonts'
    ]);
  });
});
