(function() {

    var model = raw.model();

    var group = model.dimension()
        .title('Group')
        .types(String)

    var values = model.dimension()
        .title('Size')
        .types(Number)
        .required(1)

    var colorsDimension = model.dimension()
        .title('Colors')
        .types(Number, String)

    model.map(function(data) {

        var remap = data.map(function(d){
            return {
                group: group(d),
                value: +values(d),
                color: colorsDimension(d)
            }
        })

        var nest = d3.nest()
            .key(function(d) {
                return d.group
            })
            .entries(remap)
        return nest

    })

    var chart = raw.chart()
        .title("Box plot")
        .description("A box-and-whisker plot uses simple glyphs that summarize a quantitative distribution with five standard statistics: the smallest value, lower quartile, median, upper quartile, and largest value.<br>Based on <a href='https://bl.ocks.org/mbostock/4061502'>https://bl.ocks.org/mbostock/4061502</a>")
        .thumbnail("imgs/boxplot.png")
        .category('Distribution')
        .model(model)

    var width = chart.number()
        .title('Width')
        .defaultValue(900)

    var height = chart.number()
        .title('Height')
        .defaultValue(600)

    var marginLeft = chart.number()
        .title('Left margin')
        .defaultValue(60)

    var barWidth = chart.number()
        .title('Bars width')
        .defaultValue(20)

    var iqrValue = chart.number()
        .title('Interquartile range (IQR)')
        .defaultValue(1.5)

    var colors = chart.color()
    	.title("Color scale")


    chart.draw(function(selection, data) {


        var chartMargin = {
                top: 20,
                right: 20,
                bottom: 20,
                left: marginLeft()
            },
            chartWidth = width() - chartMargin.left - chartMargin.right,
            chartHeight = height() - chartMargin.top - chartMargin.bottom;

        var boxplot = d3.box()
            .whiskers(iqr(iqrValue()))
            .height(chartHeight);

        var container = selection
            .attr("width", chartWidth + chartMargin.left + chartMargin.right)
            .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")")

        var max = d3.max(data, function(d) {
            return d3.max(d.values, function(e) {
                return e.value
            });
        });

        var min = d3.min(data, function(d) {
            return d3.min(d.values, function(e) {
                return e.value
            });
        });

        boxplot.domain([min, max]);

        var x = d3.scaleBand()
            .domain(data.map(function(d) {
                return d.key
            }))
            .rangeRound([0, chartWidth]);

        var xAxis = d3.axisBottom(x)

        var y = d3.scaleLinear()
            .domain([min, max])
            .range([chartHeight, 0]);

        var yAxis = d3.axisLeft(y)

        // draw axis
        container.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis)

        container.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .call(yAxis)

        var boxdata = data.map(function(d) {
            var output = d.values.map(function(e) {
                return e.value
            })
            return {
                key: d.key,
                color: d.values[0].color,
                values: output
            }
        })

        //define colors
        colors.domain(boxdata, function(d){
    		return d.color;
    	});

        var gplot = container.selectAll(".box")
            .data(boxdata)

        var xoffset = x.bandwidth()/2 - barWidth()/2;

        gplot
            .enter().append("g")
            .attr("class", "box")
            .attr("transform", function(d) {
                return "translate(" + (xoffset + x(d.key)) + ",0)";
            })
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .style("fill", function(d){ return colors() ? colors()(d.color) : "#eee";})
            .call(function(d) {
                var data = d.data();
                data = data.map(function(e) {
                    return e.values
                })
                d.data(data);
                boxplot.width(barWidth())(d);
            });

        //styling


        d3.selectAll('.box line, .box rect')
            .style("stroke", "#000")

        d3.selectAll('.box circle')
            .style("stroke", "#ccc")

        d3.selectAll('.box text')
            .style("fill", "#000")

        d3.selectAll('.box .center')
            .style('stroke-dasharray', '3,3')

        d3.selectAll('.box .outlier')
            .style('fill', 'none')

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#ccc")

        function iqr(k) {
            return function(d, i) {
                var q1 = d.quartiles[0],
                    q3 = d.quartiles[2],
                    iqr = (q3 - q1) * k,
                    i = -1,
                    j = d.length;
                while (d[++i] < q1 - iqr);
                while (d[--j] > q3 + iqr);
                return [i, j];
            };
        }

    })
})();
