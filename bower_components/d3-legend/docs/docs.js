(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "d3.**legendColor()**\n\nConstructs a new color legend. The legend component expects a d3 scale as the basic input, but also has a number of optional parameters for changing the default display such as vertical or horizontal orientation, shape of the symbol next to the label, symbol sizing, and label formatting.\n\nlegendColor.**scale(d3.scale)**\n\nCreates a new d3 legend based on the scale. The code determines the type of scale and generates the appropriate symbol and label pairs.\n\nlegendColor.**cells(number or [numbers])**\n\nThis parameter is only valid for continuous scales (like linear and log). When there is no indication from the domain or range for the number of steps in the legend you may want to display, it defaults to five steps in equal increments. You can pass the cells function a single number which will create equal increments for that number of steps, or an array of the [specific steps](#color-linear-custom) you want the legend to display.\n\nlegendColor.**cellFilter(function)**\n\nThis function is run as a filter function against the array of cells. If you have a function(d){ return true or false }, d has a .data and a .label property as it iterates over each cell it will display. Create a false condition for any cells you want to exclude from being displayed. An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).\n\nlegendColor.**orient(string)**\n\nAccepts \"vertical\" or \"horizontal\" for legend orientation. Default set to \"vertical.\"\n\nlegendColor.**ascending(boolean)**\n\nIf you pass this a true, it will reverse the order of the scale.\n\nlegendColor.**shape(string[, path-string])**\n\nAccepts \"rect\", \"circle\", \"line\", or \"path\". If you choose \"path,\" you must also pass a second parameter as a path string. Defaults to \"rect.\" An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).\n\nlegendColor.**shapeWidth(number)**\n\nOnly applies to shape of \"rect\" or \"line.\" Default set to 15px.\n\nlegendColor.**shapeHeight(number)**\n\nOnly applies to shape of \"rect.\" Default set to 15px.\n\nlegendColor.**shapeRadius(number)**\n\nOnly applies to shape of \"circle.\" Default set to 10px.\n\nlegendColor.**shapePadding(number)**\n\nApplies to all shapes. Determines vertical or horizontal spacing between shapes depending on the respective orient setting. Default set to 2px.\n\nlegendColor.**useClass(boolean)**\n\nThe default behavior is for the legend to set the fill of the legend's symbols (except for the \"line\" shape which uses stroke). If you set useClass to `true` then it will apply the scale's output as classes to the shapes instead of the fill or stroke. An example: [Color - Quantile Scale Legend](#color-quant).\n\nlegendColor.**classPrefix(string)**\n\nAdds this string to the beginning of all of the components of the legend that have a class. This allows for namespacing of the classes.\n\nlegendColor.**title(string)**\n\nSets the legend's title to the string. Automatically moves the legend cells down based on the size of the title. An example: [Symbol - Ordinal Scale](#symbol-ordinal).\n\nlegendColor.**titleWidth(number)**\n\nWill break the legend title into multiple lines based on the width in pixels. An example: [Color - Quantile Scale Legend](#color-quant).\n\nlegendColor.**labels([string] or function(options))**\n\nPassing a string:\nSets the legend labels to the array of strings passed to the legend. If the array is not the same length as the array the legend calculates, it merges the values and gives the calculated labels for the remaining items. An example: [Size - Linear Scale Legend, Lines](#size-line).\n\nPassing a function:\nThis function is called for each generated label and gives you the options:\n- i: current index\n- genLength: total length of generated labels\n- generatedLabels: array of generated labels\n- domain: array from input scale\n- range: array from input scale\nThis allows you to make any custom functions to handle labels. An example: [Color - Threshold Scale, Custom Labels](#color-threshold)\n\nList of [helper functions](#helpers).\n\nlegendColor.**labelAlign(string)**\n\nOnly used if the legend's orient is set to \"horizontal.\" Accepts \"start\", \"middle\", or \"end\" as inputs to determine if the labels are aligned on the left, middle or right under the symbol in a horizontal legend. An example: [Size - Linear Scale Legend, Lines](#size-line).\n\nlegendColor.**labelFormat(d3.format or d3.format string)**\n\nTakes a [d3.format](https://github.com/mbostock/d3/wiki/Formatting) and applies that styling to the legend labels. Default is set to `d3.format(\".01f\")`.\n\nlegendColor.**locale(d3.format locale)**\n\nTakes a [d3.format locale](https://github.com/d3/d3-format/tree/master/locale) and applies it to the legend labels. Default is set to [US english](https://github.com/d3/d3-format/blob/master/locale/en-US.json).\n\nlegendColor.**labelOffset(number)**\n\nA value that determines how far the label is from the symbol in each legend item. Default set to 10px.\n\nlegendColor.**labelDelimiter(string)**\n\nChange the default \"to\" text when working with a quant scale.\n\nlegendColor.**labelWrap(number)**\n\nAdd text wrapping to the cell labels. In orient horizontal you can use this in combination with shapePadding to get the desired spacing. An exampe: [Size - Linear Scale](#size-line). In orient vertical this will automatically scale the cells to fit the label.An example: [Symbol - Ordinal Scale](#symbol-ordinal) \n\nlegendColor.**on(string, function)**\n\nThere are three custom event types you can bind to the legend: \"cellover\", \"cellout\", and \"cellclick\" An example: [Symbol - Ordinal Scale](#symbol-ordinal)\n";

},{}],2:[function(require,module,exports){
module.exports = "- [Color Legend](#color)\n  - [Documentation](#color-doc)\n  - [Examples](#color-examples)\n    - [Quantile Scale Legend](#color-quant)\n    - [Threshold Scale Legend](#color-threshold)\n    - [Linear Scale Legend - Horizontal](#color-linear)\n    - [Linear Scale Legend - 10 cells](#color-linear-10)\n    - [Linear Scale Legend - Custom cells](#color-linear-custom)\n    - [Ordinal Scale Legend - Custom shape](#color-ordinal)\n- [Size Legend](#size)\n  - [Documentation](#size-doc)\n  - [Examples](#size-examples)\n    - [Linear Scale Legend - Circles](#size-linear)\n    - [Linear Scale Legend - Lines](#size-line)\n\n- [Symbol Legend](#symbol)\n  - [Documentation](#symbol-doc)\n  - [Examples](#symbol-examples)\n    - [Ordinal Scale Legend - Custom Symbols](#symbol-ordinal)\n\n- [Summary of Functions](#summary) - table of which functions are shared across legend types\n";

},{}],3:[function(require,module,exports){
module.exports = "d3.**legendHelpers()**\n\nConvenience functions for using this module\n\nlegendHelpers.**thresholdLabels**\n\nChanges the labels so the first one label says \"Less than _first-threshold_\" and the last one says \"More than _last-threshold_\".\nExample: [Color - Threshold Scale, Custom Labels](#color-threshold)\n";

},{}],4:[function(require,module,exports){
//Color: Quantile #svg-color-quant
var svg = d3.select("#svg-color-quant")

var quantize = d3
  .scaleQuantize()
  .domain([0, 0.15])
  .range(
    d3.range(9).map(function(i) {
      return "q" + i + "-9"
    })
  )

svg
  .append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(20,20)")

var legend = d3
  .legendColor()
  .labelFormat(d3.format(".2f"))
  .useClass(true)
  .title("A really really really really really long title")
  .titleWidth(100)
  .scale(quantize)

svg.select(".legendQuant").call(legend)

//Color: Treshold #svg-color-threshold

var svg = d3.select("#svg-color-threshold")

var thresholdScale = d3
  .scaleThreshold()
  .domain([0, 1000, 2500, 5000, 10000])
  .range(
    d3.range(6).map(function(i) {
      return "q" + i + "-9"
    })
  )

svg
  .append("g")
  .attr("class", "legendThreshold")
  .attr("transform", "translate(20,20)")

var legend = d3
  .legendColor()
  .labelFormat(d3.format(".2f"))
  .labels(d3.legendHelpers.thresholdLabels)
  .useClass(true)
  .shapeWidth(30)
  .scale(thresholdScale)

svg.select(".legendThreshold").call(legend)

//Color: Log #svg-color-log
var svg = d3.select("#svg-color-log")

var log = d3
  .scaleLog()
  .domain([0.1, 100, 1000])
  .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"])

svg
  .append("g")
  .attr("class", "legendLog")
  .attr("transform", "translate(20,20)")

var logLegend = d3
  .legendColor()
  .cells([0.1, 5, 10, 50, 100, 500, 1000])
  .scale(log)

svg.select(".legendLog").call(logLegend)

//Color Linear #svg-color-linear
var linear = d3
  .scaleLinear()
  .domain([0, 10])
  .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"])

svg = d3.select("#svg-color-linear")

svg
  .append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(20,20)")

var legendLinear = d3
  .legendColor()
  .shapeWidth(30)
  .orient("horizontal")
  .scale(linear)

//Color Linear #svg-color-linear-10
svg.select(".legendLinear").call(legendLinear)

svg = d3.select("#svg-color-linear-10")

svg
  .append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(20,20)")

legendLinear.cells(10)

svg.select(".legendLinear").call(legendLinear)

//Linear #svg-color-linear-custom
svg.select(".legendLinear").call(legendLinear)

svg = d3.select("#svg-color-linear-custom")

svg
  .append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(20,20)")

legendLinear.cells([1, 2, 3, 6, 8])

svg.select(".legendLinear").call(legendLinear)

//Ordinal #svg-color-ordinal
var ordinal = d3
  .scaleOrdinal()
  .domain(["a", "b", "c", "d", "e"])
  .range([
    "rgb(153, 107, 195)",
    "rgb(56, 106, 197)",
    "rgb(93, 199, 76)",
    "rgb(223, 199, 31)",
    "rgb(234, 118, 47)"
  ])

svg = d3.select("#svg-color-ordinal")

svg
  .append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(20,20)")

var legendOrdinal = d3
  .legendColor()
  .shape(
    "path",
    d3
      .symbol()
      .type(d3.symbolTriangle)
      .size(150)()
  )
  .shapePadding(10)
  .cellFilter(function(d) {
    return d.label !== "e"
  })
  .scale(ordinal)

svg.select(".legendOrdinal").call(legendOrdinal)

var sequentialScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 10])
svg = d3.select("#svg-color-sequential")

