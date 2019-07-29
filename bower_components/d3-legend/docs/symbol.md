d3.**legendSymbol()**

Constructs a new symbol legend. The legend component expects a d3 scale as the basic input, but also has a number of optional parameters for changing the default display such as vertical or horizontal orientation, shape of the symbol next to the label, symbol sizing, and label formatting.

legendSymbol.**scale()**

Creates a new d3 legend based on the scale. The code determines the type of scale and generates the different symbol and label pairs. The scale's range will be used as the d-attribute in an svg path for each symbol in the legend.

legendSymbol.**cells()**

This parameter is only valid for continuous scales (like linear and log). When there is no indication from the domain or range for the number of steps in the legend you may want to display, it defaults to five steps in equal increments. You can pass the cells function a single number which will create equal increments for that number of steps, or an array of the [specific steps](#color-linear-custom) you want the legend to display.

legendSymbol.**cellFilter(function)**

This function is run as a filter function against the array of cells. If you have a function(d){ return true or false }, d has a .data and a .label property as it iterates over each cell it will display. Create a false condition for any cells you want to exclude from being displayed. An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).

legendSymbol.**orient(string)**

Accepts "vertical" or "horizontal" for legend orientation. Default set to "vertical."

legendSymbol.**ascending(boolean)**

If you pass this a true, it will reverse the order of the scale.

legendSymbol.**shapePadding()**

Applies to all shapes. Determines vertical or horizontal spacing between shapes depending on the respective orient setting. Default set to 2px.

legendSymbol.**classPrefix(string)**

Adds this string to the beginning of all of the components of the legend that have a class. This allows for namespacing of the classes.

legendSymbol.**title(string)**

Sets the legend's title to the string. Automatically moves the legend cells down based on the size of the title. An example: [Symbol - Ordinal Scale](#symbol-ordinal).

legendSymbol.**titleWidth(number)**

Will break the legend title into multiple lines based on the width in pixels. An example: [Color - Quantile Scale Legend](#color-quant).

legendSymbol.**labels([string] or function(options))**

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

legendSymbol.**labelAlign(string)**

Only used if the legend's orient is set to "horizontal." Accepts "start", "middle", or "end" as inputs to determine if the labels are aligned on the left, middle or right under the symbol in a horizontal legend. An example: [Size - Linear Scale Legend, Lines](#size-line).

legendSymbol.**labelFormat(d3.format or d3.format string)**

Takes a [d3.format](https://github.com/mbostock/d3/wiki/Formatting) and applies that styling to the legend labels. Default is set to `d3.format(".01f")`.

legendSymbol.**locale(d3.format locale)**

Takes a [d3.format locale](https://github.com/d3/d3-format/tree/master/locale) and applies it to the legend labels. Default is set to [US english](https://github.com/d3/d3-format/blob/master/locale/en-US.json).

legendSymbol.**labelOffset(number)**

A value that determines how far the label is from the symbol in each legend item. Default set to 10px.

legendSymbol.**labelDelimiter(string)**

Change the default "to" text when working with a quant scale.

legendColor.**labelWrap(number)**

Add text wrapping to the cell labels. In orient horizontal you can use this in combination with shapePadding to get the desired spacing. An exampe: [Size - Linear Scale](#size-line). In orient vertical this will automatically scale the cells to fit the label.An example: [Symbol - Ordinal Scale](#symbol-ordinal) 

legendSymbol.**on(string, function)**

There are three custom event types you can bind to the legend: "cellover", "cellout", and "cellclick" An exampe: [Symbol - Ordinal Scale](#symbol-ordinal)
