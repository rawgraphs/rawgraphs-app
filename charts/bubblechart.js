
var points = raw.models.points();

var chart = raw.chart()
	.model(points)

var width = chart.option()
	.title("Width")
	.defaultValue(1000)

var height = chart.option()
	.title("Height")
	.defaultValue(500)

chart.draw(function (selection, data){
		
	var g = selection
		.attr("width", +width() )
		.attr("height", +height() )
		.append("g")

	var xScale = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
			yScale = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; })),
			sizeScale = d3.scale.linear().range([1, Math.pow(20,2)*Math.PI]).domain(d3.extent(data, function (d){ return d.size; }))

	g.append("rect")
    .attr("width", +width())
    .attr("height", +height())
		.style("fill","none")
		.style("stroke","#888")
		.style("shape-rendering","crispEdges")

	var point = g.selectAll("g.point")
		.data(data)
		.enter().append("g")
		.attr("class","point")

  point.append("circle")
		//.style("stroke", function(d) { return model.map.color.value.length ? d3.rgb(color(d.color)).darker() : d3.rgb(color("undefined")).darker(); } )
    .style("fill", "#f00")//function(d) { return model.map.color.value.length ? color(d.color) : color("undefined"); })
    .style("fill-opacity", .8)
    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    .attr("r", 20)//function (d){ return Math.sqrt(sizeScale(d.size)/Math.PI); });

	point.append("text")
    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
		.attr("text-anchor", "middle")
		.style("font-size","10px")
		.attr("dy", 3)
		.style("font-family","Arial, Helvetica")
  	.text(function (d){ return d.label; });

})
