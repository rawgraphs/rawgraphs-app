'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('raw.services', []).
	
	factory('dataService', function($http, $q) {
	  
	  return {

	  	loadConfig : function(url){

	      var deferred = $q.defer();
	      $http.get(url)
		      .then(function(response){
		          deferred.resolve(response.data);
		      },
		      function(){
		          deferred.reject("An error occured while getting config file (" + url + ")");
		      });
	      
	      return deferred.promise;
	    },

	    loadChart : function(url){

	      var deferred = $q.defer();
	      $http.get(url, { transformResponse: function(d){ return d; } } )
		      .then(function(response){
		          deferred.resolve(response.data);
		      },
		      function(){
		          deferred.reject("An error occured while getting config file (" + url + ")");
		      });
	      
	      return deferred.promise;
	    },
	    
	    loadSample : function(sample){

	      var deferred = $q.defer();
	      $http.get(sample.url)
		      .then(function(response){
		          deferred.resolve(response.data);
		      },
		      function(){
		          deferred.reject("An error occured while getting sample (" + sample.title + ")");
		      });
	      
	      return deferred.promise;
	    }

  	}
	})