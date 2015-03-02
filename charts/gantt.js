(function(){

    var sequence = raw.model();

    var group = sequence.dimension()
        .title('Group')
        .required(1)

    var startDate = sequence.dimension()
        .title('Start Date')
        .types(Number, Date)
        .accessor(function (d){ return this.type() == "Date" ?  Date.parse(d) : +d; })
        .required(1)

    var endDate = sequence.dimension()
        .title('End Date')
        .types(Number, Date)
        .accessor(function (d){ return this.type() == "Date" ?  Date.parse(d) : +d; })
        .required(1)

    var color = sequence.dimension()
        .title('Color')
        .types(String, Date, Number)

    sequence.map(function (data){
			var level = id = 0;

			return d3.nest()
				.key(group() ? group : function(){ return ""; })
				.rollup(function (g) {
					var l, levels = [];
					level=0;
					g.forEach(function (item,i){
						l=0;
						while(overlap(item, levels[l])) l++;
						if (!levels[l]) levels[l] = [];
						levels[l].push({
							level: l+level,
							id: id++,
							color: color() ? color(item) : group() ? group(item) : "",
							group: group() ? group(item) : "",
							start : startDate(item),
							end : endDate(item),
							data: item
						});
					})

					level++;
					return levels;

				})
				.map(data)

			function overlap(item, g) {
				if (!g) return false;
				for(var i in g) {
					if(startDate(item) < g[i].end && endDate(item) > g[i].start) {
						return true;
					}
				}
			  return false;
			};

    })

    var chart = raw.chart()
        .title('Gantt Chart')
				.thumbnail("imgs/gantt.png")
				.description("A Gantt chart is a type of bar chart, developed by Henry Gantt in the 1910s, that illustrates a project schedule. Gantt charts illustrate the start and finish dates of the terminal elements and summary elements of a project.")
        .category('Time chunks')
        .model(sequence)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    var sort = chart.list()
        .title("Sort by")
        .values(['Start date (ascending)', 'Start date (descending)', 'Name'])
        .defaultValue('Start date (ascending)')

    var colors = chart.color()
        .title("Color scale")

    chart.draw(function (selection, data){

        var g = selection
            .attr("width", +width() )
            .attr("height", +height() )
            .append("g")

        var groups = data,
						levels = d3.sum(d3.values(groups).map(function(d){ return d.length; })),
						marginLeft = raw.getMaxWidth(d3.entries(data),function(d){ return d.key; }),
						margin = { top: 10, right: 0, bottom: 20, left: marginLeft + 10 },
						values = []

				d3.values(groups).forEach(function(d){
					d.forEach(function(dd){ values = values.concat(dd);});
				});

				var x = d3.time.scale()
					.range([margin.left, width()])
					.domain([
						d3.min(values, function(d){ return d.start; }),
						d3.max(values, function(d){ return d.end; })
					]);

				var xAxis = d3.svg.axis().scale(x).orient('bottom')//.tickSize(6, 0, 0);

				var itemHeight = (height() - margin.top +- margin.bottom)/levels;

				var last = 0,
						current = 0;

				var items = g.selectAll('g.itemGroup')
					.data(d3.entries(groups).sort(sortBy))
					.enter().append('g')
						.attr("class","itemGroup")
						.attr("transform", function (d,i){
							current = last;
							last += d.value.length * itemHeight;
							return "translate(" + 0 + "," + (margin.top + current) + ")";
						});

				colors.domain(values, function(d){ return d.color; });

				items.append('line')
					.attr('x1', margin.left)
					.attr('y1', 0)
					.attr('x2', width())
					.attr('y2', 0)
					.style("shape-rendering","crispEdges")
					.attr('stroke', 'lightgrey');

				items.append('text')
					.text(function(d){ return d.key; })
					.style("font-size","11px")
        	.style("font-family","Arial, Helvetica")
					.attr('x', margin.left-10)
		  		.attr('y', 0)
		  		.attr('dy', function(d) { return (d.value.length * itemHeight)/2; })
		  		.attr('text-anchor', 'end')
		  		.attr('class', 'groupText');

				items.selectAll('rect')
					.data(function(d){ var p = []; d.value.forEach(function(dd){ p = p.concat(dd); }); return p; }) // soooo bad
					.enter().append('rect')
					.attr('x', function(d) { return x(d.start); })
			    .attr('y', function(d,i) { return itemHeight * d.level; })
				  .attr('width', function(d) { return d3.max([1,x(d.end) - x(d.start)]); })
			    .attr('height', itemHeight)
			    .style("shape-rendering","crispEdges")
			    .style('fill',function(d){ return colors()(d.color); })

				g.append('g')
				  	.attr('transform', 'translate(0,' + (margin.top + itemHeight * levels) + ')')
				  	.attr("class","axis")
						.style("stroke-width", "1px")
        		.style("font-size","10px")
        		.style("font-family","Arial, Helvetica")
			  		.call(xAxis);

        d3.selectAll(".axis line, .axis path")
         	.style("shape-rendering","crispEdges")
         	.style("fill","none")
         	.style("stroke","#ccc")

        function sortBy(a,b){
            if (sort() == 'Start date (descending)') return a.value[0][0].start - b.value[0][0].start;
            if (sort() == 'Start date (ascending)') return b.value[0][0].start - a.value[0][0].start;
            if (sort() == 'Name') return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
        }

    })

})();
