'use strict';
define(['angular'], function(angular) {
  angular.module('raw.routes', [])
    .config(['$routeProvider', '$locationProvider',
      function ($routeProvider, $locationProvider) {

        var config = {templateUrl: 'partials/main.html', controller: 'RawCtrl'};

        $routeProvider.when('/', config);
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
      }
    ]);
});