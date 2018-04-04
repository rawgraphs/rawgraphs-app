(function() {

	var tree = raw.models.tree();

	var chart = raw.chart()
		.title('Treemap')
		.description(
			"A space filling visualization of data hierarchies and proportion between elements. The different hierarchical levels create visual clusters through the subdivision into rectangles proportionally to each element's value. Treemaps are useful to represent the different proportion of nested hierarchical data structures.<br/>Based on <a href='http://bl.ocks.org/mbostock/4063582'>http://bl.ocks.org/mbostock/4063582</a>")
		.thumbnail("imgs/treemap.png")
		.category('Hierarchy (weighted)')
		.model(tree)

	var width = chart.number()
		.title('Width')
		.defaultValue(100)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var padding = chart.number()
		.title("Padding")
		.defaultValue(5)

	var colors = chart.color()
		.title("Color scale")

	chart.draw(function(selection, data) {

		//unknown function
		var format = d3.format(",d");

		// get the drawing area
		var g = selection
			.attr("width", +width())
			.attr("height", +height())
			.append("g")
			.attr("transform", "translate(.5,.5)");


		// create the layout
		var layout = d3.treemap()
			.tile(d3.treemapResquarify)
			.padding(+padding())
			.size([+width(), +height()])
			//.sticky(true)
			//.value(function(d) { return d.size; })

		// create the tree
		var root = d3.hierarchy(data)
			.sum(function(d) { return +d.size; });

		// inform the layout
		layout(root);


		// define color scale
		colors.domain(root.descendants().filter(function(d) { return !d.children }),
			function(d) { return d.data.color; });

		// Create cells
		var cell = g.selectAll("g")
			.data(root.leaves())
			.enter().append("g")
			.attr("class", "cell")
			.attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
		
		cell.append("rect")
			.attr("width", function(d) { return d.x1 - d.x0; })
			.attr("height", function(d) { return d.y1 - d.y0; })
			.style("fill", function(d) { return colors()(d.data.color); })
			//.style("fill-opacity", function(d) { return d.children ? 0 : 1; })
			.style("stroke", "#fff")

		cell.append("title")
			.text(function(d) { return d.name + ": " + format(d.size); });

		cell.append("text")
			.attr("x", function(d) { return (d.x1 - d.x0) / 2; })
			.attr("y", function(d) { return (d.y1 - d.y0) / 2; })
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.style("font-family", "Arial, Helvetica")
			.text(function(d) { return d.data.label ? d.data.label.join(", ") : d.data.name; });

	})
})();