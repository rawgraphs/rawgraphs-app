'use strict';

/* Services */

angular.module('raw.services', [])

	.factory('dataService', function ($http, $q) {
		  
		  return {
		    
		    loadSample : function(sample){

		      var deferred = $q.defer();
		      $http.get(sample)
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