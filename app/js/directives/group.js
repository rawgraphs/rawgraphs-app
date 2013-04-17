'use strict';

angular.module('rawApp')
  .directive('group', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        scope.$watch(element, function(){
        	console.log("cambiato", element.children())
        	var last = element,
        		startFrom = attrs.startFrom || 0;

        	element.children().each(function(i,o){
        		console.log(i,o)
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
