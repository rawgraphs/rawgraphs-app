var stringify = require('stringify');


module.exports = function(grunt){

// configure plugins
grunt.initConfig({
  browserify: {
    dist: {
      files: {
        'd3-legend.js': ['src/web.js'],
      },
      options: {
        browserifyOptions: { debug: true },
        transform: [ ['babelify', {'presets': ['es2015']}] ]
      }
    },
    docs: {
      files: {
        'docs/docs.js': ['docs/legends.js', 'docs/markdown.js']
      },
      options: {
        transform: [
          function(file) {
            return stringify({extensions: ['.md']}).call(stringify, file);
          }
        ]
      }
    }
  },

  // Uglify js for build
  uglify: {
    build: {
      files: {
        'd3-legend.min.js': 'd3-legend.js'
      }
    },
    docs: {
      files: {
        'docs/d3-legend.min.js': 'd3-legend.js'
      }
    },
    docsjs: {
      files: {
        'docs/docs.min.js': 'docs/docs.js'
      }
    }
  }

 });

  // Loading tasks
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Registering tasks
  grunt.registerTask('default', ['browserify', 'uglify']);

};