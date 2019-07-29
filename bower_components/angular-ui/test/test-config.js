// Sample Testacular configuration file, that contain pretty much all the available options
// It's used for running client tests on Travis (http://travis-ci.org/#!/vojtajina/testacular)
// Most of the options can be overriden by cli arguments (see testacular --help)



// base path, that will be used to resolve files and exclude
basePath = '..';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'test/lib/jquery/jquery-1.7.2.js',
  'test/lib/jquery/jquery-ui-1.8.18.js',
  'test/lib/angular-1.0.1/angular.js',
  'test/lib/angular-1.0.1/angular-mocks.js',
  'test/lib/codemirror/codemirror.js',
  'test/lib/tinymce/tiny_mce.js',
  'test/lib/tinymce/jquery.tinymce.js',
  'test/lib/googlemaps/googlemaps.js',
  'test/lib/bootstrap/bootstrap-modal.js',
  'test/lib/select2/select2.js',
  'test/lib/maskedinput/jquery.maskedinput-1.3.js',
  'test/lib/calendar/calendar.js.min',
  'common/module.js',
  'modules/*/*/*.js',
  'modules/*/*/test/*.js',
  'templates/*.js',
  'templates/test/*.js'
];

// list of files to exclude
exclude = [];

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots' || 'progress'
reporter = 'dots';

// these are default values, just to show available options

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// polling interval in ms (ignored on OS that support inotify)
autoWatchInterval = 0;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = [];