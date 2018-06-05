(function() {

    // The Model
    var timechuncks = raw.model();

    // Groups. It defines how to aggregate thte data
    var group = timechuncks.dimension('groups')
        .title('Groups')

    // Start Date. It will define the starting point of each bar
    var startDate = timechuncks.dimension('startDate')
        .title('Start date')
        .types(Date)
        .accessor(function(d) {
            return this.type() == "Date" ? Date.parse(d) : +d;
        })
        .required(true)

    // End Date. It will define the ending point of each bar
    var endDate = timechuncks.dimension('endDate')
        .title('End date')
        .types(Date)
        .accessor(function(d) {
            return this.type() == "Date" ? Date.parse(d) : +d;
        })
        .required(true)

    // Colors. it defines the color of each bar.
    var colorDimension = timechuncks.dimension('color')
        .title('Colors')
        .types(String)

    // Mapping function
    // For each record in the data returns the values
    // for the X and Y dimensions and casts them as numbers
    timechuncks.map(function(data) {

        var level = id = 0;

        var nest = d3.nest()
            .key(function(d) {
                return group() ? group(d) : ''
            })
            .rollup(function(v) {

                v.sort(function(a, b) {
                    return d3.ascending(startDate(a), startDate(b))
                })
                var l, levels = [];
                level = 0;
                v.forEach(function(item, i) {
                    l = 0;
                    while (overlap(item, levels[l])) l++;
                    if (!levels[l]) levels[l] = [];
                    levels[l].push({
                        level: l + level,
                        id: id++,
                        color: colorDimension(item),
                        group: group() ? group(item) : "",
                        start: startDate(item),
                        end: endDate(item),
                        data: item
                    });
                })

                level++;
                return levels;
            })
            .entries(data);

        function overlap(item, g) {
            if (!g) return false;
            for (var i in g) {
                if (startDate(item) < g[i].end && endDate(item) > g[i].start) {
                    return true;
                }
            }
            return false;
        };

        return nest;
    })


    // The Chart
    var chart = raw.chart()
        .title('Gantt Chart')
        .thumbnail("imgs/gantt.png")
        .description("A Gantt chart is a type of bar chart, developed by Henry Gantt in the 1910s, that illustrates a project schedule. Gantt charts illustrate the start and finish dates of the terminal elements and summary elements of a project.")
        .category('Time chunks')
        .model(timechuncks)

    // OPTIONS

    // Width
    var width = chart.number()
        .title('Width')
        .defaultValue(900)

    // Height
    var height = chart.number()
        .title('Height')
        .defaultValue(600)

    //left margin
    var marginLeft = chart.number()
        .title('Left Margin')
        .defaultValue(80)

    //labels horizontal alignment
    var alignment = chart.checkbox()
        .title("Align labels to bar")
        .defaultValue(false);

    // sorting options
    var sort = chart.list()
        .title("Sort by")
        .values(['Start date (ascending)', 'Start date (descending)', 'Name'])
        .defaultValue('Start date (ascending)')

    // Colors for the chart
    var colors = chart.color()
        .title("Color scale")

    // Drawing function
    chart.draw(function(selection, data) {

        // svg size, create container group
        var g = selection
            .attr("width", width())
            .attr("height", height())
            .append('g')

        //define margins
        var margin = {
            top: 10,
            right: 0,
            bottom: 20,
            left: marginLeft()
        };

        //compute the total amount of levels
        var levels = d3.sum(data.map(function(d) {
            return d.value.length;
        }));

        //re-flatten hierarchy
        var entries = []

        data.forEach(function(d) {
            d.value.forEach(function(e) {
                entries = entries.concat(e)
            })
        })

        //get the list of single colors
        var allColors = d3.set(entries.map(function(d) {
            return d.color;
        })).values();

        //define the colors domain
        colors.domain(allColors);

        //define x scale
        var x = d3.scaleTime()
            .range([margin.left, width()])
            .domain([
                d3.min(entries, function(d) {
                    return d.start;
                }),
                d3.max(entries, function(d) {
                    return d.end;
                })
            ]);

        //create x axis
        var xAxis = d3.axisBottom(x);

        //compute items height
        var itemHeight = (height() - margin.top - margin.bottom) / levels;

        //create items
        var newPosition = margin.top;

        var items = g.selectAll('g.itemGroup')
            .data(data.sort(sortBy))
            .enter().append('g')
            .attr("class", "itemGroup")
            .attr("transform", function(d, i) {
                var currentPosition = newPosition;
                newPosition += d.value.length * itemHeight;
                return 'translate(0, ' + currentPosition + ')';
            });

        //add horizontal lines
        items.append('line')
            .attr('x1', margin.left)
            .attr('y1', 0)
            .attr('x2', width())
            .attr('y2', 0)
            .style('shape-rendering', 'crispEdges')
            .attr('stroke', 'lightgrey');

        //add groups labels
        items.append('text')
            .text(function(d) {
                return d.key
            })
            .style("font-size", "11px")
            .style("font-family", "Arial, Helvetica")
            .attr('x', function(d) {
                return alignment() ? x(d.value[0][0].start) - 10 : margin.left - 10
            })
            .attr('y', 0)
            .attr('dy', function(d) {
                //half of the size plus 4px (custom value workin with the chosen font size)
                return itemHeight / 2 + 4;
            })
            .attr('text-anchor', 'end')
            .attr('class', 'groupText');

        // draw rectangles
        items.selectAll('rect')
            .data(function(d) { // take the data and return the list. it should be changed in the model.
                var p = [];
                d.value.forEach(function(dd) {
                    p = p.concat(dd);
                });
                return p;
            })
            .enter().append('rect')
            .attr('x', function(d) {
                return x(d.start);
            })
            .attr('y', function(d) {
                return itemHeight * d.level;
            })
            .attr('width', function(d) {
                return d3.max([1, x(d.end) - x(d.start)]);
            })
            .attr('height', itemHeight)
            .style("shape-rendering", "crispEdges")
            .style('fill', function(d) {
                return colors()(d.color);
            })

        //add axes
        g.append('g')
            .attr('transform', `translate(0, ${margin.top + itemHeight * levels})`)
            .attr("class", "axis")
            .style("stroke-width", "1px")
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            .call(xAxis);

        d3.selectAll(".axis line, .axis path")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("stroke", "#ccc")

    })

    //sorting functions
    function sortBy(a, b) {
        if (sort() == 'Start date (descending)') return d3.descending(a.value[0][0].start, b.value[0][0].start)
        if (sort() == 'Start date (ascending)') return d3.ascending(a.value[0][0].start, b.value[0][0].start)
        // if (sort() == 'End date (descending)') return d3.descending(a.value[0][0].end, b.value[0][0].end)
        // if (sort() == 'End date (ascending)') return d3.ascending(a.value[0][0].end, b.value[0][0].end)
        if (sort() == 'Name') return d3.ascending(a.key, b.key)
    }

})();
