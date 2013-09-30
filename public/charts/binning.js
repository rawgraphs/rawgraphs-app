raw.charts.binning = function(){
	
	return {

		title : 'Binned scatterplot',
		
		description : 'Visually clusters the most populated areas on a scatterplot. Useful to make more readable a scatterplot when plotting hundreds of points.<br>Based on <a href="http://bl.ocks.org/mbostock/4248145">http://bl.ocks.org/mbostock/4248145</a>',
		image : 'charts/imgs/hexagonal-binning.png',
		model : raw.models.points(),

		options : {

			width : {
				title : 'Width',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 800
			},

			height : {
				title : 'Height',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 500
			},

			radius : {
				title : 'Cell radius',
				type : 'number',
				position : 1,
				description : 'Radius',
				value : 20
			},

			grid : {
				title : 'Grid',
				type : 'boolean',
				position : 2,
				description : '',
				value : true
			},

			color : {
				title : 'Color',
				type : 'color',
				position : 2,
				description : 'Color sucks!',
				value : raw.diverging()
			}
		},

		render : function(data, target) {

			var model = this.model,
					options = this.options,
					format = d3.format(",d");

			var points = model.applyOn(data);

			console.log(points)

			// let's calculate margins
			var marginLeft = !options.grid.value ? 0 : d3.max(points, function(d){ return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9,
				marginBottom = !options.grid.value ? 0 : 20,
				width = options.width.value - marginLeft -2,
				height = options.height.value - marginBottom-1;

			var color = d3.scale.linear()
			    .domain([0, 20])
			    .range(["white", "steelblue"])
			    .interpolate(d3.interpolateLab);

			var hexbin = d3.hexbin()
			    .size([width, height])
			    .x(function(d){ return xScale(d.x); })
			    .y(function(d){ return yScale(d.y); })
			    .radius(this.options.radius.value);

			var	xScale = d3.scale.linear().range([marginLeft,this.options.width.value-1]).domain([ d3.min(points, function(d){ return d.x; }), d3.max(points, function(d){ return d.x; }) ]),
					yScale = d3.scale.linear().range([height, 0]).domain([ d3.min(points, function(d){ return d.y; }), d3.max(points, function(d){ return d.y; }) ])

			var xAxis = d3.svg.axis()
			    .scale(xScale)
			    .orient("bottom")
			    .tickSize(6, -height);

			var yAxis = d3.svg.axis()
			    .scale(yScale)
			    .orient("left")
			    .tickSize(6, -width);

			svg = target.append("svg:svg")
			    .attr("width", parseInt(options.width.value))
			    .attr("height", parseInt(options.height.value))
			  	.append("svg:g")
			    .attr("transform", "translate(0,0)");

			svg.append("clipPath")
			    .attr("id", "clip")
			  .append("rect")
			    .attr("class", "mesh")
			    .attr("width", width)
			    .attr("height", height)
			    .attr("transform", "translate(" + marginLeft + ",1)");

			    console.log(hexbin(points))

			svg.append("g")
			    .attr("clip-path", "url(#clip)")
			  .selectAll(".hexagon")
			    .data(hexbin(points))
			  .enter().append("path")
			    .attr("class", "hexagon")
			    .attr("d", hexbin.hexagon())
			    .attr("transform", function(d) { console.log(d); return "translate(" + d.x + "," + d.y + ")"; })
			    .style("fill", function(d) { return color(d.length); })
			    .attr("stroke","#000")
			    .attr("stroke-width",".5px")

			svg.append("g")
			    .attr("class", "y axis")
			    .attr("transform", "translate(" + marginLeft + ",0)")
			    .call(yAxis);

			svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);

			svg.selectAll(".axis")
				.selectAll("text")
				.style("font","10px sans-serif")

			svg.selectAll(".axis")
				.selectAll("path")
				.style("fill","none")
				.style("stroke","#000000")
				.style("shape-rendering","crispEdges")

			svg.selectAll(".axis")
				.selectAll("line")
				.style("fill","none")
				.style("stroke","#000000")
				.style("shape-rendering","crispEdges")

			return this;
		}

	}
};
