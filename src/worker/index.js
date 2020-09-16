import * as Comlink from 'comlink';
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./worker';

let parsingWorker// = new Worker()

export function parseDatasetInWorker(data, dataTypes, parsingOptions) {  
  try {
    parsingWorker.terminate()
  } catch(err){
  }
  parsingWorker = new Worker()
  let obj = Comlink.wrap(parsingWorker);
  let out = obj.parseDataset(data, dataTypes, parsingOptions)
  return out
}

let mappingWorker// = new Worker()

export function mapDataInWorker(chartName, {data, mapping, visualOptions, dataTypes}) {  
  
  try {
    mappingWorker.terminate()
  } catch(err){
  }
  mappingWorker = new Worker()
  let obj = Comlink.wrap(mappingWorker);
  let out = obj.mapData(chartName, {data, mapping, visualOptions, dataTypes})
  return out
}
