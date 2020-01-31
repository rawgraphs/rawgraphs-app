(function() {

	var tree = raw.models.tree();

	var chart = raw.chart()
		.title('Circle Packing')
		.description(
			"Nested circles allow to represent hierarchies and compare values. This visualization is particularly effective to show the proportion between elements through their areas and their position inside a hierarchical structure.<br/>Based on <a href='http://bl.ocks.org/mbostock/4063530'>http://bl.ocks.org/mbostock/4063530</a>")
		.thumbnail("imgs/circlePacking.png")
		.category('Hierarchy (weighted)')
		.model(tree)

	var diameter = chart.number()
		.title("Diameter")
		.defaultValue(800)
		.fitToWidth(true)

	var padding = chart.number()
		.title("Padding")
		.defaultValue(5)

	var sort = chart.checkbox()
		.title("Sort by size")
		.defaultValue(false)

	var colors = chart.color()
		.title("Color scale")

	var showLabels = chart.checkbox()
		.title("Show labels")
		.defaultValue(true)

	var showLegend = chart.checkbox()
		.title("show legend")
		.defaultValue(false);

	chart.draw(function(selection, data) {

		if (!data.children.length) return;

		// Retrieving dimensions from model
		var colorDimension = tree.dimensions().get('color');
		var sizeDimension = tree.dimensions().get('size');

		var legendWidth = 200;

		var margin = {
			top: 0,
			right: showLegend() ? legendWidth : 0,
			bottom: 0,
			left: 0
		};
		var outerDiameter = +diameter(),
			innerDiameter = outerDiameter - d3.max([margin.top + margin.bottom, margin.left + margin.right]);

		var x = d3.scaleLinear()
			.range([0, innerDiameter]);

		var y = d3.scaleLinear()
			.range([0, innerDiameter]);

		var pack = d3.pack()
			.padding(+padding())
			.size([innerDiameter, innerDiameter]);

		//compute the hierarchy
		var hierarchy = d3.hierarchy(data).sum(function(d) {
			return +d.size;
		});
		var nodes = hierarchy
			.sort(function(a, b) {
				return sort() ? b.value - a.value : null;
			})
			.descendants();

		pack(hierarchy);

		var g = selection
			.attr("width", outerDiameter)
			.attr("height", outerDiameter)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		colors.domain(nodes.filter(function(d) {
				return !d.children
			}),
			function(d) {
				return d.data.color;
			});

		g.append("g").selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) {
				return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
			})
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.attr("r", function(d) {
				return d.r;
			})
			.style("fill", function(d) {
				return !d.children ? colors()(d.data.color) : '';
			})
			.style("fill-opacity", function(d) {
				return !d.children ? 1 : 0;
			})
			.style("stroke", '#ddd')
			.style("stroke-opacity", function(d) {
				return !d.children ? 0 : 1
			})

		g.append("g").selectAll("text")
			.data(nodes.filter(function(d) {
				return showLabels();
			}))
			.enter().append("text")
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.style("font-family", "Arial, Helvetica")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.text(function(d) {
				return d.data.label ? d.data.label.join(", ") : d.data.name;
			});

		// rebulid the scale used in the packing
		let sizeExtent = d3.extent(hierarchy.leaves(), d => d.r);
		let valueExtent = d3.extent(hierarchy.leaves(), d => d.value);

		console.log('size:',sizeExtent, 'values:',valueExtent)

		var radiusScale = d3.scaleLinear()
			.range(sizeExtent)
			.domain(valueExtent)
		//get list of all nodes: hierarchy.descendants()

		if (showLegend()) {
			var newLegend = raw.legend()
				.legendWidth(legendWidth)
				.addColor(colorDimension.key(), colors())
				.addSize(sizeDimension.key(), radiusScale, valueExtent)
			selection.call(newLegend);
		}
	})
})();
