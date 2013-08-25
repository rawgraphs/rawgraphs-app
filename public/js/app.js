'use strict';

// Declare app level module which depends on filters, and services

angular.module('raw', [
  'raw.controllers',
  'raw.filters',
  'raw.services',
  'raw.directives',
  'ui',
  'ngSanitize',
  'colorpicker.module'
])

.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      redirectTo: '/',
      templateUrl: 'partials/main',
      controller: 'rawCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  //$locationProvider.html5Mode(true);
});
