export const thresholdLabels = function({
  i,
  genLength,
  generatedLabels,
  labelDelimiter
}) {
  if (i === 0) {
    const values = generatedLabels[i].split(` ${labelDelimiter} `)
    return `Less than ${values[1]}`
  } else if (i === genLength - 1) {
    const values = generatedLabels[i].split(` ${labelDelimiter} `)
    return `${values[0]} or more`
  }
  return generatedLabels[i]
}

export default {
  thresholdLabels
}
