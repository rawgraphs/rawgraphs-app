(function(){

	var graph = raw.models.graph();

	var chart = raw.chart()
		.title('Alluvial Diagram (Fineo-like)')
		.thumbnail("/imgs/alluvial.png")
		.model(graph)

	var width = chart.option()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.option()
		.title("Height")
		.defaultValue(500)

	var color = chart.option()
		 .title("Color scale")
		 .type("color")

	chart.draw(function (selection, data){

		var formatNumber = d3.format(",.0f"),
		    format = function(d) { return formatNumber(d); };

		var g = selection
		    .attr("width", +width() )
		    .attr("height", +height() )
		  	.append("g")
		    .attr("transform", "translate(" + 0 + "," + 0 + ")");

		var sankey = d3.sankey()
		    .nodeWidth(10)
		    .nodePadding(10)
		    .size([+width(), +height()]);

		var path = sankey.link();

		var nodes = data.nodes;
				links = data.links;

		sankey
	    .nodes(nodes)
	    .links(links)
	    .layout(32);

		var link = g.append("g").selectAll(".link")
	    .data(links)
	   	.enter().append("path")
		    .attr("class", "link")
		    .attr("d", path )
		    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
		    .style("fill","none")
		    .style("stroke","#000")
		    .style("stroke-opacity",".2")
		    .sort(function(a, b) { return b.dy - a.dy; });

		var node = g.append("g").selectAll(".node")
	    .data(nodes)
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		//color.data()

		node.append("rect")
	    .attr("height", function(d) { return d.dy; })
	    .attr("width", sankey.nodeWidth())
	    .style("fill", function (d) { console.log('d'); return "#999"; })
	   // .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
	    .style("shape-rendering","crispEdges")
	    .append("title")
	    	.text(function(d) { return d.name + "\n" + format(d.value); });

		node.append("text")
	    .attr("x", -6)
      	.attr("y", function (d) { return d.dy / 2; })
      	.attr("dy", ".35em")
      	.attr("text-anchor", "end")
      	.attr("transform", null)
		    .text(function(d) { return d.name; })
		    .style("font-size","11px")
				.style("font-family","Arial, Helvetica")
		    .style("pointer-events","none")
		    .filter(function(d) { return d.x < +width() / 2; })
		    	.attr("x", 6 + sankey.nodeWidth())
	     		.attr("text-anchor", "start");

	})

})();




