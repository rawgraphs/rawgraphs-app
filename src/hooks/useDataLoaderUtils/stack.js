import { flatMap, omit, map } from 'lodash'

export function stackData(data, column) {
  return flatMap(data, (record) => {
    const key = record[column]
    const others = omit(record, column)
    return map(others, (value, prop) => {
      return {
        [column]: key,
        column: prop,
        value,
      }
    })
  })
}
