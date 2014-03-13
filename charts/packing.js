(function(){

	var tree = raw.models.tree();

	var chart = raw.chart()
		.title('Circle Packing')
		.thumbnail("/imgs/circlePacking.png")
	  .model(tree)

	var diameter = chart.option()
		 .title("Diameter")
		 .defaultValue(800)
		 .fitToWidth(true)

	var padding = chart.option()
		 .title("Padding")
		 .defaultValue(5)

	var sort = chart.option()
		 .title("Sort by size")
		 .defaultValue(false)
		 .type("checkbox")

	var color = chart.option()
		 .title("Color scale")
		 .type("color")

	var showLabels = chart.option()
		 .title("Show labels")
		 .defaultValue(true)
		 .type("checkbox")

	chart.draw(function (selection, data){

		if (!data.children.length) return;

		var margin = 10,
	    	outerDiameter = +diameter(),
	    	innerDiameter = outerDiameter - margin - margin;

		var x = d3.scale.linear()
		    .range([0, innerDiameter]);

		var y = d3.scale.linear()
		    .range([0, innerDiameter]);

		var pack = d3.layout.pack()
		    .padding(+padding())
		    .sort(function (a,b){ return sort() ? a.value-b.value : null; })
		    .size([innerDiameter, innerDiameter])
		    .value(function(d) { return +d.size; })

		var g = selection
		    .attr("width", outerDiameter)
		    .attr("height", outerDiameter)
		  .append("g")
		    .attr("transform", "translate(" + margin + "," + margin + ")");

	  var focus = data,
	      nodes = pack.nodes(data);

	  color.data(nodes);

	  g.append("g").selectAll("circle")
	      .data(nodes)
	    .enter().append("circle")
	      .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
	      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
	      .attr("r", function (d) { return d.r; })
	      .style("fill", function (d) { return !d.children ?  color()(d.color) : '#eeeeee'; })
	      .style("stroke", '#ddd')
	      .style("stroke-opacity", function (d) { return !d.children ? 0 : 1 })

	  g.append("g").selectAll("text")
	      .data(nodes.filter(function (d){ return showLabels(); }))
	    .enter().append("text")
	      .attr("text-anchor", "middle")
	   		.style("font-size","11px")
				.style("font-family","Arial, Helvetica")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	      .text(function (d) { return d.label ? d.label.join(", ") : d.name; });

	  d3.select(self.frameElement).style("height", outerDiameter + "px");

	})
})();