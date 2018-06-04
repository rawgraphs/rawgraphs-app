(function() {

	var stream = raw.models.timeSeries();
	stream.dimensions().remove('color');

	var chart = raw.chart()
		.title('Horizon graph')
		.thumbnail("imgs/horizon.png")
		.description("Horizon charts combine position and color to reduce vertical space.<br/><br/>Based on <a href='http://bl.ocks.org/mbostock/1483226'>http://bl.ocks.org/mbostock/1483226</a>")
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

	var bands = chart.number()
		.title('Bands')
		.defaultValue(4)

	var curve = chart.list()
		.title("Interpolation")
		.values(['Cardinal', 'Basis spline', 'Sankey', 'Linear'])
		.defaultValue('Sankey')

	var sorting = chart.list()
		.title("Sort by")
		.values(['Original', 'Total (descending)', 'Total (ascending)', 'Name'])
		.defaultValue('Original')

	var colors = chart.color()
		.title("Color scale")

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

		//define colors
		colors.domain(['Negative', 'Positive']);

		//sort data
		function sortBy(a, b) {
			if (sorting() == 'Total (descending)') {
				return a.values.reduce(function(c, d) { return c + d.size }, 0) - b.values.reduce(function(c, d) { return c + d.size }, 0)
			}
			if (sorting() == 'Total (ascending)') return b.values.reduce(function(c, d) { return c + d.size }, 0) - a.values.reduce(function(c, d) { return c + d.size }, 0);
			if (sorting() == 'Name') {
				return d3.ascending(a.key, b.key);
			}
		}

		data.sort(sortBy);

		//add unique id, needed for clipping paths
		data.forEach(function(d, i) {
			d['id'] = i;
		})

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
			.range([h * bands(), 0]);

		var area = d3.area()
			.x(function(d) { return x(d.date); })
			.y0(h) //align to baseline
			.y1(function(d) { return y(d.size); })
			.curve(curves[curve()])

		x.domain([
			d3.min(data, function(layer) { return d3.min(layer.values, function(d) { return d.date; }); }),
			d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.date; }); })
		])

		var xAxis = d3.axisBottom(x).tickSize(-height() + 20);

		svg.append("g")
			.attr("class", "x axis")
			.style("stroke-width", "1px")
			.style("font-size", "10px")
			.style("font-family", "Arial, Helvetica")
			.attr("transform", "translate(" + 0 + "," + (height() - 20) + ")")
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

			var maxValue;

			if (scale()) {
				maxValue = d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return Math.abs(d.size); }); });
			} else {
				maxValue = d3.max(single.values, function(d) { return Math.abs(d.size); });
			}

			var maxPos = d3.max(single.values, function(d) { return d.size; })

			// define new range and domain according to the masimum value
			// and the amount of bands
			y.domain([0, maxValue])
				.range([h, -h * (bands() - 1)]);

			//create the clip path
			g.append("clipPath")
				.attr("id", function(d) { return "clip_" + d.id })
				.append("rect")
				.attr("width", w)
				.attr("height", h)

			//append one area per band, positive
			for (var i = 0; i < bands() * maxPos / maxValue; i++) {
				//change y range according to offset
				area.y0(h + h * i)
					.y1(function(d) { return y(d.size) + h * i; })

				g.append("path")
					.attr("class", "area")
					.style("fill", colors()('Positive'))
					.attr("d", area(single.values))
					.attr("opacity", (i + 1) / bands())
					.attr("clip-path", function(d) { return "url(#clip_" + d.id + ")" });
			}

			//do the same for negative values
			var maxNeg = d3.min(single.values, function(d) { return d.size; })

			for (var i = 0; i < bands() * -maxNeg / maxValue; i++) {

				area.y0(-h * i)
					.y1(function(d) { return y(d.size) + -h * (i + 1); })

				g.append("path")
					.attr("class", "area")
					.style("fill", colors()('Negative'))
					.attr("d", area(single.values))
					.attr("opacity", (i + 1) / bands())
					.attr("clip-path", function(d) { return "url(#clip_" + d.id + ")" });
			}

		}

	})

})();
