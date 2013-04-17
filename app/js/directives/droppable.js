'use strict';

angular.module('rawApp')
  .directive('droppable', function () {
    return {
      replace : false,
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.droppable({
          accept: scope.accept
        })
      }
    };
  });