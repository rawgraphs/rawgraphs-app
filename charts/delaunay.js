(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');
	points.dimensions().remove('color');

	var chart = raw.chart()
		.title('Delaunay Triangulation')
		.description(
            "The Delaunay triangulation, the dual of Voronoi tesselation, creates a planar, triangular mesh for a given set of points.  <br/>Based on <a href='http://bl.ocks.org/mbostock/4341156'>http://bl.ocks.org/mbostock/4341156</a>")
		.thumbnail("imgs/delaunay.png")
		.model(points)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	chart.draw(function (selection, data){

		var x = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
			y = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
		
		var delaunay = d3.geom.voronoi()
			.x(function (d){ return x(d.x); })
			.y(function (d){ return y(d.y); })
    		.clipExtent([ [ 0, 0 ], [+width(), +height()] ]);

		var g = selection
		    .attr("width", +width())
		    .attr("height", +height())
		    .append("g");

		var path = g.selectAll("path")
			.data(delaunay.triangles(data), polygon)
			.enter().append("path")
	      	.style("fill", "#bbb")
	      	.style("stroke","#fff")
	      	.attr("d", polygon);

		function polygon(d) {
			if(!d) return;
			var s = d.map(function (a){ return [x(a.x), y(a.y)]  } )
		  	return "M" + s.join("L") + "Z";
		}

	})
})();
