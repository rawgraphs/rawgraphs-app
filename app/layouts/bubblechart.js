/**
 * 
 * Treemap
 */
raw.layouts.bubblechart = function(){
	return {

		id : 'bubblechart',
		label : 'Bubble chart',
		description : 'A bubblechart is not <a href="http://www.google.com">Google</a>.',
		model : raw.models.tree({

			color : {
				label : 'Color',
				accept : ['number','string'],
				single : true,
				value : [],
				map : function(d) { return this.value.length ? d[this.value[0].key] : null; }
			},

			size : {
				label : 'Size',
				accept : ['number'],
				value : [],
				single : true,
				map : function(d,t) {
					return this.value.length ? parseFloat(d[this.value[0].key]) + parseFloat(t) : parseFloat(t) + 1;
				}
			}
		}),

		style : {

			radius : {
				label : 'Radius',
				type : 'number',
				position : 1,
				description : 'Radius is whatever',
				value : 800
			},

			padding : {
				label : 'Padding',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 5
			},

			labels : {
				label : 'Labels',
				type : 'check',
				position : 2,
				description : 'Show labels',
				value : true
			},

			color : {
				label : 'Color',
				type : 'color',
				position : 2,
				description : 'Color sucks!',
				value : raw.diverging()
			}
		},

		render : function(data, target) {

			var model = this.model,
				style = this.style,
				format = d3.format(",d");

			var r = style.radius.value,
		        format = d3.format(",d");
		    
		    var l = d3.layout.pack()
		        .sort(null)
		        .padding(parseInt(style.padding.value) || 0)
		        .value(function(d) { return d.map.size; })
		        .size([style.radius.value, style.radius.value]);

			svg = target.append("svg:svg")
			    .attr("width", parseInt(style.radius.value))
			    .attr("height", parseInt(style.radius.value))
				.attr("class", "bubble equals")


			var nodes = l.nodes(model.applyOn(data))
      			.filter(function(d) { return !d.children; });

		    var node = svg.selectAll("g.node")
		        .data(nodes)
	        	.enter().append("svg:g")
	          		.attr("class", "node")
	          		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			var color = style.color.value.domain(raw.unique(nodes, "map.color"));

			
		    node.append("svg:title")
		        .text(function(d) { return d.name + ": " + format(d.value); });

		    node.append("svg:circle")
		        .attr("r", function(d) { return d.r; })
		        .style("stroke", function(d) { return d.map.color ? d3.rgb(color(d.map.color)).darker() : d3.rgb(color("undefined")).darker(); } )
		        .style("fill", function(d) { return d.map.color ? color(d.map.color) : color("undefined"); });
		    
		    if (style.labels.value) {
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