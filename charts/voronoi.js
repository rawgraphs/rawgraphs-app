(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');

	var chart = raw.chart()
		.title('Voronoi Tessellation')
		.description(
            "It creates the minimum area around each point defined by two variables. When applied to a scatterplot, it is useful to show the distance between points. <br/>Based on <a href='http://bl.ocks.org/mbostock/4060366'>http://bl.ocks.org/mbostock/4060366</a>")
		.thumbnail("imgs/voronoi.png")
		.category('Distributions')
		.model(points)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var colors = chart.color()
		.title("Color scale")

	var showPoints = chart.checkbox()
		.title("Show points")
		.defaultValue(true)

	chart.draw(function (selection, data){

		var x = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
			y = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
		
		var voronoi = d3.geom.voronoi()
			.x(function (d){ return x(d.x); })
			.y(function (d){ return y(d.y); })
    		.clipExtent([ [ 0, 0 ], [+width(), +height()] ]);

		var g = selection
		    .attr("width", +width())
		    .attr("height", +height())
		    .append("g");

		colors.domain(data, function (d){ return d.color; });

		var path = g.selectAll("path")
			.data(voronoi(data), polygon)
			.enter().append("path")
	      	.style("fill",function (d){ return d && colors()? colors()(d.point.color) :  "#dddddd"; })
	      	.style("stroke","#fff")
	      	.attr("d", polygon);

	  	path.order();

	  	g.selectAll("circle")
		    .data(data.filter(function(){ return showPoints() }))
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
