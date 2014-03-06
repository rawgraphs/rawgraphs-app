'use strict';

/* Directives */

angular.module('raw.directives', [])

	.directive('chart', function () {
	    return {
	      restrict: 'A',
	      link: function postLink(scope, element, attrs) {

	        function update(){
	        	if (!scope.chart || !scope.data.length) return;

	        	d3.select(element[0]).select("*").remove();

	        	d3.select(element[0])
	        		.datum(scope.data)
	        		.call(scope.chart)
	        }

	        scope.$watch('chart', update)
	        //scope.$watch('data', update)
	        scope.$watch(function(){ return scope.model(scope.data); }, update, true);
	        scope.$watch(function(){ return scope.chart.options().map(function (d){ return d.value }); }, update, true);

	      }
	    };
	  })

	.directive('sortable', function () {
    return {
      restrict: 'A',
      scope : {
      	title : "=",
      	value : "=",
      	multiple : "="
      },
      link: function postLink(scope, element, attrs) {

      	var removeLast = false;

      	element.sortable({
	        items : '> li',
	        connectWith: '.dimensions-container',
	        placeholder:'drop',
	        start: onStart,
	        out: out,
	        update: onStop,
	        receive : onReceive,
	        remove: onRemove,
	        tolerance:'intersect'
	      })

	      function out(e,ui) {
	      	element.parent().removeClass('invalid');
	      }

		    function onStart(e,ui){
		      element.parent().addClass('invalid');
		      element.find('.msg').html(message(ui.item.data().dimension));
		    }

		    function onStop(e,ui){
		    	element.parent().removeClass('invalid');

					var dimension = ui.item.data().dimension;

		    	if (ui.item.find('span.remove').length == 0) {
		      	ui.item.append("<span class='remove pull-right'>&times;</span>")
		      }
		     	ui.item.find('span.remove').click(function(){  ui.item.remove(); onRemove(); });

		     	if (removeLast) {
		     		ui.item.remove();
		     		removeLast = false;
		     	}    	

		     	scope.value = values();
		     	scope.$apply();
		    }

		    scope.$watch('value', function(){
		    	if (!scope.multiple && scope.value.length) {
		     	//	element.find('.drop.static').hide();
		     	} else {
		     	//	element.parent().css("padding-bottom","53px");
		     	}
		    })

		    function onReceive(e,ui) {
					var dimension = ui.item.data().dimension;

		     	removeLast = hasValue(dimension);

					if (!scope.multiple && scope.value.length) {
						var found = false;
		     		element.find('li').each(function (i,d) {
		     			if ($(d).data().dimension.key == scope.value[0].key && !found) {
		     				$(d).remove();
		     				found = true;
		     				removeLast=false;
		     			}
		     		})
		     	} 

		    	scope.value = values();
		     	scope.$apply();
					ui.item.find('span.remove').click(function(){  ui.item.remove(); onRemove(); })

		    }

		    function onRemove(e,ui) {
		    	scope.value = values();
		    	scope.$apply();
				}

				function values(){
					if (!element.find('li').length) return [];
					var v = [];
					element.find('li').map(function (i,d){
						v.push($(d).data().dimension);
					})
					return v;
				}

				function hasValue(dimension){

					for (var i=0; i<scope.value.length;  i++) {
		    		if (scope.value[i].key == dimension.key) {
							return true;
		    		}
		    	}
		    	return false;
				}

				function message(dimension){
					return hasValue(dimension) ? "abbiamo gia" : "ok";
				}
		

      }
    }
   })

		.directive('draggable', function () {
	    return {
	      restrict: 'A',
	      scope : {
	      	items : '='
	      },
	      template : '<li class="dimension" data-index="{{$index}}" data-dimension="{{dimension}}" ng-repeat="dimension in items">{{ dimension.key }}<br/><span class="dimension-type">{{dimension.type}}</span></li>',
	      link: function postLink(scope, element, attrs) {

		      scope.$watch('items', function(){
			      
			      element.find('li').draggable({
			        connectToSortable:'.dimensions-container',
			        /*helper: function () {
					        var cloned = $(this).clone();					        
					        return cloned;
					    },*/
					    helper : 'clone',
			        revert: 'invalid',
			        start : onStart,
			        stop : onStop
			      })
		     })

			    function onStart(e,ui){
			      ui.helper.width($(e.currentTarget).width())
			      ui.helper.css('z-index','100000')
			    }

			    function onStop(e,ui){
			    	
			    }

	      }
	    }
	   })

	.directive('group', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch(attrs.watch, function (watch){
          var last = element;
          element.children().each(function(i, o){
            if( (i) && (i) % attrs.every == 0) {
           	  var oldLast = last;
              last = element.clone().empty();
              last.insertAfter(oldLast);
            }
            $(o).appendTo(last)
          })

        },true)

       }
      };
  	})