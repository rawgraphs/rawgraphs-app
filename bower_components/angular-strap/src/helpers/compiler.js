'use strict';

// NOTICE: This file was forked from the angular-material project (github.com/angular/material)
// MIT Licensed - Copyright (c) 2014-2015 Google, Inc. http://angularjs.org

angular.module('mgcrea.ngStrap.core', [])
  .service('$bsCompiler', bsCompilerService);

function bsCompilerService ($q, $http, $injector, $compile, $controller, $templateCache) {

  /*
   * @ngdoc service
   * @name $bsCompiler
   * @module material.core
   * @description
   * The $bsCompiler service is an abstraction of angular's compiler, that allows the developer
   * to easily compile an element with a templateUrl, controller, and locals.
   *
   * @usage
   * <hljs lang="js">
   * $bsCompiler.compile({
   *   templateUrl: 'modal.html',
   *   controller: 'ModalCtrl',
   *   locals: {
   *     modal: myModalInstance;
   *   }
   * }).then(function(compileData) {
   *   compileData.element; // modal.html's template in an element
   *   compileData.link(myScope); //attach controller & scope to element
   * });
   * </hljs>
   */

   /*
    * @ngdoc method
    * @name $bsCompiler#compile
    * @description A helper to compile an HTML template/templateUrl with a given controller,
    * locals, and scope.
    * @param {object} options An options object, with the following properties:
    *
    *    - `controller` - `{(string=|function()=}` Controller fn that should be associated with
    *      newly created scope or the name of a registered controller if passed as a string.
    *    - `controllerAs` - `{string=}` A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` - `{string=}` An html template as a string.
    *    - `templateUrl` - `{string=}` A path to an html template.
    *    - `transformTemplate` - `{function(template)=}` A function which transforms the template after
    *      it is loaded. It will be given the template string as a parameter, and should
    *      return a a new string representing the transformed template.
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the compiler
    *      will wait for them all to be resolved, or if one is rejected before the controller is
    *      instantiated `compile()` will fail..
    *      * `key` - `{string}`: a name of a dependency to be injected into the controller.
    *      * `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is injected and the return value is treated as the
    *        dependency. If the result is a promise, it is resolved before its value is
    *        injected into the controller.
    *
    * @returns {object=} promise A promise, which will be resolved with a `compileData` object.
    * `compileData` has the following properties:
    *
    *   - `element` - `{element}`: an uncompiled element matching the provided template.
    *   - `link` - `{function(scope)}`: A link function, which, when called, will compile
    *     the element and instantiate the provided controller (if given).
    *   - `locals` - `{object}`: The locals which will be passed into the controller once `link` is
    *     called. If `bindToController` is true, they will be coppied to the ctrl instead
    *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in.
    */
  this.compile = function (options) {

    if (options.template && /\.html$/.test(options.template)) {
      console.warn('Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead.');
      options.templateUrl = options.template;
      options.template = '';
    }

    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = options.resolve || {};
    var locals = options.locals || {};
    var transformTemplate = options.transformTemplate || angular.identity;
    var bindToController = options.bindToController;

    // Take resolve values and invoke them.
    // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
    // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
    angular.forEach(resolve, function (value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    // Add the locals, which are just straight values to inject
    // eg locals: { three: 3 }, will inject three into the controller
    angular.extend(resolve, locals);

    if (template) {
      resolve.$template = $q.when(template);
    } else if (templateUrl) {
      resolve.$template = fetchTemplate(templateUrl);
    } else {
      throw new Error('Missing `template` / `templateUrl` option.');
    }

    if (options.titleTemplate) {
      resolve.$template = $q.all([resolve.$template, fetchTemplate(options.titleTemplate)])
        .then(function (templates) {
          var templateEl = angular.element(templates[0]);
          findElement('[ng-bind="title"]', templateEl[0])
            .removeAttr('ng-bind')
            .html(templates[1]);
          return templateEl[0].outerHTML;
        });
    }

    if (options.contentTemplate) {
      // TODO(mgcrea): deprecate?
      resolve.$template = $q.all([resolve.$template, fetchTemplate(options.contentTemplate)])
        .then(function (templates) {
          var templateEl = angular.element(templates[0]);
          var contentEl = findElement('[ng-bind="content"]', templateEl[0])
            .removeAttr('ng-bind')
            .html(templates[1]);
          // Drop the default footer as you probably don't want it if you use a custom contentTemplate
          if (!options.templateUrl) contentEl.next().remove();
          return templateEl[0].outerHTML;
        });
    }

    // Wait for all the resolves to finish if they are promises
    return $q.all(resolve).then(function (locals) {

      var template = transformTemplate(locals.$template);
      if (options.html) {
        template = template.replace(/ng-bind="/ig, 'ng-bind-html="');
      }
      // var element = options.element || angular.element('<div>').html(template.trim()).contents();
      var element = angular.element('<div>').html(template.trim()).contents();
      var linkFn = $compile(element);

      // Return a linking function that can be used later when the element is ready
      return {
        locals: locals,
        element: element,
        link: function link (scope) {
          locals.$scope = scope;

          // Instantiate controller if it exists, because we have scope
          if (controller) {
            var invokeCtrl = $controller(controller, locals, true);
            if (bindToController) {
              angular.extend(invokeCtrl.instance, locals);
            }
            // Support angular@~1.2 invokeCtrl
            var ctrl = angular.isObject(invokeCtrl) ? invokeCtrl : invokeCtrl();
            // See angular-route source for this logic
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);

            if (controllerAs) {
              scope[controllerAs] = ctrl;
            }
          }

          return linkFn.apply(null, arguments);
        }
      };
    });

  };

  function findElement (query, element) {
    return angular.element((element || document).querySelectorAll(query));
  }

  var fetchPromises = {};
  function fetchTemplate (template) {
    if (fetchPromises[template]) return fetchPromises[template];
    return (fetchPromises[template] = $http.get(template, {cache: $templateCache})
      .then(function (res) {
        return res.data;
      }));
  }

}
