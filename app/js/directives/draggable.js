'use strict';

angular.module('rawApp')
  .directive('draggable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.draggable({
          
          // fixing width issue
          start:function(event,ui){
            var w = element.css("width");
            element.css("width", w);
            ui.helper.css("width", w);
          },
          stop:function(){
            element.css("width", "");
          }

        });
        element.disableSelection();

        // options, not so much safe uh?
        var options = element.draggable('option');
        for(var a in attrs){
        	if (options.hasOwnProperty(a)) {
        		element.draggable('option', a, attrs[a]);
        	}
        }
      }
    };
  });
