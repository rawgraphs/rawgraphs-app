import { dsvFormat } from 'd3'

function JsonParser(dataString) {
  return JSON.parse(dataString)
}

function CsvParser(dataString, opts) {
  const parser = dsvFormat(opts.separator || ',')
  return parser.parse(dataString)
}

const PARSERS = [
  { dataType: 'json', parse: JsonParser },
  { dataType: 'csv', parse: CsvParser },
]

export function parseData(dataString, opts) {
  for (const parser of PARSERS) {
    try {
      return [parser.dataType, parser.parse(dataString, opts)]
    } catch (e) {
      // console.error('Parsing error', e)
    }
  }
  return [null, null]
}

export function parseAndCheckData(dataString, opts) {
  const [dataType, data] = parseData(dataString, opts)
  if (dataType === null) {
    // This should never happen
    return [dataType, data, 'Cannot parse dataset!']
  } else {
    if (dataType === 'json') {
      return ['json', data, null]
    } else if (data.length > 0) {
      return [dataType, data, null]
    } else {
      return [null, null, 'Bad data']
    }
  }
}
