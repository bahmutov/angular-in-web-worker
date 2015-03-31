/*global module:false*/
module.exports = function (grunt) {
  grunt.initConfig({

    'gh-pages': {
      options: {
        base: '.'
      },
      src: [
        'README.md',
        'angular-web-worker.js',
        'index.html',
        'node_modules/console-log-div/console-log-div.js'
      ]
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);
};
