raw.charts.bubblechart = function(){

	return {

		title : 'Bubble chart',

		description : 'A bubblechart is not <a href="http://www.google.com">Google</a>.',

		model : raw.models.hierarchy({

			color : {
				title : 'Color',
				accept : ['number','string'],
				single : true,
				value : [],
				map : function(d) { return this.value.length ? d[this.value[0].key] : null; }
			},

			size : {
				title : 'Size',
				accept : ['number'],
				value : [],
				single : true,
				map : function(d,t) {
					return this.value.length ? parseFloat(d[this.value[0].key]) + parseFloat(t) : parseFloat(t) + 1;
				}
			}
		}),

		options : {

			radius : {
				title : 'Diameter',
				type : 'number',
				position : 1,
				description : 'Radius is whatever',
				value : 800
			},

			padding : {
				title : 'Padding',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 5
			},

			labels : {
				title : 'Labels',
				type : 'boolean',
				position : 2,
				description : 'Show labels',
				value : true
			},

			color : {
				title : 'Color',
				type : 'color',
				position : 2,
				description : 'Color sucks!',
				value : raw.diverging()
			}
		},

		render : function(data, target) {

			var model = this.model,
				options = this.options,
				format = d3.format(",d");

			var r = options.radius.value;
		    
		    var l = d3.layout.pack()
		        .sort(null)
		        .padding(parseInt(options.padding.value) || 0)
		        .value(function(d) { return d.map.size; })
		        .size([options.radius.value, options.radius.value]);

			svg = target.append("svg:svg")
			    .attr("width", parseInt(options.radius.value))
			    .attr("height", parseInt(options.radius.value))
				.attr("class", "bubble equals")


			var nodes = l.nodes(model.applyOn(data))
      			.filter(function(d) { return !d.children; });

		    var node = svg.selectAll("g.node")
		        .data(nodes)
	        	.enter().append("svg:g")
	          		.attr("class", "node")
	          		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			var color = options.color.value.domain(raw.unique(nodes, "map.color"));

			
		    node.append("svg:title")
		        .text(function(d) { return d.name + ": " + format(d.value); });

		    node.append("svg:circle")
		        .attr("r", function(d) { return d.r; })
		        .style("stroke", function(d) { return d.map.color ? d3.rgb(color(d.map.color)).darker() : d3.rgb(color("undefined")).darker(); } )
		        .style("fill", function(d) { return d.map.color ? color(d.map.color) : color("undefined"); });
		    
		    if (options.labels.value) {
		    	node.append("svg:text")
		      		.attr("text-anchor", "middle")
		      		.attr("dy", ".3em")
					.style("font-size","11px")
					.style("font-family","Arial, Helvetica, sans-serif")
		      		.text(function(d) { return d.name +  " (" + d.map.size + ")"; });
		    }

		    // Returns a flattened hierarchy containing all leaf nodes under the root.
		    function classes(root) {
		      var classes = [];

		      function recurse(name, node) {
		        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
		        else classes.push({packageName: name, className: node.name, value: node.size});
		      }

		      recurse(null, root);
		      return {children: classes};
		    }

		    return this;

		}

	}
};