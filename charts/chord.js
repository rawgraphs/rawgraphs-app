(function(){

	// A Chord plug-in for RAW
	// Based on http://www.delimited.io/blog/2013/12/8/chord-diagrams-in-d3

	// The Model

	var model = raw.model();

	// Source Groups
	var sources = model.dimension() 
		.title('Source Arcs')
		.types(String)
		.required(1)

	// Target Groups
	var targets = model.dimension() 
		.title('Target Arcs')
		.types(String)
		.required(1)

	// Chord Sizes
	var sizes = model.dimension() 
		.title('Chord Size')
		.types(Number)
		.required(1)

	// Mapping function
	// Map the user-designated source, target, and size columns
	model.map(function (data){
		return data.map(function(d) {
	      return {
	        source: sources(d),
	        target: targets(d),
	        size: sizes(d)
	      };
	    });
	})

	
	// The Chart

	var chart = raw.chart()
		.title("Chord")
		.description("<p>Chord diagrams visualize relationships amongst different groups. Groups are represented with arcs, "
						+ "and the relationships between them are shown using quadratic Bézier curves.</p>"
						+ "<p>Note that input data must compute down to a <a href='http://en.wikipedia.org/wiki/Square_matrix'>square matrix</a>. "
						+ "In other words, the <b>input data must describe a numerical relationship between every possible group (source and target) combination</b>. "
						+ "For example, if there are n unique entities in the sources column, there must be n*(n-1)/2 lines of input data.</p>"
						+ "<p>Based on <a href='http://www.delimited.io/blog/2013/12/8/chord-diagrams-in-d3'>http://www.delimited.io/blog/2013/12/8/chord-diagrams-in-d3</a></p>")
		.category("Correlations")
		.model(model)
		.thumbnail("imgs/chordChart.png");

	// Some options we want to expose to the users
	// For each of them a GUI component will be created
	// Options can be use within the Draw function
	// by simply calling them (i.e. witdh())
	// the current value of the options will be returned

	// Width
	var width = chart.number()
		.title('Width')
		.defaultValue(700)

	// Height
	var height = chart.number()
		.title('Height')
		.defaultValue(700)

	// Spacing (in em) between arcs
	var arcSpacing = chart.number()
		.title('Arc/Group Spacing')
		.defaultValue(3)

	// Drawing function
	// selection represents the d3 selection (svg)
	// data is not the original set of records
	// but the result of the model map function
	chart.draw(function (selection, data){
		var mpr = chordMpr(data);

		mpr
		  .addValuesToMap('source')
	      .setFilter(function (row, a, b) {
	      	return (row.source === a.name && row.target === b.name)
	      })
	      .setAccessor(function (recs, a, b) {
		    if (!recs[0]) {
		      return 0;
		    }
		    return +recs[0].size;
	      });

	    drawChords(selection, mpr.getMatrix(), mpr.getMap());
	});

	//*******************************************************************
    //  DRAW THE CHORD DIAGRAM
    //*******************************************************************
    var drawChords = function (selection, matrix, mmap) {
      var w = width(), h = height(), r1 = h / 2, r0 = r1 - 110;

      d3.select("body").append("div").attr("id", "tooltip");

      var fill = d3.scale.ordinal()
          .range(['#c7b570','#c6cdc7','#335c64','#768935','#507282','#5c4a56','#aa7455','#574109','#837722','#73342d','#0a5564','#9c8f57','#7895a4','#4a5456','#b0a690','#0a3542',]);

      var chord = d3.layout.chord()
          .padding(arcSpacing() / 100)
          .sortSubgroups(d3.descending)
          .sortChords(d3.descending);

      var arc = d3.svg.arc()
          .innerRadius(r0)
          .outerRadius(r0 + 20);

      var svg = selection
          .attr("width", w)
          .attr("height", h)
        .append("svg:g")
          .attr("id", "circle")
          .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

      svg.append("circle")
          .attr("r", r0 + 20)
          .style("opacity", 0);

      var rdr = chordRdr(matrix, mmap);
      chord.matrix(matrix);

      var g = svg.selectAll("g.group")
          .data(chord.groups())
        .enter().append("svg:g")
          .attr("class", "group")
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);

      g.append("svg:path")
          .style("stroke", "black")
          .style("fill", function(d) { return fill(rdr(d).gname); })
          .attr("d", arc);

      g.append("svg:text")
          .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
          .attr("dy", ".35em")
          .style("font-family", "helvetica, arial, sans-serif")
          .style("font-size", "9px")
          .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (r0 + 26) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
          })
          .text(function(d) { return rdr(d).gname; });

	  var chordPaths = svg.selectAll("path.chord")
	        .data(chord.chords())
	      .enter().append("svg:path")
	        .attr("class", "chord")
	        .style("stroke", function(d) { return d3.rgb(fill(rdr(d).sname)).darker(); })
	        .style("fill", function(d) { return fill(rdr(d).sname); })
	        .attr("d", d3.svg.chord().radius(r0))
	        .on("mouseover", function (d) {
	          d3.select("#tooltip")
	            .style("visibility", "visible")
	            .html(chordTip(rdr(d)))
	            .style("top", function () { return (d3.event.pageY - 170)+"px"})
	            .style("left", function () { return (d3.event.pageX - 100)+"px";});
	        })
	        .on("mouseout", mouseout);

      function chordTip (d) {
        var p = d3.format(".1%"), q = d3.format(",.2f")
        return "Chord Info:<br/>"
          +  d.sname + " <-- " + d.tname
          + ": " + q(d.svalue) + "<br/>"
          + p(d.svalue/d.stotal) + " of " + d.sname + "'s Total (" + q(d.stotal) + ")<br/>"
          + p(d.svalue/d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")<br/>";
      }

      function groupTip (d) {
        var p = d3.format(".1%"), q = d3.format(",.2f")
        return "Group Info:<br/>"
            + d.gname + " : " + q(d.gvalue) + "<br/>"
            + p(d.gvalue/d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")"
      }

      function mouseover(d, i) {
        d3.select("#tooltip")
          .style("visibility", "visible")
          .html(groupTip(rdr(d)))
          .style("top", function () { return (d3.event.pageY - 80)+"px"})
          .style("left", function () { return (d3.event.pageX - 130)+"px";})

        chordPaths.classed("faded", function(p) {
          return p.source.index != i
              && p.target.index != i;
        });
      }

      function mouseout(d, i) {
      	d3.select("#tooltip").style("visibility", "hidden");
      }
    };

})();