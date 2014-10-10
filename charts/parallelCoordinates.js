(function(){

    var model = raw.model();

    var list = model.dimension()
        .title('Dimensions')
        .multiple(true)
        .types(Number)
        .required(2);

    var color = model.dimension()
        .title("Color")

    model.map(function (data){
        if (!list()) return;
        return data.map(function (d){
            var obj = { dimensions: {}, color: color(d) };
            list().forEach(function (l){
                obj.dimensions[l] = d[l];
            })
            return obj;
        })
    })

    var chart = raw.chart()
        .title('Parallel Coordinates')
        .description(
            "Parallel coordinates is a common way of visualizing high-dimensional geometry and analyzing multivariate data.To show a set of points in an n-dimensional space, a backdrop is drawn consisting of n parallel lines, typically vertical and equally spaced. A point in n-dimensional space is represented as a polyline with vertices on the parallel axes; the position of the vertex on the ith axis corresponds to the ith coordinate of the point. <br/>Based on <a href='http://bl.ocks.org/jasondavies/1341281'>http://bl.ocks.org/jasondavies/1341281</a>")
        .thumbnail("imgs/parallelCoordinates.png")
        .category('Distributions')
        .model(model)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    var colors = chart.color()
        .title("Color scale")

    chart.draw(function (selection, data){

        var m = [30, 40, 10, 40],
            w = +width() - m[1] - m[3],
            h = +height() - m[0] - m[2];

        var x = d3.scale.ordinal().rangePoints([0, w], 0),
            y = {},
            dragging = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

        var svg = selection
            .attr("width", +width())
            .attr("height", +height())
            .append("g")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .style("font-size","10px")
                .style("font-family","Arial, Helvetica")
                    .append("svg:g")    
                        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        x.domain(dimensions = d3.keys(data[0].dimensions).filter(function (d) {
          return d != "name" && (y[d] = d3.scale.linear()
              .domain(d3.extent(data, function(p) { return +p.dimensions[d]; }))
              .range([h, 0]));
        }));

        colors.domain(data, function (d){ return d.color; });

        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
                .enter().append("svg:path")
                    .style('fill','none')
                    .style('stroke', function (d){ return colors()(d.color); })
                    .style('stroke-opacity','.4')
                    .attr("d", path);

        var g = svg.selectAll(".dim")
            .data(dimensions)
            .enter().append("svg:g")
                .attr("class", "dim")
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

        g.append("svg:g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("svg:text")
                .attr("text-anchor", "middle")
                .style("font-size","10px")
                .style("font-family","Arial, Helvetica")
                .attr("y", -9)
                .text(String);

        d3.selectAll('text')
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")

        d3.selectAll(".axis line, .axis path")
            .style('fill', 'none')
            .style('stroke', '#000')
            .style('stroke-width', '1px')
            .style('shape-rendering','crispEdges')

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function path(d) {
            return line(dimensions.map(function(p) { return [position(p), y[p](d.dimensions[p])]; }));
        }

    });

})();