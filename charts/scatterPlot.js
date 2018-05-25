(function() {

	var points = raw.models.points();

	var chart = raw.chart()
		.title('Scatter Plot')
		.description(
			"A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
		.thumbnail("imgs/scatterPlot.png")
		.category('Dispersion')
		.model(points);

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true);

	var height = chart.number()
		.title("Height")
		.defaultValue(500);

	var maxRadius = chart.number()
		.title("max radius")
		.defaultValue(20);

	var useZero = chart.checkbox()
		.title("set origin at (0,0)")
		.defaultValue(false);

	var colors = chart.color()
		.title("Color scale");

	var showPoints = chart.checkbox()
		.title("show points")
		.defaultValue(true);

	chart.draw((selection, data) => {

		// Retrieving dimensions from model
		var x = points.dimensions().get('x'),
			y = points.dimensions().get('y');

		var g = selection
			.attr("width", +width())
			.attr("height", +height())
			.append("g");

		var marginLeft = d3.max([maxRadius(), (d3.max(data, d => {
				return(Math.log(d.y) / 2.302585092994046) + 1;
			}) * 9)]),
			marginBottom = 20,
			w = width() - marginLeft,
			h = height() - marginBottom;

		var xExtent = !useZero() ? d3.extent(data, d => { return d.x;
			}) : [0, d3.max(data, d => {
				return d.x;
			})],
			yExtent = !useZero() ? d3.extent(data, d => {
				return d.y;
			}) : [0, d3.max(data, d => {
				return d.y;
			})];

		var xScale = x.type() == "Date" ?
			d3.scaleTime().range([marginLeft, width() - maxRadius()]).domain(xExtent) :
			d3.scaleLinear().range([marginLeft, width() - maxRadius()]).domain(xExtent),
			yScale = y.type() == "Date" ?
			d3.scaleTime().range([h - maxRadius(), maxRadius()]).domain(yExtent) :
			d3.scaleLinear().range([h - maxRadius(), maxRadius()]).domain(yExtent),
			sizeScale = d3.scaleLinear().range([1, Math.pow(+maxRadius(), 2) * Math.PI]).domain([0, d3.max(data, d => {
				return d.size;
			})]),
			xAxis = d3.axisBottom(xScale).tickSize(-h + maxRadius() * 2) //.tickSubdivide(true),
		yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-w + maxRadius());

		g.append("g")
			.attr("class", "x axis")
			.style("stroke-width", "1px")
			.style("font-size", "10px")
			.style("font-family", "Arial, Helvetica")
			.attr("transform", `translate(0, ${h - maxRadius()})`)
			.call(xAxis);

		g.append("g")
			.attr("class", "y axis")
			.style("stroke-width", "1px")
			.style("font-size", "10px")
			.style("font-family", "Arial, Helvetica")
			.attr("transform", `translate(${marginLeft}, 0)`)
			.call(yAxis);

		d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
			.style("shape-rendering", "crispEdges")
			.style("fill", "none")
			.style("stroke", "#ccc");

		var circle = g.selectAll("g.circle")
			.data(data)
			.enter().append("g")
			.attr("class", "circle");

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
			.attr("class", "point")

		colors.domain(data, d => {
			return d.color;
		});

		circle.append("circle")
			.style("fill", d => {
				return colors() ? colors()(d.color) : "#eeeeee";
			})
			.style("fill-opacity", .9)
			.attr("transform", d => {
				return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
			})
			.attr("r", d => {
				return Math.sqrt(sizeScale(d.size) / Math.PI);
			});

		point.append("circle")
			.filter(d => {
				return showPoints();
			})
			.style("fill", "#000")
			.attr("transform", d => {
				return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
			})
			.attr("r", 1);

		circle.append("text")
			.attr("transform", d => {
				return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
			})
			.attr("text-anchor", "middle")
			.style("font-size", "10px")
			.attr("dy", 15)
			.style("font-family", "Arial, Helvetica")
			.text(d => {
				return d.label ? d.label.join(", ") : "";
			});

	})

})();
