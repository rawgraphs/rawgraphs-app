import * as Comlink from 'comlink'
import { parseDataset, chart as rawChart } from '@rawgraphs/rawgraphs-core'
import charts from '../charts'
import { requireRawChartsFromUrlWebWorker } from '../hooks/rawRequire'

const obj = {
  parseDataset(data, dataTypes, parsingOptions) {
    let out = parseDataset(data, dataTypes, parsingOptions)
    out.errors = (out.errors || []).map((err) => ({
      row: err.row,
      error: err.error,
    }))
    return out
  },
  mapData(chartName, { data, mapping, visualOptions, dataTypes }, customChart) {
    let chart
    if (customChart) {
      const chartsInPack = requireRawChartsFromUrlWebWorker(customChart.url)
      chart = chartsInPack.find((item) => item.metadata.name === chartName)
    } else {
      chart = charts.find((item) => item.metadata.name === chartName)
    }
    const viz = rawChart(chart, {
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
