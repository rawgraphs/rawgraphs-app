import React, { useState, useCallback } from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import {
  BsClipboard,
  BsUpload,
  BsGift,
  BsFolder,
  BsCloud,
  BsSearch,
  BsArrowCounterclockwise,
} from 'react-icons/bs'
import DataSamples from '../DataSamples/DataSamples'
import { parseDataset } from '@raw-temp/rawgraphs-core'
import { parseDatasetInWorker } from '../../worker'

import localeList from './localeList'
import ParsingOptions from '../ParsingOptions'
import Paste from './loaders/Paste'
import UploadFile from './loaders/UploadFile'
import { parseAndCheckData, normalizeJsonArray } from './parser'
import JsonViewer from '../JsonViewer'
import DataGrid from '../DataGrid/DataGrid'
import { get } from 'lodash'

import styles from './DataLoader.module.scss'
import { stackData } from './stack'
import UrlFetch from './loaders/UrlFetch'
import { WEBWORKER_ACTIVE } from '../../constants'

function DataLoader({ data, setData, dataSource, setDataSource, setLoading }) {
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
  const [[unstackedData, unstackedColumns], setUnstackedInfo] = useState([
    null,
    null,
  ])

  /* Parsing Options */
  const [separator, setSeparator] = useState(',')
  const [thousandsSeparator, setThousandsSeparator] = useState(',')
  const [decimalsSeparator, setDecimalsSeparator] = useState('.')
  const [locale, setLocale] = useState(navigator.language || 'en-US')
  const [stackDimension, setStackDimension] = useState()

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

  const parseDatasetAndSetData = WEBWORKER_ACTIVE
    ? parseDatasetAsyncAndSetData
    : parseDatasetSyncAndSetData

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

  const options = [
    {
      id: 'paste',
      name: 'Paste your data',
      loader: (
        <Paste
          separator={separator}
          setData={setData}
          userInput={userInput}
          setUserInput={(rawInput) =>
            setUserDataAndDetect(rawInput, { type: 'paste' })
          }
        />
      ),
      message:
        'Copy and paste your data from other applications or websites. You can use tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
      icon: BsClipboard,
    },
    {
      id: 'upload',
      name: 'Upload your data',
      loader: (
        <UploadFile
          userInput={userInput}
          setUserInput={(rawInput) =>
            setUserDataAndDetect(rawInput, { type: 'file' })
          }
        />
      ),
      message:
        'You can load tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
      icon: BsUpload,
    },
    {
      id: 'samples',
      name: 'Try our data samples',
      message: 'Wanna know more about what you can do with RAWGraphs?',
      loader: <DataSamples onSampleReady={loadSample} />,
      icon: BsGift,
    },
    {
      id: 'sparql',
      name: 'SPARQL query SOON!',
      message: 'Load data from a query address.',
      loader: <DataSamples onSampleReady={loadSample} />,
      icon: BsCloud,
      disabled: true,
    },
    {
      id: 'url',
      name: 'From URL',
      message:
        'Enter a web address (URL) pointing to the data (e.g. a public Dropbox file, a public API, ...). Please, be sure the server is CORS-enabled.',
      loader: (
        <UrlFetch
          userInput={userInput}
          setUserInput={(rawInput, source) =>
            setUserDataAndDetect(rawInput, source)
          }
        />
      ),
      icon: BsSearch,
      disabled: false,
    },
    {
      id: 'project',
      name: 'Open your project SOON!',
      message:
        'Load a .rawgraphs project. Questions about how to save your work?',
      loader: (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid lightgrey',
            borderRadius: 4,
            padding: '1rem',
            minHeight: '250px',
            height: '40vh',
          }}
        >
          <span role="img" aria-label="work in progress">
            ⏳
          </span>{' '}
          this will be a drop zone / file loader that accepts .rawgraphs files
        </div>
      ),
      icon: BsFolder,
      disabled: true,
    },
  ]
  const [optionIndex, setOptionIndex] = useState(0)
  const selectedOption = options[optionIndex]

  let mainContent
  if (data) {
    mainContent = (
      <DataGrid
        userDataset={userData}
        dataset={data.dataset}
        errors={data.errors}
        dataTypes={data.dataTypes}
        coerceTypes={coerceTypes}
        onDataUpdate={handleInlineEdit}
      />
    )
  } else if (userDataType === 'json' && userData === null) {
    mainContent = (
      <JsonViewer
        context={JSON.parse(userInput)}
        selectFilter={(ctx) => Array.isArray(ctx)}
        onSelect={(ctx) => {
          const normalized = normalizeJsonArray(ctx)
          setUserData(normalized)
          setData(parseDataset(normalized, undefined, { locale }))
        }}
      />
    )
  } else {
    mainContent = (
      <>
        {selectedOption.loader}
        <p className="mt-3">
          {selectedOption.message}{' '}
          <a
            href="https://rawgraphs.io/learning"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out our guides
          </a>
          .
        </p>
      </>
    )
  }

  return (
    <>
      <Row>
        {!userData && (
          <Col
            xs={3}
            lg={2}
            className="d-flex flex-column justify-content-start pl-3 pr-0 options"
          >
            {options.map((d, i) => {
              const classnames = [
                'w-100',
                'd-flex',
                'align-items-center',
                'user-select-none',
                'cursor-pointer',
                styles['loading-option'],
                d.disabled ? styles['disabled'] : null,
                d.id === selectedOption.id && !userDataType
                  ? styles.active
                  : null,
                userDataType ? styles.disabled : null,
              ]
                .filter((c) => c !== null)
                .join(' ')
              return (
                <div
                  key={d.id}
                  className={classnames}
                  onClick={() => setOptionIndex(i)}
                >
                  <d.icon className="w-25" />
                  <h4 className="m-0 d-inline-block">{d.name}</h4>
                </div>
              )
            })}
          </Col>
        )}
        {userData && (
          <Col
            xs={3}
            lg={2}
            className="d-flex flex-column justify-content-start pl-3 pr-0 options"
          >
            <div
              className={`w-100 d-flex justify-content-center align-items-center ${styles['start-over']} user-select-none cursor-pointer`}
              onClick={() => {
                setData(null)
                setUserData(null)
                setUserDataType(null)
                setUserInput('')
                setDataSource(null)
                setParserError(null)
                setOptionIndex(0)
                setStackDimension(null)
              }}
            >
              <BsArrowCounterclockwise className="mr-2" />
              <h4 className="m-0 d-inline-block">{'Start over'}</h4>
            </div>
            <div className="my-3 divider" />
            <ParsingOptions
              locale={locale}
              setLocale={handleChangeLocale}
              localeList={localeList}
              separator={separator}
              setSeparator={handleChangeSeparator}
              thousandsSeparator={thousandsSeparator}
              setThousandsSeparator={handleChangeThousandsSeparator}
              decimalsSeparator={decimalsSeparator}
              setDecimalsSeparator={handleChangeDecimalSeparator}
              dimensions={data ? unstackedColumns || data.dataTypes : []}
              stackDimension={stackDimension}
              setStackDimension={handleStackOperation}
              userDataType={userDataType}
              dataSource={dataSource}
              onDataRefreshed={(rawInput) =>
                setUserDataAndDetect(rawInput, dataSource)
              }
            />
          </Col>
        )}
        <Col>
          <Row>
            <Col>
              {mainContent}
              {parseError && (
                <Alert variant="danger" className="mt-3">
                  <p className="m-0">{parseError}</p>
                </Alert>
              )}
              {get(data, 'errors', []).length > 0 && (
                <Alert variant="warning" className="mt-3">
                  <p className="m-0">
                    Ops here something seems weird. Check row{' '}
                    {data.errors[0].row + 1}!
                  </p>
                </Alert>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default React.memo(DataLoader)
