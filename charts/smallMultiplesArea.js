(function() {

	var stream = raw.models.timeSeries();

	var chart = raw.chart()
		.title('Area graph')
		.thumbnail("imgs/smallMultiples.png")
		.description("A small multiple is a series of small similar graphics or charts, allowing them to be easily compared.<br/>Based on <a href='http://bl.ocks.org/mbostock/9490313'>http://bl.ocks.org/mbostock/9490313</a>")
		.category('Time series')
		.model(stream)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var padding = chart.number()
		.title("Padding")
		.defaultValue(5)

	var scale = chart.checkbox()
		.title("Use same scale")
		.defaultValue(false)

	var specular = chart.checkbox()
		.title("Center values vertically")
		.defaultValue(false)

	var colors = chart.color()
		.title("Color scale")

	var curve = chart.list()
		.title("Interpolation")
		.values(['Cardinal', 'Basis spline', 'Sankey', 'Linear'])
		.defaultValue('Sankey')

	var sorting = chart.list()
		.title("Sort by")
		.values(['Original', 'Total (descending)', 'Total (ascending)', 'Name'])
		.defaultValue('Original')

	// interpolation function

	function CurveSankey(context) {
		this._context = context;
	}

	CurveSankey.prototype = {
		areaStart: function() {
			this._line = 0;
		},
		areaEnd: function() {
			this._line = NaN;
		},
		lineStart: function() {
			this._x = this._y = NaN;
			this._point = 0;
		},
		lineEnd: function() {
			if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
			this._line = 1 - this._line;
		},
		point: function(x, y) {
			x = +x, y = +y;
			switch (this._point) {
				case 0:
					this._point = 1;
					this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
					break;
				case 1:
					this._point = 2; // proceed
				default:
					var mx = (x - this._x) / 2 + this._x;
					this._context.bezierCurveTo(mx, this._y, mx, y, x, y);
					break;
			}
			this._x = x, this._y = y;
		}
	};

	var curveSankey = function(context) {
		return new CurveSankey(context);
	}

	chart.draw(function(selection, data) {

		//sort data
		function sortBy(a, b) {
			console.log(a);
			if (sorting() == 'Total (descending)') {
				return a.values.reduce(function(c, d) { return c + d.size }, 0) - b.values.reduce(function(c, d) { return c + d.size }, 0)
			}
			if (sorting() == 'Total (ascending)') {
				return b.values.reduce(function(c, d) { return c + d.size }, 0) - a.values.reduce(function(c, d) { return c + d.size }, 0);
			}
			if (sorting() == 'Name') {
				if (a[0].group < b[0].group) return -1;
				if (a[0].group > b[0].group) return 1;
			}
		}

		data.sort(sortBy);

		var curves = {
			'Basis spline': d3.curveBasis,
			'Cardinal': d3.curveCardinal,
			'Sankey': curveSankey,
			'Linear': d3.curveLinear
		}

		var w = +width(),
			h = (+height() - 20 - (+padding() * (data.length - 1))) / data.length;

		var svg = selection
			.attr("width", +width())
			.attr("height", +height())

		var x = d3.scaleTime()
			.range([0, w]);

		var y = d3.scaleLinear()
			.range([h, 0]);

		var area = d3.area()
			.x(function(d) { return x(d.date); })
			.curve(curves[curve()]);

		if (specular()) {
			area.y0(function(d) { return h - y(d.size) / 2; })
				.y1(function(d) { return y(d.size) / 2; })
		} else {
			area.y0(h) //align to baseline
				.y1(function(d) { return y(d.size); })
		}

		x.domain([
			d3.min(data, function(layer) { return d3.min(layer.values, function(d) { return d.date; }); }),
			d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.date; }); })
		])

		colors.domain(data, function(d) { return d.values[0].color; }) //get color of first item

		var xAxis = d3.axisBottom(x).tickSize(-height() + 15);

		svg.append("g")
			.attr("class", "x axis")
			.style("stroke-width", "1px")
			.style("font-size", "10px")
			.style("font-family", "Arial, Helvetica")
			.attr("transform", "translate(" + 0 + "," + (height() - 15) + ")")
			.call(xAxis);

		d3.selectAll(".x.axis line, .x.axis path")
			.style("shape-rendering", "crispEdges")
			.style("fill", "none")
			.style("stroke", "#ccc")


		svg.selectAll("g.flow")
			.data(data)
			.enter().append("g")
			.attr("class", "flow")
			.attr("title", function(d) { return d.key; })
			.attr("transform", function(d, i) { return "translate(0," + ((h + padding()) * i) + ")" })
			.each(multiple);

		svg.selectAll("g.flow")
			.append("text")
			.attr("x", w - 6)
			.attr("y", h - 6)
			.style("font-size", "10px")
			.style("fill", "black")
			.style("font-family", "Arial, Helvetica")
			.style("text-anchor", "end")
			.text(function(d) { return d.key; });

		function multiple(single) {

			var g = d3.select(this);

			if (scale()) {
				y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.size; }); })])
			} else {
				y.domain([0, d3.max(single.values, function(d) { return d.size; })]);
			}

			g.append("path")
				.attr("class", "area")
				.style("fill", function(d) { return colors()(d.values[0].color); })
				.attr("d", area(single.values));
		}

	})

})();
