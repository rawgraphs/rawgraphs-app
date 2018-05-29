(function() {

    var tree = raw.models.tree();

    var chart = raw.chart()
        .title('Sunburst')
        .description("A sunburst is similar to the treemap, except it uses a radial layout. The root node of the tree is at the center, with leaves on the circumference. The area (or angle, depending on implementation) of each arc corresponds to its value.<br/>Based on <a href='http://bl.ocks.org/mbostock/4063423'>http://bl.ocks.org/mbostock/4063423</a>")
        .thumbnail("imgs/sunburst.png")
        .category('Hierarchy (weighted)')
        .model(tree);

    var diameter = chart.number()
        .title('Diameter')
        .defaultValue(600)
        .fitToWidth(true);

    var colors = chart.color()
        .title("Color scale");

    chart.draw((selection, data) => {

        var radius = +diameter() / 2;

        var root = d3.hierarchy(data);
        root.sum(d => {
            return d.size;
        });

        var layout = d3.partition();

        var x = d3.scaleLinear()
            .range([0, 2 * Math.PI]);

        var y = d3.scaleSqrt()
            .range([0, radius]);

        var arc = d3.arc()
            .startAngle(d => {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
            })
            .endAngle(d => {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
            })
            .innerRadius(d => {
                return Math.max(0, y(d.y0));
            })
            .outerRadius(d => {
                return Math.max(0, y(d.y1));
            });

        var format = d3.format(",d");

        var g = selection
            .attr("width", +diameter())
            .attr("height", +diameter())
            .append("g")
            .attr("transform", `translate(${(+diameter() / 2)}, ${(+diameter() / 2)})`);

        var nodes = layout(root).descendants();

        colors.domain(nodes, d => {
            return seek(d);
        });

        var slicesGroups = g.selectAll("g")
            .data(nodes)
            .enter().append("g")
            .attr("display", d => {
                return d.depth ? null : "none";
            }); // hide inner ring

        slicesGroups.append("path")
            .attr("d", arc)
            .style("stroke", "#fff")
            .style("fill", d => {
                return colors()(seek(d));
            })
            .style("fill-rule", "evenodd");

        slicesGroups.append("text")
            .attr("transform", d => {
                var ang = ((x((d.x0 + d.x1) / 2) - Math.PI / 2) / Math.PI * 180);
                d.textAngle = (ang > 90) ? 180 + ang : ang;
                return 'translate(' + arc.centroid(d) + ')rotate(' + d.textAngle + ')';
            })
			.attr('text-anchor', 'middle')
            .attr("dx", "6")
            .attr("dy", ".35em")
            .style("font-size", "11px")
            .style("font-family", "Arial, Helvetica")
            .text(d => {
                return d.data.label ? d.data.label.join(", ") : d.data.name;
            });

        slicesGroups.append("title")
            .text(d => {
                var size = d.data.size ? format(d.data.size) : "none";
                return d.data.name + ": " + size;
            });

        function seek(d) {
            if (d.children) return seek(d.children[0]);
            else return d.data.color;
        }

    })
})();
