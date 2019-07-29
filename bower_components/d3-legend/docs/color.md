d3.**legendColor()**

Constructs a new color legend. The legend component expects a d3 scale as the basic input, but also has a number of optional parameters for changing the default display such as vertical or horizontal orientation, shape of the symbol next to the label, symbol sizing, and label formatting.

legendColor.**scale(d3.scale)**

Creates a new d3 legend based on the scale. The code determines the type of scale and generates the appropriate symbol and label pairs.

legendColor.**cells(number or [numbers])**

This parameter is only valid for continuous scales (like linear and log). When there is no indication from the domain or range for the number of steps in the legend you may want to display, it defaults to five steps in equal increments. You can pass the cells function a single number which will create equal increments for that number of steps, or an array of the [specific steps](#color-linear-custom) you want the legend to display.

legendColor.**cellFilter(function)**

This function is run as a filter function against the array of cells. If you have a function(d){ return true or false }, d has a .data and a .label property as it iterates over each cell it will display. Create a false condition for any cells you want to exclude from being displayed. An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).

legendColor.**orient(string)**

Accepts "vertical" or "horizontal" for legend orientation. Default set to "vertical."

legendColor.**ascending(boolean)**

If you pass this a true, it will reverse the order of the scale.

legendColor.**shape(string[, path-string])**

Accepts "rect", "circle", "line", or "path". If you choose "path," you must also pass a second parameter as a path string. Defaults to "rect." An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).

legendColor.**shapeWidth(number)**

Only applies to shape of "rect" or "line." Default set to 15px.

legendColor.**shapeHeight(number)**

Only applies to shape of "rect." Default set to 15px.

legendColor.**shapeRadius(number)**

Only applies to shape of "circle." Default set to 10px.

legendColor.**shapePadding(number)**

Applies to all shapes. Determines vertical or horizontal spacing between shapes depending on the respective orient setting. Default set to 2px.

legendColor.**useClass(boolean)**

The default behavior is for the legend to set the fill of the legend's symbols (except for the "line" shape which uses stroke). If you set useClass to `true` then it will apply the scale's output as classes to the shapes instead of the fill or stroke. An example: [Color - Quantile Scale Legend](#color-quant).

legendColor.**classPrefix(string)**

Adds this string to the beginning of all of the components of the legend that have a class. This allows for namespacing of the classes.

legendColor.**title(string)**

Sets the legend's title to the string. Automatically moves the legend cells down based on the size of the title. An example: [Symbol - Ordinal Scale](#symbol-ordinal).

legendColor.**titleWidth(number)**

Will break the legend title into multiple lines based on the width in pixels. An example: [Color - Quantile Scale Legend](#color-quant).

legendColor.**labels([string] or function(options))**

Passing a string:
Sets the legend labels to the array of strings passed to the legend. If the array is not the same length as the array the legend calculates, it merges the values and gives the calculated labels for the remaining items. An example: [Size - Linear Scale Legend, Lines](#size-line).

Passing a function:
This function is called for each generated label and gives you the options:
- i: current index
- genLength: total length of generated labels
- generatedLabels: array of generated labels
- domain: array from input scale
- range: array from input scale
This allows you to make any custom functions to handle labels. An example: [Color - Threshold Scale, Custom Labels](#color-threshold)

List of [helper functions](#helpers).

legendColor.**labelAlign(string)**

Only used if the legend's orient is set to "horizontal." Accepts "start", "middle", or "end" as inputs to determine if the labels are aligned on the left, middle or right under the symbol in a horizontal legend. An example: [Size - Linear Scale Legend, Lines](#size-line).

legendColor.**labelFormat(d3.format or d3.format string)**

Takes a [d3.format](https://github.com/mbostock/d3/wiki/Formatting) and applies that styling to the legend labels. Default is set to `d3.format(".01f")`.

legendColor.**locale(d3.format locale)**

Takes a [d3.format locale](https://github.com/d3/d3-format/tree/master/locale) and applies it to the legend labels. Default is set to [US english](https://github.com/d3/d3-format/blob/master/locale/en-US.json).

legendColor.**labelOffset(number)**

A value that determines how far the label is from the symbol in each legend item. Default set to 10px.

legendColor.**labelDelimiter(string)**

Change the default "to" text when working with a quant scale.

legendColor.**labelWrap(number)**

Add text wrapping to the cell labels. In orient horizontal you can use this in combination with shapePadding to get the desired spacing. An exampe: [Size - Linear Scale](#size-line). In orient vertical this will automatically scale the cells to fit the label.An example: [Symbol - Ordinal Scale](#symbol-ordinal) 

legendColor.**on(string, function)**

There are three custom event types you can bind to the legend: "cellover", "cellout", and "cellclick" An example: [Symbol - Ordinal Scale](#symbol-ordinal)
