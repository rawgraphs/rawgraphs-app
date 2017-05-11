(function(){

    var stream = raw.model();

    var group = stream.dimension()
        .title('Group')
        .required(1)

    var date = stream.dimension()
        .title('Date')
        .types(Number, Date, String)
        .accessor(function (d){ return this.type() == "Date" ? Date.parse(d) : this.type() == "String" ? d : +d; })
        .required(1)

    var size = stream.dimension()
        .title('Size')
        .types(Number)
        .required(1)

    stream.map(function (data){
        if (!group()) return [];

        var dates = d3.set(data.map(function (d){ return date(d); })).values();

        var groups = d3.nest()
            .key(group)
            .rollup(function (g){

                var singles = d3.nest()
                    .key(function(d){ return date(d); })
                    .rollup(function (d){
                        return {
                            group : group(d[0]),
                            x : date(d[0]),
                            y : size() ? d3.sum(d,size) : d.length
                        }
                    })
                    .map(g);

                // let's create the empty ones
                dates.forEach(function(d){
                    if (!singles.hasOwnProperty(d)) {
                        //console.log(singles, d);
                        singles[d] = { group : group(g[0]), x : d, y : 0 }
                    }
                })

                return d3.values(singles);
            })
            .map(data)

        return d3.values(groups).map(function(d){ return d.sort(function(a,b){ return a.x - b.x; }) });

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

    var offset = chart.list()
        .title("Offset")
        .values(['silhouette','wiggle','expand','zero'])
        .defaultValue('silhouette')

    var curve = chart.list()
        .title("Interpolation")
        .values(['Sankey curves','Linear','Basis spline'])
        .defaultValue('Sankey curves')

    var showLabels = chart.checkbox()
        .title("Show labels")
        .defaultValue(true)

    var colors = chart.color()
        .title("Color scale")

    chart.draw(function (selection, data){

        var g = selection
            .attr("width", +width() )
            .attr("height", +height() )
            .append("g")

        var curves = {
          'Basis spline' : 'basis',
          'Sankey curves' : interpolate,
          'Linear' : 'linear',
        }

        var stack = d3.layout.stack()
            .offset(offset());

        var layers = stack(data);

        var x = date.type() == "Date"
            // Date
            ? d3.time.scale()
                .domain( [ d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.x; }); }), d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.x; }); }) ])
                .range([0, +width()])
            : date && date.type() == "String"
              // String
              ? d3.scale.ordinal()
                  .domain(layers[0].map(function(d){ return d.x; }) )
                  .rangePoints([0, +width()],0)
              // Number
              : d3.scale.linear()
                  .domain( [ d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.x; }); }), d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.x; }); }) ])
                  .range([0, +width()]);

        var y = d3.scale.linear()
            .domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
            .range([+height()-20, 0]);

        var xAxis = d3.svg.axis().scale(x).tickSize(-height()+20).orient("bottom")//.tickFormat(d3.format("d"))

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
            .interpolate(curves[curve()])
            .x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        var line = d3.svg.line()
            .interpolate(curves[curve()])
            .x(function(d) { return x(d.x); })
            .y(function(d) {
                var y0 = y(d.y0), y1 = y(d.y0 + d.y);
                return y0 + (y1 - y0) * 0.5;
            });


        g.selectAll("path.layer")
            .data(layers)
            .enter().append("path")
                .attr("class","layer")
                .attr("d", area)
                .attr("title", function (d){ return d[0].group; })
                .style("fill", function (d) { return colors()(d[0].group); });

        if (!showLabels()) return;

        g.append('defs');

        g.select('defs')
            .selectAll('path')
            .data(layers)
            .enter().append('path')
            .attr('id', function(d,i) { return 'path-' + i; })
            .attr('d', line);

        g.selectAll("text.label")
            .data(layers)
            .enter().append('text')
            .attr('dy', '0.5ex')
            .attr("class","label")
           .append('textPath')
            .attr('xlink:xlink:href', function(d,i) { return '#path-' + i; })
            .attr('startOffset', function(d) {
                var maxYr = 0, maxV = 0;
                d3.range(layers[0].length).forEach(function(i) {
                    if (d[i].y > maxV) {
                        maxV = d[i].y;
                        maxYr = i;
                    }
                });
                d.maxVal = d[maxYr].y;
                d.offset = Math.round(x(d[maxYr].x) / x.range()[1] * 100);
                return Math.min(95, Math.max(5, d.offset))+'%';
            })
            .attr('text-anchor', function(d) {
                return d.offset > 90 ? 'end' : d.offset < 10 ? 'start' : 'middle';
            })
            .text(function(d){ return d[0].group; })
            .style("font-size","11px")
            .style("font-family","Arial, Helvetica")
            .style("font-weight","normal")

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

        function interpolate(points) {
          var x0 = points[0][0], y0 = points[0][1], x1, y1, x2,
              path = [x0, ",", y0],
              i = 0,
              n = points.length;

          while (++i < n) {
            x1 = points[i][0], y1 = points[i][1], x2 = (x0 + x1) / 2;
            path.push("C", x2, ",", y0, " ", x2, ",", y1, " ", x1, ",", y1);
            x0 = x1, y0 = y1;
          }
          return path.join("");
        }

    })

})();
