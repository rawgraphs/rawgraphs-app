
raw.charts.sunburst = function(){
	return {

		id : 'sunburst',
		label : 'Sunburst',
		description : '...',
		model : raw.models.tree(),

		style : {

			radius : {
				label : 'Radius',
				type : 'number',
				position : 1,
				description : 'Radius is whatever',
				value : 400
			},

			labels : {
				label : 'Labels',
				type : 'check',
				position : 2,
				description : 'Show labels',
				value : true
			}
		},

		render : function(data, target) {

			var model = this.model,
				style = this.style;

			var radius = style.radius.value,
		        format = d3.format(",d");

		    var partition = d3.layout.partition()
    			.sort(null)
    			.size([2 * Math.PI, radius * radius])
    			.value(function(d) { return 1; });

    		var svg = target.append("svg")
			    .attr("width", radius * 2)
			    .attr("height", radius * 2)
			  	.append("g")
			    .attr("transform", "translate(" + radius + "," + radius + ")");

			var arc = d3.svg.arc()
			    .startAngle(function(d) { return d.x; })
			    .endAngle(function(d) { return d.x + d.dx; })
			    .innerRadius(function(d) { return Math.sqrt(d.y); })
			    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

			var children = partition.nodes(model.applyOn(data)).filter(function(d) { return !d.children; });
			var color = raw.diverging().domain(raw.unique(children, "parent.name"));

			var path = svg.datum(model.applyOn(data)).selectAll("path")
			    .data(partition.nodes)
				.enter().append("path")
			    	.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
			      	.attr("d", arc)
			      	.style("stroke", "#fff")
			      	.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
			      	.style("fill-rule", "evenodd")
			      	.each(stash);

			d3.selectAll("input").on("change", function change() {
			    var value = this.value === "count"
			        ? function() { return 1; }
			        : function(d) { return d.size; };

			    path
			    	.data(partition.value(value).nodes)
			      	.transition()
			        .duration(1500)
			        .attrTween("d", arcTween);
			});

			// Stash the old values for transition.
			function stash(d) {
				d.x0 = d.x;
			  	d.dx0 = d.dx;
			}

			// Interpolate the arcs in data space.
			function arcTween(a) {
			  	var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
			  	return function(t) {
			    	var b = i(t);
			    	a.x0 = b.x;
			    	a.dx0 = b.dx;
			    	return arc(b);
			  	};
			}


		    return this;

		}
	}
};