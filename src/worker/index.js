import * as Comlink from 'comlink';
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./worker';

let worker// = new Worker()
let obj// = Comlink.wrap(worker);

export default async function parseDatasetInWorker(data, dataTypes, parsingOptions) {  
  try {
    worker.terminate()
  } catch(err){
  }
  worker = new Worker()
  obj = Comlink.wrap(worker);
  
  let out = obj.parseDataset(data, dataTypes, parsingOptions)
  return out

}
