/*
  Script for creating standalone dynamic visualisations using the RAW library.

  \m/ (-_-) \m/

  The 8th of Feb, 2017 - Vathsav Harikrishnan

  // Todo
  > Switching color scales :/
  > Handle multiple dimensions :/
  > Try to retain the JSON format and mifify everything else.

  // General Fixes
  > Prevent dragging the dimensions values beyond the width and the height of the page.

  > Yet to Test
    * Hexagonal Binning
    * Scatter Plot
    * Voronoi Tessellation
    * Box plot
    * Circular Dendrogram
    * Cluster Dendrogram
    * Circle Packing
    * Clustered Force Layout
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

  > Buggy
    * Clustered Force Layout - Doesn't render without Size dimension

*/

d3.json("http://localhost:5000/raw_config.json", function(json) {
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
    var dimensionKeys = Object.keys(raw_config.dimensions);
    var options = chart.options();

    function update() {
        d3.select("#chart")
            .append('svg')
            .datum(data)
            .call(chart);
    }

    // Include dimensions to the model
    for (key in dimensions) {
    	var dimension = dimensions[key];
    	var title = dimension.title();
    	var value = raw_config.dimensions[key];
    	dimensions[key].title(dimensionKeys[key]);
    	dimensions[key].value.push(raw_config.dimensions[dimensionKeys[key]]);
    }

    // Include attributes to the chart
    for (key in options) {
    	var option = options[key];

    	// Check for colors!
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
