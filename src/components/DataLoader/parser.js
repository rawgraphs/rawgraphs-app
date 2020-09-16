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

function isScalarType(item) {
  return ['string', 'number', 'boolean'].includes(typeof item)
}

export function normalizeJsonArray(jsonArray) {
  return jsonArray
    .map((element) => {
      let iterateElement = element
      if (Array.isArray(iterateElement)) {
        const tmp = {}
        iterateElement.forEach((item, i) => {
          tmp[`Column ${i + 1}`] = item
        })
        iterateElement = tmp
      }
      if (isScalarType(iterateElement) || iterateElement === null) {
        iterateElement = { value: iterateElement }
      }
      const outElement = {}
      for (const property in iterateElement) {
        const value = iterateElement[property]
        const valueType = typeof value
        if (Array.isArray(value)) {
          outElement[property] = value.filter(isScalarType).join(' ')
        } else if (valueType === 'object' && valueType !== null) {
          for (const nestedProperty in value) {
            const nestedValue = value[nestedProperty]
            if (isScalarType(nestedValue)) {
              outElement[`${property}.${nestedProperty}`] = nestedValue
            }
          }
        } else if (isScalarType(value)) {
          outElement[property] = value
        }
      }
      return outElement
    })
    .filter((item) => item !== null)
}
