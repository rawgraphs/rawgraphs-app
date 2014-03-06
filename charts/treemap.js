
var tree = raw.models.tree();

// Chart

var chart = raw.chart()
	 .model(tree)

var width = chart.option()
	 .title("Width")
	 .defaultValue(1000)

var height = chart.option()
	 .title("Height")
	 .defaultValue(500)

var padding = chart.option()
	 .title("Padding")
	 .defaultValue(10)

chart.draw(function (selection, data){
	
	var format = d3.format(",d");

	var layout = d3.layout.treemap()
		.sticky(true)
	  .padding(+padding() || 0)
    .size([+width(), +height()])
    .value(function(d) { return d.size; })

	var g = selection.append("svg:svg")
    .attr("width", +width())
    .attr("height", +height())
  	.append("g")
    .attr("transform", "translate(.5,.5)");

	var nodes = layout.nodes(data)
  	.filter(function(d) { return !d.children; });

	var cell = g.selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "cell")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	var color = d3.scale.category20b();

	cell.append("svg:rect")
    .attr("width", function (d) { return d.dx; })
    .attr("height", function (d) { return d.dy; })
    .style("fill", function (d) { return d.color ? color(d.color) : color('undefined'); })
    .style("fill-opacity", function (d) {  return d.children ? 0 : 1; })
		.style("stroke","#fff")
	
	cell.append("svg:title")
		.text(function(d) { return d.name + ": " + format(d.size); });

	cell.append("svg:text")
    .attr("x", function(d) { return d.dx / 2; })
    .attr("y", function(d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
   	.style("font-size","11px")
		.style("font-family","Arial, Helvetica")
    .text(function(d) { return d.name +  " (" + d.value + ")"; });


})