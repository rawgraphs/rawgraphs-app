/**
 * Created by mikeh on 9/3/15.
 */
require.config({
  baseUrl: "js",
  packages: [

    // codemirror uses relative paths (e.g. define(["../../lib/codemirror"], mod);)
    // so this will help find those modules
    // see https://github.com/codemirror/CodeMirror/issues/2389
    {
      name: 'codemirror',
      location: '/bower_components/codemirror/',
      main: 'lib/codemirror'
    }
  ],
  paths: {
    'raw':  '/lib/raw',

    // d3
    'd3':         '/bower_components/d3/d3',
    'd3-sankey':  '/bower_components/d3-plugins/sankey/sankey',
    'd3-hexbin':  '/bower_components/d3-plugins/hexbin/hexbin',

    // angular components
    'angular':          '/bower_components/angular/angular',
    'ang-routes' :      '/bower_components/angular-route/angular-route.min',
    'ang-animate':      '/bower_components/angular-animate/angular-animate.min',
    'ang-sanitize':     '/bower_components/angular-sanitize/angular-sanitize.min',
    'ang-strap':        '/bower_components/angular-strap/dist/angular-strap.min',
    'ang-strap-tpl':    '/bower_components/angular-strap/dist/angular-strap.tpl.min',
    'ang-ui':           '/bower_components/angular-ui/build/angular-ui.min',
    'ang-colorpicker':  '/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module',

    // jquery
    'jquery':           '/bower_components/jquery/dist/jquery.min',
    'jquery-ui':        '/bower_components/jquery-ui/ui/minified/jquery-ui.min',
    'jquery-ui-touch':  '/bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',

    // bootstrap
    'bootstrap':        '/bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrapcolor':   '/bower_components/bootstrap-colorpicker/js/bootstrap-colorpicker',

    // misc
    'canvas-to-blob':   '/bower_components/canvas-toBlob/canvas-toBlob',
    'filesaver':        '/bower_components/FileSaver/FileSaver',
    'zeroclip':         '/bower_components/zeroclipboard/ZeroClipboard.min',

  },
  shim: {
    'raw': {
      exports: 'raw',
      deps: ['d3']
    },

    'd3': {
      exports: 'd3'
    },
    'd3-sankey': {
      deps:      ['d3']
    },
    'd3-hexbin': {
      deps:      ['d3']
    },

    'angular':  {
      exports:  'angular',
      deps:      ['jquery']
    },
    'codemirror': {
      exports: 'CodeMirror'
    },

    'ang-routes':       {deps: ['angular']},
    'ang-animate':      {deps: ['angular']},
    'ang-sanitize':     {deps: ['angular']},
    'ang-strap':        {deps: ['angular']},
    'ang-strap-tpl':    {deps: ['ang-strap']},
    'ang-ui':           {deps: ['angular', 'codemirror']},
    'ang-colorpicker':  {deps: ['angular']},

    'jquery-ui':        {deps: ['jquery']},
    'jquery-ui-touch':  {deps: ['jquery']},

    'bootstrap':        {deps: ['angular']},
    'bootstrapcolor':   {deps: ['bootstrap']},

    'services':     {deps: ['angular', 'raw']},
    'controllers':  {deps: ['angular', 'raw']},
    'filters':      {deps: ['angular', 'raw']},
    'directives':   {deps: ['angular', 'raw']}

  } // end of shim

});

require([
  'angular',
  'raw',

  'codemirror',
  'codemirror/addon/display/placeholder',

  'bootstrap',
  'bootstrapcolor',

  'ang-routes',
  'ang-animate',
  'ang-sanitize',
  'ang-strap',
  'ang-ui',
  'ang-colorpicker',

  'jquery',
  'jquery-ui',
  'jquery-ui-touch',

  'canvas-to-blob',
  'filesaver',
  'zeroclip',

  // angular modules
  'routes',  // was app.js
  'services',
  'controllers',
  'filters',
  'directives',

  // raw + d3 charts
  '/charts/alluvial.js',
  '/charts/bumpChart.js',
  '/charts/chart.js',               // simple scatterplot chart
  '/charts/circularDendrogram.js',
  '/charts/clusterDendrogram.js',
  '/charts/clusterForce.js',
  '/charts/convexHull.js',
  '/charts/delaunay.js',
  '/charts/hexagonalBinning.js',
  '/charts/packing.js',             // circle packing
  '/charts/parallelCoordinates.js',
  '/charts/reingoldTilford.js',
  '/charts/scatterPlot.js',
  '/charts/smallMultiplesArea.js',  // none of the sample datasets works for testing this, build your own
  '/charts/streamgraph.js',
  '/charts/treemap.js',
  '/charts/voronoi.js'



], function(angular, raw, cm) {

  console.log("loaded angular", angular.version.full);
  console.log("loaded raw", raw.version);
  console.log("loaded codemirror", cm.version);

  // hack for angular-ui to work, depends on CodeMirror being
  // in the global scope, note, the 'shim' config didn't do the trick
  // see https://github.com/codemirror/CodeMirror/issues/736
  window.CodeMirror = cm;

  // modules, originally defined in app.js
  var app = angular.module('raw', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'raw.routes',       // see routes.js
    'raw.filters',      // see filters.js
    'raw.services',     // see services.js
    'raw.directives',   // see directives.js
    'raw.controllers',  // see controllers.js
    'mgcrea.ngStrap',
    'ui',
    'colorpicker.module'
  ]);

  //
  //bootstrap angular
  //
  angular.element(document).ready(function() {

    angular.bootstrap(document, ['raw']);

  });

});