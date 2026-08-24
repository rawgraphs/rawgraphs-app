import * as Comlink from 'comlink'
import Worker from './worker?worker'

let parsingWorker // = new Worker()
let parsingWorkerProxy

export function parseDatasetInWorker(data, dataTypes, parsingOptions) {
  // TODO: Check lazy loading vs terminate on each time
  if (!parsingWorker) {
    parsingWorker = new Worker()
    parsingWorkerProxy = Comlink.wrap(parsingWorker)
  }
  let out = parsingWorkerProxy.parseDataset(data, dataTypes, parsingOptions)
  return out
}

let mappingWorker // = new Worker()
let mappingWorkerProxy

export function mapDataInWorker(
  chartName,
  { data, mapping, visualOptions, dataTypes },
  customChart
) {
  // TODO: Check lazy loading vs terminate on each time
  if (!mappingWorker) {
    mappingWorker = new Worker()
    mappingWorkerProxy = Comlink.wrap(mappingWorker)
  }
  let out = mappingWorkerProxy.mapData(
    chartName,
    { data, mapping, visualOptions, dataTypes },
    customChart
  )
  return out
}
