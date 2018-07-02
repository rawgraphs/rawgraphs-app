(function() {

    var graph = raw.models.graph();

    var chart = raw.chart()
        .title('Alluvial Diagram')
        .description(
            "Alluvial diagrams allow to represent flows and to see correlations between categorical dimensions, visually linking to the number of elements sharing the same categories. It is useful to see the evolution of cluster (such as the number of people belonging to a specific group). It can also be used to represent bipartite graphs, using each node group as dimensions.<br/>Mainly based on DensityDesign's work with Fineo, it is inspired by <a href='https://bl.ocks.org/mbostock/ca9a0bb7ba204d12974bca90acc507c0'>https://bl.ocks.org/mbostock/ca9a0bb7ba204d12974bca90acc507c0</a>")
        .thumbnail("imgs/alluvial.png")
        .category("Multi categorical")
        .model(graph);

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true);

    var height = chart.number()
        .title("Height")
        .defaultValue(500);

    var nodeWidth = chart.number()
        .title("Node Width")
        .defaultValue(5);

    var opacity = chart.number()
        .title("Links opacity")
        .defaultValue(.4);

    var sortBy = chart.list()
        .title("Sort by")
        .values(['size', 'name', 'automatic'])
        .defaultValue('size');

    var colors = chart.color()
        .title("Color scale");

    chart.draw((selection, data) => {

        // get the drawing area
        var g = selection
            .attr("width", +width())
            .attr("height", +height() + 20)
            .append("g")
            .attr("transform", "translate(0, 10)");

        // define numbers formatting
        var formatNumber = d3.format(",.0f"),
            format = function(d) {
                return formatNumber(d);
            };

        // Calculating the best nodePadding (TODO: improve)
        var nested = d3.nest()
            .key(function(d) {
                return d.group;
            })
            .rollup(function(d) {
                return d.length;
            })
            .entries(data.nodes);

        var maxNodes = d3.max(nested, function(d) {
            return d.values;
        });
        var bestPadding = d3.min([10, (height() - maxNodes) / maxNodes])

        // create sankey object
        var sankey = d3.sankey()
            .nodeWidth(+nodeWidth())
            .nodePadding(bestPadding)
            .size([+width(), +height()]);

        // use the loaded data
        sankey(data);

        // define colors
        colors.domain(data.links, function(d) {
            return d.source.group + " - " + d.source.name;
        });

        // add values to nodes
        data.nodes.forEach(function(d) {
            // get height for each node
            d.dx = d.x1 - d.x0;
            d.dy = d.y1 - d.y0;
            // check if the name is a number

            if (!isNaN(+d.name)) {
                d.name = +d.name;
            }
        })

        // Re-sorting nodes
        var nested = d3.nest()
            .key(function(d) {
                return d.group;
            })
            .entries(data.nodes)

        nested
            .forEach(function(d) {

                var y = (height() - d3.sum(d.values, function(n) {
                    return n.dy + sankey.nodePadding();
                })) / 2 + sankey.nodePadding() / 2;

                d.values.sort(function(a, b) {
                    if (sortBy() == "automatic") return b.y0 - a.y0;
                    if (sortBy() == "size") return b.dy - a.dy;
                    //if (sortBy() == "name") return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                    if (sortBy() == "name") {
                        var a1 = typeof a.name,
                            b1 = typeof b.name;
                        return a1 < b1 ? -1 : a1 > b1 ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                    }
                })

                d.values.forEach(function(node) {
                    node.y0 = y;
                    y += node.dy + sankey.nodePadding();
                })
            })

        // Resorting links

        nested.forEach(function(d) {

            d.values.forEach(function(node) {

                var ly = node.y0;

                node.sourceLinks
                    .sort(function(a, b) {
                        return a.target.y0 - b.target.y0;
                    })
                    .forEach(function(link) {
                        link.y0 = ly + link.width / 2;
                        ly += link.width;
                    })

                ly = node.y0;

                node.targetLinks
                    .sort(function(a, b) {
                        return a.source.y0 - b.source.y0;
                    })
                    .forEach(function(link) {
                        link.y1 = ly + link.width / 2;
                        ly += link.width;
                    })
            })
        })

        //prepare link
        var link = g.append("g")
            .attr("class", "links")
            .attr("fill", "none")
            .attr("stroke-opacity", +opacity())
            .selectAll("path")
            .data(data.links)
            .enter().append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .style("stroke", function(d) {
                return colors()(d.source.group + " - " + d.source.name);
            })
            .attr("stroke-width", function(d) {
                return d.width;
            });


        //prepare node
        var node = g.append("g")
            .attr("class", "nodes")
            .attr("font-family", "Arial, Helvetica")
            .attr("font-size", 10)
            .selectAll("g")
            .data(data.nodes)
            .enter().append("g");

        //add rectangle
        node.append("rect")
            .attr("x", function(d) {
                return d.x0;
            })
            .attr("y", function(d) {
                return d.y0;
            })
            .attr("height", function(d) {
                return d.dy;
            })
            .attr("width", function(d) {
                return d.dx;
            })
            .attr("fill", function(d) {
                return '#000'
            });


        //add labels
        node.append("text")
            .attr("x", function(d) {
                return d.x0 - 6;
            })
            .attr("y", function(d) {
                return d.y0 + d.dy / 2;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) {
                return d.name;
            })
            .filter(function(d) {
                return d.x0 < nodeWidth()
            })
            .attr("x", function(d) {
                return d.x1 + 6;
            })
            .attr("text-anchor", "start");
    })

})();
