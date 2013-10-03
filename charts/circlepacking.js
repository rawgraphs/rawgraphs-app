raw.charts.circlepacking = function(){

	return {

		title : 'Circle Packing',
		description : 'Nested circles allow to represent hierarchies and compare values. This visualization is particularly effective to show the proportion between elements through their areas and their position inside a hierarchical structure. <br>Based on <a href="http://bl.ocks.org/mbostock/4063530">http://bl.ocks.org/mbostock/4063530</a>.',
		image : 'charts/imgs/circle.png',
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
				title : 'Radius',
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
				description : 'Show titles',
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
				options = this.options;

			var r = options.radius.value,
		        format = d3.format(",d");

		    var pack = d3.layout.pack()
    			.size([r - 4, r - 4])
    			.sort(null)
    			.padding(parseInt(options.padding.value) || 0)
    			.value(function(d) { return d.map.size; });

			svg = target.append("svg")
    			.attr("width", r)
    			.attr("height", r)
  				.append("g")
    			.attr("transform", "translate(2,2)");

			var node = svg.datum(model.applyOn(data)).selectAll(".node")
			    .data(pack.nodes)
			    .enter().append("g")
			    	.attr("class", function(d) { return d.children ? "node" : "leaf node"; })
			      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			var nodes = pack.nodes(model.applyOn(data))
      			.filter(function(d) { return !d.children; });
			
			var color = options.color.value.domain(raw.unique(nodes, "map.color"));

			node.append("title")
			    .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.value)); });

			node.append("circle")
			    .attr("r", function(d) { return d.r; })
			    .style("stroke", function(d){return d3.select(this.parentNode).attr("class").indexOf("leaf") != -1 ? d3.rgb(color(d.map.color || 'undefined')).darker() : "#aaaaaa"} )
			    .style("stroke-width", "1px")
			    .style("fill-opacity", function(d){ return d3.select(this.parentNode).attr("class").indexOf("leaf") != -1 ? "1" : ".25"})
			    .style("fill", function(d){ return d3.select(this.parentNode).attr("class").indexOf("leaf") != -1 ? color(d.map.color || 'undefined') : "#cccccc"})

			if (options.labels.value) {
				node.filter(function(d) { return !d.children; }).append("text")
			    	.attr("dy", ".3em")
			    	.style("text-anchor", "middle")
			    	.style("font-size","11px")
					.style("font-family","Arial, Helvetica, sans-serif")
			    	.text(function(d) { return d.name;/* d.name.substring(0, d.r / 3); */});
			}
			
			d3.select(self.frameElement).style("height", r + "px");

		    return this;

		}
	}
};
