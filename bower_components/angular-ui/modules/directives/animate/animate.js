/**
 * Animates the injection of new DOM elements by simply creating the DOM with a class and then immediately removing it
 * Animations must be done using CSS3 transitions, but provide excellent flexibility
 *
 * @todo Add proper support for animating out
 * @param [options] {mixed} Can be an object with multiple options, or a string with the animation class
 *    class {string} the CSS class(es) to use. For example, 'ui-hide' might be an excellent alternative class.
 * @example <li ng-repeat="item in items" ui-animate=" 'ui-hide' ">{{item}}</li>
 */
angular.module('ui.directives').directive('uiAnimate', ['ui.config', '$timeout', function (uiConfig, $timeout) {
  var options = {};
  if (angular.isString(uiConfig.animate)) {
    options['class'] = uiConfig.animate;
  } else if (uiConfig.animate) {
    options = uiConfig.animate;
  }
  return {
    restrict: 'A', // supports using directive as element, attribute and class
    link: function ($scope, element, attrs) {
      var opts = {};
      if (attrs.uiAnimate) {
        opts = $scope.$eval(attrs.uiAnimate);
        if (angular.isString(opts)) {
          opts = {'class': opts};
        }
      }
      opts = angular.extend({'class': 'ui-animate'}, options, opts);

      element.addClass(opts['class']);
      $timeout(function () {
        element.removeClass(opts['class']);
      }, 20, false);
    }
  };
}]);