svg
  .append("g")
  .attr("class", "legendSequential")
  .attr("transform", "translate(20,20)")

var legendSequential = d3
  .legendColor()
  .shapeWidth(30)
  .cells(10)
  .orient("horizontal")
  .scale(sequentialScale)

svg.select(".legendSequential").call(legendSequential)

//Size: Linear Circle #svg-size-linear
var linearSize = d3
  .scaleLinear()
  .domain([0, 10])
  .range([10, 30])

svg = d3.select("#svg-size-linear")

svg
  .append("g")
  .attr("class", "legendSize")
  .attr("transform", "translate(20, 40)")

var legendSize = d3
  .legendSize()
  .scale(linearSize)
  .shape("circle")
  .shapePadding(15)
  .labelOffset(20)
  .orient("horizontal")
  .on("cellover", function() {
    console.log("cellover", d3.event, d3.event.type)
  })

svg.select(".legendSize").call(legendSize)

//Size: Linear Line #svg-size-line
var lineSize = d3
  .scaleLinear()
  .domain([0, 10])
  .range([2, 10])

svg = d3.select("#svg-size-line")

svg
  .append("g")
  .attr("class", "legendSizeLine")
  .attr("transform", "translate(0, 20)")

var legendSizeLine = d3
  .legendSize()
  .scale(lineSize)
  .shape("line")
  .orient("horizontal")
  .labels([
    "tiny testing at the beginning",
    "small",
    "medium",
    "large",
    "grand, all the way long label"
  ])
  .labelWrap(30)
  .shapeWidth(50)
  .labelAlign("start")
  .shapePadding(10)

