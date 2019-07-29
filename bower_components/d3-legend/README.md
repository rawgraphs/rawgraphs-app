# d3-legend

Full documentation: [http://d3-legend.susielu.com](http://d3-legend.susielu.com)

## Looking for compatibility with d3 v3?
- You can see the code for the d3 legend that works with d3 v3 in the [v3 branch](https://github.com/susielu/d3-legend/tree/v3)
- [Documentation](http://d3-legend-v3.susielu.com) for the v3 version of the legend

## d3-legend v4 updates (npm version 2.0.0 and higher)
- Flattened naming for accessing functions
    - d3.legend.color => d3.legendColor
    - d3.legend.size => d3.legendSize
    - d3.legend.symbol => d3.legendSymbol
- NPM package no longer binds to global d3, is now just an object with the three legend functions

## Usage

### Using just the minified file

You must include the [d3 library](http://d3js.org/) before including the legend file. Then you can simply add the compiled js file to your website:

- d3-legend.min.js
- d3-legend.js (Human readable version)

### Using CDN

You can also add the latest version of [d3-legend hosted on cdnjs](https://cdnjs.com/libraries/d3-legend).

### Using npm

You can add the d3 legend as a node module by running:

`npm i d3-svg-legend -S`

To use the version compatible with d3v3 run:
`npm i d3-svg-legend@1.x -S`

Using the import syntax `import legend from 'd3-svg-legend'` gives access to the three legend types as an object. You can also import them independently for example `import { legendColor } from 'd3-svg-legend'`

```
var svg = d3.select("#svg-color-quant");

var quantize = d3.scaleQuantize()
    .domain([ 0, 0.15 ])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(20,20)");

var colorLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .useClass(true)
    .scale(quantize);

svg.select(".legendQuant")
  .call(colorLegend);

```

## Feedback
I would love to hear from you about any additional features that would be useful, please say hi on twitter [@DataToViz](https://www.twitter.com/DataToViz).
