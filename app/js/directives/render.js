'use strict';

angular.module('rawApp')
  .directive('render', function () {
    return {
      template: '<div class="layout"></div>',
      replace: true,
      require :'?ngModel',
      scope: {
      	renderLayout: "=",
      	renderData: "=",
      },
      restrict: 'E',
      link: function(scope, element, attrs) {
        //element.text('this is the render directive');

        var updateLayout = function() {
          
          var data = scope.renderData,
              target = d3.select(element[0]),
              model = scope.renderLayout.model;

          target.selectAll("svg").remove();
          if (!model.isValid() || !data.length) return;
                  
        	scope.renderLayout.render(data, target);
        }

        scope.$watch("renderLayout",function(){
        	if(scope.renderLayout) updateLayout();
        },true)

        scope.$watch("renderData",function(){
        	if(scope.renderLayout) updateLayout();
        }, true)

        
      }
    };
  });
