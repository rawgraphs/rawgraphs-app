describe('uiSortable', function() {

  // Ensure the sortable angular module is loaded
  beforeEach(module('ui.directives'));

  describe('simple use', function() {

    it('should have a ui-sortable class', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile("<ul ui-sortable></ul>")($rootScope);
        expect(element.hasClass("ui-sortable")).toBeTruthy();
      });
    });

    it('should update model when order changes', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable ng-model="items"><li ng-repeat="item in items" id="s-{{$index}}">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          return $rootScope.items = ["One", "Two", "Three"];
        });

        element.find('li:eq(1)').insertAfter(element.find('li:eq(2)'));

        // None of this work, one way is to use .bind("sortupdate")
        // and then use .trigger("sortupdate", e, ui) but I have no idea how to
        // construct ui object
        
        // element.sortable('refresh')
        // element.sortable('refreshPositions')
        // element.trigger('sortupdate')

        // expect($rootScope.items).toEqual(["One", "Three", "Two"])
      });
    });

  });

});