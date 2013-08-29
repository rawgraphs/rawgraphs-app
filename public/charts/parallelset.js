raw.charts.parallelset = function(){

	return {

		title : 'Parallel Set',
		description : '',
		model : raw.models.graph({}),

		options : {
			width : {
		      value : 800,
		      title : 'Width',
		      type : 'number'
		    },
		    height : {
		      value : 400,
		      title : 'Height',
		      type : 'number'
		    },
		    margin : {
		      value : 5,
		      title : 'Margin',
		      type : 'number'
		    }

		},

		render : function(data, target) {

			var model = this.model,
				options = this.options

			var formatNumber = d3.format(",.0f"),
			    format = function(d) { return formatNumber(d); },
			    width = options.width.value - options.margin.value,
			    height = options.height.value - options.margin.value;

			var svg = target.append("svg")
			    .attr("width", width + options.margin.value +1 )
			    .attr("height", height + options.margin.value +1 )
			  	.append("g")
			    .attr("transform", "translate(" + options.margin.value + "," + options.margin.value + ")");

			var parset = 

			var path = sankey.link();

			var nodes = model.applyOn(data).nodes,
				links = model.applyOn(data).links;

			sankey
			    .nodes(nodes)
			    .links(links)
			    .layout(32);

			


			return this;
		}

	}
};