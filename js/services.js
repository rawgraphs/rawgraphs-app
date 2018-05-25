'use strict';

/* Services */

angular.module('raw.services', [])

	.factory('dataService', function ($http, $q, $timeout) {

		  return {

				flatJSON : function(array){

					return array.map(function(d){
						return parse_object(d);
					});

					function parse_object(obj, path) {
					    if (path == undefined)
					        path = "";

					    var type = $.type(obj);
					    var scalar = (type == "number" || type == "string" || type == "boolean" || type == "null");

					    if (type == "array" || type == "object") {
					        var d = {};
					        for (var i in obj) {
					            var newD = parse_object(obj[i], path + i + ".");
					            $.extend(d, newD);
					        }

					        return d;
					    }

					    else if (scalar) {
					        var d = {};
					        var endPath = path.substr(0, path.length-1);
					        d[endPath] = obj;
					        return d;
					    }

					    // ?
					    else return {};
					}

				},

				loadURL : function(url) {



				},

				loadExcel : function(file){

					var deferred = $q.defer();

					var reader = new FileReader();

					reader.onload = function(e) {

						var worksheets = [];
			      var data = e.target.result;
			      var workbook = XLSX.read(data, {type: 'binary'});
						var sheet_name_list = workbook.SheetNames;

						sheet_name_list.forEach(function(y) { /* iterate through sheets */
						  var worksheet = workbook.Sheets[y];
							worksheets.push({
								name: y,
								text : XLSX.utils.sheet_to_csv(worksheet)
							//	rows: worksheet['!range'].e.r
							})
						});
						deferred.resolve(worksheets);
			    };

					reader.readAsBinaryString(file);

					return deferred.promise;

				},

				loadJson : function(file){
					var deferred = $q.defer();

					var reader = new FileReader();

					reader.onload = function(e) {
						var text = reader.result;
						var json = JSON.parse(text);
						deferred.resolve(json);
			    };

					reader.readAsText(file);

					return deferred.promise;
				},

				// text file
				loadText : function(file){

					var deferred = $q.defer();

					var reader = new FileReader();

					reader.onload = function(e) {
						var text = reader.result;
						deferred.resolve(text);
			    };

					reader.readAsText(file);

					return deferred.promise;
				},

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
		    },

		    debounce : function (func, wait, immediate) {
			    var timeout;
			    var deferred = $q.defer();
			    return function() {
			      var context = this, args = arguments;
			      var later = function() {
			        timeout = null;
			        if(!immediate) {
			          deferred.resolve(func.apply(context, args));
			          deferred = $q.defer();
			        }
			      };
			      var callNow = immediate && !timeout;
			      if ( timeout ) {
			        $timeout.cancel(timeout);
			      }
			      timeout = $timeout(later, wait);
			      if (callNow) {
			        deferred.resolve(func.apply(context,args));
			        deferred = $q.defer();
			      }
			      return deferred.promise;
			    };
			  }

	  	}
	})
