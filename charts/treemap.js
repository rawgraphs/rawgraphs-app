
raw.charts.treemap = function(){
	
	return {

		title : 'Treemap',
		
		description : "A space filling visualization of data hierarchies and proportion between elements. The different hierarchical levels create visual clusters through the subdivision into rectangles proportionally to each element's value. Treemaps are useful to represent the different proportion of nested hierarchical data structures.<br/>Based on <a href='http://bl.ocks.org/mbostock/4063582'>http://bl.ocks.org/mbostock/4063582</a>",
		image : 'charts/imgs/treemap.png',
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

			width : {
				title : 'Width',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 800
			},

			height : {
				title : 'Height',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 500
			},

			padding : {
				title : 'Padding',
				type : 'number',
				position : 2,
				description : 'Width is whatever',
				value : 10
			},

			labels : {
				title : 'Labels',
				type : 'boolean',
				position : 2,
				description : 'Show labels',
				value : true
			},

			color : {
				title : 'Colors',
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

			var l = d3.layout.treemap()
    			.sticky(true)
    		    .padding(parseInt(options.padding.value) || 0)
			    .size([parseInt(options.width.value), parseInt(options.height.value)])
			    .value(function(d) { return d.map.size; })
						
			//target.selectAll("svg").remove()


			svg = target.append("svg:svg")
			    .attr("width", parseInt(options.width.value))
			    .attr("height", parseInt(options.height.value))
			  	.append("svg:g")
			    .attr("transform", "translate(.5,.5)");

			var nodes = l.nodes(model.applyOn(data))
      			.filter(function(d) { return !d.children; });

			var cell = svg.selectAll("g")
			    .data(nodes)
			    .enter().append("svg:g")
			    	.attr("class", "cell")
			      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			var color = options.color.value.domain(raw.unique(nodes, "map.color"));

			cell.append("svg:rect")
			    .attr("width", function(d) { return d.dx; })
			    .attr("height", function(d) { return d.dy; })
			    .style("fill", function(d) { return d.map.color ? color(d.map.color) : color('undefined'); })
			    .style("fill-opacity", function(d) {  return d.children ? 0 : 1; })
				.style("stroke","#fff")
			
			cell.append("svg:title")
				.text(function(d) { return d.name + ": " + format(d.map.size); });

			if (options.labels.value) {
				cell.append("svg:text")
				    .attr("x", function(d) { return d.dx / 2; })
				    .attr("y", function(d) { return d.dy / 2; })
				    .attr("dy", ".35em")
				    .attr("text-anchor", "middle")
				   	.style("font-size","11px")
					.style("font-family","Arial, Helvetica")
				    .text(function(d) { return d.name +  " (" + d.value + ")"; })//{ return d.children ? null : d.name; })
			}

			return this;
		}

	}
};