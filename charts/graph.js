(function() {
/*

a	b	w
carlos	silvi	3
silvi	dani	30
dani	carlos	2
silvi	miri	15
miri	dani	20

*/

  var model = raw.model();

  var source = model.dimension()
    .title('sources')
    .types(String);

  var target = model.dimension()
    .title('connected nodes / known as targets')
    .types(String);

  var weight = model.dimension()
    .title('edge weight')
    .types(Number);

  var simulation = d3.forceSimulation();

  model.map(function(data) {
    var graph = {
      nodeIds: {},
      nodes: [],
      links: []
    }

    data.forEach(function(d) {
      var sou = source(d);
      var tar = target(d);
      var lin = sou + '-' + tar;
      var val = weight(d) || 1;
      if (sou && tar) {
        if (!graph.nodeIds[sou]) {
          graph.nodeIds[sou] = {
            id: sou,
            r: 1,
            color: 'cyan'
          };
        }
        if (!graph.nodeIds[tar]) {
          graph.nodeIds[tar] = {
            id: tar,
            r: 1,
            color: 'magenta'
          };
        }
        graph.links.push({
          source: sou,
          target: tar,
          value: val,
        });

        console.log('> graph (source:', sou, ')-[', val, ']->(target:', tar, ')');
      }
    });

    // cycle throug ids
    graph.nodes = Object.values(graph.nodeIds);

    if(graph.nodes.length) {
      console.log('success! nodes:', graph.nodes.length, ', edges:', graph.links.length)
    }
    return graph;
  });



  // The Chart

  var chart = raw.chart()
    .title('Basic k-partite graph')
    .description(
      "Display the relationship between two or more (k) entity types to see correlations between dimensions")
      .category("Multi categorical")
    .model(model)

  // Width
  var width = chart.number()
    .title('Width')
    .defaultValue(900)

  // Height
  var height = chart.number()
    .title('Height')
    .defaultValue(600)

  // A simple margin
  var margin = chart.number()
    .title('margin')
    .defaultValue(10);

  var minDistance = chart.number()
    .title('min distance between nodes')
    .defaultValue(80);

  chart.draw(function(selection, data) {
    // svg size
    selection
      .attr("width", width())
      .attr("height", height())
      .style('background', '#e0e0e0');

    if(!data.nodes.length){
      console.warn('no graph data.');
      return;
    }

    var links = selection
      .append("g").classed("links", true)
      .selectAll("g.node")
      .data(data.links, function(d,i) {
        return i;
      });

    var nodes = selection
      .append("g").classed("nodes", true)
      .selectAll("g.node")
      .data(data.nodes, function(d) {
        return d.id;
      });



    var linkElement = links.enter()
      .append("line")
      .style('stroke', 'black')
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var nodeElement = nodes.enter()
      .append("g")
      .classed('node', true)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    nodeElement.append("text")
      .attr("dx", 25)
      .attr("dy", ".35em")
      .style('pointer-events', 'none')
      .text(function(d) { return d.id });

    nodeElement.append("circle")
      // .attr("fill", function(d,i){ return i==0?'magenta':'cyan'})
      .attr("r", function(d){
        return 5 + d.r;
      });

    nodeElement.append("circle")
      .attr('class', 'whoosh')
      // .attr("fill", function(d,i){ return i==0?'magenta':'cyan'})
      .attr("r", 2);

    var h = height();
    var w = width();
    // set tick function to update positions
    var ticked = function() {
      nodeElement.attr("transform", function(d) {
        d.y = Math.max(d.r, Math.min(h - d.r, d.y));
        d.x = Math.max(d.r, Math.min(w - d.r, d.x));
        return "translate(" + d.x + "," + d.y + ")";
      });
      linkElement
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    };
    if(simulation)
      simulation.stop();

    simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(minDistance()))
      .force("charge", d3.forceManyBody().distanceMax(300))
      .force("center", d3.forceCenter(width() / 2, height() / 2))
      .alphaTarget(.5);

    simulation.nodes(data.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(data.links);

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  })
})();
