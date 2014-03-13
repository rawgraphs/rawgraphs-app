(function(){
	var tree = raw.models.tree();

	// Chart

	var chart = raw.chart()
		 .title('Treemap')
		 .description("A space filling visualization of data hierarchies and proportion between elements. The different hierarchical levels create visual clusters through the subdivision into rectangles proportionally to each element's value. Treemaps are useful to represent the different proportion of nested hierarchical data structures.<br/>Based on <a href='http://bl.ocks.org/mbostock/4063582'>http://bl.ocks.org/mbostock/4063582</a>")
		 .thumbnail("/imgs/treemap.png")
		 .model(tree)

	var width = chart.option()
		 .title("Width")
		 .defaultValue(1000)
		 .fitToWidth(true)

	var height = chart.option()
		 .title("Height")
		 .defaultValue(500)

	var padding = chart.option()
		 .title("Padding")
		 .defaultValue(5)

	var color = chart.option()
		 .title("Color scale")
		 .type("color")

	chart.draw(function (selection, data){
		
		var format = d3.format(",d");

		var layout = d3.layout.treemap()
			.sticky(true)
		  .padding(+padding() || 0)
	    .size([+width(), +height()])
	    .value(function(d) { return d.size; })

		var g = selection
	    .attr("width", +width())
	    .attr("height", +height())
	  	.append("g")
	    .attr("transform", "translate(.5,.5)");

		var nodes = layout.nodes(data)
	  	.filter(function(d) { return !d.children; });

		//console.log("prima",color().domain(),color().range())
	  color.data(nodes);

		var cell = g.selectAll("g")
	    .data(nodes)
	    .enter().append("g")
	    .attr("class", "cell")
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		cell.append("svg:rect")
	    .attr("width", function (d) { return d.dx; })
	    .attr("height", function (d) { return d.dy; })
	    .style("fill", function (d) { return color()(d.color); })
	    .style("fill-opacity", function (d) {  return d.children ? 0 : 1; })
			.style("stroke","#fff")
		
		cell.append("svg:title")
			.text(function(d) { return d.name + ": " + format(d.size); });

		cell.append("svg:text")
	    .attr("x", function(d) { return d.dx / 2; })
	    .attr("y", function(d) { return d.dy / 2; })
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	  //  .attr("fill", function (d) { return raw.foreground(color()(d.color)); })
	   	.style("font-size","11px")
			.style("font-family","Arial, Helvetica")
	    .text(function(d) { return d.label ? d.label.join(", ") : d.name; });

	})
})();