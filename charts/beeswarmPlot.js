(function() {

    // A multiple beeswarm plot

    // The Model
    // The model abstraction is a matrix of categories: the main dimansion will define the groups,
    // and the secondary will define the single bars.
    // Optional dimension is on the bar chart color (to be defined).

    var model = raw.model();

    // Group dimension.
    // It can accept both numbers and strings
    var groups = model.dimension()
        .title('Groups')
        .types(Number, String)

    // values dimension. each category will define a bar
    // It can accept both numbers and strings
    var values = model.dimension()
        .title('X Axis')
        .types(Number, Date)
        .required(true)

    // Values dimension. It will define the height of the bars
    var radiuses = model.dimension()
        .title('Radius')

    // Colors dimension. It will define the color of the bubbles
    var colorsDimesion = model.dimension()
        .title('Colors')
        .types(Number, String)

    // Values dimension. It will define the height of the bars
    var labels = model.dimension()
        .title('Labels')

    model.map(function(data) {

        var results = d3.nest()
            .key(function(d) {
                return d[groups()]
            })
            .entries(data)

        // remap the array
        results.forEach(function(d) {
            d.values = d.values.map(function(g) {
                return {
                    group: g[groups()],
                    value: values.type() == 'Date' ? new Date(g[values()]) : +g[values()],
                    radius: radiuses() ? +g[radiuses()] : 1,
                    color: colorsDimesion() ? g[colorsDimesion()] : null,
                    label: g[labels()]
                }
            })
        })

        return results;
    })


    // The Chart
    var chart = raw.chart()
        .title('Beeswarm Plot')
        .description("It distributes elements horizontally avoiding overlap between them and according to a selected dimension.<br/><br/>Based on <a href='https://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320'>https://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320</a>")
        .thumbnail("imgs/beeswarm.png")
        .category('Distribution')
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

    // Spatialization iterations
    var anticollisionIterations = chart.number()
        .title('Anticollision iterations')
        .defaultValue(1);

    var marginCircles = chart.number()
        .title("Circles padding")
        .defaultValue(.5);

    // Space between barcharts
    var padding = chart.number()
        .title('Vertical padding')
        .defaultValue(0);

    var minRadius = chart.number()
        .title("min radius")
        .defaultValue(2);

    var maxRadius = chart.number()
        .title("max radius")
        .defaultValue(20);

    var sorting = chart.list()
        .title("Sort by")
        .values(['Original', 'Name (ascending)', 'Name (descending)', 'Total (descending)', 'Total (ascending)'])
        .defaultValue('Original')

    // Chart colors
    var colors = chart.color()
        .title("Color scale")

    // Drawing function
    // selection represents the d3 selection (svg)
    // data is not the original set of records
    // but the result of the model map function
    chart.draw(function(selection, data) {

        //sort data
        function sortBy(a, b) {
            if (sorting() == 'Name (descending)') {
                if (a.key < b.key) return 1;
                if (a.key > b.key) return -1;
                return 0;
            } else if (sorting() == 'Name (ascending)') {
                if (a.key < b.key) return -1;
                if (a.key > b.key) return 1;
                return 0;
            } else if (sorting() == 'Total (descending)') {
                if (a.values.length < b.values.length) return 1;
                if (a.values.length > b.values.length) return -1;
                return 0;
            } else if (sorting() == 'Total (ascending)') {
                if (a.values.length < b.values.length) return -1;
                if (a.values.length > b.values.length) return 1;
                return 0;
            }
        }
        data.sort(sortBy);

        // Define margins
        var margin = {
            top: 50,
            right: 25,
            bottom: 0,
            left: 25
        };

        //define title space
        var titleSpace = groups() == null ? 0 : 30;

        // Define common variables.

        // svg size
        selection
            .attr("width", width())
            .attr("height", height())

        // define single beswarm plot height, depending on the number of bar charts
        var w = +width() - margin.left - margin.right,
            h = (+height() - margin.bottom - margin.top - ((titleSpace + padding()) * (data.length - 1))) / data.length;

        // Define scales

        // Radiuses
        let rMax = d3.max(data, function(d) {
            return d3.max(d.values, function(e) {
                return e.radius;
            })
        })
        let rMin = d3.min(data, function(d) {
            return d3.min(d.values, function(e) {
                return e.radius;
            })
        })
        var radius = d3.scaleLinear()
            .range([minRadius(), maxRadius()])
            .domain([rMin, rMax])

        // colors
        let allColors = [];
        data.forEach(function(d) {
            d.values.forEach(function(dd) {
                allColors.push(dd);
            })
        })
        allColors = d3.nest()
            .key(function(d) {
                return d.color;
            })
            .entries(allColors)
            .map(function(d) {
                return d.key
            })
        colors.domain(allColors);

        // Horizontal

        //handle data type (Number or Date)
        var xScale = values.type() == 'Date' ? d3.scaleTime() : d3.scaleLinear();

        let xMax = d3.max(data, function(d) {
            return d3.max(d.values, function(e) {
                return e.value;
            })
        })
        let xMin = d3.min(data, function(d) {
            return d3.min(d.values, function(e) {
                return e.value;
            })
        })
        // if (values.type() == 'Date') {
        //     xMin = new Date(xMin);
        //     xMax = new Date(xMax)
        // }

        xScale.range([radius(radius.domain()[0]), w - radius(radius.domain()[1])])
            .domain([xMin, xMax]);

        // Draw each bar chart
        data.forEach(function(item, index) {

            // Append a grupo containing axis and circles,
            // move it according the index
            let beeswarm = selection.append("g")
                .attr('id', item.key === "undefined" ? "swarm" : "swarm-" + item.key)
                .attr("transform", "translate(" + margin.left + "," + index * (h + padding() + titleSpace) + ")");

            // Draw title
            beeswarm.append("text")
                .attr("x", -margin.left)
                .attr("y", titleSpace - 7)
                .style("font-size", "10px")
                .style("font-family", "Arial, Helvetica")
                .text(item.key);

            let data = item.values;

            var simulation = d3.forceSimulation(data)
                .force("x", d3.forceX(function(d) {
                        return xScale(d.value)
                    })
                    .strength(1))
                .force("y", d3.forceY(h / 2))
                .force("collide", d3.forceCollide(function(d) {
                    return radius(d.radius) + marginCircles()
                }).iterations(anticollisionIterations()))
                .stop();

            for (var i = 0; i < 240; ++i) simulation.tick();

            let bees = beeswarm.append('g')
                .attr('id', 'circles')
                .attr('class', 'bees')
                .selectAll("circle")
                .data(data).enter()
                .append('circle')
                .attr('id', function(d) {
                    return d.label ? d.label : 'circle'
                })
                .attr('r', function(d) {
                    return radius(d.radius)
                })
                .attr('cx', function(d) {
                    return d.x
                })
                .attr('cy', function(d) {
                    return d.y
                })
                .attr("fill", function(d) {
                    if (d.color) {
                        return colors()(d.color);
                    } else {
                        return '#444'
                    }
                });

            let labels = beeswarm.append('g')
                .attr('id', 'labels')
                .attr('class', 'label')
                .selectAll("text")
                .data(data).enter()
                .append('text')
                .attr('x', function(d) {
                    return d.x
                })
                .attr('y', function(d) {
                    return d.y
                })
                .attr('text-anchor', 'middle')
                .attr('fill', '#000')
                .text(function(d) {
                    if (d.label) return d.label;
                })

        })

        // After all the charts, draw x axis
        selection.append("g")
            .attr('id', '"x-axis')
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
