(function(){

    var stream = raw.model();

    var group = stream.dimension()
        .title('Group')
        .required(1)

    var date = stream.dimension()
        .title('Date')
        .types(Date)
        .accessor(function (d){ return this.type() == "Date" ? Date.parse(d) : +d; })
        .required(1)

    var size = stream.dimension()
        .title('Size')
        .types(Number)
        .required(1)

    stream.map(function (data){
        if (!group()) return [];

        var dates = d3.set(data.map(function (d){ return +date(d); })).values();

        var groups = d3.nest()
            .sortKeys(function(d){ return 1})
            .key(group)
            .rollup(function (g){
                var singles = d3.nest()
                    .key(function(d){ return +date(d); })
                    .rollup(function (d){
                        return {
                            group : group(d[0]),
                            date : date(d[0]),
                            size : size() ? d3.sum(d,size) : d.length
                        }
                    })
                    .map(g);

                return d3.values(singles);
            })
            .map(data)

        return d3.values(groups).map(function(d){ return d.sort(function(a,b){ return a.date - b.date; }) });

    })

    var chart = raw.chart()
        .title('Area graph')
        .thumbnail("imgs/smallMultiples.png")
        .description("A small multiple is a series of small similar graphics or charts, allowing them to be easily compared.<br/>Based on <a href='http://bl.ocks.org/mbostock/9490313'>http://bl.ocks.org/mbostock/9490313</a>")
        .category('Time series')
        .model(stream)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    var padding = chart.number()
        .title("Padding")
        .defaultValue(5)

    var scale = chart.checkbox()
        .title("Use same scale")
        .defaultValue(false)

    var specular = chart.checkbox()
        .title("Center values vertically")
        .defaultValue(false)

    var colors = chart.color()
        .title("Color scale")
    
    var curve = chart.list()
      .title("Interpolation")
      .values(['Basis spline','Sankey','Linear'])
      .defaultValue('Basis spline')
    
    var sorting = chart.list()
        .title("Sort by")
        .values(['Original','Total (descending)', 'Total (ascending)', 'Name'])
        .defaultValue('Original')

    chart.draw(function (selection, data){
        
        //sort data
        function sortBy(a,b){
            if (sorting() == 'Total (descending)'){                
                return a.reduce(function (c,d) {return c + d.size}, 0) - b.reduce(function (c,d) {return c + d.size}, 0)
            }
            if (sorting() == 'Total (ascending)') return b.reduce(function (c,d) {return c + d.size}, 0) - a.reduce(function (c,d) {return c + d.size}, 0);
            if (sorting() == 'Name'){
                if(a[0].group < b[0].group) return -1;
                if(a[0].group > b[0].group) return 1;
            }
        }
        
        data.sort(sortBy);
        
        console.log(data);
        
        var curves = {
            'Basis spline' : 'basis',
            'Sankey' : interpolate,
            'Linear' : 'linear'
            }

        var w = +width(),
            h = (+height()-20 - (+padding()*(data.length-1))) / data.length;

        var svg = selection
            .attr("width", +width())
            .attr("height", +height())

        var x = d3.time.scale()
            .range([0, w]);

        var y = d3.scale.linear()
            .range([h, 0]);

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .interpolate(curves[curve()])

        //@TODO: expose this in options
        //var specular = false;
        // if specular
        if(specular() == true) {
            area.y0(function(d) { return h-y(d.size)/2; })
                .y1(function(d) { return y(d.size)/2; })  
        } else {
            area.y0(h) //align to baseline
                .y1(function(d) { return y(d.size); })
        }

        x.domain([
            d3.min(data, function(layer) { return d3.min(layer, function(d) { return d.date; }); }),
            d3.max(data, function(layer) { return d3.max(layer, function(d) { return d.date; }); })
        ])

        colors.domain(data, function (d){ return d[0].group; })

        var xAxis = d3.svg.axis().scale(x).tickSize(-height()+15).orient("bottom");

        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()-15) + ")")
            .call(xAxis);

        d3.selectAll(".x.axis line, .x.axis path")
            .style("shape-rendering","crispEdges")
            .style("fill","none")
            .style("stroke","#ccc")


        svg.selectAll("g.flow")
            .data(data)
            .enter().append("g")
            .attr("class","flow")
            .attr("title", function(d) { return d[0].group; })
            .attr("transform", function(d,i) { return "translate(0," + ((h+padding())*i) + ")"})
            .each(multiple);

        svg.selectAll("g.flow")
            .append("text")
            .attr("x", w - 6)
            .attr("y", h - 6)
            .style("font-size","10px")
            .style("fill", function(d){ return raw.foreground(colors()(d[0].group)) })
            .style("font-family","Arial, Helvetica")
            .style("text-anchor", "end")
            .text(function(d) { return d[0].group; });

        function multiple(single) {

            var g = d3.select(this);

            if (scale()) y.domain([0, d3.max(data, function(layer) { return d3.max(layer, function(d) { return d.size; }); })])
            else y.domain([0, d3.max(single, function(d) { return d.size; })]);

            g.append("path")
              .attr("class", "area")
              .style("fill", function(d){ return colors()(d[0].group); })
              .attr("d", area(single));
        }
        
        function interpolate(points) {
          var x0 = points[0][0], y0 = points[0][1], x1, y1, x2,
              path = [x0, ",", y0],
              i = 0,
              n = points.length;

          while (++i < n) {
            x1 = points[i][0], y1 = points[i][1], x2 = (x0 + x1) / 2;
            path.push("C", x2, ",", y0, " ", x2, ",", y1, " ", x1, ",", y1);
            x0 = x1, y0 = y1;
          }
          return path.join("");
        }

    })

})();