svg.select(".legendSizeLine").call(legendSizeLine)

//Symbol: Ordinal #svg-symbol-ordinal
svg = d3.select("#svg-symbol-ordinal")

svg
  .append("g")
  .attr("class", "legendSymbol")
  .attr("transform", "translate(20, 20)")

var triangleU = d3.symbol().type(d3.symbolTriangle)(),
  circle = d3.symbol().type(d3.symbolCircle)(),
  cross = d3.symbol().type(d3.symbolCross)(),
  diamond = d3.symbol().type(d3.symbolDiamond)(),
  star = d3.symbol().type(d3.symbolStar)()

//example output of d3.svg.symbol().type('circle')();
//"M0,4.51351666838205A4.51351666838205,4.51351666838205 0 1,1 0,
//-4.51351666838205A4.51351666838205,4.51351666838205 0 1,1 0,4.51351666838205Z"

var symbolScale = d3
  .scaleOrdinal()
  .domain(["a longer label", "b", "c", "d", "e"])
  .range([triangleU, circle, cross, diamond, star])

var legendPath = d3
  .legendSymbol()
  .scale(symbolScale)
  //.orient("horizontal")
  .labelWrap(30)
  .title("Symbol Legend Title")
  .on("cellclick", function(d) {
    alert("clicked " + d)
  })

