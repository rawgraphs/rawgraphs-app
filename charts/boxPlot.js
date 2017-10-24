(function(){

	var model = raw.model();

	var group = model.dimension()
		.title('Group')
		.types(String)
    .required(1)

	var values = model.dimension()
		.title('Size')
		.types(Number)
    .required(1)

  model.map(function(data){
    var nest = d3.nest()
      .key(function(d){return group(d)})
      .entries(data)

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

	var margin = chart.number()
		.title('Margin')
		.defaultValue(20)

  var iqrValue = chart.number()
    .title('Iqr')
    .defaultValue(1.5)


  chart.draw(function(selection, data){


    var chartMargin = {top: margin(), right: margin(), bottom: margin(), left: margin()},
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
     return d3.max(d.values, function(e){return +values(e)});
   });

   var min = d3.min(data, function(d) {
     return d3.min(d.values, function(e){return +values(e)});
   });

   boxplot.domain([min, max]);

   var x = d3.scale.ordinal()
     .domain( data.map(function(d) { return d.key } ) )
     .rangeRoundBands([0 , chartWidth], 0.75, 0.5);

   var xAxis = d3.svg.axis()
  		.scale(x)
  		.orient("bottom");

   var y = d3.scale.linear()
   		.domain([min, max])
   		.range([chartHeight, 0]);

   var yAxis = d3.svg.axis()
       .scale(y)
       .tickSize(-chartWidth)
       .orient("left");

     // draw axis
    container.append("g")
         .attr("class", "x axis")
         .style("stroke-width", "1px")
          .style("font-size","10px")
          .style("font-family","Arial, Helvetica")
         .attr("transform", "translate(0," + chartHeight + ")")
         .call(xAxis)

       container.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "1px")
             .style("font-size","10px")
             .style("font-family","Arial, Helvetica")
            .call(yAxis)

   var boxdata = data.map(function(d){
     var output = d.values.map(function(e){return +values(e)})
     return {key:d.key, values:output}
   })

  var gplot = container.selectAll(".box")
       .data(boxdata)

   gplot
    .enter().append("g")
     .attr("class", "box")
    .attr("transform", function(d) {return "translate(" +  x(d.key)  + ",0)"; } )
    .style("font-size","10px")
    .style("font-family","Arial, Helvetica")
    .call(function(d){
      var data = d.data();
      data = data.map(function(e){
        return e.values
      })
      d.data(data)
      boxplot.width(x.rangeBand())(d)
    });

    //styling

    d3.selectAll('.box line, .box rect, .box circle')
      .style("fill","#ccc")
      .style("stroke","#000")

    d3.selectAll('.box .center')
      .style('stroke-dasharray', '3,3')

    d3.selectAll('.box .outlier')
      .style('fill', 'none')

   d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
     .style("shape-rendering","crispEdges")
     .style("fill","none")
     .style("stroke","#ccc")

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
