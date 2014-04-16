(function(){

    var stream = raw.model();

    var group = stream.dimension()
        .title('Group')

    var date = stream.dimension()
        .title('Date')
        .types(Number,Date)

    var size = stream.dimension()
        .title('Size')
        .types(Number)

    stream.map(function (data){
        if (!group()) return [];

        var dates = d3.set(data.map(function (d){ return date(d); })).values();

        var groups = d3.nest()
            .key(group)
            .rollup(function (g){

                var singles = d3.nest()
                    .key(date)
                    .rollup(function (d){
                        return {
                            group : group(d[0]),
                            x : +date(d[0]),
                            y : size() ? d3.sum(d,size) : d.length 
                        }
                    })
                    .map(g);

                // let's create the empty ones
                dates.forEach(function(d){
                    if (!singles[d]) singles[d] = { group : group(g[0]), x : +d, y : 0 }
                })

                return d3.values(singles);
            })
            .map(data)

        return d3.values(groups);
    })

    var chart = raw.chart()
        .title('Streamgraph')
        .thumbnail("imgs/streamgraph.png")
        .description(
            "For continuous data such as time series, a streamgraph can be used in place of stacked bars. <br/>Based on <a href='http://bl.ocks.org/mbostock/4060954'>http://bl.ocks.org/mbostock/4060954</a>")
        .model(stream)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    var offset = chart.list()
        .title("Offset")
        .values(['silhouette','wiggle','expand','zero'])
        .defaultValue('silhouette')

    var colors = chart.color()
        .title("Color scale")

    chart.draw(function (selection, data){
        console.log(data)

        var g = selection
            .attr("width", +width() )
            .attr("height", +height() )
            .append("g")
   
        var stack = d3.layout.stack()
            .offset(offset());

        var layers = stack(data);

        var x = d3.scale.linear()
            .domain( [ d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.x; }); }), d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.x; }); }) ])
            .range([0, +width()]);

        var y = d3.scale.linear()
            .domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
            .range([+height()-20, 0]);

        var xAxis = d3.svg.axis().scale(x).tickSize(-height()+20).orient("bottom").tickFormat(d3.format("d"))

        g.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()-20) + ")")
            .call(xAxis);

        d3.selectAll(".x.axis line, .x.axis path")
            .style("shape-rendering","crispEdges")
            .style("fill","none")
            .style("stroke","#ccc")

        colors.domain(layers, function (d){ return d[0].group; })

        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        g.selectAll("path.layer")
            .data(layers)
            .enter().append("path")
                .attr("class","layer")
                .attr("d", area)
                .style("fill", function (d) { return colors()(d[0].group); });

    })

})();