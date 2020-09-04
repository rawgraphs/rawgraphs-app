// import { LineGraph, ScatterPlot } from "rawgraphs-charts";

// export default [LineGraph, ScatterPlot];

import { scatterplot, linechart, matrixplot, colortest, sunburst, sankeydiagram, alluvialdiagram } from "@raw-temp/rawgraphs-charts"

const chartArray = [
  scatterplot,
  linechart,
  // colortest,
  matrixplot,
	sunburst,
	sankeydiagram,
	alluvialdiagram
]

// const exampleChartArray = [
//   {
//     name: 'Scatter Plot',
//     thumbnail:"https://via.placeholder.com/320x200/4bc06a/999999.png?text=Scatter%20Plot%20Thumb",
//     category: 'Dispersion',
//     description: 'A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.',
//     basedOn: null,
//     code:'https://github.com/rawgraphs/raw',
//     tutorial:'https://rawgraphs.io/learning/'
//   },
//   {
//     name: 'Sunburst',
//     thumbnail:"https://via.placeholder.com/320x200/4bc06a/999999.png?text=Sunburst%20Thumb",
//     category: 'Weighted Hierarchy',
//     description: 'A sunburst is similar to the treemap, except it uses a radial layout. The root node of the tree is at the center, with leaves on the circumference. The area (or angle, depending on implementation) of each arc corresponds to its value.',
//     basedOn: {
//       label:'Sunburst',
//       url:'https://observablehq.com/@d3/sunburst'
//     },
//     code:'https://github.com/rawgraphs/raw',
//     tutorial:'https://rawgraphs.io/learning/'
//   },
//   {
//     name: 'Linechart',
//     thumbnail:"https://via.placeholder.com/320x200/4bc06a/999999.png?text=Linechart20Thumb",
//     category: 'Lines',
//     description: 'A linechart uses lines to represent values.',
//     basedOn: {
//       label:'Linechart',
//       url:'https://observablehq.com/@d3/line-chart'
//     },
//     code:'https://github.com/rawgraphs/raw',
//     tutorial:'https://rawgraphs.io/learning/'
//   }
// ];

export default chartArray
