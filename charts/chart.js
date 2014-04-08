(function(){

	// A simple scatterplot for APIs demo

	// The Model

	var model = raw.model();

	// X axis dimension
	// Adding a title to be displayed in the UI
 	// and limiting the type of data to Numbers only
	var x = model.dimension() 
		.title('X Axis')
		.types(Number)

	// Y axis dimension
	// Same as X
	var y = model.dimension() 
		.title('Y Axis')
		.types(Number)

	// Mapping function
	// For each record in the data returns the values
	// for the X and Y dimensions and casts them as numbers
	model.map(function (data){
		return data.map(function (d){
			return {
				x : +x(d),
				y : +y(d)
			}
		})
	})

	
	// The Chart

	var chart = raw.chart()
		.title("Simple Scatter Plot")
		.description("A simple chart for test")
		.model(model)

	// Some options we want to expose to the users
	// For each of them a GUI component will be created
	// Options can be use within the Draw function
	// by simply calling them (i.e. witdh())
	// the current value of the options will be returned

	// Width
	var width = chart.number()
		.title('Width')
		.defaultValue(900)

	// Height
	var height = chart.number()
		.title('Height')
		.defaultValue(600)

	// A simple margin
	var margin = chart.number()
		.title('margin')
		.defaultValue(10)

	// Drawing function
	// selection represents the d3 selection (svg)
	// data is not the original set of records
	// but the result of the model map function
	chart.draw(function (selection, data){

		// svg size
		selection
			.attr("width", width())
			.attr("height", height())

		// x and y scale
		var xScale = d3.scale.linear().domain([0, d3.max(data, function (d){ return d.x; })]).range([margin(), width()-margin()]);
		var yScale = d3.scale.linear().domain([0, d3.max(data, function (d){ return d.y; })]).range([height()-margin(), margin()]);

		// let's plot the dots!
		selection.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.attr("cx", function(d) { return xScale(d.x); })
			.attr("cy", function(d) { return yScale(d.y); })
			.attr("r", 5)

	})
})();