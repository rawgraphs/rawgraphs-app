angular.module('rawApp')
  .directive('coder', function () {
    return {
      restrict: 'E',
      scope : {
        source : '@',
      },
      template :  '<textarea class="span12" ng-model="stringify"></textarea>',

      link: function postLink(scope, element, attrs) {


        scope.stringify = function(){
          //if (!$(scope.source).find("svg").length) return;
          return $(scope.source).find('svg').length;
          return d3.select(scope.source).select("svg")
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .node().parentNode.innerHTML;

        }
        

      }
    };
  });