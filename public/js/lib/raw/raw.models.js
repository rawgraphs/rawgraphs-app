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


	raw.models.graph = function(map){

	return {

		structure : {

			sequence : {
				title : 'Dimensions',
				accept : ['string','number'],
				single : false,
				value : []
			},

			value : {
				title : 'Link value',
				accept : ['number'],
				single : true,
				value : []
			}
		},

		map : map,

		applyOn : function(data) {

			var model = this,
				n = [],
				l = [],
				d = {};

			var sequence = model.structure.sequence.value.map(function(d){return d.key;})

			for (var i=0; i < sequence.length-1; i++ ) {

				var sg = sequence[i]
				var tg = sequence[i+1]
				var relations = d3.nest()
					.key(function(d) { return d[sg] } )
					.key(function(d) { return d[tg] } )
					.entries(data)

				relations.forEach(function(s){

					si = getNodeIndex(n, s.key, sg);

					if ( si == -1) {
						n.push({ "name" : s.key, "group" : sg })
						si = n.length-1;
					}

					s.values.forEach(function(t){
						ti = getNodeIndex(n, t.key, tg)
						if (ti == -1) {
							n.push({ "name" : t.key, "group" : tg })
							ti = n.length-1;
						}
						var value = model.structure.value.value.length ? d3.sum(t.values, function(d){ return parseFloat(d[model.structure.value.value[0].key]); }) : t.values.length;
						//var value = t.values.length;
						var link = { "source" : parseInt(si), "target" : parseInt(ti), "value" : value };
						l.push(link);
					})
				})
			}

			function getNodeIndex(array, name, group) {
				for (var i in array){		
					var a = array[i]
					if (a['name'] == name && a['group'] == group) {
						return i;
					}
				}
				return -1;
			}

			d.nodes = n;
			d.links = l;
			return d

		},

		isValid : function(){
			return this.structure.sequence.value.length > 0;
		}
	};
}


/* Points */

raw.models.points = function(map){

		return {

			structure : {

				x : {
					title : 'X',
					accept : ['number'],
					single : true,
					value : []
				},

				y : {
					title : 'Y',
					accept : ['number'],
					single : true,
					value : []
				}
			},

			map : map,

			applyOn : function(data) {

				var model = this;
		    try {
		      var points = [];
	        data.forEach(function(d){
	        	var point = {};
	        	// structure
	        	point.x = model.structure.x.value.length ? parseFloat(d[model.structure.x.value[0].key]) : 0;
	        	point.y = model.structure.y.value.length ? parseFloat(d[model.structure.y.value[0].key]) : 0;
          	// map
            for (var m in model.map){
            	point[m] = model.map[m].map(d, 0);
            }
            points.push(point);

		    	});
	      }
        catch(e){
          return false;
        }
        
        return points;
			},

			isValid : function(){
				return this.structure.x.value.length != 0 && this.structure.y.value.length != 0;
			}
		}

	}


})();