var testacular = require('testacular');

/*global module:false*/
module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-recess');

  // Project configuration.
  grunt.initConfig({
    builddir: 'build',
    pkg: '<json:package.json>',
    meta: {
      banner: '/**\n' + ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' + ' */'
    },
    concat: {
      build: {
        src: ['<banner:meta.banner>', 'common/*.js'],
        dest: '<%= builddir %>/<%= pkg.name %>.js'
      },
      ieshiv: {
        src: ['<banner:meta.banner>', 'common/ieshiv/*.js'],
        dest: '<%= builddir %>/<%= pkg.name %>-ieshiv.js'
      }
    },
    min: {
      build: {
        src: ['<banner:meta.banner>', '<config:concat.build.dest>'],
        dest: '<%= builddir %>/<%= pkg.name %>.min.js'
      },
      ieshiv: {
        src: ['<banner:meta.banner>', '<config:concat.ieshiv.dest>'],
        dest: '<%= builddir %>/<%= pkg.name %>-ieshiv.min.js'
      }
    },
    recess: {
      build: {
        src: ['common/**/*.less'],
        dest: '<%= builddir %>/<%= pkg.name %>.css',
        options: {
          compile: true
        }
      },
      min: {
        src: '<config:recess.build.dest>',
        dest: '<%= builddir %>/<%= pkg.name %>.min.css',
        options: {
          compress: true
        }
      }
    },
    lint: {
      files: ['grunt.js', 'common/**/*.js', 'modules/**/*.js']
    },
    watch: {
      files: ['modules/**/*.js', 'common/**/*.js', 'templates/**/*.js'],
      tasks: 'build test'
    }
  });

  // Default task.
  grunt.registerTask('default', 'build test');

  grunt.registerTask('build', 'build all or some of the angular-ui modules', function () {

    var jsBuildFiles = grunt.config('concat.build.src');
    var lessBuildFiles = [];

    if (this.args.length > 0) {

      this.args.forEach(function(moduleName) {
        var modulejs = grunt.file.expandFiles('modules/*/' + moduleName + '/*.js');
        var moduleless = grunt.file.expandFiles('modules/*/' + moduleName + '/stylesheets/*.less', 'modules/*/' + moduleName + '/*.less');

        jsBuildFiles = jsBuildFiles.concat(modulejs);
        lessBuildFiles = lessBuildFiles.concat(moduleless);
      });

      grunt.config('concat.build.src', jsBuildFiles);
      grunt.config('recess.build.src', lessBuildFiles);

    } else {
      grunt.config('concat.build.src', jsBuildFiles.concat(['modules/*/*/*.js']));
      grunt.config('recess.build.src', lessBuildFiles.concat(grunt.config('recess.build.src')));
    }

    grunt.task.run('concat min recess:build recess:min');
  });

  grunt.registerTask('dist', 'change dist location', function() {
    var dir = this.args[0];
    if (dir) { grunt.config('builddir', dir); }
  });

  grunt.registerTask('server', 'start testacular server', function () {
    //Mark the task as async but never call done, so the server stays up
    var done = this.async();
    testacular.server.start({ configFile: 'test/test-config.js'});
  });

  grunt.registerTask('test', 'run tests (make sure server task is run first)', function () {
    var done = this.async();
    grunt.utils.spawn({
      cmd: process.platform === 'win32' ? 'testacular.cmd' : 'testacular',
      args: process.env.TRAVIS ? ['start', 'test/test-config.js', '--single-run', '--no-auto-watch', '--reporters=dots', '--browsers=Firefox'] : ['run']
    }, function (error, result, code) {
      if (error) {
        grunt.warn("Make sure the testacular server is online: run `grunt server`.\n" +
          "Also make sure you have a browser open to http://localhost:8080/.\n" +
          error.stdout + error.stderr);
        //the testacular runner somehow modifies the files if it errors(??).
        //this causes grunt's watch task to re-fire itself constantly,
        //unless we wait for a sec
        setTimeout(done, 1000);
      } else {
        grunt.log.write(result.stdout);
        done();
      }
    });
  });
};
