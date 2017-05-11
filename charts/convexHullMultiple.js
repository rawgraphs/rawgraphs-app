(function () {

    var model = raw.model();

    var mx = model.dimension()
        .title("X Axis")
        .types(Number, Date)
        .accessor(function (d) {
            return this.type() == "Date" ? new Date(d) : +d;
        })
        .required(1);

    var my = model.dimension()
        .title("Y Axis")
        .types(Number, Date)
        .accessor(function (d) {
            return this.type() == "Date" ? new Date(d) : +d;
        })
        .required(1);

    var mlabel = model.dimension()
        .title('label')

    var mgroup = model.dimension().title('Group')

    model.map(function (data) {

        var nest = d3.nest()
            .key(mgroup)
            .rollup(function (g) {
                return g.map(function (d) {
                    return {
                        group: mgroup(d),
                        y: my(d),
                        x: mx(d),
                        label: mlabel(d)
                    };
                })
            })
            .entries(data)

        return nest;

    })


    var chart = raw.chart()
        .title('Convex Hull')
        .description(
            "In mathematics, the <a href='https://en.wikipedia.org/wiki/Convex_hull'>convex hull</a> is the smallest convex shape containing a set of points. Applied to a scatterplot, it is useful to identify points belonging to the same category.<br /> <br/>Based on <a href='http://bl.ocks.org/mbostock/4341699'>http://bl.ocks.org/mbostock/4341699</a>")
        .thumbnail("imgs/multipleConvexHull.png")
        .model(model)
        .category('Dispersion')


    var width = chart.number()
        .title("Width")
        .defaultValue(800)
        .fitToWidth(true);

    var height = chart.number()
        .title("Height")
        .defaultValue(600);

    var dotRadius = chart.number()
        .title("Dots Diameter")
        .defaultValue(6);

    var useZero = chart.checkbox()
        .title("set origin at (0,0)")
        .defaultValue(false);

    var stroke = chart.number()
        .title("Stroke Width")
        .defaultValue(32);

    var colors = chart.color()
        .title("Color scale");

    chart.draw(function (selection, data) {

        var xmin = d3.min(data, function (layer) {
            return d3.min(layer.values, function (d) {
                return d.x;
            });
        });
        var xmax = d3.max(data, function (layer) {
            return d3.max(layer.values, function (d) {
                return d.x;
            });
        });
        var ymin = d3.min(data, function (layer) {
            return d3.min(layer.values, function (d) {
                return d.y;
            });
        });
        var ymax = d3.max(data, function (layer) {
            return d3.max(layer.values, function (d) {
                return d.y;
            });
        })

        //define the drawing space
        var bottomPadding = 15;
        //magic formula, no idea why it works. Anyway it defines the max length of the labels string.
        var leftPadding = ((Math.log(ymax) / 2.302585092994046) + 1) * 9;

        var w = +width() - stroke() - leftPadding;
        var h = +height() - stroke() - bottomPadding;

        var x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([h, 0]);


        //set domain according to "origin" variable

        if (useZero()) {
            x.domain([0, xmax]);
            y.domain([0, ymax]);
        } else {
            x.domain([xmin, xmax]);
            y.domain([ymin, ymax]);
        }

        //define colors
        colors.domain(data, function (layer) {
            return layer.key;
        });

        //@TODO: add x and y axes (copy from scatterPlot.js)

        var xAxis = d3.svg.axis().scale(x).tickSize(-h).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).tickSize(-w).orient("left");

        var svg = selection
            .attr("width", +width())
            .attr("height", +height())


        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .attr("transform", "translate(" + (stroke() / 2 + leftPadding) + "," + (height() - stroke() / 2 - bottomPadding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .attr("transform", "translate(" + (stroke() / 2 + leftPadding) + "," + stroke() / 2 + ")")
            .call(yAxis);

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#ccc")


        //for each group...
        data.forEach(function (layer) {

            var vertices = layer.values.map(function (d) {
                
                return [x(d.x), y(d.y)]
            })

            //assure that there are at least 4 vertices (required by convex hull)
            //add 0.01 to slightly move from position (otherwise convex hull won't work)
            //dirty but working.
            while (vertices.length < 3) {
                vertices.push([vertices[0][0] + 0.01, vertices[0][1] + 0.01]);
            }

            var g = svg.append("g")
                .attr("id", layer.key)
                .attr("transform", "translate(" + (stroke() / 2 + leftPadding) + "," + stroke() / 2 + ")")

            var gcolor = colors()(layer.key);

            g.append("path")
                .datum(d3.geom.hull(vertices))
                .style("fill", gcolor)
                .style("opacity", 0.3)
                .style("stroke", gcolor)
                .style("stroke-width", +stroke())
                .style("stroke-linejoin", "round")
                .attr("d", function (d) {
                    return "M" + d.join("L") + "Z";
                });

            g.selectAll("circle")
                .data(vertices)
                .enter().append("circle")
                .style("fill", gcolor)
                .attr("r", dotRadius() / 2)
                .attr("transform", function (d) {
                    return "translate(" + d + ")";
                })
        })
        
        // now, add label above all
        if(mlabel() != null) {
            var txt_group = svg.append('g')
                                .attr("transform", "translate(" + (stroke() / 2 + leftPadding) + "," + stroke() / 2 + ")");
            
            data.forEach(function (layer) {

                layer.values.forEach(function(item){
                    txt_group.append("text")
                        .attr("transform", "translate(" + x(item.x) +"," + y(item.y) + ")")
                        .attr("text-anchor", "middle")
                        .style("font-size","10px")
                        .style("font-family","Arial, Helvetica")
                        .text(item.label)

                    console.log(item);
                })
            });
        }
    })
})();