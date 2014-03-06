'use strict';

angular.module('raw', [
  'ngRoute',
  'ngAnimate',
  'raw.filters',
  'raw.services',
  'raw.directives',
  'raw.controllers',
  'mgcrea.ngStrap',
  'ui.codemirror'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'RawCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);