(function() {

	var graph = raw.models.graph();

	var chart = raw.chart()
		.title('Alluvial Diagram')
		.description(
			"Alluvial diagrams allow to represent flows and to see correlations between categorical dimensions, visually linking to the number of elements sharing the same categories. It is useful to see the evolution of cluster (such as the number of people belonging to a specific group). It can also be used to represent bipartite graphs, using each node group as dimensions.<br/>Mainly based on DensityDesign's work with Fineo, it is inspired by <a href='http://bost.ocks.org/mike/sankey/'>http://bost.ocks.org/mike/sankey/</a>")
		.thumbnail("imgs/alluvial.png")
		.category("Multi categorical")
		.model(graph);

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true);

	var height = chart.number()
		.title("Height")
		.defaultValue(500);

	var nodeWidth = chart.number()
		.title("Node Width")
		.defaultValue(5);

	var sortBy = chart.list()
		.title("Sort by")
		.values(['size', 'name', 'automatic'])
		.defaultValue('size');

	var colors = chart.color()
		.title("Color scale");

	chart.draw((selection, data) => {

		var formatNumber = d3.format(",.0f"),
			format = d => {
				return formatNumber(d);
			};

		var g = selection
			.attr("width", +width())
			.attr("height", +height() + 20)
			.append("g")
			.attr("transform", "translate(0, 10)");

		// Calculating the best nodePadding

		var nested = d3.nest()
			.key(d => {
				return d.group;
			})
			.rollup(d => {
				return d.length;
			})
			.entries(data.nodes);

		var maxNodes = d3.max(nested, d => {
			return d.values;
		});

		var sankey = d3.sankey()
			.nodeWidth(+nodeWidth())
			.nodePadding(d3.min([10, (height() - maxNodes) / maxNodes]))
			.size([+width(), +height()]);

		var path = sankey.link(),
			nodes = data.nodes,
			links = data.links;

		sankey
			.nodes(nodes)
			.links(links)
			.layout(32);

		// Re-sorting nodes

		nested = d3.nest()
			.key(d => {
				return d.group;
			})
			.map(nodes);

		Object.values(nested)
			.forEach(d => {
				var y = (height() - d3.sum(d, n => {
					return n.dy + sankey.nodePadding();
				})) / 2 + sankey.nodePadding() / 2;
				d.sort((a, b) => {
					if(sortBy() == "automatic") return b.y - a.y;
					if(sortBy() == "size") return b.dy - a.dy;
					if(sortBy() == "name") return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
				})
				d.forEach(node => {
					node.y = y;
					y += node.dy + sankey.nodePadding();
				})
			});

		// Resorting links

		Object.values(nested).forEach(d => {

			d.forEach(node => {

				var ly = 0;
				node.sourceLinks
					.sort((a, b) => {
						return a.target.y - b.target.y;
					})
					.forEach(link => {
						link.sy = ly;
						ly += link.dy;
					});

				ly = 0;

				node.targetLinks
					.sort((a, b) => {
						return a.source.y - b.source.y;
					})
					.forEach(link => {
						link.ty = ly;
						ly += link.dy;
					});
			})
		})

		colors.domain(links, d => {
			return d.source.name;
		});

		var link = g.append("g").selectAll(".link")
			.data(links)
			.enter().append("path")
			.attr("class", "link")
			.attr("d", path)
			.style("stroke-width", d => {
				return Math.max(1, d.dy);
			})
			.style("fill", "none")
			.style("stroke", d => {
				return colors()(d.source.name);
			})
			.style("stroke-opacity", ".4")
			.sort((a, b) => {
				return b.dy - a.dy;
			})
			.append("title")
			.text(d => {
				return d.value;
			});

		var node = g.append("g").selectAll(".node")
			.data(nodes)
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", d => {
				return `translate(${d.x}, ${d.y})`;
			});

		node.append("rect")
			.attr("height", d => {
				return d.dy;
			})
			.attr("width", sankey.nodeWidth())
			.style("fill", d => {
				return d.sourceLinks.length ? colors(d.name) : "#666";
			})
			.append("title")
			.text(d => {
				return d.name + "\n" + format(d.value);
			});

		node.append("text")
			.attr("x", -6)
			.attr("y", d => {
				return d.dy / 2;
			})
			.attr("dy", ".35em")
			.attr("text-anchor", "end")
			.attr("transform", null)
			.text(d => {
				return d.name;
			})
			.style("font-size", "11px")
			.style("font-family", "Arial, Helvetica")
			.style("pointer-events", "none")
			.filter(d => {
				return d.x < +width() / 2;
			})
			.attr("x", 6 + sankey.nodeWidth())
			.attr("text-anchor", "start");

	})

})();
