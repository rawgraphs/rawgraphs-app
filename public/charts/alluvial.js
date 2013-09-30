raw.charts.alluvial = function(){

	return {

		title : 'Alluvial diagram (fineo-like)',
		image : 'charts/imgs/alluvial.png',
		description : 'Alluvial diagrams allow to represent flows and to see correlations between categorical dimensions, visually linking to the number of elements sharing the same categories. It is useful to see the evolution of cluster (such as the number of people belonging to a specific group). It can also be used to represent <a href="http://en.wikipedia.org/wiki/Bipartite_graph">bipartite graphs</a>, using each node group as dimensions.<br>Mainly based on our previous work with <a href="http://www.densitydesign.org/research/fineo/">Fineo</a>, it is inspired by on <a href="http://bost.ocks.org/mike/sankey/">http://bost.ocks.org/mike/sankey/</a>.',
		model : raw.models.graph({}),

		options : {
			width : {
		      value : 800,
		      title : 'Width',
		      type : 'number'
		    },
		    height : {
		      value : 400,
		      title : 'Height',
		      type : 'number'
		    },
		    margin : {
		      value : 5,
		      title : 'Margin',
		      type : 'number'
		    },
		    nodeWidth : {
		      value : 15,
		      title : 'Node width',
		      type : 'number'
		    },
		    nodePadding : {
		      value : 10,
		      title : 'Node padding',
		      type : 'number'
		    }

		},

		render : function(data, target) {

			var model = this.model,
				options = this.options

			var formatNumber = d3.format(",.0f"),
			    format = function(d) { return formatNumber(d); },
			    width = options.width.value - options.margin.value,
			    height = options.height.value - options.margin.value;

			var svg = target.append("svg")
			    .attr("width", width + options.margin.value +1 )
			    .attr("height", height + options.margin.value +1 )
			  	.append("g")
			    .attr("transform", "translate(" + options.margin.value + "," + options.margin.value + ")");

			var sankey = d3.sankey()
			    .nodeWidth(options.nodeWidth.value)
			    .nodePadding(options.nodePadding.value)
			    .size([width, height]);

			var path = sankey.link();

			var nodes = model.applyOn(data).nodes,
				links = model.applyOn(data).links;

			sankey
			    .nodes(nodes)
			    .links(links)
			    .layout(32);

			var link = svg.append("g").selectAll(".link")
			    .data(links)
			   	.enter().append("path")
			    .attr("class", "link")
			    .attr("d", path )
			    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			    .style("fill","none")
			    .style("stroke","#000")
			    .style("stroke-opacity",".2")
			    .sort(function(a, b) { return b.dy - a.dy; });

			link.append("title")
			    .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

			var node = svg.append("g").selectAll(".node")
			    .data(nodes)
			    .enter().append("g")
			      	.attr("class", "node")
			      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			    	.call(d3.behavior.drag()
			      		.origin(function(d) { return d; })
			      		.on("dragstart", function() { this.parentNode.appendChild(this); })
			      		.on("drag", dragmove));

			var color = raw.diverging(raw.countUnique(nodes.map(function(d){ return { name: d.name.replace(/ .*/, "") }; }), "name"));

			node.append("rect")
			    .attr("height", function(d) { return d.dy; })
			    .attr("width", sankey.nodeWidth())
			    .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
			    .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
			    .style("shape-rendering","crispEdges")
			    .style("cursor","ns-resize")
			    .append("title")
			    .text(function(d) { return d.name + "\n" + format(d.value); });

			node.append("text")
			    .attr("x", -6)
		      	.attr("y", function(d) { return d.dy / 2; })
		      	.attr("dy", ".35em")
		      	.attr("text-anchor", "end")
		      	.attr("transform", null)
			    .text(function(d) { return d.name; })
			    .style("font-size","11px")
				.style("font-family","Arial, Helvetica, sans-serif")
			    .style("pointer-events","none")
			    .filter(function(d) { return d.x < width / 2; })
			    	.attr("x", 6 + sankey.nodeWidth())
			     	.attr("text-anchor", "start");

			function dragmove(d) {
			    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
			    sankey.relayout();
			    link.attr("d", path);
			}


			return this;
		}

	}
};