svg.select(".legendSymbol").call(legendPath)

},{}],5:[function(require,module,exports){
var md = require('marked');

var contents = require('./contents.md')
var color = require('./color.md');
var size = require('./size.md');
var symbol = require('./symbol.md');
var helpers = require('./helpers.md');

document.getElementById('contents-md').innerHTML = md(contents);
document.getElementById('color-md').innerHTML = md(color);
document.getElementById('size-md').innerHTML = md(size);
document.getElementById('symbol-md').innerHTML = md(symbol);
document.getElementById('helpers-md').innerHTML = md(helpers);

},{"./color.md":1,"./contents.md":2,"./helpers.md":3,"./size.md":6,"./symbol.md":7,"marked":8}],6:[function(require,module,exports){
module.exports = "d3.**legendSize()**\n\nConstructs a new size legend. The legend component expects a d3 scale as the basic input, but also has a number of optional parameters for changing the default display such as vertical or horizontal orientation, shape of the symbol next to the label, symbol sizing, and label formatting.\n\nlegendSize.**scale(d3.scale)**\n\nCreates a new d3 legend based on the scale. The code determines the type of scale and generates the different symbol and label pairs. Expects a scale that has a numerical range.\n\nlegendSize.**cells(number or [numbers])**\n\nThis parameter is only valid for continuous scales (like linear and log). When there is no indication from the domain or range for the number of steps in the legend you may want to display, it defaults to five steps in equal increments. You can pass the cells function a single number which will create equal increments for that number of steps, or an array of the [specific steps](#color-linear-custom) you want the legend to display.\n\nlegendSize.**cellFilter(function)**\n\nThis function is run as a filter function against the array of cells. If you have a function(d){ return true or false }, d has a .data and a .label property as it iterates over each cell it will display. Create a false condition for any cells you want to exclude from being displayed. An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).\n\nlegendSize.**orient(string)**\n\nAccepts \"vertical\" or \"horizontal\" for legend orientation. Default set to \"vertical.\"\n\nlegendSize.**ascending(boolean)**\n\nIf you pass this a true, it will reverse the order of the scale.\n\nlegendSize.**shape(string)**\n\nAccepts \"rect\", \"circle\", or \"line\". Defaults to \"rect.\" The assumption is that the scale's output will be used for the width and height if you select \"rect,\" the radius if you select \"circle,\" and the stroke-width if you select \"line.\" If you want to have a custom shape of different sizes in your legend, use the symbol legend and make each path string for the sizes you want as the range array.\n\nlegendSize.**shapeWidth(number)**\n\nOnly applies to shape \"line.\" Default set to 15px.\n\nlegendSize.**shapePadding(number)**\n\nApplies to all shapes. Determines vertical or horizontal spacing between shapes depending on the respective orient setting. Default set to 2px.\n\nlegendSize.**classPrefix(string)**\n\nAdds this string to the beginning of all of the components of the legend that have a class. This allows for namespacing of the classes.\n\nlegendSize.**title(string)**\n\nSets the legend's title to the string. Automatically moves the legend cells down based on the size of the title. An example: [Symbol - Ordinal Scale](#symbol-ordinal).\n\nlegendSize.**titleWidth(number)**\n\nWill break the legend title into multiple lines based on the width in pixels. An example: [Color - Quantile Scale Legend](#color-quant).\n\nlegendSize.**labels([string] or function(options))**\n\nPassing a string:\nSets the legend labels to the array of strings passed to the legend. If the array is not the same length as the array the legend calculates, it merges the values and gives the calculated labels for the remaining items. An example: [Size - Linear Scale Legend, Lines](#size-line).\n\nPassing a function:\nThis function is called for each generated label and gives you the options:\n- i: current index\n- genLength: total length of generated labels\n- generatedLabels: array of generated labels\n- domain: array from input scale\n- range: array from input scale\nThis allows you to make any custom functions to handle labels. An example: [Color - Threshold Scale, Custom Labels](#color-threshold)\n\nList of [helper functions](#helpers).\n\n\nlegendSize.**labelAlign(string)**\n\nOnly used if the legend's orient is set to \"horizontal.\" Accepts \"start\", \"middle\", or \"end\" as inputs to determine if the labels are aligned on the left, middle or right under the symbol in a horizontal legend. An example: [Size - Linear Scale Legend, Lines](#size-line).\n\nlegendSize.**labelFormat(d3.format or d3.format string)**\n\n\nTakes a [d3.format](https://github.com/mbostock/d3/wiki/Formatting) and applies that styling to the legend labels. Default is set to `d3.format(\".01f\")`.\n\nlegendSize.**locale(d3.format locale)**\n\nTakes a [d3.format locale](https://github.com/d3/d3-format/tree/master/locale) and applies it to the legend labels. Default is set to [US english](https://github.com/d3/d3-format/blob/master/locale/en-US.json).\n\nlegendSize.**labelOffset(number)**\n\nA value that determines how far the label is from the symbol in each legend item. Default set to 10px.\n\nlegendSize.**labelDelimiter(string)**\n\nChange the default \"to\" text when working with a quant scale.\n\nlegendColor.**labelWrap(number)**\n\nAdd text wrapping to the cell labels. In orient horizontal you can use this in combination with shapePadding to get the desired spacing. An exampe: [Size - Linear Scale](#size-line). In orient vertical this will automatically scale the cells to fit the label.An example: [Symbol - Ordinal Scale](#symbol-ordinal) \n\nlegendSize.**on(string, function)**\n\nThere are three custom event types you can bind to the legend: \"cellover\", \"cellout\", and \"cellclick\" An exampe: [Symbol - Ordinal Scale](#symbol-ordinal)\n";

},{}],7:[function(require,module,exports){
module.exports = "d3.**legendSymbol()**\n\nConstructs a new symbol legend. The legend component expects a d3 scale as the basic input, but also has a number of optional parameters for changing the default display such as vertical or horizontal orientation, shape of the symbol next to the label, symbol sizing, and label formatting.\n\nlegendSymbol.**scale()**\n\nCreates a new d3 legend based on the scale. The code determines the type of scale and generates the different symbol and label pairs. The scale's range will be used as the d-attribute in an svg path for each symbol in the legend.\n\nlegendSymbol.**cells()**\n\nThis parameter is only valid for continuous scales (like linear and log). When there is no indication from the domain or range for the number of steps in the legend you may want to display, it defaults to five steps in equal increments. You can pass the cells function a single number which will create equal increments for that number of steps, or an array of the [specific steps](#color-linear-custom) you want the legend to display.\n\nlegendSymbol.**cellFilter(function)**\n\nThis function is run as a filter function against the array of cells. If you have a function(d){ return true or false }, d has a .data and a .label property as it iterates over each cell it will display. Create a false condition for any cells you want to exclude from being displayed. An example: [Color - Ordinal Scale Legend, custom shape](#color-ordinal).\n\nlegendSymbol.**orient(string)**\n\nAccepts \"vertical\" or \"horizontal\" for legend orientation. Default set to \"vertical.\"\n\nlegendSymbol.**ascending(boolean)**\n\nIf you pass this a true, it will reverse the order of the scale.\n\nlegendSymbol.**shapePadding()**\n\nApplies to all shapes. Determines vertical or horizontal spacing between shapes depending on the respective orient setting. Default set to 2px.\n\nlegendSymbol.**classPrefix(string)**\n\nAdds this string to the beginning of all of the components of the legend that have a class. This allows for namespacing of the classes.\n\nlegendSymbol.**title(string)**\n\nSets the legend's title to the string. Automatically moves the legend cells down based on the size of the title. An example: [Symbol - Ordinal Scale](#symbol-ordinal).\n\nlegendSymbol.**titleWidth(number)**\n\nWill break the legend title into multiple lines based on the width in pixels. An example: [Color - Quantile Scale Legend](#color-quant).\n\nlegendSymbol.**labels([string] or function(options))**\n\nPassing a string:\nSets the legend labels to the array of strings passed to the legend. If the array is not the same length as the array the legend calculates, it merges the values and gives the calculated labels for the remaining items. An example: [Size - Linear Scale Legend, Lines](#size-line).\n\nPassing a function:\nThis function is called for each generated label and gives you the options:\n- i: current index\n- genLength: total length of generated labels\n- generatedLabels: array of generated labels\n- domain: array from input scale\n- range: array from input scale\nThis allows you to make any custom functions to handle labels. An example: [Color - Threshold Scale, Custom Labels](#color-threshold)\n\nList of [helper functions](#helpers).\n\nlegendSymbol.**labelAlign(string)**\n\nOnly used if the legend's orient is set to \"horizontal.\" Accepts \"start\", \"middle\", or \"end\" as inputs to determine if the labels are aligned on the left, middle or right under the symbol in a horizontal legend. An example: [Size - Linear Scale Legend, Lines](#size-line).\n\nlegendSymbol.**labelFormat(d3.format or d3.format string)**\n\nTakes a [d3.format](https://github.com/mbostock/d3/wiki/Formatting) and applies that styling to the legend labels. Default is set to `d3.format(\".01f\")`.\n\nlegendSymbol.**locale(d3.format locale)**\n\nTakes a [d3.format locale](https://github.com/d3/d3-format/tree/master/locale) and applies it to the legend labels. Default is set to [US english](https://github.com/d3/d3-format/blob/master/locale/en-US.json).\n\nlegendSymbol.**labelOffset(number)**\n\nA value that determines how far the label is from the symbol in each legend item. Default set to 10px.\n\nlegendSymbol.**labelDelimiter(string)**\n\nChange the default \"to\" text when working with a quant scale.\n\nlegendColor.**labelWrap(number)**\n\nAdd text wrapping to the cell labels. In orient horizontal you can use this in combination with shapePadding to get the desired spacing. An exampe: [Size - Linear Scale](#size-line). In orient vertical this will automatically scale the cells to fit the label.An example: [Symbol - Ordinal Scale](#symbol-ordinal) \n\nlegendSymbol.**on(string, function)**\n\nThere are three custom event types you can bind to the legend: \"cellover\", \"cellout\", and \"cellclick\" An exampe: [Symbol - Ordinal Scale](#symbol-ordinal)\n";

},{}],8:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(
          cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1])
        );
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return '';
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[^]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[^]*/, '$1') + href;
  } else {
    return base + href;
  }
}
baseUrls = {};
originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[4,5]);
