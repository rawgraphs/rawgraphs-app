raw.charts.dendogram = function(){

	/* 
		To be moved somewhere it can be reused across classes

	 */
	var ClassUtil = {};
	(function(Class) {
		
		/*
			AccessMaker helps rapidly create getter and setters in classes meant to provide a fluent/chainable interface.
			@param instance  the instance object to return after a variable is set
			@param state the object with the attributes to read/write when a variable is accessed.
		*/
		Class.accessMaker = function(instance, state) {
			return {
				/*
					GetSet creates an accessor/mutator for a given property
					@param attr  the attribute to update
					@param aroundSetFns the functions to execute at the time a value is set.
				*/
				getSet: function(attr, aroundSetFns) {
					return function(_) {
						if(_ === undefined) { return state[attr]; }
						if(_ !== state[attr]) {
							(aroundSetFns || []).forEach(function(fn) {
								fn(_);
							});
							state[attr] = _;
						}
						return instance;
					};
				}
			};
		};
		return Class;
	})(ClassUtil);

	/* 
		To be moved somewhere it can be reused across projects. For instance, in a raw folder, in the bower-components directory. 
		No dependency on the raw domain space should exist within this class, to allow the graphing classes to be reused in 
		any project (possibly even on nodejs for automatic graph generation, server side). 
	*/
	var Dendrogram = {};
	(function(Class) {

		Class.defaults = {width: 800, height: 500, labelsVisible: true };

		Class.instance = function() {
			var instance = {}, s = {}, dataChange = false;

			function warnChange() { dataChange = true; }

			var access              = ClassUtil.accessMaker(instance, s);
			instance.width          = access.getSet("width",  [warnChange]);
			instance.height         = access.getSet("height", [warnChange]);
			instance.data           = access.getSet("data",   [warnChange]);
			instance.targetElement  = access.getSet("targetElement", [warnChange]);
			instance.labelsVisible  = access.getSet("labelsVisible", [warnChange]);

			instance.render = function() {

				var width     = s.width;
				var height    = s.height;
				var modelData = s.data;
				var labels    = s.labelsVisible;
				var target    = s.targetElement;

				// early exit conditions
				if(!modelData) { throw '[No data specified]'; }
				if(!target) { throw '[No target element specified]'; }

				// validation
				if(!width || isNaN(width)) { width = Class.defaults.width; }
				if(!height || isNaN(height)) { height = Class.defaults.height; }

				// process
				if(!dataChange) { return; }
				var format = d3.format(",d");

				var cluster = d3.layout.cluster()
					.size([height, width - 160]);

				var diagonal = d3.svg.diagonal()
					.projection(function(d) { return [d.y, d.x]; });

				var svg = target.append("svg")
					.attr("width", width)
					.attr("height", height)
					.append("g")
					.attr("transform", "translate(40,0)");
				
				var nodes = cluster.nodes(modelData),
					links = cluster.links(nodes);

				var link = svg.selectAll(".link")
					.data(links)
					.enter().append("path")
					.attr("class", "link")
					.attr("d", diagonal)
					.style("fill","none")
					.style("stroke","#ccc")
					.style("stroke-width","1.5px");

				var node = svg.selectAll(".node")
					.data(nodes)
					.enter().append("g")
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
				
				node.append("circle")
					.attr("r", 4.5)
					.style("fill","#fff")
					.style("stroke","steelblue")
					.style("stroke-width","1.5px");

				if (labels) {
					node.append("text")
						.attr("dx", function(d) { return d.children ? -8 : 8; })
						.attr("dy", 3)
						.style("font-size","11px")
						.style("font-family","Arial, Helvetica, sans-serif")
						.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
						.text(function(d) { return d.name; });
				}

			};


			return instance;
		};

	})(Dendrogram);

	return {

	/* 
		This should be renamed dendogramAdapter or something of the like. 
		The sole responsibility of this class is to manager access to the Dendogram class from the 
		raw-app. It is not really of any use to anybody outside of the raw app. 
	*/

		title : 'Dendogram',
		description : 'Dendrograms are tree-like diagrams used to represent the distribution of a hierarchical clustering. The different depth levels represented by each node are visualized on the horizontal axes and it is useful to visualize a non-weighted hierarchy.<br>Based on <a href="http://bl.ocks.org/mbostock/4063570">http://bl.ocks.org/mbostock/4063570</a>.',
		image : 'charts/imgs/dendogram.png',
		model : raw.models.hierarchy(),

		options : {

			width : {
				title : 'Width',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : Dendrogram.defaults.width
			},

			height : {
				title : 'Height',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : Dendrogram.defaults.height
			},

			labels : {
				title : 'Labels',
				type : 'boolean',
				position : 2,
				description : 'Show labels',
				value : Dendrogram.defaults.labelsVisible
			},

			color : {
				title : 'Colors',
				type : 'color',
				position : 2,
				description : 'Color sucks!',
				value : raw.diverging()
			}
		},

		render : function(data, target) {

			var model = this.model,
				options = this.options;

			if(!this.graph) { this.graph = Dendrogram.instance(); }
			var g = this.graph;
			g.data(model.applyOn(data));
			g.width(options.width.value);
			g.height(options.height.value);
			g.labelsVisible(options.labels.value);
			g.targetElement(target);
			g.render();

			return this;

		}
	};
};
