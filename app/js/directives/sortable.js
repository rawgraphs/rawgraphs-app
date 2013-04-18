'use strict';

angular.module('rawApp')
  .directive('sortable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

      	var sortableIn = false;

      	function typeIsValid(){
      		var types = scope.$eval(attrs.ngModel).value.map(function(r){return r.type;});
      		var validTypes = scope.$eval(attrs.accept);
      		var valid = true;
      		for (var t in types) {
      			if (validTypes.indexOf(types[t]) == -1) {
      				valid = false;
      				break;
      			}
      		}
      		return valid;
      	}

      	function update(){
			var values = element.sortable('toArray',{ attribute : "value" }).map(function(d){ return d.length ? JSON.parse(d) : {} });

			// fixing toArray
			scope.$eval(attrs.ngModel).value = values.filter(function(d){ return d.hasOwnProperty('key'); });
			
			if (scope.$eval(attrs.unique)) {
            	scope.$eval(attrs.ngModel).value = $.grep(scope.$eval(attrs.ngModel).value, function(v, k){
              		return $.inArray(v.key,scope.$eval(attrs.ngModel).value.map(function(r){return r.key;})) === k;
            	});
          	}

          	if(typeIsValid()) {
          		element.addClass("success");
          		element.removeClass("fail");
          	} else {
          		element.addClass("fail");
          		element.removeClass("success");
          	}
          	console.log(scope.$eval(attrs.ngModel).value)
          	if(!scope.$eval(attrs.ngModel).value.length) {
          		element.removeClass("success");
          		element.removeClass("fail");
          	}

			element.find('.ui-draggable').remove();
			scope.$apply();
      	}

        element.sortable({
        	update: update,
        	items: attrs.items || '> li',
        	placeholder: 'placeholder',
        	
        	receive: function(event, ui)
	        {
	        	sortableIn = true;
	        },
	        over: function(event, ui)
	        {
	            sortableIn = true;
	        },
	        out: function(event, ui)
	        {
	            sortableIn = false;
	        },
	        beforeStop: function(event, ui)
	        {
	            if (!sortableIn || scope.$eval(attrs.single) && scope.$eval(attrs.ngModel).value && scope.$eval(attrs.ngModel).value.length) {
	              sortableIn = false;
	              ui.item.remove();
	              update();
	            }
	          }
        });

        element.disableSelection();
      }
    };
  });
