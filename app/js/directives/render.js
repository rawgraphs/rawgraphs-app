'use strict';

angular.module('rawApp')
  .directive('render', function () {
    return {
      template: '<div class="layout"></div>',
      replace: true,
      require :'?ngModel',
      scope: {
      	layout: "=",
      	data: "=",
        update: "&"
      },
      restrict: 'E',
      link: function(scope, element, attrs) {

        var updateLayout = function() {
          
          var target = d3.select(element[0]),
              model = scope.layout.model;

          target.selectAll("svg").remove();
          if (!model.isValid() || !scope.data.length) return;
                  
        	scope.layout.render(scope.data, target);
          scope.update();
        }

        scope.$watch("layout",function(){
        	if(scope.layout) updateLayout();
        },true)

        scope.$watch("data",function(){
        	if(scope.layout) updateLayout();
        }, true)

        
      }
    };
  });
