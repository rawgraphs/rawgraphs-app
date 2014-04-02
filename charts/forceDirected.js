(function(){

	var graph = raw.models.graph();

	var chart = raw.chart()
		.title('Force Directed')
		.model(graph)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var colors = chart.color()
		.title("Color scale")

	chart.draw(function (selection, data){

		var vis = selection
			.attr("width", +width())
			.attr("height", +height())
			.append("g")

		var nodes = data.nodes;
		var links = data.links;
		var labelAnchors = [];
		var labelAnchorLinks = [];

		nodes.forEach(function (d){
			labelAnchors.push({ node: d });
			labelAnchors.push({ node: d });
		})

		labelAnchorLinks = nodes.map(function (d,i){
			return {
				source : i * 2,
				target : i * 2 + 1,
				weight : 1
			}
		})

		var force = d3.layout.force()
			.size([width(), height()])
			.nodes(nodes)
			.links(links)
			.gravity(.8)
			.linkDistance(30)
			.charge(-2000)
			.linkStrength(function (d) {
				return d.value * 10;
			});

		force.start();

		var force2 = d3.layout.force()
			.nodes(labelAnchors)
			.links(labelAnchorLinks)
			.gravity(0)
			.linkDistance(0)
			.linkStrength(8)
			.charge(-100)
			.size([width(), height()]);
		
		force2.start();

		var link = vis.selectAll("line.link")
			.data(links)
			.enter()
			.append("svg:line")
			.attr("class", "link")
			.style("stroke", "#CCC");

		var node = vis.selectAll("g.node")
			.data(force.nodes())
			.enter()
			.append("svg:g")
			.attr("class", "node");

		var groups = d3.nest()
			.key(function(d){ return d.group; })
			.map(nodes)

		colors.domain(d3.keys(groups))
		
		node.append("svg:circle")
			.attr("r", 5)
			.style("fill", function (d){ return colors()(d.group); })
			.style("stroke", "#FFF")
			.style("stroke-width", 0);
		
		//node.call(force.drag);

		var anchorLink = vis.selectAll("line.anchorLink")
			.data(labelAnchorLinks)

		var anchorNode = vis.selectAll("g.anchorNode")
			.data(force2.nodes())
			.enter().append("svg:g")
				.attr("class", "anchorNode");

		anchorNode.append("svg:circle")
			.attr("r", 0)
			.style("fill", "#FFF");
		
		anchorNode.append("svg:text")
			.style("fill", "#555")
			.style("font-family", "Arial, Helvetica")
			.style("font-size", 11)
			.text(function(d, i) {
				return i % 2 == 0 ? "" : d.node.name;
			})

		var updateLink = function() {
			this.attr("x1", function(d) {
				return d.source.x;
			}).attr("y1", function(d) {
				return d.source.y;
			}).attr("x2", function(d) {
				return d.target.x;
			}).attr("y2", function(d) {
				return d.target.y;
			});

		}

		var updateNode = function() {
			this.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		}

		force.on("tick", function() {
			force2.start();
			node.call(updateNode);
			anchorNode.each(function(d, i) {
				if(i % 2 == 0) {
					d.x = d.node.x;
					d.y = d.node.y;
				} else {

					var b = this.childNodes[1].getBBox(),
						diffX = d.x - d.node.x,
						diffY = d.y - d.node.y,
						dist = Math.sqrt(diffX * diffX + diffY * diffY);

					var shiftX = b.width * (diffX - dist) / (dist * 2);
					shiftX = Math.max(-b.width, Math.min(0, shiftX));
					var shiftY = 5;
					this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
				}
			});

			anchorNode.call(updateNode);
			link.call(updateLink);
			anchorLink.call(updateLink);
		});
	})
})();