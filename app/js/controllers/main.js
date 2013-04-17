'use strict';

angular.module('rawApp')
  .controller('mainCtrl', function($scope, $http) {

  	$scope.$watch("text", function(){
   
    	$scope.errors = false;

			try {
				
				$scope.data = raw.parse($scope.text);
				var sniff = raw.sniffAll($scope.data)
				$scope.header = d3.keys($scope.data[0]).map(function(d){
					return { key:d, type:raw.maxOnValue(raw.count(sniff[d]))}
				})
			
			} catch(e){
				
				$scope.data = [];
				$scope.header = [];
				$scope.errors = e.message;
			
			}

    })


  	// should be a service?
    $scope.loadSample = function() {
    
	    $http({method: 'GET', url: 'samples/comuni.txt'}).
	    success(function(data, status, headers, config) {
	      	$scope.text = data;
	    }).
	    error(function(data, status, headers, config) {
	      $scope.error = "Oh no! Sorry, but we can't retrieve sample data (" + status + ")";
	    });
  	
  	}

  	// loading scripts
  	$scope.loadScripts = function() {
  		
  		var scripts = [];

  		// let's loading models...
  		$http.get('models/models.json')
  			.success(function(data){
  				scripts = scripts.concat(data);
  				// let's loading layouts...
  				$http.get('layouts/layouts.json')
  					.success(function(data){

  						scripts = scripts.concat(data);
  						
  						// i know, please forgive me
  						var counter = 0;
  						var loaded = function(){
  							counter++;
  							if (counter == scripts.length) {
  								$scope.layouts = d3.values(raw.layouts).map(function(l){ return l(); });
    							$scope.layout = $scope.layouts[0];
    							$scope.$apply();
  							}
  						}

  						for (var script in scripts) {
			      		try {
			      			var fileref=document.createElement('script')
	  							fileref.setAttribute("src", scripts[script].file)
	  							document.getElementsByTagName("body")[0].appendChild(fileref);
	  							fileref.onload = loaded;
	  							$scope.loadingProgress = (script+1)/scripts.length*100;
	  						}
	  						catch(err) {
	  							console.log("sdad")
	  						}
		      		}

  					})

  			})
  	}

  	
  	$scope.loadScripts();

  });