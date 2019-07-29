/*global describe, beforeEach, module, inject, it, spyOn, expect, $ */
describe('uiSelect2', function () {
  'use strict';

  var scope, $compile, options, $timeout;
  beforeEach(module('ui.directives'));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$window_, _$timeout_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    scope.options = {
      query: function (query) {
        var data = {
          results: [{ id: 1, text: 'first' }]
        };
        query.callback(data);
      }
    };
  }));

  /**
   * Compile a template synchronously
   * @param  {String} template The string to compile
   * @return {Object}          A reference to the compiled template
   */
  function compile(template) {
    var element = $compile(template)(scope);
    scope.$apply();
    $timeout.flush();
    return element;
  }

  describe('with a <select> element', function () {
    describe('compiling this directive', function () {
      it('should throw an error if we have no model defined', function () {
        expect(function(){
          compile('<select type="text" ui-reset></select>');
        }).toThrow();
      });
      it('should create proper DOM structure', function () {
        var element = compile('<select ui-select2 ng-model="foo"></select>');
        expect(element.siblings().is('div.select2-container')).toBe(true);
      });
    });
    describe('when model is changed programmatically', function(){
      it('should set select2 to the value', function(){
        scope.foo = 'First';
        var element = compile('<select ui-select2 ng-model="foo"><option>First</option><option>Second</option></select>');
        expect(element.select2('val')).toBe('First');
        scope.$apply('foo = "Second"');
        expect(element.select2('val')).toBe('Second');
      });
      it('should set select2 to the value for multiples', function(){
        scope.foo = 'First';
        var element = compile('<select ui-select2 multiple ng-model="foo"><option>First</option><option>Second</option><option>Third</option></select>');
        expect(element.select2('val')).toEqual(['First']);
        scope.$apply('foo = ["Second"]');
        expect(element.select2('val')).toEqual(['Second']);
        scope.$apply('foo = ["Second","Third"]');
        expect(element.select2('val')).toEqual(['Second','Third']);
      });
    });
    it('should observe the disabled attribute', function () {
      var element = compile('<select ui-select2 ng-model="foo" ng-disabled="disabled"></select>');
      expect(element.siblings().hasClass('select2-container-disabled')).toBe(false);
      scope.$apply('disabled = true');
      expect(element.siblings().hasClass('select2-container-disabled')).toBe(true);
      scope.$apply('disabled = false');
      expect(element.siblings().hasClass('select2-container-disabled')).toBe(false);
    });
    it('should observe the multiple attribute', function () {
      var element = $compile('<select ui-select2 ng-model="foo" ng-multiple="multiple"></select>')(scope);

      expect(element.siblings().hasClass('select2-container-multi')).toBe(false);
      scope.$apply('multiple = true');
      expect(element.siblings().hasClass('select2-container-multi')).toBe(true);
      scope.$apply('multiple = false');
      expect(element.siblings().hasClass('select2-container-multi')).toBe(false);
    });
    it('should observe an option with ng-repeat for changes', function(){
      scope.items = ['first', 'second', 'third'];
      scope.foo = 'fourth';
      var element = compile('<select ui-select2 ng-model="foo"><option ng-repeat="item in items">{{item}}</option></select>');
      expect(element.select2('val')).toNotBe('fourth');
      scope.$apply('items=["fourth"]');
      $timeout.flush();
      expect(element.select2('val')).toBe('fourth');
    });
  });
  describe('with an <input> element', function () {
    describe('compiling this directive', function () {
      it('should throw an error if we have no model defined', function () {
        expect(function() {
          compile('<input ui-select2/>');
        }).toThrow();
      });
      it('should creae proper DOM structure', function () {
        var element = compile('<input ui-select2="options" ng-model="foo"/>');
        expect(element.siblings().is('div.select2-container')).toBe(true);
      });
    });
    describe('when model is changed programmatically', function(){
      describe('for single-select', function(){
        it('should call select2(data, ...) for objects', function(){
          var element = compile('<input ng-model="foo" ui-select2="options">');
          spyOn($.fn, 'select2');
          scope.$apply('foo={ id: 1, text: "first" }');
          expect(element.select2).toHaveBeenCalledWith('data', { id: 1, text: "first" });
        });
        it('should call select2(val, ...) for strings', function(){
          var element = compile('<input ng-model="foo" ui-select2="options">');
          spyOn($.fn, 'select2');
          scope.$apply('foo="first"');
          expect(element.select2).toHaveBeenCalledWith('val', 'first');
        });
      });
      describe('for multi-select', function(){
        it('should call select2(data, ...) for arrays', function(){
          var element = compile('<input ng-model="foo" multiple ui-select2="options">');
          spyOn($.fn, 'select2');
          scope.$apply('foo=[{ id: 1, text: "first" },{ id: 2, text: "second" }]');
          expect(element.select2).toHaveBeenCalledWith('data', [{ id: 1, text: "first" },{ id: 2, text: "second" }]);
        });
        it('should call select2(data, []) for falsey values', function(){
          var element = compile('<input ng-model="foo" multiple ui-select2="options">');
          spyOn($.fn, 'select2');
          scope.$apply('foo=[]');
          expect(element.select2).toHaveBeenCalledWith('data', []);
        });
        it('should call select2(val, ...) for strings', function(){
          var element = compile('<input ng-model="foo" multiple ui-select2="options">');
          spyOn($.fn, 'select2');
          scope.$apply('foo="first,second"');
          expect(element.select2).toHaveBeenCalledWith('val', 'first,second');
        });
      });
    });
    it('should set the model when the user selects an item', function(){
      var element = compile('<input ng-model="foo" multiple ui-select2="options">');
      // TODO: programmactically select an option
      // expect(scope.foo).toBe(/*  selected val  */);
    });
  });
});