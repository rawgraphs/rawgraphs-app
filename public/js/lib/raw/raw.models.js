(function() {

	var raw = window.raw || (window.raw = {});

	raw.models = {};

	raw.models.hierarchy = function(map){

		return {

			structure : {
				hierarchy : {
					title : 'Hierarchy',
					accept : ['string','number'],
					single : false,
					value : []
				}
			},

			map : map,

			applyOn : function(data) {

				var model = this,
						tree = { children:[] },
		        classes = model.structure.hierarchy.value.map(function(d){return d.key;}),
		        path = [],
		        leaf = {};

		    try {
		        
	        data.forEach(function(d){

          	// Structure path
            path = model.structure.hierarchy.value.map(function(p){ return d[p.key]; })
            leaf = raw.seek(tree, path, classes);
            if(leaf === false) return;
            if (!leaf.map) leaf.map = {};


            // Mapping options...
            for (var m in model.map){
            	if (!leaf.map.hasOwnProperty(m)) leaf.map[m] = 0;
            	leaf.map[m] = model.map[m].map(d, leaf.map[m]) || null;
            }

            delete leaf.children;

		    	});
	      }
        catch(e){
          return false;
        }
        
        return tree;
			},

			isValid : function(){
				return this.structure.hierarchy.value.length != 0;
			}
		}

	}



	/* Graph */
	raw.models.graph = function(){
		
	}

})();