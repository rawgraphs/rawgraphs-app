(function() {

    var points = raw.models.points();

    var chart = raw.chart()
        .title('Scatter Plot')
        .description(
            "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
        .thumbnail("imgs/scatterPlot.png")
        .category('Dispersion')
        .model(points);

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true);

    var height = chart.number()
        .title("Height")
        .defaultValue(500);

    //left margin
    var marginLeft = chart.number()
        .title('Left Margin')
        .defaultValue(40)

    var maxRadius = chart.number()
        .title("max radius")
        .defaultValue(20);

    var useZero = chart.checkbox()
        .title("set origin at (0,0)")
        .defaultValue(false);

    var colors = chart.color()
        .title("Color scale");

    var showPoints = chart.checkbox()
        .title("show points")
        .defaultValue(true);

    chart.draw((selection, data) => {

        // Retrieving dimensions from model
        var x = points.dimensions().get('x'),
            y = points.dimensions().get('y');

        //define margins
        var margin = {
            top: +maxRadius(),
            right: +maxRadius(),
            bottom: 20 + maxRadius(),
            left: marginLeft()
        };

        var w = width() - margin.left - margin.right,
            h = height() - margin.bottom - margin.top;

        var g = selection
            .attr("width", +width())
            .attr("height", +height())
            .append("g")
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

        var xExtent = !useZero() ? d3.extent(data, d => {
                return d.x;
            }) : [0, d3.max(data, d => {
                return d.x;
            })],
            yExtent = !useZero() ? d3.extent(data, d => {
                return d.y;
            }) : [0, d3.max(data, d => {
                return d.y;
            })];

        var xScale = x.type() == "Date" ?
            d3.scaleTime().range([0, w]).domain(xExtent) :
            d3.scaleLinear().range([0, w]).domain(xExtent),
            yScale = y.type() == "Date" ?
            d3.scaleTime().range([h, 0]).domain(yExtent) :
            d3.scaleLinear().range([h, 0]).domain(yExtent),
            sizeScale = d3.scaleSqrt().range([1, +maxRadius()])
                .domain([0, d3.max(data, d => {
                    return d.size;
                })]),
            xAxis = d3.axisBottom(xScale).tickSize(-h) //.tickSubdivide(true),
        yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-w);

        g.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            //.attr("transform", `translate(0, ${h - maxRadius()})`)
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);

        g.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            //.attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#ccc");

        var circle = g.selectAll("g.circle")
            .data(data)
            .enter().append("g")
            .attr("class", "circle");

        var point = g.selectAll("g.point")
            .data(data)
            .enter().append("g")
            .attr("class", "point")

        colors.domain(data, d => {
            return d.color;
        });

        circle.append("circle")
            .style("fill", d => {
                return colors() ? colors()(d.color) : "#eeeeee";
            })
            .style("fill-opacity", .9)
            .attr("transform", d => {
                return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
            })
            .attr("r", d => {
                return sizeScale(d.size);
            });

        point.append("circle")
            .filter(d => {
                return showPoints();
            })
            .style("fill", "#000")
            .attr("transform", d => {
                return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
            })
            .attr("r", 1);

        circle.append("text")
            .attr("transform", d => {
                return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
            })
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .attr("dy", 15)
            .style("font-family", "Arial, Helvetica")
            .text(d => {
                return d.label ? d.label.join(", ") : "";
            });

    })

})();
