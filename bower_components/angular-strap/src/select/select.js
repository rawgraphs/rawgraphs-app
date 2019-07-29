'use strict';

angular.module('mgcrea.ngStrap.select', ['mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions'])

  .provider('$select', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'select',
      prefixEvent: '$select',
      placement: 'bottom-left',
      templateUrl: 'select/select.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      multiple: false,
      allNoneButtons: false,
      sort: true,
      caretHtml: '&nbsp;<span class="caret"></span>',
      placeholder: 'Choose among the following...',
      allText: 'All',
      noneText: 'None',
      maxLength: 3,
      maxLengthHtml: 'selected',
      iconCheckmark: 'glyphicon glyphicon-ok',
      toggle: false
    };

    this.$get = function ($window, $document, $rootScope, $tooltip, $timeout) {

      // var bodyEl = angular.element($window.document.body);
      var isNative = /(ip[ao]d|iphone|android)/ig.test($window.navigator.userAgent);
      var isTouch = ('createTouch' in $window.document) && isNative;

      function SelectFactory (element, controller, config) {

        var $select = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $select = $tooltip(element, options);
        var scope = $select.$scope;

        scope.$matches = [];
        if (options.multiple) {
          scope.$activeIndex = [];
        } else {
          scope.$activeIndex = -1;
        }
        scope.$isMultiple = options.multiple;
        scope.$showAllNoneButtons = options.allNoneButtons && options.multiple;
        scope.$iconCheckmark = options.iconCheckmark;
        scope.$allText = options.allText;
        scope.$noneText = options.noneText;

        scope.$activate = function (index) {
          scope.$$postDigest(function () {
            $select.activate(index);
          });
        };

        scope.$select = function (index, evt) {
          scope.$$postDigest(function () {
            $select.select(index);
          });
        };

        scope.$isVisible = function () {
          return $select.$isVisible();
        };

        scope.$isActive = function (index) {
          return $select.$isActive(index);
        };

        scope.$selectAll = function () {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (!scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };

        scope.$selectNone = function () {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };

        // Public methods

        $select.update = function (matches) {
          scope.$matches = matches;
          $select.$updateActiveIndex();
        };

        $select.activate = function (index) {
          if (options.multiple) {
            if ($select.$isActive(index)) {
              scope.$activeIndex.splice(scope.$activeIndex.indexOf(index), 1);
            } else {
              scope.$activeIndex.push(index);
            }
            if (options.sort) scope.$activeIndex.sort(function (a, b) { return a - b; }); // use numeric sort instead of default sort
          } else {
            scope.$activeIndex = index;
          }
          return scope.$activeIndex;
        };

        $select.select = function (index) {
          if (angular.isUndefined(index) || index < 0 || index >= scope.$matches.length) { return; }
          var value = scope.$matches[index].value;
          scope.$apply(function () {
            $select.activate(index);
            if (options.multiple) {
              controller.$setViewValue(scope.$activeIndex.map(function (index) {
                if (angular.isUndefined(scope.$matches[index])) {
                  return null;
                }
                return scope.$matches[index].value;
              }));
            } else {
              if (options.toggle) {
                controller.$setViewValue((value === controller.$modelValue) ? undefined : value);
              } else {
                controller.$setViewValue(value);
              }
              // Hide if single select
              $select.hide();
            }
          });
          // Emit event
          scope.$emit(options.prefixEvent + '.select', value, index, $select);
          if (angular.isDefined(options.onSelect) && angular.isFunction(options.onSelect)) {
            options.onSelect(value, index, $select);
          }
        };

        // Protected methods

        $select.$updateActiveIndex = function () {
          if (options.multiple) {
            if (angular.isArray(controller.$modelValue)) {
              scope.$activeIndex = controller.$modelValue.map(function (value) {
                return $select.$getIndex(value);
              });
            } else {
              scope.$activeIndex = [];
            }
          } else {
            if (angular.isDefined(controller.$modelValue) && scope.$matches.length) {
              scope.$activeIndex = $select.$getIndex(controller.$modelValue);
            } else {
              scope.$activeIndex = -1;
            }
          }
        };

        $select.$isVisible = function () {
          if (!options.minLength || !controller) {
            return scope.$matches.length;
          }
          // minLength support
          return scope.$matches.length && controller.$viewValue.length >= options.minLength;
        };

        $select.$isActive = function (index) {
          if (options.multiple) {
            return scope.$activeIndex.indexOf(index) !== -1;
          }
          return scope.$activeIndex === index;
        };

        $select.$getIndex = function (value) {
          var index;
          for (index = scope.$matches.length; index--;) {
            if (angular.equals(scope.$matches[index].value, value)) break;
          }
          return index;
        };

        $select.$onMouseDown = function (evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            var anchor;

            if (evt.target.nodeName !== 'A') {
              var anchorCandidate = targetEl.parent();
              while (!anchor && anchorCandidate.length > 0) {
                if (anchorCandidate[0].nodeName === 'A') {
                  anchor = anchorCandidate;
                }
                anchorCandidate = anchorCandidate.parent();
              }
            }

            if (anchor) {
              angular.element(anchor).triggerHandler('click');
            } else {
              targetEl.triggerHandler('click');
            }
          }
        };

        $select.$onKeyDown = function (evt) {
          if (!/(9|13|38|40)/.test(evt.keyCode)) return;
          // Let tab propagate
          if (evt.keyCode !== 9) {
            evt.preventDefault();
            evt.stopPropagation();
          }

          // release focus on tab
          if (options.multiple && evt.keyCode === 9) {
            return $select.hide();
          }

          // Select with enter
          if (!options.multiple && (evt.keyCode === 13 || evt.keyCode === 9)) {
            return $select.select(scope.$activeIndex);
          }

          if (!options.multiple) {
            // Navigate with keyboard
            if (evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
            else if (evt.keyCode === 38 && scope.$activeIndex < 0) scope.$activeIndex = scope.$matches.length - 1;
            else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
            else if (angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
            scope.$digest();
          }
        };

        $select.$isIE = function () {
          var ua = $window.navigator.userAgent;
          return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;
        };

        $select.$selectScrollFix = function (e) {
          if ($document[0].activeElement.tagName === 'UL') {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.target.focus();
          }
        };

        // Overrides

        var _show = $select.show;
        $select.show = function () {
          _show();
          if (options.multiple) {
            $select.$element.addClass('select-multiple');
          }
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function () {
            $select.$element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
            if (options.keyboard) {
              element.on('keydown', $select.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $select.hide;
        $select.hide = function () {
          if (!options.multiple && angular.isUndefined(controller.$modelValue)) {
            scope.$activeIndex = -1;
          }
          $select.$element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
          if (options.keyboard) {
            element.off('keydown', $select.$onKeyDown);
          }
          _hide(true);
        };

        return $select;

      }

      SelectFactory.defaults = defaults;
      return SelectFactory;

    };

  })

  .directive('bsSelect', function ($window, $parse, $q, $select, $parseOptions) {

    var defaults = $select.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink (scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope, placeholder: defaults.placeholder};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'placeholder', 'allNoneButtons', 'maxLength', 'maxLengthHtml', 'allText', 'noneText', 'iconCheckmark', 'autoClose', 'id', 'sort', 'caretHtml', 'prefixClass', 'prefixEvent', 'toggle'], function (key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container', 'allNoneButtons', 'sort'], function (key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });

        // bind functions from the attrs to the show, hide and select events
        angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide', 'onSelect'], function (key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });

        // Only parse data-multiple. Angular sets existence attributes to true (multiple/required/etc), they apply this
        // to data-multiple as well for some reason, so we'll parse this ourselves and disregard multiple
        var dataMultiple = element.attr('data-multiple');
        if (angular.isDefined(dataMultiple)) {
          if (falseValueRegExp.test(dataMultiple)) {
            options.multiple = false;
          } else {
            options.multiple = dataMultiple;
          }
        }

        // Add support for select markup
        if (element[0].nodeName.toLowerCase() === 'select') {
          var inputEl = element;
          inputEl.css('display', 'none');
          element = angular.element('<button type="button" class="btn btn-default"></button>');
          inputEl.after(element);
        }

        // Build proper bsOptions
        var parsedOptions = $parseOptions(attr.bsOptions);

        // Initialize select
        var select = $select(element, controller, options);

        if (select.$isIE()) {
          element[0].addEventListener('blur', select.$selectScrollFix);
        }

        // Watch bsOptions values before filtering for changes
        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').trim();
        scope.$watch(watchedOptions, function (newValue, oldValue) {
          // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
          parsedOptions.valuesFn(scope, controller)
          .then(function (values) {
            select.update(values);
            controller.$render();
          });
        }, true);

        // Watch model for changes
        scope.$watch(attr.ngModel, function (newValue, oldValue) {
          // console.warn('scope.$watch(%s)', attr.ngModel, newValue, oldValue);
          select.$updateActiveIndex();
          controller.$render();
        }, true);

        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var selected;
          var index;
          if (options.multiple && angular.isArray(controller.$modelValue)) {
            selected = controller.$modelValue.map(function (value) {
              index = select.$getIndex(value);
              return index !== -1 ? select.$scope.$matches[index].label : false;
            }).filter(angular.isDefined);
            if (selected.length > (options.maxLength || defaults.maxLength)) {
              selected = selected.length + ' ' + (options.maxLengthHtml || defaults.maxLengthHtml);
            } else {
              selected = selected.join(', ');
            }
          } else {
            index = select.$getIndex(controller.$modelValue);
            selected = index !== -1 ? select.$scope.$matches[index].label : false;
          }
          element.html((selected || options.placeholder) + (options.caretHtml || defaults.caretHtml));
        };

        if (options.multiple) {
          controller.$isEmpty = function (value) {
            return !value || value.length === 0;
          };
        }

        // Garbage collection
        scope.$on('$destroy', function () {
          if (select) select.destroy();
          options = null;
          select = null;
        });

      }
    };

  });
