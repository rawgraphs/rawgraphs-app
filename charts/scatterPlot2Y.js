(function() {

    var model = raw.model();

    var x = model.dimension('x')
      .title("X Axis")
      .types(Number, Date)
      .accessor(function(d) { return this.type() == "Date" ? new Date(d) : +d; })
      .required(1);

    var y = model.dimension('y')
      .title("Y1 Axis")
      .types(Number, Date)
      .accessor(function(d) { return this.type() == "Date" ? new Date(d) : +d; })
      .required(1);

    var y2 = model.dimension('y2')
      .title("Y2 Axis")
      .types(Number, Date)
      .accessor(function(d) { return this.type() == "Date" ? new Date(d) : +d; })
      .required(1);
/*
    var size = model.dimension('size')
        .title("Size")
        .types(Number);

    var color = model.dimension('color')
        .title("Color");

    var label = model.dimension('label')
        .title("Label")
        .multiple(true);
*/  

    model.map(function (data){
        return data.map(function (d){
            return {
                x : +x(d),
                y : +y(d),
                y2 : +y2(d),
                size : 3 //size() ? +size(d) : 1
                //color : color(d)
                //label : label(d)      
            }
        })
    })


    //var points = raw.models.points();

    var chart = raw.chart()
        .title('Scatter Dual Plot')
        .description(
            "A multidimensional scatter plot that allows two independent y axes. This extends the one dimensional scatter plot.")
        .thumbnail("imgs/scatterPlot2Y.png")
        .category('Dispersion')
        .model(model);

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true);

    var height = chart.number()
        .title("Height")
        .defaultValue(500);

    var marginLeft = chart.number()
        .title('Left+Right Margin')
        .defaultValue(40)

    var maxRadius = chart.number()
        .title("max radius")
        .defaultValue(3);

    var useZero = chart.checkbox()
        .title("set origin at (0,0)")
        .defaultValue(false);

    var showPoints = chart.checkbox()
        .title("show points")
        .defaultValue(true);

    var colors = chart.color()
        .title("Color scale");

    var maxValueY1 = chart.number()
        .title("max value y1")
        .defaultValue(0);
    
    var maxValueY2 = chart.number()
        .title("max value y2")
        .defaultValue(0);


    chart.draw((selection, data) => {

        // Retrieving dimensions from model
        var x = model.dimensions().get('x'),
            y = model.dimensions().get('y'),
            y2 = model.dimensions().get('y2');

        //define margins
        var margin = {
            top: +maxRadius(),
            right: marginLeft(),
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

        if ( !useZero() ) {
            var xExtent = d3.extent(data, d => {
                return d.x;
            }),
            yExtent = maxValueY1() > 0 ?
                [d3.min(data, d => {
                    return d.y;
                }), maxValueY1()] : d3.extent(data, d => {
                    return d.y;
            }),
            y2Extent = maxValueY2() > 0 ?
                [d3.min(data, d => {
                    return d.y2;
                }), maxValueY2()] : d3.extent(data, d => {
                    return d.y2;
            });
        } else {
            var xExtent = [0, d3.max(data, d => {
                return d.x;
            })],
            yExtent = [0, maxValueY1() > 0 ?
                maxValueY1() : d3.max(data, d => {
                    return d.y;
            })],
            y2Extent = [0, maxValueY2() > 0 ?
                maxValueY2() : d3.max(data, d => {
                    return d.y2;
            })];
        }
/*
        var xExtent = !useZero() ? d3.extent(data, d => {
                return d.x;
            }) : [0, d3.max(data, d => {
                return d.x;
            })],
            yExtent = !useZero() ? d3.extent(data, d => {
                return d.y;
            }) : [0, d3.max(data, d => {
                return d.y;
            })],
            y2Extent = !useZero() ? d3.extent(data, d => {
                return d.y2;
            }) : [0, d3.max(data, d => {
                return d.y2;
            })];
*/
        var xScale = x.type() == "Date" ?
            d3.scaleTime().range([0, w]).domain(xExtent) :
            d3.scaleLinear().range([0, w]).domain(xExtent),
            yScale = y.type() == "Date" ?
            d3.scaleTime().range([h, 0]).domain(yExtent) :
            d3.scaleLinear().range([h, 0]).domain(yExtent),
            y2Scale = y2.type() == "Date" ?
            d3.scaleTime().range([h, 0]).domain(y2Extent) :
            d3.scaleLinear().range([h, 0]).domain(y2Extent),
            sizeScale = d3.scaleSqrt().range([1, +maxRadius()])
                .domain([0, d3.max(data, d => {
                    return d.size;
                })]),
            xAxis = d3.axisBottom(xScale).tickSize(-h), //.tickSubdivide(true),
        yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-w),
        y2Axis = d3.axisRight(y2Scale).ticks(10).tickSize(-w);




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

        g.append("g")
            .attr("class", "y2 axis")
            .style("stroke-width", "0px") // removed the strokes for y2 axis
            .style("font-size", "10px")
            .style("font-family", "Arial, Helvetica")
            //.attr("transform", `translate(${margin.left}, 0)`)
            .attr('transform', 'translate(' + w + ',0)')
            .call(y2Axis);

        d3.selectAll(".y2.axis line, .y.axis line, .x.axis line, .y2.axis path, .y.axis path, .x.axis path")
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
            .attr("class", "point");
        /*
        colors.domain(data, d => {
            return d.color;
        });
        */
       colors.domain(['y1','y2'], c => {
           return c;
       });
       
        
        // add y1 points
        point.append("circle")
            .filter(d => {
                return showPoints();
            })
            .style("fill", "#000")
            .attr("transform", d => {
                return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
            })
            .attr("r", 1);

        // add y1 circles
        circle.append("circle")
        .style("fill", d => {
            return colors() ? colors()('y1') : "#eeeeee";
        })
        .style("fill-opacity", .9)
        .attr("transform", d => {
            return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
        })
        .attr("r", d => {
            return sizeScale(d.size);
        });
        
        // add y2 points
        point.append("circle")
            .filter(d => {
                return showPoints();
            })
            .style("fill", "#000")
            .attr("transform", d => {
                return `translate(${xScale(d.x)}, ${y2Scale(d.y2)})`;
            })
            .attr("r", 1);
        
        // add y2 circles
        circle.append("circle")
            .style("fill", d => {
                return colors() ? colors()('y2') : "#eeeeee";
            })
            .style("fill-opacity", .9)
            .attr("transform", d => {
                return `translate(${xScale(d.x)}, ${y2Scale(d.y2)})`;
            })
            .attr("r", d => {
                return sizeScale(d.size);
            });

        
        // add labels to y1 values
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



