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
        var groups = d3.nest()
            .key(function (g){ return group(g); })
            .rollup(function (g){ return g.map(function (h){ return { group : group(h), x : date(h), y : +size(h) }; }) })
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
            .range([+height(), 0]);

        colors.domain(layers, function (d){ return d[0].group; })

        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        g.selectAll("path")
            .data(layers)
            .enter().append("path")
                .attr("d", area)
                .style("fill", function (d) { return colors()(d[0].group); });

    })

})();