(function(){

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');
	points.dimensions().remove('color');


	var chart = raw.chart()
		.title('Delaunay Triangulation')
		.thumbnail("/imgs/delaunay.png")
		.model(points)

	var width = chart.option()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.option()
		.title("Height")
		.defaultValue(500)


	chart.draw(function (selection, data){

		var x = d3.scale.linear().range([0,+width()]).domain(d3.extent(data, function (d){ return d.x; })),
				y = d3.scale.linear().range([+height(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
		
		var vertices = data;

		var delaunay = d3.geom.voronoi()
			.x(function (d){ return x(d.x); })
			.y(function (d){ return y(d.y); })
    	.clipExtent([ [ 0, 0 ], [+width(), +height()] ]);

		var g = selection
		    .attr("width", +width())
		    .attr("height", +height())
		    .append("g");

		var path = g.selectAll("path")
			.data(delaunay.triangles(vertices), polygon)
			.enter().append("path")
	      .style("fill", "#bbb")//function (d){ console.log(d); return d && color()? color()(d[0].color) :  "#dddddd"; })
	      .style("stroke","#fff")
	      .attr("d", polygon);

		function polygon(d) {
			if(!d) return;
			var s = d.map(function (a){ return [x(a.x), y(a.y)]  } )
		  return "M" + s.join("L") + "Z";
		}

	})
})();







