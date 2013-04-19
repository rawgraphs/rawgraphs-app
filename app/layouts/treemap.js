/**
 * 
 * Treemap
 */
raw.layouts.treemap = function(){
	return {

		id : 'treemap',
		label : 'Treemap',
		description : 'A treemap is whatever <a href="http://www.google.com">Google</a>.',
		model : raw.models.tree({

			color : {
				label : 'Color',
				accept : ['number','string'],
				single : true,
				value : [],
				map : function(d) { return this.value.length ? d[this.value[0].key] : null; }
			},

			size : {
				label : 'Size',
				accept : ['number'],
				value : [],
				single : true,
				map : function(d,t) {
					return this.value.length ? parseFloat(d[this.value[0].key]) + parseFloat(t) : parseFloat(t) + 1;
				}
			}
		}),

		style : {

			width : {
				label : 'Width',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 800
			},

			height : {
				label : 'Height',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 500
			},

			padding : {
				label : 'Padding',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 10
			},

			labels : {
				label : 'Labels',
				type : 'check',
				position : 2,
				description : 'Show labels',
				value : true
			},

			color : {
				label : 'Color',
				type : 'color',
				position : 2,
				description : 'Color sucks!',
				value : raw.diverging()
			}
		},

		render : function(data, target) {

			var model = this.model,
				style = this.style,
				format = d3.format(",d");

			var l = d3.layout.treemap()
    			.sticky(true)
    		    .padding(parseInt(style.padding.value) || 0)
			    .size([parseInt(style.width.value), parseInt(style.height.value)])
			    .value(function(d) { return d.map.size; })
						
			//target.selectAll("svg").remove()

			svg = target.append("svg:svg")
			    .attr("width", parseInt(style.width.value))
			    .attr("height", parseInt(style.height.value))
			  	.append("svg:g")
			    .attr("transform", "translate(.5,.5)");

			var nodes = l.nodes(model.applyOn(data))
      			.filter(function(d) { return !d.children; });

			var cell = svg.selectAll("g")
			    .data(nodes)
			    .enter().append("svg:g")
			    	.attr("class", "cell")
			      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			var color = style.color.value.domain(raw.unique(nodes, "map.color"));

			cell.append("svg:rect")
			    .attr("width", function(d) { return d.dx; })
			    .attr("height", function(d) { return d.dy; })
			    .style("fill", function(d) { return d.map.color ? color(d.map.color) : color('undefined'); })
			    .style("fill-opacity", function(d) {  return d.children ? 0 : 1; })
				.style("stroke","#fff")
			
			cell.append("svg:title")
				.text(function(d) { return d.name + ": " + format(d.map.size); });

			if (style.labels.value) {
				cell.append("svg:text")
				    .attr("x", function(d) { return d.dx / 2; })
				    .attr("y", function(d) { return d.dy / 2; })
				    .attr("dy", ".35em")
				    .attr("text-anchor", "middle")
				   	.style("font-size","11px")
					.style("font-family","Arial, Helvetica, sans-serif")
				    .text(function(d) { return d.name +  " (" + d.value + ")"; })//{ return d.children ? null : d.name; })
			}
			return this;
		}

	}
};