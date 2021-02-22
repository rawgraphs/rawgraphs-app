import { get, has } from "lodash"
import charts from "./charts"

export const VERSION = "1.1"

function objectsToMatrix(listOfObjects, columns) {
  return listOfObjects.map(obj => {
    return columns.map(col => obj[col])
  })
}

function matrixToObjects(matrix, columns) {
  return matrix.map(record => {
    const obj = {}
    for (let i = 0; i < columns.length; i++) {
      obj[columns[i]] = record[i]
    }
    return obj
  })
}

export function serializeProject(
  userInput,
  userData,
  userDataType,
  parseError,
  unstackedData,
  unstackedColumns,
  data,
  separator,
  thousandsSeparator,
  decimalsSeparator,
  locale,
  stackDimension,
  dataSource,
  currentChart,
  mapping,
  visualOptions,
) {
  const project = {
    version: VERSION,
  }

  /* First stage: user input */
  project.userInput = userInput
  project.userInputFormat = userDataType
  project.dataSource = dataSource

  /* Second stage: parsed */
  project.rawData = objectsToMatrix(userData, Object.keys(data.dataTypes))
  project.parseError = parseError
  project.parseOptions = {
    separator,
    thousandsSeparator,
    decimalsSeparator,
    locale,
    stackDimension,
    unstackedData,
    unstackedColumns
  }

  /* Third stage: typed data ready for chart */
  project.dataTypes = data.dataTypes

  /* Chart: mapping and visual options */
  project.chart = currentChart.metadata.id
  project.mapping = mapping
  project.visualOptions = visualOptions

  return project
}

function getOrError(object, path) {
  if (!has(object, path)) {
    console.log("IMPORT ERROR", object, path)
    throw new Error("Selected project is not valid")
  }
  return get(object, path)
}

export function deserializeProject(project) {
  if (project.version !== VERSION) {
    throw new Error("Invalid version number, please use a suitable deserializer")
  }

  const chartId = getOrError(project, "chart")
  const chart = charts.find(c => c.metadata.id === chartId)
  if (!chart) {
    throw new Error("Unknown chart!")
  }

  return {
    userInput: getOrError(project, "userInput"),
    userData: matrixToObjects(
      getOrError(project, "rawData"), 
      Object.keys(getOrError(project, "dataTypes"))
    ),
    userDataType: getOrError(project, "userInputFormat"),
    parseError: getOrError(project, "parseError"),
    unstackedData: getOrError(project, "parseOptions.unstackedData"),
    unstackedColumns: getOrError(project, "parseOptions.unstackedColumns"),
    dataTypes: getOrError(project, "dataTypes"),
    separator: getOrError(project, "parseOptions.separator"),
    thousandsSeparator: getOrError(project, "parseOptions.thousandsSeparator"),
    decimalsSeparator: getOrError(project, "parseOptions.decimalsSeparator"),
    locale: getOrError(project, "parseOptions.locale"),
    stackDimension: get(project, "parseOptions.stackDimension", undefined),
    dataSource: getOrError(project, "dataSource"),
    currentChart: chart,
    mapping: getOrError(project, "mapping"),
    visualOptions: getOrError(project, "visualOptions"),
  }
}