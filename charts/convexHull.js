(function(){

    var points = raw.models.points();

    points.dimensions().remove('size');
    points.dimensions().remove('label');
    points.dimensions().remove('color');

    var chart = raw.chart()
        .title('Convex Hull')
        .description(
            "In mathematics, the <a href='https://en.wikipedia.org/wiki/Convex_hull'>convex hull</a> is the smallest convex shape containing a set o points. Applied to a scatterplot, it is useful to identify points belonging to the same category.<br /> <br/>Based on <a href='http://bl.ocks.org/mbostock/4341699'>http://bl.ocks.org/mbostock/4341699</a>")
        .thumbnail("imgs/convexHull.png")
        .model(points)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    var stroke = chart.number()
        .title("Stroke Width")
        .defaultValue(32)

    chart.draw(function (selection, data){

        var x = d3.scale.linear().range([0,+width()-stroke()]).domain(d3.extent(data, function (d){ return d.x; })),
            y = d3.scale.linear().range([+height()-stroke(), 0]).domain(d3.extent(data, function (d){ return d.y; }));
        
        var vertices = data.map(function (d){
          return [ x(d.x), y(d.y) ]
        })

        var g = selection
            .attr("width", +width())
            .attr("height", +height())
            .append("g")
            .attr("transform","translate(" + stroke()/2 + "," + stroke()/2 + ")")

        g.append("path")
            .datum(d3.geom.hull(vertices))
            .style("fill", "#bbb")
            .style("stroke","#bbb")
            .style("stroke-width", +stroke())
            .style("stroke-linejoin","round")
            .attr("d", function (d) { return "M" + d.join("L") + "Z"; });

        g.selectAll("circle")
            .data(vertices)
            .enter().append("circle")
                .attr("r", 2)
                .attr("transform", function (d) { return "translate(" + d + ")"; })
  })
})();