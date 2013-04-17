'use strict';

angular.module('rawApp')
  .directive('color', function () {
    return {
      template: '<input ng-repeat="(key,value) in colors" type="text" value="{{value}}" class="span12"></input>',
      restrict: 'E',
      scope: {
      	colors: "="
      },
      link: function postLink(scope, element, attrs) {

        function prova(){
          console.log("yeahhh")
        }

      	scope.prova = function(){
      		console.log("yeahhh")
      	}

        scope.$watch("colors",function(){
        	console.log(scope.colors);
        },true)

      }
    };
  });
