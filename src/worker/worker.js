import * as Comlink from "comlink";
import { parseDataset } from "@raw-temp/rawgraphs-core";

const obj = {
  parseDataset(data, dataTypes, parsingOptions) {
    return parseDataset(data, dataTypes, parsingOptions);
  },
};

Comlink.expose(obj);
