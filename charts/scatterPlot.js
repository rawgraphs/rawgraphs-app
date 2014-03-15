(function(){

	var points = raw.models.points();

	var chart = raw.chart()
		.title('Scatter Plot')
		.thumbnail("/imgs/scatterPlot.png")
		.model(points)

	var width = chart.option()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.option()
		.title("Height")
		.defaultValue(500)

	var maxRadius = chart.option()
		.title("max radius")
		.defaultValue(20)

	var useZero = chart.option()
		.title("set origin at (0,0)")
		.type("checkbox")
		.defaultValue(false)

	var color = chart.option()
		 .title("Color scale")
		 .type("color")

	var showPoints = chart.option()
		.title("show points")
		.type("checkbox")
		.defaultValue(true)

	chart.draw(function (selection, data){
			
		var g = selection
			.attr("width", +width() )
			.attr("height", +height() )
			.append("g")

		var marginLeft = d3.max(data, function (d) { return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9,
				marginBottom = 20,
				w = width() - marginLeft,
				h = height() - marginBottom;

		var xExtent = !useZero()? d3.extent(data, function (d){ return d.x; }) : [0, d3.max(data, function (d){ return d.x; })],
				yExtent = !useZero()? d3.extent(data, function (d){ return d.y; }) : [0, d3.max(data, function (d){ return d.y; })];

		var xScale = d3.scale.linear().range([marginLeft,width()-maxRadius()]).domain(xExtent),
				yScale = d3.scale.linear().range([h-maxRadius(), maxRadius()]).domain(yExtent),
				sizeScale = d3.scale.linear().range([1, Math.pow(+maxRadius(),2)*Math.PI]).domain([0, d3.max(data, function (d){ return d.size; })]),
				xAxis = d3.svg.axis().scale(xScale).tickSize(-h+maxRadius()*2).orient("bottom")//.tickSubdivide(true),
    		yAxis = d3.svg.axis().scale(yScale).ticks(10).tickSize(-w+maxRadius()).orient("left");


    g.append("g")
      .attr("class", "x axis")
      .style("stroke-width", "1px")
		  .style("font-size","10px")
			.style("font-family","Arial, Helvetica")
      .attr("transform", "translate(" + 0 + "," + (h-maxRadius()) + ")")
      .call(xAxis);

  		// Add the y-axis.
  	g.append("g")
      .attr("class", "y axis")
      .style("stroke-width", "1px")
      .style("font-size","10px")
			.style("font-family","Arial, Helvetica")
      .attr("transform", "translate(" + marginLeft + "," + 0 + ")")
      .call(yAxis);

    d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
     	.style("shape-rendering","crispEdges")
     	.style("fill","none")
     	.style("stroke","#ccc")

		var circle = g.selectAll("g.circle")
			.data(data)
			.enter().append("g")
			.attr("class","circle")

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
			.attr("class","point")

		color.data(data);

	  circle.append("circle")
	    .style("fill", function(d) { return color() ? color()(d.color) : "#eeeeee"; })
	    .style("fill-opacity", .9)
	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
	    .attr("r", function (d){ return Math.sqrt(sizeScale(d.size)/Math.PI); });

	  point.append("circle")
	  	.filter(function(){ return showPoints(); })
	    .style("fill", "#000")
	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
	    .attr("r", 1);

		circle.append("text")
	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
			.attr("text-anchor", "middle")
			.style("font-size","10px")
			.attr("dy", 15)
			.style("font-family","Arial, Helvetica")
	  	.text(function (d){ return d.label? d.label.join(", ") : ""; });

	})
})();
