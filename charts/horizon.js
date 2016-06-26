!function(){

  var model = raw.model();
  
  var group = model.dimension()
    .title('Group');

  var date = model.dimension()
    .title('Date')
    .types(Date)
    .required(true);

  var size = model.dimension()
    .title('Size')
    .types(Number)
    .required(true);

  model.map(function(data){

    var nest = d3.nest()
      .key(group)
      .rollup(function(g){
        return g.map(function(d){
          //return [ Date.UTC(date(d),1), +size(d) ]
            return [ Date.parse(date(d)), +size(d) ]
        })
      })
      .entries(data)

    return nest;

  })

  var chart = raw.chart()
    .model(model)
    .title('Horizon')
    .thumbnail("imgs/horizon.png")
    .description("Horizon charts combine position and color to reduce vertical space.<br/>Based on <a href='http://bl.ocks.org/mbostock/1483226'>http://bl.ocks.org/mbostock/1483226</a>")
    .category('Time series')

  var width = chart.number()
    .title('Width')
    .defaultValue(800)

  var height = chart.number()
    .title('Height')
    .defaultValue(600)

  var padding = chart.number()
    .title('Padding')
    .defaultValue(10)
  
  var scale = chart.checkbox()
    .title("Use same scale")
    .defaultValue(false)

  var bands = chart.number()
    .title('Bands')
    .defaultValue(4)

  var curve = chart.list()
      .title("Interpolation")
      .values(['Basis spline','Sankey','Linear'])
      .defaultValue('Basis spline')

  var mode = chart.list()
      .title("Mode")
      .values(['Mirror', 'Offset'])
      .defaultValue('Mirror')

  chart.draw(function(selection, data){

    var curves = {
      'Basis spline' : 'basis',
      'Sankey' : interpolate,
      'Linear' : 'linear'
    }

    var modes = {
      'Mirror' : 'mirror',
      'Offset' : 'offset'
    }

    var h = (+height() - (+padding()*(data.length-1))) / data.length;

    var horizon = d3.horizon()
      .width(+width())
      .height(h)
      .bands(+bands())
      .mode(modes[mode()])
      .interpolate(curves[curve()])

    selection
      .attr('width', +width())
      .attr('height', +height());

    var g = selection
      .selectAll('g')
      .data(data)
      .enter().append('g')
      .attr("transform", function(d,i){ return 'translate(0,' + (h+padding()) * i  + ')'})

    g.selectAll('g')
      .data(function(d){ return [d.values]; })
      .enter().append('g')
      .call(horizon);

    g.append("text")
      .attr("x", +width() - 6)
      .attr("y", h - 6)
      .style("font-size","11px")
      .style("font-family","Arial, Helvetica")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });


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

}();
