(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');


	var chart = raw.chart()
		.title('Voronoi Tessellation')
		.thumbnail("/imgs/voronoi.png")
		.model(points)

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

	var showPoints = chart.option()
		 .title("Show points")
		 .defaultValue(true)
		 .type("checkbox")

	chart.draw(function (selection, data){

		var x = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
				y = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
		
		var vertices = data
		/*.map(function(d) {
		  return [ x(d.x), y(d.y) ];
		});*/

		var voronoi = d3.geom.voronoi()
			.x(function (d){ return x(d.x); })
			.y(function (d){ return y(d.y); })
    	.clipExtent([ [ 0, 0 ], [+width(), +height()] ]);

		var g = selection
		    .attr("width", +width())
		    .attr("height", +height())
		    .append("g");

		color.data(data);

		var path = g.selectAll("path")
			.data(voronoi(vertices), polygon)
			.enter().append("path")
	      .style("fill",function (d){ return d && color()? color()(d.point.color) :  "#dddddd"; })
	      .style("stroke","#fff")
	      .attr("d", polygon);

	  path.order();

  	g.selectAll("circle")
	    .data(vertices.filter(function(){ return showPoints() }))
	  .enter().append("circle")
	  	.style("fill","#000000")
	  	.style("pointer-events","none")
	    .attr("transform", function (d) { return "translate(" + x(d.x) + ", " + y(d.y) + ")"; })
	    .attr("r", 1.5);

		function polygon(d) {
			if(!d) return;
		  return "M" + d.join("L") + "Z";
		}

	})
})();




