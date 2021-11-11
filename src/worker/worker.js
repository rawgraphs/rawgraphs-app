/* eslint-disable no-restricted-globals */
import * as Comlink from 'comlink'
import * as d3 from 'd3'
import * as rawgraphsCore from '@rawgraphs/rawgraphs-core'
import charts from '../charts'

const obj = {
  parseDataset(data, dataTypes, parsingOptions) {
    let out =  rawgraphsCore.parseDataset(data, dataTypes, parsingOptions)
    out.errors = (out.errors || []).map(err => ({row: err.row, error: err.error}))
    return out

  },
  mapData(chartName, { data, mapping, visualOptions, dataTypes }, customChart) {
    let chart
    if (customChart) {
      // Import custom chart
      self.d3 = d3
      self.rawgraphsCore = rawgraphsCore
      self.RAWGRAPH_APP_INJECT_HOOK = []
      self.importScripts(customChart.url)
      // Read the populated stack
      const chartsInPack = []
      while (self.RAWGRAPH_APP_INJECT_HOOK.length > 0) {
        chartsInPack.push(self.RAWGRAPH_APP_INJECT_HOOK.pop())
      }
      chart = chartsInPack.find((item) => item.metadata.name === chartName)
    } else {
      chart = charts.find((item) => item.metadata.name === chartName)
    }
    const viz = rawgraphsCore.chart(chart, {
      data,
      mapping,
      dataTypes,
      visualOptions,
    })
    try {
      const vizData = viz._getVizData()
      return vizData
    } catch (err) {}
  },
}

Comlink.expose(obj)
