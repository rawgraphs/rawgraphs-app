'use strict';

angular.module('rawApp')
  .directive('group', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        scope.$watch(attrs.watch,function(){
          var last = element

          element.children().each(function(i,o){
            if( (i) && (i) % attrs.every == 0) {
              last = element.clone().empty();
              last.insertAfter(element);
            }
            $(o).appendTo(last)
          })
        })

      }
    };
  });
