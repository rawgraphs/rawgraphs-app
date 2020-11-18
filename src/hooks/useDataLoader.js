import { parseDataset } from "@raw-temp/rawgraphs-core"
import { get } from "lodash"
import { useCallback, useState } from "react"
import { DefaultSeparator, localeList, WEBWORKER_ACTIVE } from "../constants"
import { parseDatasetInWorker } from "../worker"
import { normalizeJsonArray, parseAndCheckData } from "./useDataLoaderUtils/parser"
import { stackData } from "./useDataLoaderUtils/stack"

export default function useDataLoader() {
  /* Data to be plot in the chart */
  /* First stage: raw user input */
  const [userInput, setUserInput] = useState('')

  /* Second stage: parsed data and user data type (i.e. csv, json, ...) */
  /*
   * In case user data type is json, userData is not filled immediately.
   * Instead, a JSON view is first shown asking the user to select an
   * array inside the JSON tree. The (parsed) content of the array will
   * be used to fill `userData`. In case of some error during parsing,
   * the `parseError` state holds the error description
   */
  const [userData, setUserData] = useState(null)
  const [userDataType, setUserDataType] = useState(null)
  const [parseError, setParserError] = useState(null)
  const [unstackedInfo, setUnstackedInfo] = useState([
    null,
    null,
  ])

  /* Data Parsing Options */
  const [separator, setSeparator] = useState(DefaultSeparator)
  const [thousandsSeparator, setThousandsSeparator] = useState(',')
  const [decimalsSeparator, setDecimalsSeparator] = useState('.')
  const [locale, setLocale] = useState(navigator.language || 'en-US')
  const [stackDimension, setStackDimension] = useState()

  /* Third stage: data ready to become a chart */
  const [dataSource, setDataSource] = useState(null)
  const [data, setData] = useState(null)

  /* Stack operations */
  const [unstackedData, unstackedColumns] = unstackedInfo

  /* Misc */
  const [loading, setLoading] = useState(false)

  //wrapper for async parse via web worker
  const parseDatasetAsyncAndSetData = useCallback(
    (data, dataTypes, parsingOptions) => {
      setLoading(true)
      parseDatasetInWorker(data, dataTypes, {
        ...parsingOptions,
        dateLocale: get(localeList, parsingOptions.locale),
      })
        .then(setData)
        .catch((err) => {
          console.log('eee', err)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [setData, setLoading]
  )

  const parseDatasetSyncAndSetData = useCallback(
    (data, dataTypes, parsingOptions) => {
      setLoading(true)
      setData(
        parseDataset(data, dataTypes, {
          ...parsingOptions,
          dateLocale: get(localeList, parsingOptions.locale),
        })
      )
      setLoading(false)
    },
    [setData, setLoading]
  )

  const setJsonData = useCallback(data => {
    const normalized = normalizeJsonArray(data)
    setUserData(normalized)
    setData(parseDataset(normalized, undefined, { locale }))
  }, [locale])

  const reset = useCallback(() => {
    setData(null)
    setUserData(null)
    setUserDataType(null)
    setUserInput('')
    setDataSource(null)
    setParserError(null)
    setStackDimension(null)
  }, [])

  const parseDatasetAndSetData = WEBWORKER_ACTIVE
    ? parseDatasetAsyncAndSetData
    : parseDatasetSyncAndSetData

  const hydrateFromSavedProject = useCallback(project => {
    const {
      userInput,
      userData,
      userDataType,
      parseError,
      unstackedColumns,
      unstackedData,
      dataTypes,
      separator,
      thousandsSeparator,
      decimalsSeparator,
      locale,
      stackDimension,
      dataSource,
    } = project
    setUserInput(userInput)
    setUserDataType(userDataType)
    setSeparator(separator)
    setThousandsSeparator(thousandsSeparator)
    setDecimalsSeparator(decimalsSeparator)
    setLocale(locale)
    setStackDimension(stackDimension)
    setDataSource(dataSource)
    setUserData(userData)
    setParserError(parseError)
    setUnstackedInfo([unstackedData, unstackedColumns])
    parseDatasetAndSetData(userData, dataTypes, {
      thousandsSeparator,
      decimalsSeparator,
      locale
    })
  }, [parseDatasetAndSetData])

  

  /*
   * Callback to handle user injecting data
   * When user uploads some data (in any possible way), we store the raw user input at first
   * Then we try to read it using different parsers (notably json and csv)
   * Finally, if read is successful, we go inferring types using the raw-core library
   */
  function setUserDataAndDetect(str, source, options) {
    const [dataType, parsedUserData, error] = parseAndCheckData(str, {
      separator: get(options, 'separator', separator),
    })
    setUserInput(str)
    setDataSource(source)
    setUserDataType(dataType)
    setParserError(error)
    // Data parsed ok set parent data
    if (dataType !== 'json' && !error) {
      setUserData(parsedUserData)
      parseDatasetAndSetData(parsedUserData, undefined, {
        locale,
        decimal: decimalsSeparator,
        group: thousandsSeparator,
      })
      // setData(parseDataset(parsedUserData, undefined, {locale, decimal: decimalsSeparator, group:thousandsSeparator}));
    }
  }

  /*
   * Callback to handle user changing separator
   * When the separator is changed, a fresh parsing of raw user input is required for proper handling
   * Steps are very similar with respect to the `setUserInputAndDetect` callback, except for the
   * fact that we take user input from state instead of from parameters
   */
  function handleChangeSeparator(newSeparator) {
    const [dataType, parsedUserData, error] = parseAndCheckData(userInput, {
      separator: newSeparator,
    })
    setSeparator(newSeparator)
    setUserDataType(dataType)
    setParserError(error)
    if (dataType !== 'json' && !error && newSeparator) {
      setUserData(parsedUserData)
      parseDatasetAndSetData(parsedUserData, undefined, {
        locale,
        decimal: decimalsSeparator,
        group: thousandsSeparator,
      })
      // setData(parseDataset(parsedUserData, undefined, {locale, decimal: decimalsSeparator, group:thousandsSeparator}));
    }
  }

  function handleChangeLocale(newLocale) {
    if (!data) {
      return
    }
    parseDatasetAndSetData(data.dataset, data.dataTypes, {
      locale: newLocale,
      decimal: decimalsSeparator,
      group: thousandsSeparator,
    })
    setLocale(newLocale)
  }

  function handleChangeDecimalSeparator(newDecimalSeparator) {
    const [dataType, parsedUserData, error] = parseAndCheckData(userInput, {
      separator,
    })
    setDecimalsSeparator(newDecimalSeparator)
    setUserDataType(dataType)
    setParserError(error)
    if (dataType !== 'json' && !error) {
      setUserData(parsedUserData)
      setLoading(true)
      parseDatasetAndSetData(parsedUserData, undefined, {
        locale,
        decimal: newDecimalSeparator,
        group: thousandsSeparator,
      })
      //setData(parseDataset(parsedUserData, undefined, {locale, decimal: newDecimalSeparator, group:thousandsSeparator}));
    }
  }

  function handleChangeThousandsSeparator(newThousandsSeparator) {
    const [dataType, parsedUserData, error] = parseAndCheckData(userInput, {
      separator,
    })
    setThousandsSeparator(newThousandsSeparator)
    setUserDataType(dataType)
    setParserError(error)
    if (dataType !== 'json' && !error) {
      setUserData(parsedUserData)
      parseDatasetAndSetData(parsedUserData, undefined, {
        locale,
        decimal: decimalsSeparator,
        group: newThousandsSeparator,
      })
      // setData(parseDataset(parsedUserData, undefined, {locale, decimal: decimalsSeparator, group:newThousandsSeparator}));
    }
  }

  /*
   * Callback to handle user coercing a type of a column
   * When this happens, we don't need to go through data parsing again, we just invoke
   * the raw-core library starting from the parsed data (stage-2 data)
   */
  function coerceTypes(nextTypes) {
    parseDatasetAndSetData(userData, nextTypes, {
      locale,
      decimal: decimalsSeparator,
      group: thousandsSeparator,
    })
    //setData(parseDataset(userData, nextTypes, {locale, decimal: decimalsSeparator, group:thousandsSeparator}));
  }

  /*
   * Callback to handle user selecting a data sample from RawGraphs.io
   * When this happens, we have data parsed with dsv with a proper separator out of the box
   *   since in this case data are rigorously checked
   * So we just take them as good and use the raw-core library to infer types
   */
  function loadSample(rawData, sampleSeparator) {
    setSeparator(sampleSeparator)
    setUserDataAndDetect(
      rawData,
      { type: 'sample' },
      { separator: sampleSeparator }
    )
  }

  function handleInlineEdit(newDataset) {
    setUserData(newDataset)
    parseDatasetAndSetData(newDataset, data.dataTypes, {
      locale,
      decimal: decimalsSeparator,
      group: thousandsSeparator,
    })
    // setData(parseDataset(newDataset, data.dataTypes, {locale}))
  }

  function handleStackOperation(column) {
    setStackDimension(column)
    if (column !== null) {
      if (unstackedData === null) {
        setUnstackedInfo([userData, data.dataTypes])
      }
      const stackedData = stackData(unstackedData || userData, column)
      setUserData(stackedData)
      parseDatasetAsyncAndSetData(stackedData, undefined, {
        locale,
        decimal: decimalsSeparator,
        group: thousandsSeparator,
      })
      // setData(parseDataset(stackedData, undefined, { locale }))
    } else {
      setUserData(unstackedData)
      parseDatasetAndSetData(unstackedData, undefined, {
        locale,
        decimal: decimalsSeparator,
        group: thousandsSeparator,
      })
      // setData(parseDataset(unstackedData, undefined, {locale}))
      setUnstackedInfo([null, null])
    }
  }

  return {
    userInput,
    setUserInput: setUserDataAndDetect,
    userData,
    userDataType,
    parseError,
    unstackedData,
    unstackedColumns,
    separator,
    setSeparator: handleChangeSeparator,
    thousandsSeparator,
    setThousandsSeparator: handleChangeThousandsSeparator,
    decimalsSeparator,
    setDecimalsSeparator: handleChangeDecimalSeparator,
    locale,
    setLocale: handleChangeLocale,
    stackDimension,
    dataSource,
    data,
    loading,
    coerceTypes,
    loadSample,
    handleInlineEdit,
    handleStackOperation,
    setJsonData,
    resetDataLoader: reset,
    hydrateFromSavedProject
  }
}