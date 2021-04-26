import { dsvFormat } from 'd3'
import { DefaultSeparator, separatorsList } from '../../constants'

function JsonParser(dataString) {
  //Removing white lines (useful when pasting from sheets, ecc)
  const trimmedDataString = dataString
    .trim()
    .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '')
  
  return [JSON.parse(trimmedDataString), {}]
}

function CsvParser(dataString, opts) {
  //Removing white lines (useful when pasting from sheets, ecc)
  const trimmedDataString = dataString
    .trim()
    .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '')
  
  // Use the separator the user gives me, if any
  if (opts.separator) {
    return [
      dsvFormat(opts.separator).parse(trimmedDataString),
      {
        separator: opts.separator,
      },
    ]
  }
  // Otherwise, try to infer it
  const candidates = []
  for (const _separator of separatorsList) {
    const separator = _separator
      .replace(/\\r/g, '\r')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
    try {
      const parser = dsvFormat(separator)
      const parsed = parser.parse(trimmedDataString)
      if (
        (parsed.length > 0 && Object.keys(parsed[0]).length > 1) ||
        separator === DefaultSeparator
      ) {
        candidates.push({
          separator,
          score: Object.keys(parsed[0]).length,
          parsed,
        })
      }
    } catch (e) {}
  }
  candidates.sort((a, b) => b.score - a.score)
  return [candidates[0].parsed, { separator: candidates[0].separator }]
}

export const SparqlMarker = Symbol("RawgraphsSparqlMarker")

function SparqlParser(data, opts) {
  if (data[SparqlMarker] === true) {
    return [data, {}]
  } 
  throw new Error("Not a sparql result")
}

const PARSERS = [
  { dataType: 'sparql', parse: SparqlParser },
  { dataType: 'json', parse: JsonParser },
  { dataType: 'csv', parse: CsvParser },
]

export function parseData(data, opts) {
  for (const parser of PARSERS) {
    try {
      const [parsed, extra] = parser.parse(data, opts)
      return [parser.dataType, parsed, extra]
    } catch (e) {
      // console.error('Parsing error', e)
    }
  }
  return [null, null]
}

export function parseAndCheckData(dataString, opts) {
  const [dataType, data, extra] = parseData(dataString, opts)
  if (dataType === null) {
    // This should never happen
    return [
      dataType,
      data,
      'Cannot parse dataset! (This should never happen)',
      {},
    ]
  } else {
    if (dataType === 'json') {
      return ['json', data, null, extra]
    } else if (data.length > 0) {
      return [dataType, data, null, extra]
    } else {
      return [null, null, "We can't parse your data.", {}]
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
