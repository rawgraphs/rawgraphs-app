(function(){

    var tree = raw.models.tree();

    tree.dimensions().remove('size');
    tree.dimensions().remove('color');
    tree.dimensions().remove('label');

    var chart = raw.chart()
        .title('Radial Dendrogram')
        .description(
            "Dendrograms are tree-like diagrams used to represent the distribution of a hierarchical clustering. The different depth levels represented by each node are visualized on the horizontal axes and it is useful to visualize a non-weighted hierarchy.<br />Based on <br /><a href='http://bl.ocks.org/mbostock/4063570'>http://bl.ocks.org/mbostock/4063570</a>")
        .thumbnail("imgs/dendrogram.png")
        .model(tree)
    
    var radius = chart.number ()  
        .title("Radius")
        .defaultValue(1000)
        .fitToWidth(true)

chart.draw(function (selection, data){
    
     var g = selection
            .attr("size", +size() )
            .attr("radius", +radius() )
            .append("g")
            .attr("transform", "translate(40,0)");

    
     var cluster = d3.layout.cluster()
      .size([360, radius - 120]);

     var diagonal = d3.svg.diagonal.radial()
       .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
    
     var nodes = cluster.nodes(root);

     var link = svg.selectAll("path.link")
      .data(cluster.links(nodes))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);
    
     var node = svg.selectAll("g.node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

     node.append("circle")
      .attr("r", 4.5);

     node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) { return d.name; });

  })
})();
