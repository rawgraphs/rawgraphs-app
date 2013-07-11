
raw.charts.circulardendogram = function(){
	
	return {

		title : 'Circular Dendogram',
		description : '...',
		model : raw.models.hierarchy(),

		options : {

			radius : {
				title : 'Radius',
				type : 'number',
				position : 1,
				description : 'Radius is whatever',
				value : 800
			},

			labels : {
				title : 'Labels',
				type : 'boolean',
				position : 2,
				description : 'Show labels',
				value : true
			}
		},

		render : function(data, target) {

			var model = this.model,
				options = this.options,
		        format = d3.format(",d");

		    var radius = options.radius.value;

			var tree = d3.layout.tree()
			    .size([360, radius / 2 - 120])
			    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

			var diagonal = d3.svg.diagonal.radial()
			    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

			var svg = target.append("svg")
    			.attr("width", radius)
    			.attr("height", radius)
  				.append("g")
			    .attr("transform", "translate(" + radius / 2 + "," + radius / 2 + ")");
			
			var nodes = tree.nodes(model.applyOn(data)),
      			links = tree.links(nodes);

			var link = svg.selectAll(".link")
			    .data(links)
			    .enter().append("path")
			    	.attr("class", "link")
			     	.attr("d", diagonal)
			     	.style("fill","none")
			    	.style("stroke","#ccc")
			    	.style("stroke-width","1.5px");

			var node = svg.selectAll(".node")
			    .data(nodes)
			    .enter().append("g")
			      	.attr("class", "node")
			      	.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

			node.append("circle")
			    .attr("r", 4.5)
			    .style("fill","#fff")
			    .style("stroke","steelblue")
			    .style("stroke-width","1.5px");

			if (options.labels.value) {
				node.append("text")
				    .attr("dy", ".31em")
				    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				    .style("font-size","11px")
					.style("font-family","Arial, Helvetica, sans-serif")
				    .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
				    .text(function(d) { return d.name; });
			}

		    return this;

		}
	}
};