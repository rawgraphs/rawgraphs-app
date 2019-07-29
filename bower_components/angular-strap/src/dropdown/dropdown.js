'use strict';

angular.module('mgcrea.ngStrap.dropdown', ['mgcrea.ngStrap.tooltip'])

  .provider('$dropdown', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'dropdown',
      prefixEvent: 'dropdown',
      placement: 'bottom-left',
      templateUrl: 'dropdown/dropdown.tpl.html',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };

    this.$get = function ($window, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

      function DropdownFactory (element, config) {

        var $dropdown = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        /* var scope = */$dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        $dropdown = $tooltip(element, options);
        var parentEl = element.parent();

        // Protected methods

        $dropdown.$onKeyDown = function (evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Retrieve focused index
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if (!items.length) return;
          var index;
          angular.forEach(items, function (el, i) {
            if (matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });

          // Navigate with keyboard
          if (evt.keyCode === 38 && index > 0) index--;
          else if (evt.keyCode === 40 && index < items.length - 1) index++;
          else if (angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();

        };

        // Overrides

        var show = $dropdown.show;
        $dropdown.show = function () {
          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function () {
            if (options.keyboard && $dropdown.$element) $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          }, 0, false);
          if (parentEl.hasClass('dropdown')) parentEl.addClass('open');
        };

        var hide = $dropdown.hide;
        $dropdown.hide = function () {
          if (!$dropdown.$isShown) return;
          if (options.keyboard && $dropdown.$element) $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          if (parentEl.hasClass('dropdown')) parentEl.removeClass('open');
          hide();
        };

        var destroy = $dropdown.destroy;
        $dropdown.destroy = function () {
          bodyEl.off('click', onBodyClick);
          destroy();
        };

        // Private functions

        function onBodyClick (evt) {
          if (evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }

        return $dropdown;

      }

      return DropdownFactory;

    };

  })

  .directive('bsDropdown', function ($window, $sce, $dropdown) {

    return {
      restrict: 'EAC',
      scope: true,
      compile: function (tElement, tAttrs) {

        // Support for inlined template (next sibling)
        // It must be fetched before compilation
        if (!tAttrs.bsDropdown) {
          var nextSibling = tElement[0].nextSibling;
          while (nextSibling && nextSibling.nodeType !== 1) {
            nextSibling = nextSibling.nextSibling;
          }
          if (nextSibling && nextSibling.className.split(' ').indexOf('dropdown-menu') >= 0) {
            tAttrs.template = nextSibling.outerHTML;
            tAttrs.templateUrl = undefined;
            nextSibling.parentNode.removeChild(nextSibling);
          }
        }

        return function postLink (scope, element, attr) {

          // Directive options
          var options = {scope: scope};
          angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'id', 'autoClose'], function (key) {
            if (angular.isDefined(tAttrs[key])) options[key] = tAttrs[key];
          });

          // use string regex match boolean attr falsy values, leave truthy values be
          var falseValueRegExp = /^(false|0|)$/i;
          angular.forEach(['html', 'container'], function (key) {
            if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
          });

          // bind functions from the attrs to the show and hide events
          angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide'], function (key) {
            var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
            if (angular.isDefined(attr[bsKey])) {
              options[key] = scope.$eval(attr[bsKey]);
            }
          });

          // Support scope as an object
          if (attr.bsDropdown) {
            scope.$watch(attr.bsDropdown, function (newValue, oldValue) {
              scope.content = newValue;
            }, true);
          }

          // Initialize dropdown
          var dropdown = $dropdown(element, options);

          // Visibility binding support
          if (attr.bsShow) {
            scope.$watch(attr.bsShow, function (newValue, oldValue) {
              if (!dropdown || !angular.isDefined(newValue)) return;
              if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
              if (newValue === true) {
                dropdown.show();
              } else {
                dropdown.hide();
              }
            });
          }

          // Garbage collection
          scope.$on('$destroy', function () {
            if (dropdown) dropdown.destroy();
            options = null;
            dropdown = null;
          });

        };
      }
    };

  });
