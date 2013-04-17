'use strict';

angular.module('rawApp')
  .directive('selectpicker', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs) {
          element.selectpicker();
      }
    };
  });