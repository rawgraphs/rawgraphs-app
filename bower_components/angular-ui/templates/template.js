angular.module('ui.directives').directive('uiTemplate', ['ui.config', function (uiConfig) {
  var options = uiConfig.uiTemplate || {};
  return {
    restrict: 'EAC', // supports using directive as element, attribute and class
    link: function (iScope, iElement, iAttrs, controller) {
      var opts;

      // opts is link element-specific options merged on top of global defaults. If you only extend the global default, then all instances would override each other
      opts = angular.extend({}, options, iAttrs.uiTemplate);

      // your logic goes here
    }
  };
}]);


angular.module('ui.filters').filter('filterTmpl', ['ui.config', function (uiConfig) {
  return function (value) {
    return value;
  };
}]);