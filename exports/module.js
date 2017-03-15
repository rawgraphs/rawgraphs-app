/*
  // TODO
  > Switching color scale
  > Include libraries for necessary charts

  > Yet to Test
    * Hexagonal Binning
    * Scatter Plot
    * Voronoi Tessellation
    * Box plot
    * Circular Dendrogram
    * Cluster Dendrogram
    * Circle Packing
    * Sunburst
    * Treemap
    * Alluvial Diagram
    * Parallel Coordinates
    * Bar chart
    * Pie chart
    * Gantt Chart
    * Area graph
    * Bump Chart
    * Horizon graph
    * Streamgraph

  > Working charts
    * Convex Hull
    * Delaunay Triangulation
    * Clustered Force Layout

*/

d3.json("raw_config.json", function(json) {
    init(json)
});

var init = function(raw_config) {

	var data = raw_config.data;
    var charts = raw.charts.values().sort(function(a, b) {
        return d3.ascending(a.category(), b.category()) || d3.ascending(a.title(), b.title());
    });
    var chart = charts.filter(function(d) {
        return d.title() == raw_config.chart_specifications.title;
    })[0];
    var model = chart ? chart.model() : null;
    var dimensions = model.dimensions().values();
    var options = chart.options();

    function update() {
        d3.select("#chart")
            .append('svg')
            .datum(data)
            .call(chart);
    }

    // Include dimensions to the model
    for (key in dimensions) {
      var dimension = raw_config.dimensions[Object.keys(raw_config.dimensions)[key]];

      if (dimension != null) {
        if (dimension.length > 1) dimensions[key].value = dimension;
        else dimensions[key].value.push(dimension);
      }
    }

    // Include attributes to the chart
    for (key in options) {
    	var option = options[key];

    	// Check for colors
    	if (option.type() === "color") {
    		option.value = d3.scale.ordinal().range(raw.divergingRange(1));
    		option.value.domain(raw_config.chart_specifications[option.title()].domain);
    		option.value.range(raw_config.chart_specifications[option.title()].range);
    	} else {
    		option.value = raw_config.chart_specifications[option.title()];
    	}
    }

    update();
}
