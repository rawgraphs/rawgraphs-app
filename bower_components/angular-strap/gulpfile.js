'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('ng-factory').use(gulp, {
  cdn: true,
  src: {
    docsViews: '*/docs/{,*/}*.tpl.{html,jade}'
  },
  bower: {
    exclude: /jquery|js\/bootstrap|\.less/
  }
});
config.dirname = __dirname;

//
// Tasks

gulp.task('serve', gulp.series('ng:serve'));

require('./tasks/compat')(gulp, config);

var del = require('del');
gulp.task('build', gulp.series('ng:build', 'compat', function afterBuild() {
  var paths = config.paths;
  // Delete useless module.* build files
  return del(path.join(paths.dest, 'module.*'));
}));

gulp.task('pages', gulp.series('ng:pages', function afterPages(done) {
  var paths = config.docs;
  return gulp.src([
    'bower_components/highlightjs/styles/github.css',
    '1.0/**/*'
  ],
    {cwd: paths.cwd, base: paths.cwd})
    .pipe(gulp.dest(paths.dest));
}));

require('./tasks/test')(gulp, config);

gulp.task('default', gulp.task('build'));
