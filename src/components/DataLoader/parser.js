import { dsvFormat } from "d3"

function JsonParser(dataString) {
  return JSON.parse(dataString)
}

function CsvParser(dataString, opts) {
  const parser = dsvFormat(opts.separator || ",")
  return parser.parse(dataString)
}

const PARSERS = [
  { dataType: "json", parser: JsonParser },
  { dataType: "csv", parser: CsvParser}
]

export function parseData(dataString, opts) {
  for (const parser of PARSERS) {
    try {
      return [parser.dataType, parser.parse(dataString, opts)]
    } catch (_) {

    }
  }
  return [null, null]
}

export function parseAndCheckData(dataString, opts) {
  const [dataType, data] = parseData(dataString, opts)
  if (dataType === null) {
    // This should never happen
    return [dataType, data, "Cannot parse dataset!"]
  } else {
    if (dataType !== "json" && data.length > 0) {
      return [dataType, data, null]
    }
    else if (data.length === 0) {
      return [null, null, "Bad data"]
    }
  }
}