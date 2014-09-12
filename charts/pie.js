(function(){
  var chart = raw.chart(),
      model = raw.model(),
//      colors = model.dimension(),
      labels = model.dimension(),
      arcs = model.dimension(),
      colors = model.dimension(),
      outerRadius = chart.number(),
      innerRadius = chart.number(),
      colorScale = chart.color();


  chart.title('Pie Chart')
    .description('A simple Pie Chart')
    .thumbnail("imgs/pieChart.png");

  labels
    .title('Labels')
    .types(Number, String, Date);
  arcs
    .title('Arcs')
    .types(Number);
  colors
    .title('Colors')
    .types(Number, String, Date);

  model
    .map(modelMapper);

  chart
    .model(model);

  outerRadius
    .title('Outer Radius')
    .defaultValue(500);

  innerRadius
    .title('Inner Radius')
    .defaultValue(120);

  colorScale
    .title("Color scale");

  chart
    .draw(draw);


  function modelMapper(data) {
    return data.map(function(d) {
      return {
        arc: arcs(d),
        color: colors(d),
        label: labels(d)
      };
    });
  }

  function draw(selection, data) {
    var arc = d3.svg.arc(),
        pie = d3.layout.pie();

    colorScale.domain(data.filter(function (d){ return d.type == "node"; }), function (d){ return d.color; });

    arc
      .outerRadius(outerRadius() / 2)
      .innerRadius(innerRadius() / 2);

    pie
      .sort(null)
      .value(function(d) { return d.arc; });

    var svg = selection
      .attr('width', outerRadius())
      .attr('height', outerRadius())
      .append('g')
        .attr('transform', 'translate(' + outerRadius() / 2 + ',' + outerRadius() / 2 + ')');

    var label = selection
      .append('g')
        .attr('id', 'label')
        .attr('transform', 'translate('+outerRadius() /2 + ',' + (+outerRadius() / 2) +')');

    var labelText = label
        .append('text')
          .attr('text-anchor', 'middle');

    window.l = label;
    window.lt = labelText;
    group = svg
      .selectAll('.svg')
      .data(pie(data))
      .enter()
      .append('g')
        .attr('class', 'arc');

    group
      .append('path')
      .attr('d', arc)
      .style('fill', function(d) { return d.data.color ? colorScale()(d.data.color) : colorScale()(null); })
      .style('cursor', 'pointer')
      .on('mouseover', function(d) {
        label
          .transition()
          .style('opacity', 1);

        labelText.text(d.data.label);

      })
      .on('mouseout', function() {
        label
          .transition()
          .style('opacity', 0)
      });
  }

})();