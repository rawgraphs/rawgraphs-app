/*
 * sample unit testing for sample templates and implementations
 */
describe('uiAnimate', function () {

  // declare these up here to be global to all tests
  var $rootScope, $compile, $timeout, uiConfig = angular.module('ui.config');

  beforeEach(module('ui.directives'));

  // inject in angular constructs. Injector knows about leading/trailing underscores and does the right thing
  // otherwise, you would need to inject these into each test
  beforeEach(inject(function (_$rootScope_, _$compile_, _$timeout_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  afterEach(function () {
    uiConfig.value('ui.config', {});
  });

  describe('behavior', function () {
    it('should add a ui-animate class when the dom is compiled', function () {
      var element = $compile('<div ui-animate></div>')($rootScope);
      expect(element.hasClass('ui-animate')).toBeTruthy();
    });
    it('should remove the ui-animate class immediately after injection', function () {
      var element = $compile('<div ui-animate></div>')($rootScope);
      $timeout.flush();
      expect(element.hasClass('ui-animate')).toBeFalsy();
    });

  });

  describe('options', function () {
    describe('passed', function () {

      it('should use a string as the class', function () {
        var element = $compile('<div ui-animate=" \'ui-hide\' "></div>')($rootScope);
        expect(element.hasClass('ui-hide')).toBeTruthy();
      });
      it('should use an object\'s class attribute as the class', function () {
        var element = $compile('<div ui-animate=" { \'class\' : \'ui-hide\' } "></div>')($rootScope);
        expect(element.hasClass('ui-hide')).toBeTruthy();
      });

    });
    describe('global', function () {

      var uiConfig;
      beforeEach(inject(function ($injector) {
        uiConfig = $injector.get('ui.config');
      }));

      it('should use a string as the class', function () {
        uiConfig.animate = 'ui-hide-global';
        var element = $compile('<div ui-animate></div>')($rootScope);
        expect(element.hasClass('ui-hide-global')).toBeTruthy();
      });

      it('should use an object\'s class attribute as the class', function () {
        uiConfig.animate = { 'class': 'ui-hide-global' };
        var element = $compile('<div ui-animate></div>')($rootScope);
        expect(element.hasClass('ui-hide-global')).toBeTruthy();
      });

    });
  });

});
