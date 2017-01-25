! function () {

    var model = raw.model();

    var group = model.dimension()
        .title('Group');

    var date = model.dimension()
        .title('Date')
        .types(Date)
        .required(true);

    var size = model.dimension()
        .title('Size')
        .types(Number)
        .required(true);

    model.map(function (data) {

        var nest = d3.nest()
            .key(group)
            .rollup(function (g) {
                return g.map(function (d) {
                    return [new Date(date(d)), +size(d)]
                }).sort( function(a,b){return a[0] - b[0]}) //sort temporally
            })
            .entries(data)

        return nest;

    })

    var chart = raw.chart()
        .model(model)
        .title('Horizon graph')
        .thumbnail("imgs/horizon.png")
        .description("Horizon charts combine position and color to reduce vertical space.<br/><br/>Based on <a href='http://bl.ocks.org/mbostock/1483226'>http://bl.ocks.org/mbostock/1483226</a>")
        .category('Time series')

    var width = chart.number()
        .title('Width')
        .defaultValue(800)

    var height = chart.number()
        .title('Height')
        .defaultValue(600)

    var padding = chart.number()
        .title('Padding')
        .defaultValue(10)

    var scale = chart.checkbox()
        .title("Use same scale")
        .defaultValue(false)

    var bands = chart.number()
        .title('Bands')
        .defaultValue(4)

    var curve = chart.list()
        .title("Interpolation")
        .values(['Basis spline', 'Sankey', 'Linear'])
        .defaultValue('Basis spline')

    var mode = chart.list()
        .title("Mode")
        .values(['Mirror', 'Offset'])
        .defaultValue('Mirror')
    
    var sorting = chart.list()
        .title("Sort by")
        .values(['Original','Total (descending)', 'Total (ascending)', 'Name'])
        .defaultValue('Original')

    chart.draw(function (selection, data) {

        //sort data
        function sortBy(a,b){
            if (sorting() == 'Total (descending)'){                
                return b.values.reduce(function (c,d) {return c + d[1]}, 0) - a.values.reduce(function (c,d) {return c + d[1]}, 0)
            }
            if (sorting() == 'Total (ascending)') return a.values.reduce(function (c,d) {return c + d[1]}, 0) - b.values.reduce(function (c,d) {return c + d[1]}, 0);
            if (sorting() == 'Name'){
                if(a.key < b.key) return -1;
                if(a.key > b.key) return 1;
            }
        }
        
        data.sort(sortBy);

        var curves = {
            'Basis spline': 'basis',
            'Sankey': interpolate,
            'Linear': 'linear'
        }

        var modes = {
            'Mirror': 'mirror',
            'Offset': 'offset'
        }

        var h = (+height() - 15 - (+padding() * (data.length - 1))) / data.length;

        //draw scale
        var x = d3.time.scale()
            .range([0, +width()]);


        x.domain([
            d3.min(data, function (layer) {
                return d3.min(layer.values, function (d) {
                    return d[0];
                });
            }),
            d3.max(data, function (layer) {
                return d3.max(layer.values, function (d) {
                    return d[0];
                });
            })
        ])

        var xAxis = d3.svg.axis().scale(x).tickSize(-height() + 15).orient("bottom");

        var horizon = d3.horizon()
            .scale(scale() ? "global" : "local")
            .width(+width())
            .height(h)
            .bands(+bands())
            .mode(modes[mode()])
            .interpolate(curves[curve()])

        selection
            .attr('width', +width())
            .attr('height', +height());


        selection.append("g")
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


        var g = selection
            .selectAll('g.horizon')
            .data(data)
            .enter().append('g')
            .attr("transform", function (d, i) {
                return 'translate(0,' + (h + padding()) * i + ')'
            })

        g.selectAll('g.horizon')
            .data(function (d) {
                return [d.values];
            })
            .enter().append('g')
            .call(horizon);

        g.append("text")
            .attr("x", +width() - 6)
            .attr("y", h - 6)
            .style("font-size", "11px")
            .style("font-family", "Arial, Helvetica")
            .style("text-anchor", "end")
            .text(function (d) {
                return d.key;
            });


        function interpolate(points) {
            var x0 = points[0][0],
                y0 = points[0][1],
                x1, y1, x2,
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

}();