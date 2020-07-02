import React, { useState } from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import {
  BsClipboard,
  BsUpload,
  BsGift,
  BsFolder,
  BsTrashFill,
} from 'react-icons/bs'
import DataSamples from '../DataSamples/DataSamples'
import { parseDataset } from '@raw-temp/rawgraphs-core'


import localeList from './localeList'
import ParsingOptions from '../ParsingOptions'
import Paste from './loaders/Paste'
import { parseAndCheckData } from './parser'
import JsonViewer from '../JsonViewer'
import DataGrid from '../DataGrid/DataGrid'

export default function DataLoader({ data, setData }) {
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

  /* Parsing Options */
  const [locale, setLocale] = useState('en-CA')
  const [separator, setSeparator] = useState(',')

  /*
   * Callback to handle user injecting data
   * When user uploads some data (in any possible way), we store the raw user input at first
   * Then we try to read it using different parsers (notably json and csv)
   * Finally, if read is successful, we go inferring types using the raw-core library
   */
  function setUserDataAndDetect(str) {
    const [dataType, parsedUserData,  error] = parseAndCheckData(str, {
      separator,
      locale,
    })
    setUserInput(str)
    setUserDataType(dataType)
    setParserError(error)
    // Data parsed ok set parent data
    if (dataType !== 'json' && !error) {
      setUserData(parsedUserData)
      setData(parseDataset(parsedUserData))
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
      locale,
    })
    setSeparator(newSeparator)
    setUserDataType(dataType)
    setParserError(error)
    if (dataType !== 'json' && !error) {
      setUserData(parsedUserData)
      setData(parseDataset(parsedUserData))
    }
  }

  /*
   * Callback to handle user coercing a type of a column
   * When this happens, we don't need to go through data parsing again, we just invoke
   * the raw-core library starting from the parsed data (stage-2 data)
   */
  function coerceTypes(nextTypes) {
    setData(parseDataset(userData, nextTypes))
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
          setUserInput={setUserDataAndDetect}
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
          this will be a drop zone / file loader that accepts datasets
        </div>
      ),
      message:
        'You can load tabular (TSV, CSV, DSV) or JSON data. Questions about how to format your data?',
      icon: BsUpload,
    },
    {
      id: 'samples',
      name: 'Try our data samples',
      message: 'Wanna know more about what you can do with RAWGraphs?',
      loader: <DataSamples setData={setData} />,
      icon: BsGift,
    },
    {
      id: 'project',
      name: 'Open your project',
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
    },
  ]
  const [optionIndex, setOptionIndex] = useState(0)
  const selectedOption = options[optionIndex]

  let mainContent
  if (data) {
    console.log(data)
    mainContent = (
      <DataGrid
        data={data}
        coerceTypes={coerceTypes}
      />
    )
  } else if (userDataType === 'json' && userData === null) {
    mainContent = (
      <JsonViewer
        context={JSON.parse(userInput)}
        selectFilter={ctx => Array.isArray(ctx)}
        onSelect={ctx => {
          setUserData(ctx)
          setData(parseDataset(ctx))
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
        <Col
          xs={{ span: 9, order: null, offset: 3 }}
          lg={{ span: 10, order: null, offset: 2 }}
          style={{ height: '64px' }}
        >
          <ParsingOptions
            locale={locale}
            setLocale={setLocale}
            localeList={localeList}
            separator={separator}
            setSeparator={handleChangeSeparator}
            // dimensions={data ? data.columns : []}
            dimensions={[]}
          />
        </Col>
      </Row>
      <Row>
        <Col
          xs={3}
          lg={2}
          className="d-flex flex-column justify-content-start pl-3 pr-0 options"
          style={{ marginTop: '-8px' }}
        >
          {options.map((d, i) => {
            return (
              <div
                key={d.id}
                className={`w-100 d-flex align-items-center loading-option no-select cursor-pointer${
                  d.id === selectedOption.id && !userDataType ? ' active' : ''
                }${userDataType ? ' disabled' : ''}`}
                onClick={() => setOptionIndex(i)}
              >
                <d.icon className="w-25" />
                <h4 className="m-0 d-inline-block">{d.name}</h4>
              </div>
            )
          })}
          <div
            className={`w-100 d-flex align-items-center loading-option no-select cursor-pointer`}
            onClick={() => {
              setData(null)
              setUserData(null)
              setUserDataType(null)
              setUserInput('')
              setParserError(null)
              setOptionIndex(0)
            }}
          >
            <BsTrashFill className="w-25" />
            <h4 className="m-0 d-inline-block">{'Clear'}</h4>
          </div>
        </Col>
        <Col>
          <Row>
            <Col>
              {mainContent}
              {parseError && (
                <Alert variant="danger">
                  <p className="m-0">
                    {parseError}
                  </p>
                </Alert>
              )}
              {/* {data && (
                <>
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid lightgrey',
                      borderRadius: 4,
                      padding: '1rem',
                      minHeight: '250px',
                      height: '40vh',
                      overflowY: 'auto',
                      marginBottom: '1rem',
                    }}
                  >
                    Data is loaded, but not displayed.
                    <br />
                    <span
                      className="cursor-pointer underlined"
                      onClick={() => {
                        console.log(data.columns)
                        console.log(data)
                      }}
                    >
                      Click here to console-log it
                    </span>
                    !
                    <br />
                    (Currently RAW uses d3.autoType to guess data types.)
                  </div>

                  <Alert variant="success">
                    <p className="m-0">
                      {data.length} records in your data have been successfully
                      parsed!
                    </p>
                  </Alert>
                  <Alert variant="warning">
                    <p className="m-0">
                      Ops here something seems weird. Check row {'1234321'}!
                    </p>
                  </Alert>
                  <Alert variant="danger">
                    <p className="m-0">
                      Whoops! Something wrong with the data you provided.
                      Refresh the page!
                    </p>
                  </Alert>
                </>
              )} */}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
