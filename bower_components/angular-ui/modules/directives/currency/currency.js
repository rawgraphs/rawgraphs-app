/*
 Gives the ability to style currency based on its sign.
 */
angular.module('ui.directives').directive('uiCurrency', ['ui.config', 'currencyFilter' , function (uiConfig, currencyFilter) {
  var options = {
    pos: 'ui-currency-pos',
    neg: 'ui-currency-neg',
    zero: 'ui-currency-zero'
  };
  if (uiConfig.currency) {
    angular.extend(options, uiConfig.currency);
  }
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function (scope, element, attrs, controller) {
      var opts, // instance-specific options
        renderview,
        value;

      opts = angular.extend({}, options, scope.$eval(attrs.uiCurrency));

      renderview = function (viewvalue) {
        var num;
        num = viewvalue * 1;
        element.toggleClass(opts.pos, (num > 0) );
        element.toggleClass(opts.neg, (num < 0) );
        element.toggleClass(opts.zero, (num === 0) );
        if (viewvalue === '') {
          element.text('');
        } else {
          element.text(currencyFilter(num, opts.symbol));
        }
        return true;
      };

      controller.$render = function () {
        value = controller.$viewValue;
        element.val(value);
        renderview(value);
      };

    }
  };
}]);
