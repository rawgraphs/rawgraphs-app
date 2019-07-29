xdescribe('uiMask', function () {

  var inputHtml = "<input ui-mask=\"'(9)9'\" ng-model='x'>";
  var $compile, $rootScope, element;

  beforeEach(module('ui.directives'));
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('ui changes on model changes', function () {
    it('should update ui valid model value', function () {
      $rootScope.x = undefined;
      element = $compile(inputHtml)($rootScope);
      $rootScope.$digest();
      expect(element.val()).toBe('');
      $rootScope.$apply(function () {
        $rootScope.x = 12;
      });
      expect(element.val()).toBe('(1)2');
    });
    it('should wipe out ui on invalid model value', function () {
      $rootScope.x = 12;
      element = $compile(inputHtml)($rootScope);
      $rootScope.$digest();
      expect(element.val()).toBe('(1)2');
      $rootScope.$apply(function () {
        $rootScope.x = 1;
      });
      expect(element.val()).toBe('');
    });
  });

  describe('model binding on ui change', function () {
    //TODO: was having har time writing those tests, will open a separate issue for those
  });

  describe('should fail', function() {
    it('errors on missing quotes', function() {
      $rootScope.x = 42;
      var errorInputHtml = "<input ui-mask=\"(9)9\" ng-model='x'>";
      element = $compile(errorInputHtml)($rootScope);
      expect($rootScope.$digest).toThrow('The Mask widget is not correctly set up');
    });
  });
});