
var tree = raw.models.tree();

var chart = raw.chart()
	 .model(tree)

var radius = chart.option()
	 .title("Radius")
	 .defaultValue(500)

var padding = chart.option()
	 .title("Padding")
	 .defaultValue(10)

chart.draw(function (selection, data){

	var margin = 10,
    	outerDiameter = +radius()*2,
    	innerDiameter = outerDiameter - margin - margin;

	var x = d3.scale.linear()
	    .range([0, innerDiameter]);

	var y = d3.scale.linear()
	    .range([0, innerDiameter]);

	var color = d3.scale.category20b();

	var pack = d3.layout.pack()
	    .padding(2)
	    .sort(null)
	    .size([innerDiameter, innerDiameter])
	    .value(function(d) { return d.size; })

	var g = selection.append("svg")
	    .attr("width", outerDiameter)
	    .attr("height", outerDiameter)
	  .append("g")
	    .attr("transform", "translate(" + margin + "," + margin + ")");

  var focus = data,
      nodes = pack.nodes(data);

  g.append("g").selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return !d.children ? color(d.color||'undefined') : '#eeeeee'; })

  g.append("g").selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("text-anchor", "middle")
   		.style("font-size","11px")
			.style("font-family","Arial, Helvetica")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style("fill-opacity", function(d) { return d.parent === data ? 1 : 0; })
      .style("display", function(d) { return d.parent === data ? null : "none"; })
      .text(function(d) { return d.name; });

  d3.select(self.frameElement).style("height", outerDiameter + "px");


})