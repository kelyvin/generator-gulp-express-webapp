 /* jshint node:true */
 'use strict';
 var gulp = require('gulp');
 var $ = require('gulp-load-plugins')();
 var requireDir = require('require-dir');
 var dir = requireDir('./gulp/', {
     recurse: true
 });


 gulp.task('default', ['clean'], function() {
     gulp.start('build');
 });
