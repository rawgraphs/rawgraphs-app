// import { LineGraph, ScatterPlot } from "rawgraphs-charts";
// export default [LineGraph, ScatterPlot];

import { scatterplot, linechart, colortest, matrixplot, sunburst, sankeydiagram, alluvialdiagram, beeswarm, treemap, circlepacking, dendrogram } from "@raw-temp/rawgraphs-charts";

let chartArray = [
  scatterplot,
  linechart,
  matrixplot,
	sunburst,
	sankeydiagram,
  alluvialdiagram,
  colortest
]

// New charts, not included into first release.
// Comment at necessity.
chartArray = [
  scatterplot,
  matrixplot,
  circlepacking,
  treemap,
  sunburst,
  dendrogram,
	sankeydiagram,
  alluvialdiagram,
  beeswarm,
  linechart,
  colortest
]

// Export charts list
export default chartArray;
