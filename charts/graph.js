(function() {
  var g = raw.models.graph();

  // The Chart
  var chart = raw.chart()
    .title('Basic k-partite graph')
    .description(
      "Display the relationship between two or more (k) entity types to see correlations between dimensions")
    .category("Multi categorical")
    .model(g)

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

  var colors = chart.color()
    .title("Color scale")

  var minDistance = chart.number()
    .title('min distance between nodes')
    .defaultValue(80);

  var isLinkTransparent = chart.checkbox()
    .title('transparent links')
    .defaultValue(false);

  var simulation = d3.forceSimulation();

  chart.draw(function(selection, data) {

    // svg size
    selection
      .attr("width", width())
      .attr("height", height())
      .style('background', '#e0e0e0');



    if (!data.nodes.length) {
      console.warn('no graph data.');
      return;
    }

    // set up color groups
    var groups = [];

    // remap nodes
    data.nodes = data.nodes.map(function(d) {
      d.r = 1;
      if (groups.indexOf(d.group) === -1) {
        groups.push(d.group);
      }
      return d;
    });

    colors.domain(groups);


    // add links layer
    var links = selection
      .append("g").classed("links", true)
      .selectAll("g.node")
      .data(data.links, function(d, i) {
        return i;
      });

    // add nodes layer
    var nodes = selection
      .append("g").classed("nodes", true)
      .selectAll("g.node")
      .data(data.nodes, function(d) {
        return d.name;
      });

    var isSimulationRunning = true;
    // add toggle play/pause, top left
    var toggle = selection
      .append("g")
      .style('transform', 'translate(20px,25px)')
      .style('background', '#f0f0f0')
      .on('click', function(d) {
        if (simulation) {
          if (isSimulationRunning) {
            stopSimulation();
          } else {
            playSimulation();
          }
        }
      });

    var toggleText = toggle
      .append("text")
      .text('pause force layout');


    var linkElement = links.enter()
      .append("line")
      .style('stroke', isLinkTransparent() ? '#00000022' : '#000000')
      .attr("stroke-width", function(d) {
        return Math.sqrt(d.value);
      });

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
      .text(function(d) {
        return d.name
      });

    nodeElement.append("circle")
      .attr("fill", function(d) {
        return colors()(d.group)
      })
      .attr("r", function(d) {
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
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

    };

    var stopSimulation = function() {
      simulation.stop();
      toggleText.text('play force layout');
      isSimulationRunning = false;
    }

    var playSimulation = function() {
      simulation.alphaTarget(0).restart();
      toggleText.text('pause force layout');
      isSimulationRunning = true;
    }

    if (simulation)
      simulation.stop();

    simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) {
        return d.index;
      }).distance(minDistance()))
      .force("charge", d3.forceManyBody().distanceMax(300))
      .force("center", d3.forceCenter(width() / 2, height() / 2))
      .alphaTarget(.5);

    simulation.nodes(data.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(data.links);

    function dragstarted(d) {
      if (!d3.event.active) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        toggleText.text('pause force layout');
        isSimulationRunning = true;
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
        toggleText.text('pause force layout');
        isSimulationRunning = true;
      }
      d.fx = null;
      d.fy = null;
    }

  })
})();
