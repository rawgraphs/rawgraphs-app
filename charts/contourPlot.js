(function() {

	var points = raw.models.points();

	points.dimensions().remove('size');
	points.dimensions().remove('label');
	points.dimensions().remove('color');

	var chart = raw.chart()
		.title('Contour Plot')
		.description(
			"It shows the estimated density of point clouds, which is especially useful to avoid overplotting in large datasets.<br/>Based on <a href='https://bl.ocks.org/mbostock/7f5f22524bd1d824dd53c535eda0187f'>Density Contours II</a>")
		.thumbnail("imgs/contourplot.png")
		.category('Dispersion')
		.model(points)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var bandwidth = chart.number()
		.title("Standard deviation")
		.defaultValue(40)

	var colorMode = chart.list()
		.title("Colors applied to")
		.values(["Stroke", "Fill"])
		.defaultValue("Stroke")

	var useZero = chart.checkbox()
		.title("Set origin at (0,0)")
		.defaultValue(false)

	var colors = chart.color()
		.title("Color scale")

	var showPoints = chart.checkbox()
		.title("Show points")
		.defaultValue(true)

	chart.draw(function(selection, data) {

		// Retrieving dimensions from model
		var x = points.dimensions().get('x'),
			y = points.dimensions().get('y');

		var g = selection
			.attr("width", +width())
			.attr("height", +height())
			.append("g")

		var marginLeft = d3.max(data, function(d) { return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9,
			marginBottom = 20,
			w = width() - marginLeft,
			h = height() - marginBottom;

		var xExtent = !useZero() ? d3.extent(data, function(d) { return d.x; }) : [0, d3.max(data, function(d) { return d.x; })],
			yExtent = !useZero() ? d3.extent(data, function(d) { return d.y; }) : [0, d3.max(data, function(d) { return d.y; })];

		var xScale = x.type() == "Date" ?
			d3.scaleTime().range([marginLeft, width()]).domain(xExtent) :
			d3.scaleLinear().range([marginLeft, width()]).domain(xExtent);

		var yScale = y.type() == "Date" ?
			d3.scaleTime().range([h, 0]).domain(yExtent) :
			d3.scaleLinear().range([h, 0]).domain(yExtent);

		var xAxis = d3.axisBottom(xScale).tickSize(6, -h);
		var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(6, -w);

		g.append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("class", "mesh")
			.attr("width", w)
			.attr("height", h)
			.attr("transform", "translate(" + marginLeft + ",1)");

		var contours = d3.contourDensity()
			.x(function(d) { return xScale(d.x); })
			.y(function(d) { return yScale(d.y); })
			.size([w, h])
			.bandwidth(bandwidth())
			(data);

		colors.domain(contours, function(d) { return d.value; });

		var contourPaths = g.insert("g", "g")
			.attr("clip-path", "url(#clip)")
			.attr("stroke-linejoin", "round")
			.selectAll("path")
			.data(contours)
			.enter().append("path")
			.attr("d", d3.geoPath());

		if (colorMode() == "Fill") {

			contourPaths.attr("fill", function(d) { console.log(d); return colors()(d.value) })
				.attr("stroke", "none")

		} else if (colorMode() == "Stroke") {

			contourPaths.attr("stroke", function(d) { console.log(d); return colors()(d.value) })
				.attr("fill", "none")
		}

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
			.attr("class", "point")

		point.append("circle")
			.filter(function() { return showPoints(); })
			.style("fill", "#000")
			.attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
			.attr("r", 1);

		g.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + marginLeft + ",0)")
			.call(yAxis);

		g.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);

		g.selectAll(".axis")
			.selectAll("text")
			.style("font", "10px Arial, Helvetica")

		g.selectAll(".axis")
			.selectAll("path")
			.style("fill", "none")
			.style("stroke", "#000000")
			.style("shape-rendering", "crispEdges")

		g.selectAll(".axis")
			.selectAll("line")
			.style("fill", "none")
			.style("stroke", "#000000")
			.style("shape-rendering", "crispEdges")
	})
})();