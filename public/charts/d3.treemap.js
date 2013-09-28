(function(){

	d3.treemap = function(){

		/* Default values */

		var width = 500,
				height = 500,
				padding = 10,
				labels = true,
				colors = null;

		/*
		 * Main chart function
		 * Data should be already in the proper format
		 */

		function chart (selection){
			selection.each(function(data){

				// Treemap layout
				var layout = d3.layout.treemap()
	  			.sticky(true)
	  		  .padding(padding || 0)
			    .size([width, height])
			    .value(valueAccessor);

			  // Nodes
				var nodes = layout.nodes(data)
	      	.filter(function(d) { return !d.children; });

	      // Cells
				var cell = selection.selectAll("g")
			    .data(nodes)

			  // updating existing
			  cell.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  // creating new
			  cell.enter().append("svg:g")
			    .attr("class", "cell")
			    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  // deleting old
			  cell.exit().remove();

			  var rect = cell.selectAll("rect")
			  	.data(function (d){ return [d]; })

			  rect
			  	.attr("width", function(d) { return d.dx; })
				  .attr("height", function(d) { return d.dy; })
				  .style("fill", function(d) { return "#ff0000"; })
				  .style("fill-opacity", function(d) {  return d.children ? 0 : 1; })
					.style("stroke","#fff");

				rect.enter().append("svg:rect")
				  .attr("width", function(d) { return d.dx; })
				  .attr("height", function(d) { return d.dy; })
				  .style("fill", function(d) { return "#ff0000"; })
				  .style("fill-opacity", function(d) {  return d.children ? 0 : 1; })
					.style("stroke","#fff");

				rect.exit().remove();
				
				/*cell.append("svg:title")
					.text(function(d) { return d.name + ": " + format(d.map.size); });

				if (options.labels.value) {
					cell.append("svg:text")
					    .attr("x", function(d) { return d.dx / 2; })
					    .attr("y", function(d) { return d.dy / 2; })
					    .attr("dy", ".35em")
					    .attr("text-anchor", "middle")
					   	.style("font-size","11px")
						.style("font-family","Arial, Helvetica, sans-serif")
					    .text(function(d) { return d.name +  " (" + d.value + ")"; })//{ return d.children ? null : d.name; })
				}*/

			})
		};

		function valueAccessor(d) {
			return 1;
		};

		/* Helpers */

		/* Getters and Setters */

		chart.width = function (value){
			if (!arguments.length) return width;
			width = value;
			return chart;
		};

		chart.width._type = "number";

		chart.height = function (value){
			if (!arguments.length) return height;
			height = value;
			return chart;
		};

		chart.padding = function (value){
			if (!arguments.length) return padding;
			padding = value;
			return chart;
		};

		chart.labels = function (value){
			if (!arguments.length) return labels;
			labels = value;
			return chart;
		};

		chart.labels._type = "boolean";

		chart.colors = function (value){
			if (!arguments.length) return colors;
			colors = value;
			return chart;
		};

		chart.valueAccessor = function (value){
			if (!arguments.length) return valueAccessor;
			valueAccessor = value;
			return chart;
		};

		return chart;

	}

})();