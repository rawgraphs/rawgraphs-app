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
        }

      	scope.prova = function(){
      	}

        scope.$watch("colors",function(){
        },true)

      }
    };
  });
