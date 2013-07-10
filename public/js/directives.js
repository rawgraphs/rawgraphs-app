'use strict';

/* Directives */

angular.module('raw.directives', [])
	
	/* Group */

	 .directive('group', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        scope.$watch(attrs.watch,function(){
          var last = element;

          element.children().each(function(i,o){
            if( (i) && (i) % attrs.every == 0) {
              last = element.clone().empty();
              last.insertAfter(element);
            }
            $(o).appendTo(last)
          })
        })

      }
    };
  })

	/* Select picker */

	.directive('selectpicker', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs) {
        element.selectpicker();
      }
    };
  })

	
	/* Chart */

	.directive('chart', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs) {

      	var updateLayout = function() {
          
          var target = d3.select(element[0]),
              model = scope.chart.model;

          target.selectAll("svg").remove();
          if (!model.isValid() || !scope.data.length) return;
                  
        	scope.chart.render(scope.data, target);
          //scope.update();
        }

        scope.$watch("chart",function(){
        	if(scope.chart) updateLayout();
        },true)

        scope.$watch("data",function(){
        	if(scope.chart) updateLayout();
        }, true)


      }
    };
  })

  /* UI */
	
	/* Draggable */
  
  .directive('draggable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.draggable({
          
          // fixing width issue
          start:function(event,ui){
            var w = element.css("width");
            element.css("width", w);
            element.css("opacity", .4);
            ui.helper.css("width", w);
            ui.helper.css("z-index", 10000);
          },

          stop:function(){
            element.css("width", "");
            element.css("opacity", "");
          }

        });

        element.disableSelection();

        // options, not so much safe uh?
        var options = element.draggable('option');
        for(var a in attrs){
        	if (options.hasOwnProperty(a)) {
        		element.draggable('option', a, attrs[a]);
        	}
        }
      }
    };
  })

  /* Droppable */

  .directive('droppable', function () {
    return {
      replace : false,
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.droppable({
          accept: scope.accept
        })
      }
    };
  })

  /* Sortable */

  .directive('sortable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

      	var sortableIn = false;
        
        function getValues(){
          var values = element.sortable('toArray',{ attribute : "value" }).map(function(d){ return d.length ? JSON.parse(d) : {} });
          return values.filter(function(d){ return d.hasOwnProperty('key'); });
        }

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

    			scope.$eval(attrs.ngModel).value = getValues();
    			
        	scope.$eval(attrs.ngModel).value = $.grep(scope.$eval(attrs.ngModel).value, function(v, k){
          		return $.inArray(v.key,scope.$eval(attrs.ngModel).value.map(function(r){return r.key;})) === k;
        	});
        	

        	/*if(typeIsValid()) {
        		element.addClass("success");
        		element.removeClass("fail");
        	} else {
        		element.addClass("fail");
        		element.removeClass("success");
        	}

        	if(!scope.$eval(attrs.ngModel).value.length) {
        		element.removeClass("success");
        		element.removeClass("fail");
        	}*/

    			element.find('.ui-draggable').remove();
    			scope.$apply();
      	}

        element.sortable({
        	update: update,
        	items: (attrs.items || '> li'),
        	placeholder: 'placeholder',
        	
        	receive: function(event, ui)
	        {
	        	sortableIn = true; 
	        },

	        over: function(event, ui)
	        {
            element.find('.placeholder.static').remove();
	          sortableIn = true;
	        },

	        out: function(event, ui)
	        {
            if(ui.item.hasClass('ui-draggable') && !scope.$eval(attrs.single) || !scope.$eval(attrs.ngModel).value.length) {
              element.append('<div class="placeholder static">drop here</div>');
            }

            sortableIn = false;
	        },
          
          start: function (e, ui)
          {
            ui.placeholder.html('drop here');
          },
          
	        beforeStop: function(event, ui)
	        { 

            if(!ui.item.hasClass('ui-draggable')) {
              element.append('<div class="placeholder static">drop here</div>');
            }

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
