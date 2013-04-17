'use strict';

// Declare app level module which depends on filters, and services
angular.module('rawApp', ['rawApp.filters', 'rawApp.services', 'rawApp.directives', 'rawApp.controllers'])
	.config(function ($routeProvider) {
	    $routeProvider
	      .when('/', {
	        templateUrl: 'views/main.html',
	        controller: 'MainCtrl'
	      })
	      .otherwise({
	        redirectTo: '/'
	      });
	  });