(function(){

    var stream = raw.model();

    var group = stream.dimension()
        .title('Group')

    var date = stream.dimension()
        .title('Date')
        .types(Date)
        .accessor(function (d){ return this.type() == "Date" ? new Date(moment(d,raw.dateFormats,true).toISOString()) : +d; })

    var size = stream.dimension()
        .title('Size')
        .types(Number)

    stream.map(function (data){
        if (!group()) return [];

        var dates = d3.set(data.map(function (d){ return +date(d); })).values();

        var groups = d3.nest()
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
        .title('Small Multiples (Area)')
        .thumbnail("imgs/smallMultiples.png")
        .description("Based on <a href='http://bl.ocks.org/mbostock/9490313'>http://bl.ocks.org/mbostock/9490313</a>")
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
        .defaultValue(10)

    var scale = chart.checkbox()
        .title("Same scale")
        .defaultValue(false)

    var colors = chart.color()
        .title("Color scale")

    chart.draw(function (selection, data){

        console.log(data)

        var w = +width(),
            h = (+height() - (+padding()*(data.length-1))) / (data.length);

        var svg = selection
            .attr("width", +width())
            .attr("height", +height())

        var x = d3.time.scale()
            .range([0, w]);

        var y = d3.scale.linear()
            .range([h, 0]);

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .y0(h)
            .y1(function(d) { return y(d.size); });

        var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.size); });

        x.domain([
            d3.min(data, function(layer) { return d3.min(layer, function(d) { return d.date; }); }),
            d3.max(data, function(layer) { return d3.max(layer, function(d) { return d.date; }); })
        ])

        colors.domain(data, function (d){ return d[0].group; })

        svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("title", function(d) { return d[0].group; })
            .attr("transform", function(d,i) { return "translate(0," + ((h+padding())*i) + ")"})
            .each(multiple);

        svg.selectAll("g")
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

            /*g.append("path")
              .attr("class", "line")
              .style("fill","none")
              .style("stroke","#666")
              .style("stroke-width","1.5px")
              .attr("d", line(single));*/

        }

    })

})();