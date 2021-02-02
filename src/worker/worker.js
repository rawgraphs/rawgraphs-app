import * as Comlink from 'comlink'
import { parseDataset, chart as rawChart } from '@raw-temp/rawgraphs-core'
import charts from '../charts'

const obj = {
  parseDataset(data, dataTypes, parsingOptions) {
    let out =  parseDataset(data, dataTypes, parsingOptions)
    out.errors = (out.errors || []).map(err => ({row: err.row, error: err.error}))
    return out
  
  },
  mapData(chartName, { data, mapping, visualOptions, dataTypes }) {
    const chart = charts.find((item) => item.metadata.name === chartName)
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
