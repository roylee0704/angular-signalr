'use strict';

// Contents of: test/karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '../',

    // list of files / patterns to load in the browser
    files: [
      // libraries
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',

      // the directives
      'src/**/*.js',

      // test
      'test/*_spec.js'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/'
    }

  });
};
