(function() {

    var model = raw.model();

    var mx = model.dimension()
        .title("X Axis")
        .types(Number, Date)
        .accessor(function(d) {
            return this.type() == "Date" ? new Date(d) : +d;
        })
        .required(1);

    var my = model.dimension()
        .title("Y Axis")
        .types(Number, Date)
        .accessor(function(d) {
            return this.type() == "Date" ? new Date(d) : +d;
        })
        .required(1);

    var mlabel = model.dimension()
        .title('label')

    var mgroup = model.dimension().title('Group')

    model.map(data => {

        var nest = d3.nest()
            .key(mgroup)
            .rollup(g => {
                return g.map(d => {
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

    //left margin
    var marginLeft = chart.number()
        .title('Left Margin')
        .defaultValue(40)

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

    chart.draw((selection, data) => {

        var xmin = d3.min(data, layer => {
            return d3.min(layer.value, d => {
                return d.x;
            });
        });
        var xmax = d3.max(data, layer => {
            return d3.max(layer.value, d => {
                return d.x;
            });
        });
        var ymin = d3.min(data, layer => {
            return d3.min(layer.value, d => {
                return d.y;
            });
        });
        var ymax = d3.max(data, layer => {
            return d3.max(layer.value, d => {
                return d.y;
            });
        })

        //define margins
        var margin = {
            top: 0,
            right: 0,
            bottom: 15,
            left: marginLeft()
        };

        var w = +width() - stroke() - margin.left;
        var h = +height() - stroke() - margin.bottom;

        var x = d3.scaleLinear().range([0, w]),
            y = d3.scaleLinear().range([h, 0]);


        //set domain according to "origin" variable

        if (useZero()) {
            x.domain([0, xmax]);
            y.domain([0, ymax]);
        } else {
            x.domain([xmin, xmax]);
            y.domain([ymin, ymax]);
        }

        //define colors
        colors.domain(data, layer => {
            return layer.key;
        });

        //@TODO: add x and y axes (copy from scatterPlot.js)

        var xAxis = d3.axisBottom(x).tickSize(-h);
        var yAxis = d3.axisLeft(y).tickSize(-w);

        var svg = selection
            .attr("width", +width())
            .attr("height", +height())

        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .attr("transform", `translate(${stroke() / 2 + margin.left}, ${height() - stroke() / 2 - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .attr("transform", `translate(${stroke() / 2 + margin.left}, ${stroke() / 2})`)
            .call(yAxis);

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#ccc")


        //for each group...
        data.forEach(layer => {

            var vertices = layer.value.map(d => {
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
                .attr("transform", `translate(${stroke() / 2 + margin.left}, ${stroke() / 2})`)

            var gcolor = colors()(layer.key);

            g.append("path")
                .datum(d3.polygonHull(vertices))
                .style("fill", gcolor)
                .style("opacity", 0.3)
                .style("stroke", gcolor)
                .style("stroke-width", +stroke())
                .style("stroke-linejoin", "round")
                .attr("d", d => {
                    return "M" + d.join("L") + "Z";
                });

            g.selectAll("circle")
                .data(vertices)
                .enter().append("circle")
                .style("fill", gcolor)
                .attr("r", dotRadius() / 2)
                .attr("transform", d => {
                    return `translate(${d})`;
                })
        })

        // now, add label above all
        if (mlabel() != null) {
            var txt_group = svg.append('g')
                .attr("transform", `translate(${stroke() / 2 + margin.left}, ${stroke() / 2})`)

            data.forEach(layer => {

                layer.value.forEach(item => {
                    txt_group.append("text")
                        .attr("transform", `translate(${x(item.x)}, ${y(item.y)})`)
                        .attr("text-anchor", "middle")
                        .style("font-size", "10px")
                        .style("font-family", "Arial, Helvetica")
                        .text(item.label)
                })
            });
        }
    })
})();
