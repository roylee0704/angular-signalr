'use strict';

module.exports = function (grunt) {


  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');
  grunt.loadNpmTasks('grunt-ddescribe-iit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.initConfig({

    //user-defined configs
    dist: 'dist',

    // Karma setup, a place to override the default options set in karma.config.js
    //
    karma: {
      //global karma options
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        background: true
      },
      continuous: {
        singleRun: false
      },
      travis: {
        singleRun: true,
        browsers: ['Firefox'],
        preprocessors: {
          'src/**/*.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
          type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
          dir: 'coverage/'
        }
      }
    },


    // Sends coverage report to Coveralls
    //
    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage'
      }
    },


    'ddescribe-iit': {
      files: [
        'test/**/*.spec.js'
      ]
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      src: 'src/**/*.js',
      test: 'test/*.js'
    },


    // Minifies the JavaScript code
    //
    uglify: {
      dist: {
        files: {
          '<%= dist %>/angular-socket-signalr.min.js': ['src/angular-socket-signalr.js']
        }
      }
    },


    delta: {
      js: {
        files: ['src/**/*.js'],
        //we don't need to jshint here, it slows down everything else
        tasks: ['karma:watch:run']
      }
    }


  });


  // generate coverage report and send it to coveralls
  grunt.registerTask('coverage', ['karma:travis', 'coveralls']);


  //register before and after test tasks so we've don't have to change cli
  //options on the google's CI server
  grunt.registerTask('before-test', ['ddescribe-iit', 'jshint']);
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('after-test', ['build']);

  grunt.registerTask('test', 'Run tests on singleRun karma server', function () {
    if (process.env.TRAVIS) {
      grunt.task.run('karma:travis');
    } else {
      grunt.task.run('karma:continuous');
    }
  });





    //Rename our watch task to 'delta', then make actual 'watch'
  //task build things, then start test server
  grunt.renameTask('watch', 'delta');



  grunt.registerTask('watch', ['before-test', 'after-test', 'karma:watch', 'delta']);
  // Default task.
  grunt.registerTask('default', ['before-test', 'test', 'after-test']);







  //// default task
  //grunt.registerTask('default', ['jshint', ' :unit', 'build']);
  //
  //// automatically execute the unit tests when a file changes
  //grunt.registerTask('watch', ['karma:watch']);
  //
  //// generate coverage report and send it to coveralls
  //grunt.registerTask('coverage', ['karma:coverage', 'coveralls']);
  //
  //// generate combined and minified distribution files
  //grunt.registerTask('build', ['concat', 'uglify']);


};
