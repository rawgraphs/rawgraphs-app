import React, { useState } from 'react'
import { dsvFormat } from 'd3'
import { Row, Col, Alert } from 'react-bootstrap'
import {
  BsClipboard,
  BsUpload,
  BsGift,
  BsFolder,
  BsTrashFill,
} from 'react-icons/bs'
import DataSamples from '../DataSamples/DataSamples'

import localeList from './localeList'
import ParsingOptions from '../ParsingOptions'
import Paste from './loaders/Paste'

export default function DataLoader({ data, setData }) {
  const [parseError, setParserError] = useState(null)
  const [userDataType, setUserDataType] = useState(null)

  const [userInput, setUserInput] = useState('')
  const [userData, setUserData] = useState(null)

  // Parsing Options
  const [locale, setLocale] = useState('en-CA')
  const [separator, setSeparator] = useState(',')

  function setUserDataAndDetect(str) {
    let data
    let dataType
    try {
      data = JSON.parse(str)
      dataType = 'json'
    } catch (e) {
      const parser = dsvFormat(separator)
      data = parser.parse(str)
      dataType = 'csv'
    }
    if (data.length === 0) {
      setParserError('Bad Data')
    } else {
      setParserError(null)
      setUserDataType(dataType)
      if (dataType === 'csv') {
        setUserData(data)
      }
    }
    setUserInput(str)
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
    // {
    //   id: 'clear',
    //   name: 'Clear',
    //   message: null,
    //   loader: null,
    //   icon: BsTrashFill,
    // },
  ]
  const [optionIndex, setOptionIndex] = useState(0)
  const selectedOption = options[optionIndex]

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
            setSeparator={setSeparator}
            dimensions={data ? data.columns : []}
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
                  d.id === selectedOption.id ? ' active' : ''
                }${data && i < options.length - 1 ? ' disabled' : ''}`}
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
              {!data && (
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
              )}
              {parseError && (
                <Alert variant="danger">
                  <p className="m-0">
                    Whoops! Something wrong with the data you provided. Refresh
                    the page!
                  </p>
                </Alert>
              )}
              {data && (
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
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
