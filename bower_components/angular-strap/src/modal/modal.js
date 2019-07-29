'use strict';

angular.module('mgcrea.ngStrap.modal', ['mgcrea.ngStrap.core', 'mgcrea.ngStrap.helpers.dimensions'])

  .provider('$modal', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      backdropAnimation: 'am-fade',
      customClass: '',
      prefixClass: 'modal',
      prefixEvent: 'modal',
      placement: 'top',
      templateUrl: 'modal/modal.tpl.html',
      template: '',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true,
      size: null,
      zIndex: null
    };

    this.$get = function ($window, $rootScope, $bsCompiler, $animate, $timeout, $sce, dimensions) {

      var forEach = angular.forEach;
      var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
      var bodyElement = angular.element($window.document.body);

      var backdropCount = 0;
      var dialogBaseZindex = 1050;
      var backdropBaseZindex = 1040;

      var validSizes = {
        lg: 'modal-lg',
        sm: 'modal-sm'
      };

      function ModalFactory (config) {

        var $modal = {};

        // Common vars
        var options = $modal.$options = angular.extend({}, defaults, config);
        var promise = $modal.$promise = $bsCompiler.compile(options);
        var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        if (!options.element && !options.container) {
          options.container = 'body';
        }

        if (options.zIndex) {
          dialogBaseZindex = parseInt(options.zIndex, 10);
          backdropBaseZindex = dialogBaseZindex - 10;
        }

        // Store $id to identify the triggering element in events
        // give priority to options.id, otherwise, try to use
        // element id if defined
        $modal.$id = options.id || options.element && options.element.attr('id') || '';

        // Support scope as string options
        forEach(['title', 'content'], function (key) {
          if (options[key]) scope[key] = $sce.trustAsHtml(options[key]);
        });

        // Provide scope helpers
        scope.$hide = function () {
          scope.$$postDigest(function () {
            $modal.hide();
          });
        };
        scope.$show = function () {
          scope.$$postDigest(function () {
            $modal.show();
          });
        };
        scope.$toggle = function () {
          scope.$$postDigest(function () {
            $modal.toggle();
          });
        };
        // Publish isShown as a protected var on scope
        $modal.$isShown = scope.$isShown = false;

        // Fetch, compile then initialize modal
        var compileData;
        var modalElement;
        var modalScope;
        var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
        backdropElement.css({position: 'fixed', top: '0px', left: '0px', bottom: '0px', right: '0px'});
        promise.then(function (data) {
          compileData = data;
          $modal.init();
        });

        $modal.init = function () {

          // Options: show
          if (options.show) {
            scope.$$postDigest(function () {
              $modal.show();
            });
          }

        };

        $modal.destroy = function () {

          // Remove element
          destroyModalElement();

          // remove backdrop element
          if (backdropElement) {
            backdropElement.remove();
            backdropElement = null;
          }

          // Destroy scope
          scope.$destroy();
        };

        $modal.show = function () {
          if ($modal.$isShown) return;

          var parent;
          var after;
          if (angular.isElement(options.container)) {
            parent = options.container;
            after = options.container[0].lastChild ? angular.element(options.container[0].lastChild) : null;
          } else {
            if (options.container) {
              parent = findElement(options.container);
              after = parent[0] && parent[0].lastChild ? angular.element(parent[0].lastChild) : null;
            } else {
              parent = null;
              after = options.element;
            }
          }

          // destroy any existing modal elements
          if (modalElement) destroyModalElement();

          // create a new scope, so we can destroy it and all child scopes
          // when destroying the modal element
          modalScope = $modal.$scope.$new();
          // Fetch a cloned element linked from template (noop callback is required)
          modalElement = $modal.$element = compileData.link(modalScope, function (clonedElement, scope) {});

          if (options.backdrop) {
            // set z-index
            modalElement.css({'z-index': dialogBaseZindex + (backdropCount * 20)});
            backdropElement.css({'z-index': backdropBaseZindex + (backdropCount * 20)});

            // increment number of backdrops
            backdropCount++;
          }

          if (scope.$emit(options.prefixEvent + '.show.before', $modal).defaultPrevented) {
            return;
          }
          if (angular.isDefined(options.onBeforeShow) && angular.isFunction(options.onBeforeShow)) {
            options.onBeforeShow($modal);
          }

          // Set the initial positioning.
          modalElement.css({display: 'block'}).addClass(options.placement);

          // Options: customClass
          if (options.customClass) {
            modalElement.addClass(options.customClass);
          }

          // Options: size
          if (options.size && validSizes[options.size]) {
            angular.element(findElement('.modal-dialog', modalElement[0])).addClass(validSizes[options.size]);
          }

          // Options: animation
          if (options.animation) {
            if (options.backdrop) {
              backdropElement.addClass(options.backdropAnimation);
            }
            modalElement.addClass(options.animation);
          }

          if (options.backdrop) {
            $animate.enter(backdropElement, bodyElement, null);
          }

          // Support v1.2+ $animate
          // https://github.com/angular/angular.js/issues/11713
          if (angular.version.minor <= 2) {
            $animate.enter(modalElement, parent, after, enterAnimateCallback);
          } else {
            $animate.enter(modalElement, parent, after).then(enterAnimateCallback);
          }

          $modal.$isShown = scope.$isShown = true;
          safeDigest(scope);
          // Focus once the enter-animation has started
          // Weird PhantomJS bug hack
          var el = modalElement[0];
          requestAnimationFrame(function () {
            el.focus();
          });

          bodyElement.addClass(options.prefixClass + '-open');
          if (options.animation) {
            bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
          }

          // Bind events
          bindBackdropEvents();
          bindKeyboardEvents();
        };

        function enterAnimateCallback () {
          scope.$emit(options.prefixEvent + '.show', $modal);
          if (angular.isDefined(options.onShow) && angular.isFunction(options.onShow)) {
            options.onShow($modal);
          }
        }

        $modal.hide = function () {
          if (!$modal.$isShown) return;

          if (scope.$emit(options.prefixEvent + '.hide.before', $modal).defaultPrevented) {
            return;
          }
          if (angular.isDefined(options.onBeforeHide) && angular.isFunction(options.onBeforeHide)) {
            options.onBeforeHide($modal);
          }

          // Support v1.2+ $animate
          // https://github.com/angular/angular.js/issues/11713
          if (angular.version.minor <= 2) {
            $animate.leave(modalElement, leaveAnimateCallback);
          } else {
            $animate.leave(modalElement).then(leaveAnimateCallback);
          }

          if (options.backdrop) {
            // decrement number of backdrops
            backdropCount--;
            $animate.leave(backdropElement);
          }
          $modal.$isShown = scope.$isShown = false;
          safeDigest(scope);

          // Unbind events
          unbindBackdropEvents();
          unbindKeyboardEvents();
        };

        function leaveAnimateCallback () {
          scope.$emit(options.prefixEvent + '.hide', $modal);
          if (angular.isDefined(options.onHide) && angular.isFunction(options.onHide)) {
            options.onHide($modal);
          }
          if (findElement('.modal').length <= 0) {
            bodyElement.removeClass(options.prefixClass + '-open');
          }
          if (options.animation) {
            bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
          }
        }

        $modal.toggle = function () {
          if ($modal.$isShown) {
            $modal.hide();
          } else {
            $modal.show();
          }
        };

        $modal.focus = function () {
          modalElement[0].focus();
        };

        // Protected methods

        $modal.$onKeyUp = function (evt) {

          if (evt.which === 27 && $modal.$isShown) {
            $modal.hide();
            evt.stopPropagation();
          }

        };

        function bindBackdropEvents () {
          if (options.backdrop) {
            modalElement.on('click', hideOnBackdropClick);
            backdropElement.on('click', hideOnBackdropClick);
            backdropElement.on('wheel', preventEventDefault);
          }
        }

        function unbindBackdropEvents () {
          if (options.backdrop) {
            modalElement.off('click', hideOnBackdropClick);
            backdropElement.off('click', hideOnBackdropClick);
            backdropElement.off('wheel', preventEventDefault);
          }
        }

        function bindKeyboardEvents () {
          if (options.keyboard) {
            modalElement.on('keyup', $modal.$onKeyUp);
          }
        }

        function unbindKeyboardEvents () {
          if (options.keyboard) {
            modalElement.off('keyup', $modal.$onKeyUp);
          }
        }

        // Private helpers

        function hideOnBackdropClick (evt) {
          if (evt.target !== evt.currentTarget) return;
          if (options.backdrop === 'static') {
            $modal.focus();
          } else {
            $modal.hide();
          }
        }

        function preventEventDefault (evt) {
          evt.preventDefault();
        }

        function destroyModalElement () {
          if ($modal.$isShown && modalElement !== null) {
            // un-bind events
            unbindBackdropEvents();
            unbindKeyboardEvents();
          }

          if (modalScope) {
            modalScope.$destroy();
            modalScope = null;
          }

          if (modalElement) {
            modalElement.remove();
            modalElement = $modal.$element = null;
          }
        }

        return $modal;

      }

      // Helper functions

      function safeDigest (scope) {
        /* eslint-disable no-unused-expressions */
        scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
        /* eslint-enable no-unused-expressions */
      }

      function findElement (query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }

      return ModalFactory;

    };

  })

  .directive('bsModal', function ($window, $sce, $parse, $modal) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink (scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation', 'backdropAnimation', 'id', 'prefixEvent', 'prefixClass', 'customClass', 'modalClass', 'size', 'zIndex'], function (key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Options: alias modalClass to customClass
        if (options.modalClass) {
          options.customClass = options.modalClass;
        }

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['backdrop', 'keyboard', 'html', 'container'], function (key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });

        // bind functions from the attrs to the show and hide events
        angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide'], function (key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function (key) {
          if (attr[key]) {
            attr.$observe(key, function (newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });

        // Support scope as an object
        if (attr.bsModal) {
          scope.$watch(attr.bsModal, function (newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }

        // Initialize modal
        var modal = $modal(options);

        // Trigger
        element.on(attr.trigger || 'click', modal.toggle);

        // Garbage collection
        scope.$on('$destroy', function () {
          if (modal) modal.destroy();
          options = null;
          modal = null;
        });

      }
    };

  });
