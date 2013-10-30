raw.charts.bubblechart = function(){
	
	return {

		title : 'Bubble chart',
		
		description : 'The bubble chart uses Cartesian coordinates to represent three numerical variables using circles position and area. Similar to scatterplot, it is useful to spot out correlations between variables.<br> Based on <a href="http://nvd3.org/ghpages/scatter.html">http://nvd3.org/ghpages/scatter.html</a>',
		image : 'charts/imgs/bubble.png',
		model : raw.models.points({

			color : {
				title : 'Color',
				accept : ['number','string'],
				single : true,
				value : [],
				map : function(d) { return this.value.length ? d[this.value[0].key] : null; }
			},

			label : {
				title : 'Label',
				accept : ['number','string'],
				single : true,
				value : [],
				map : function(d) { return this.value.length ? d[this.value[0].key] : null; }
			},

			size : {
				title : 'Size',
				accept : ['number'],
				value : [],
				single : true,
				map : function(d,t) {
					return this.value.length ? parseFloat(d[this.value[0].key]) + parseFloat(t) : parseFloat(t) + 1;
				}
			}
		}),

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

			labels : {
				title : 'Labels',
				type : 'boolean',
				position : 2,
				description : 'Show labels',
				value : true
			},

			grid : {
				title : 'Grid',
				type : 'boolean',
				position : 2,
				description : '',
				value : true
			},

			maxRadius : {
				title : 'Max radius',
				type : 'number',
				position : 2,
				description : 'Show labels',
				value : 30
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

			// let's calculate margins
			var marginLeft = !options.grid.value ? 0 : d3.max(points, function(d){ return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9,
					marginBottom = !options.grid.value ? 0 : 20,
					w = options.width.value - marginLeft -1,
					h = options.height.value - marginBottom-1;

			var xScale = d3.scale.linear().range([marginLeft,this.options.width.value-1]).domain([ d3.min(points, function(d){ return d.x; }), d3.max(points, function(d){ return d.x; }) ]),
					yScale = d3.scale.linear().range([h,marginBottom]).domain([ d3.min(points, function(d){ return d.y; }), d3.max(points, function(d){ return d.y; }) ]),
					sizeScale = d3.scale.linear().range([1,Math.pow(parseFloat(options.maxRadius.value),2)*Math.PI]).domain([ d3.min(points, function(d){ return d.size; }), d3.max(points, function(d){ return d.size; }) ]),
					
			svg = target.append("svg:svg")
			    .attr("width", parseInt(options.width.value))
			    .attr("height", parseInt(options.height.value))
			  	.append("svg:g")

			
			if (options.grid.value) {

				var xrule = svg.selectAll("g.x")
			  .data(xScale.ticks(10))
			  .enter().append("g")
			    .attr("class", "x")

				xrule.append("line")
			    .attr("x1", xScale)
			    .attr("x2", xScale)
			    .attr("y1", 0)
			    .attr("y2", h)
					.style("stroke","#ccc")
					.style("shape-rendering","crispEdges");

				xrule.append("text")
			    .attr("x", xScale)
			    .attr("y", h + 3)
			    .attr("dy", ".71em")
			    .attr("text-anchor", "middle")
					.style("font-size","10px")
					.style("font-family","Arial, Helvetica")
				  .text(xScale.tickFormat(10));

				var yrule = svg.selectAll("g.y")
				  .data(yScale.ticks(10))
				  .enter().append("g")
				  	.attr("class", "y")
				  	.attr("transform", "translate(" + marginLeft + ",0)");

				yrule.append("line")
			    .attr("x1", 0)
			    .attr("x2", w)
			    .attr("y1", yScale)
			    .attr("y2", yScale)
					.style("stroke","#ccc")
					.style("shape-rendering","crispEdges");

				yrule.append("text")
			    .attr("x", -3)
			    .attr("y", yScale)
			    .attr("dy", ".35em")
			    .attr("text-anchor", "end")
					.style("font-size","10px")
					.style("font-family","Arial, Helvetica")
				  .text(yScale.tickFormat(10));
			}

			svg.append("rect")
		    .attr("width", w)
		    .attr("height", h)
				.style("fill","none")
				.style("stroke","#888")
				.style("shape-rendering","crispEdges")
				.attr("transform", "translate(" + marginLeft + ",0)");

			var color = options.color.value.domain(raw.unique(points, "color"));

			var point = svg.selectAll("g.point")
				.data(points)
				.enter().append("g")
				.attr("class","point")

			point
			  .append("circle")
					.style("stroke", function(d) { return model.map.color.value.length ? d3.rgb(color(d.color)).darker() : d3.rgb(color("undefined")).darker(); } )
			    .style("fill", function(d) { return model.map.color.value.length ? color(d.color) : color("undefined"); })
			    .style("fill-opacity", .8)
			    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
			    .attr("r", function(d){ return model.map.size.value.length ? Math.sqrt(sizeScale(d.size)/Math.PI) : parseFloat(options.maxRadius.value); });

			if (options.labels.value)
				point.append("text")
				    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
						.attr("text-anchor", "middle")
						.style("font-size","10px")
						.attr("dy", 3)
						.style("font-family","Arial, Helvetica")
				  	.text(function(d){ return model.map.label.value.length ? d.label : ""; });

			return this;
		}

	}
};
