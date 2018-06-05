(function() {

    // A multiple bar chart

    // The Model
    // The model abstraction is a matrix of categories: the main dimansion will define the groups,
    // and the secondary will define the single bars.
    // Optional dimension is on the bar chart color (to be defined).

    var model = raw.model();

    // Categories dimension. each category will define a bar
    // It can accept both numbers and strings
    var categories = model.dimension()
        .title('X Axis')
        .types(Number, String)
        .required(true)
    // Values dimension. It will define the height of the bars
    var sizes = model.dimension()
        .title('Height')
        .types(Number)

    // Group dimension.
    // It can accept both numbers and strings
    var groups = model.dimension()
        .title('Groups')
        .types(Number, String)


    // Colors dimension. It will define the color of the bars
    var colorsDimesion = model.dimension()
        .title('Colors')
        .types(String)

    // Mapping function
    // For each record in the data returns the values
    // for the X and Y dimensions and casts them as numbers
    model.map(function(data) {

        var results = d3.nest()
            .key(function(d) {
                return d[groups()]
            })
            .key(function(d) {
                return d[categories()]
            })
            .rollup(function(v) {
                return {
                    size: !sizes() ? v.length : d3.sum(v, function(e) {
                        return e[sizes()]
                    }),
                    category: categories(v[0]),
                    group: groups(v[0]),
                    color: colorsDimesion(v[0])
                }
            })
            .entries(data)

        // remap the array
        results.forEach(function(d) {
            d.values = d.values.map(function(item) {
                return item.value
            })
        })

        return results;
    })


    // The Chart

    var chart = raw.chart()
        .title("Bar chart")
        .description("A bar chart or bar graph is a chart or graph that presents grouped data with rectangular bars with heights proportional to the values that they represent.</br> Chart based on <a href='https://bl.ocks.org/mbostock/3310560'>https://bl.ocks.org/mbostock/3310560</a>")
        .thumbnail("imgs/barChart.png")
        .category('Other')
        .model(model)

    // visualiziation options
    // Width
    var width = chart.number()
        .title('Width')
        .defaultValue(800)

    // Height
    var height = chart.number()
        .title('Height')
        .defaultValue(600)

    //left margin
    var marginLeft = chart.number()
        .title('Left Margin')
        .defaultValue(40)

    // Space between barcharts
    var padding = chart.number()
        .title('Vertical padding')
        .defaultValue(0);

    // Padding between bars
    var xPadding = chart.number()
        .title('Horizontal padding')
        .defaultValue(0.1);

    // Use or not the same scale across all the bar charts
    var sameScale = chart.checkbox()
        .title("Use same scale")
        .defaultValue(false)

    // Chart colors
    var colors = chart.color()
        .title("Color scale")

    // Drawing function
    // selection represents the d3 selection (svg)
    // data is not the original set of records
    // but the result of the model map function
    chart.draw(function(selection, data) {

        // Define margins
        var margin = {
            top: 0,
            right: 0,
            bottom: 50,
            left: marginLeft()
        };
        //define title space
        var titleSpace = groups() == null ? 0 : 30;

        // Define common variables.
        // Find the overall maximum value
        var maxValue;

        if (sameScale()) {
            maxValue = d3.max(data, function(item) {
                return d3.max(item.values, function(d) {
                    return d.size;
                });
            })
        }

        // Check consistency among categories and colors, save them all
        var allCategories = [];
        var allColors = [];
        data.forEach(function(item) {

            var temp_categories = item.values.map(function(val) {
                return val.category;
            })
            allCategories = allCategories.concat(temp_categories);

            // Same for color
            var temp_colors = item.values.map(function(val) {
                return val.color;
            })
            allColors = allColors.concat(temp_colors);
        })
        //keep uniques
        allCategories = d3.set(allCategories).values();
        allColors = d3.set(allColors).values();

        // svg size
        selection
            .attr("width", width())
            .attr("height", height())

        // define single barchart height,
        // depending on the number of bar charts
        var w = +width() - margin.left,
            h = (+height() - margin.bottom - ((titleSpace + padding()) * (data.length - 1))) / data.length;


        // Define scales
        var xScale = d3.scaleBand()
            .rangeRound([0, w])
            .padding(+xPadding());

        var yScale = d3.scaleLinear()
            .range([h, 0]);

        // Define color scale domain
        colors.domain(allColors);

        // Draw each bar chart
        data.forEach(function(item, index) {

            // Define x domain
            xScale.domain(allCategories);
            // Define y domain
            if (sameScale()) {
                yScale.domain([0, maxValue]);
            } else {
                yScale.domain([0, d3.max(item.values, function(d) {
                    return d.size;
                })]);
            }

            // Append a grupo containing axis and bars,
            // move it according the index
            barchart = selection.append("g")
                .attr("transform", "translate(" + margin.left + "," + index * (h + padding() + titleSpace) + ")");

            // Draw title
            barchart.append("text")
                .attr("x", -margin.left)
                .attr("y", titleSpace - 7)
                .style("font-size", "10px")
                .style("font-family", "Arial, Helvetica")
                .text(item.key);

            // Draw y axis
            barchart.append("g")
                .attr("class", "y axis")
                .style("font-size", "10px")
                .style("font-family", "Arial, Helvetica")
                .attr("transform", "translate(0," + titleSpace + ")")
                .call(d3.axisLeft(yScale).ticks(h / 15));

            // Draw the bars
            barchart.selectAll(".bar")
                .data(item.values)
                .enter().append("rect")
                .attr("transform", "translate(0," + titleSpace + ")")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return xScale(d.category);
                })
                .attr("width", xScale.bandwidth())
                .attr("y", function(d) {
                    return yScale(d.size);
                })
                .attr("height", function(d) {
                    return h - yScale(d.size);
                })
                .style("fill", function(d) {
                    return colors()(d.color);
                });

        })

        // After all the charts, draw x axis
        selection.append("g")
            .attr("class", "x axis")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .attr("transform", "translate(" + margin.left + "," + ((h + padding() + titleSpace) * data.length - padding()) + ")")
            .call(d3.axisBottom(xScale));


        // Set styles

        d3.selectAll(".axis line, .axis path")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#ccc");

    })
})();
