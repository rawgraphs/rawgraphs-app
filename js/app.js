'use strict';

angular.module('raw', [
  'ngRoute',
  'raw.filters',
  'raw.services',
  'raw.directives',
  'raw.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'RawCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);