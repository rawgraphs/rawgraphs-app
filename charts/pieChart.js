!function(){

  var model = raw.model();

  var dimensions = model.dimension()
    .title('Dimensions')
    .required(true)
    .multiple(true);

  var group = model.dimension()
    .title('Group');

  model.map(function(data){
    var index = 0;
    var nest = d3.nest()
      .key(function(d){ return group() ? group(d) : ++index; })
      .rollup(function(d){
        return dimensions().map(function(dimension){
          return { key: dimension, size: d3.sum(d, function(a){ return +a[dimension]; } ) }
        })
      })
      .entries(data);

    return nest

  })

  var chart = raw.chart()
    .title("Pie chart")
    .model(model);

  var width = chart.number()
    .title('Width')
    .defaultValue(800)

  var columns = chart.number()
    .title('Columns')
    .defaultValue(4)

  var padding = chart.number()
    .title('Padding')
    .defaultValue(10)

  var donut = chart.checkbox()
    .title('Donut chart')
    .defaultValue(false)

  var thickness = chart.number()
    .title('Thickness')
    .defaultValue(10)

  var sortChartsBy = chart.list()
    .title("Sort arcs by")
    .values(['size','name','automatic'])
    .defaultValue('size')

  var sortArcsBy = chart.list()
    .title("Sort arcs by")
    .values(['size','name','automatic'])
    .defaultValue('size')

  chart.draw(function(selection, data){

    var color = d3.scale.category20c()
      , radius = +width() / +columns() / 2 - +padding()/2;

    var h = Math.ceil(data.length / +columns()) * (radius*2 +padding());

    selection
      .attr("width", +width())
      .attr("height", h)

    var area = d3.scale.linear()
      .domain([0, d3.max(data, function(layer) { return d3.sum(layer.values, function(d) { return d.size; }); })])
      .range([0, radius * radius * Math.PI ])

    var pie = d3.layout.pie()
        .sort(sortArcsByComparator)
        .value(function(d) { return d.size; });

    data.forEach(function(l, li){

      var outerRadius = Math.sqrt( area(d3.sum(l.values, function(d) { return d.size; })) / Math.PI );

      var arc = d3.svg.arc()
        .outerRadius( outerRadius )
        .innerRadius( donut() && thickness() < outerRadius ? outerRadius - +thickness() : 0 )

      var g = selection
        .append("g")
        .attr("transform", function(){
          return "translate(" + (li % +columns() * (+radius*2 + +padding()) + +radius + padding()/2 ) + "," + (Math.floor(li / +columns()) * (radius*2 + +padding() ) +radius + padding()/2 ) + ")";
        })

      var p = g.selectAll(".arc")
          .data(pie(l.values))
        .enter().append("g")
          .attr("class", "arc");

      p.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.key); });

      p.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.data.key; });


    })


    function sortChartsByComparator(a,b){
        if (sortArcsBy() == 'size') return d3.descending(d3.sum(a.values, function(d) { return d.size; }), d3.sum(b.values, function(d) { return d.size; }));
        if (sortArcsBy() == 'name') return d3.descending(a.key, b.key);
        if (sortArcsBy() == 'automatic') return 1;
    }

    function sortArcsByComparator(a,b){
        if (sortArcsBy() == 'size') return d3.ascending(a.size, b.size);
        if (sortArcsBy() == 'name') return d3.ascending(a.key, b.key);
        if (sortArcsBy() == 'automatic') return 1;
    }


  })



}()
