(function() {

	var stream = raw.model();

	var group = stream.dimension()
		.title('Group')
		.required(1)

	var date = stream.dimension()
		.title('Date')
		.types(Number, Date, String)
		//.accessor(function (d){ return this.type() == "Date" ? new Date(+Date.parse(d)) : this.type() == "String" ? d : +d; })
		.accessor(function(d) { return +Date.parse(d) })
		.required(1)

	var size = stream.dimension()
		.title('Size')
		.types(Number)

	stream.map(function(data) {
		if (!group()) return [];

		var keys = d3.set(data.map(function(d) { return group(d); })).values();

		var groups = d3.nest()
			.key(function(d) { return date(d) }).sortKeys(function(a, b) { return a - b })
			.rollup(function(v) {
				var singles = d3.nest()
					.key(function(e) { return group(e) })
					.rollup(function(w) {
						return {
							size: +d3.sum(w, function(f) { return size() ? size(f) : 1 }),
							date: +date(w[0]),
							group: group(w[0])
						}
					})
					.entries(v);

				var map = d3.map(singles, function(d) { return d.key });

				keys.forEach(function(d) {
					if (!map.has(d)) {

						singles.push({
							'key': d,
							'value': { size: 0, date: d, group: group(v[0]) }
						})
					}
				});

				return singles.sort(function(a, b) { return d3.ascending(a.key, b.key) });
			})
			.entries(data)

		var results = groups.map(function(d) {
			var item = {}
			d.value.forEach(function(e) {
				item[e.key] = e.value['size']
			});
			item.date = new Date(+d.key);
			return item;
		});

		//create a wrap object
		var output = {
			values: results,
			keys: keys
		}

		return output
	})

	var chart = raw.chart()
		.title('Streamgraph')
		.thumbnail("imgs/streamgraph.png")
		.description(
			"For continuous data such as time series, a streamgraph can be used in place of stacked bars. <br/>Based on <a href='http://bl.ocks.org/mbostock/4060954'>http://bl.ocks.org/mbostock/4060954</a>")
		.category('Time series')
		.model(stream)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var order = chart.list()
		.title("Series order")
		.values(["Original order", "Bigger to smaller", "Smaller to bigger", "Inside out", "Reverse original"])
		.defaultValue("Original order")

	var offset = chart.list()
		.title("Offset")
		.values(['Expand', 'Diverging', 'Silhouette', 'Wiggle', 'None'])
		.defaultValue('Wiggle')

	var curve = chart.list()
		.title("Interpolation")
		.values(['Cardinal', 'Basis spline', 'DensityDesign', 'Linear'])
		.defaultValue('Basis spline')

	var showLabels = chart.checkbox()
		.title("Show labels")
		.defaultValue(false)

	var colors = chart.color()
		.title("Color scale")

	chart.draw(function(selection, data) {

		var g = selection
			.attr("width", +width())
			.attr("height", +height())
			.append("g")

		var curves = {
			'Basis spline': d3.curveBasis,
			'Cardinal': d3.curveCardinal,
			'Linear': d3.curveLinear,
			'DensityDesign': curveSankey
		}

		var offsets = {
			'Expand': d3.stackOffsetExpand,
			'Diverging': d3.stackOffsetDiverging,
			'None': d3.stackOffsetNone,
			'Silhouette': d3.stackOffsetSilhouette,
			'Wiggle': d3.stackOffsetWiggle
		}

		var orders = {
			"Original order": d3.stackOrderNone,
			"Bigger to smaller": d3.stackOrderAscending,
			"Smaller to bigger": d3.stackOrderDescending,
			"Inside out": d3.stackOrderInsideOut,
			"Reverse original": d3.stackOrderReverse
		}

		var stack = d3.stack()
			.keys(data.keys)
			.offset(offsets[offset()])
			.order(orders[order()]);

		var layers = stack(data.values);

		//below, the old code to swap among three types of data. for now, it is forced to dates only.

		// var x = date.type() == "Date"
		//     // Date
		//     ? d3.scaleTime()
		//         .domain( [ d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.x; }); }), d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.x; }); }) ])
		//         .range([0, +width()])
		//     : date && date.type() == "String"
		//       // String
		//       ? d3.scaleOrdinal()
		//           .domain(layers[0].map(function(d){ return d.x; }) )
		//           .rangePoints([0, +width()],0)
		//       // Number
		//       : d3.scaleLinear()
		//           .domain( [ d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.x; }); }), d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.x; }); }) ])
		//           .range([0, +width()]);

		// var y = d3.scaleLinear()
		//     .domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
		//     .range([+height()-20, 0]);

		var x = d3.scaleTime()
			.domain(d3.extent(data.values, function(d) { return d.date; }))
			.range([0, +width()]);

		var y = d3.scaleLinear()
			.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
			.range([+height() - 20, 0]);

		function stackMax(layer) {
			return d3.max(layer, function(d) { return d[1]; });
		}

		function stackMin(layer) {
			return d3.min(layer, function(d) { return d[0]; });
		}

		colors.domain(data.keys);

		var xAxis = d3.axisBottom(x); //.tickSize(-height()+20);

		var area = d3.area()
			.curve(curves[curve()])
			.x(function(d) { return x(d.data.date); })
			.y0(function(d) { return y(d[0]); })
			.y1(function(d) { return y(d[1]); });

		var line = d3.line()
			.curve(curves[curve()])
			.x(function(d) { return x(d.data.date); })
			.y(function(d) {
				return y(d[0] + (d[1] - d[0]) / 2);
			});

		g.selectAll("path.layer")
			.data(layers)
			.enter().append("path")
			.attr("class", "layer")
			.attr("d", area)
			.attr("fill", function(d) { return colors()(d.key) })
			.attr("title", function(d) { return d.key; });

		g.append("g")
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

		if (!showLabels()) return;

		g.append('defs');

		g.select('defs')
			.selectAll('path')
			.data(layers)
			.enter().append('path')
			.attr('id', function(d, i) { return 'path-' + i; })
			.attr('d', line);

		g.selectAll("text.label")
			.data(layers)
			.enter().append('text')
			.attr('dy', '0.5ex')
			.attr("class", "label")
			.append('textPath')
			.attr('xlink:xlink:href', function(d, i) { return '#path-' + i; })
			.attr('startOffset', function(d) {
				var maxYloc = 0,
					maxV = 0;
				d.forEach(function(e, i) {
					// get point with max value
					var val = e[1] - e[0];
					if (val > maxV) {
						maxV = val;
						maxYloc = i
					}
				})
				//get y position
				d.offset = Math.round(maxYloc / d.length * 100);
				//return offset
				return Math.min(95, Math.max(5, d.offset)) + '%';
			})
			.attr('text-anchor', function(d) {
				return d.offset > 90 ? 'end' : d.offset < 10 ? 'start' : 'middle';
			})
			.text(function(d) { return d.key; })
			.style("font-size", "11px")
			.style("font-family", "Arial, Helvetica")
			.style("font-weight", "normal")

		/*g.selectAll("text.label")
			.data(labels(layers))
			.enter().append("text")
				.attr("x", function(d){ return x(d.x); })
				.attr("y", function(d){ return y(d.y0 + d.y/2); })
				.text(function(d){ return d.group; })
				.style("font-size","11px")
				.style("font-family","Arial, Helvetica")



		function labels(layers){
			return layers.map(function(layer){
				var l = layer[0], max = 0;
				layer.forEach(function(d){
					if ( d.y > max ) {
						max = d.y;
						l = d;
					}
				})
				return l;
			})

		}*/

	})

	//Sankey interpolator. Could be moved in a better place.
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

})();
