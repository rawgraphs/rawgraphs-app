import { get } from 'lodash'
import React, { useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import {
  BsArrowCounterclockwise, BsClipboard,
  BsCloud, BsFolder, BsGift,
  BsSearch, BsUpload
} from 'react-icons/bs'
import DataGrid from '../DataGrid/DataGrid'
import DataSamples from '../DataSamples/DataSamples'
import JsonViewer from '../JsonViewer'
import ParsingOptions from '../ParsingOptions'
import styles from './DataLoader.module.scss'
import LoadProject from './loaders/LoadProject'
import Paste from './loaders/Paste'
import UploadFile from './loaders/UploadFile'
import UrlFetch from './loaders/UrlFetch'
import Loading from './loading'

function DataLoader({
  userInput,
  setUserInput,
  userData,
  userDataType,
  parseError,
  unstackedColumns,
  separator,
  setSeparator,
  thousandsSeparator,
  setThousandsSeparator,
  decimalsSeparator,
  setDecimalsSeparator,
  locale,
  setLocale,
  stackDimension,
  dataSource,
  data,
  loading,
  coerceTypes,
  loadSample,
  handleInlineEdit,
  handleStackOperation,
  setJsonData,
  resetDataLoader,
  hydrateFromProject,
}) {
  const options = [
    {
      id: 'paste',
      name: 'Paste your data',
      loader: (
        <Paste
          userInput={userInput}
          setUserInput={(rawInput) =>
            setUserInput(rawInput, { type: 'paste' })
          }
        />
      ),
      message:
        'Copy and paste your data from other applications or websites. You can use tabular (TSV, CSV, DSV) or JSON data.',
      icon: BsClipboard,
    },
    {
      id: 'upload',
      name: 'Upload your data',
      loader: (
        <UploadFile
          userInput={userInput}
          setUserInput={(rawInput) =>
            setUserInput(rawInput, { type: 'file' })
          }
        />
      ),
      message: 'You can load tabular (TSV, CSV, DSV) or JSON data.',
      icon: BsUpload,
    },
    {
      id: 'samples',
      name: 'Try our data samples',
      message: '',
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
            setUserInput(rawInput, source)
          }
        />
      ),
      icon: BsSearch,
      disabled: false,
    },
    {
      id: 'project',
      name: 'Open your project',
      message:
        'Load a .rawgraphs project. Questions about how to save your work?',
      loader: (
        <LoadProject
          onProjectSelected={hydrateFromProject}
        />
      ),
      icon: BsFolder,
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
          setJsonData(ctx)
        }}
      />
    )
  } else if (loading && !data) {
    mainContent = <Loading />
  } else {
    mainContent = (
      <>
        {selectedOption.loader}
        <p className="mt-3">
          {selectedOption.message}
          {/*<a
            href="https://rawgraphs.io/learning"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out our guides
          </a>*/}
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
                setOptionIndex(0)
                resetDataLoader()
              }}
            >
              <BsArrowCounterclockwise className="mr-2" />
              <h4 className="m-0 d-inline-block">{'Start over'}</h4>
            </div>
            <div className="my-3 divider" />
            <ParsingOptions
              locale={locale}
              setLocale={setLocale}
              separator={separator}
              setSeparator={setSeparator}
              thousandsSeparator={thousandsSeparator}
              setThousandsSeparator={setThousandsSeparator}
              decimalsSeparator={decimalsSeparator}
              setDecimalsSeparator={setDecimalsSeparator}
              dimensions={data ? unstackedColumns || data.dataTypes : []}
              stackDimension={stackDimension}
              setStackDimension={handleStackOperation}
              userDataType={userDataType}
              dataSource={dataSource}
              onDataRefreshed={(rawInput) =>
                setUserInput(rawInput, dataSource)
              }
            />
          </Col>
        )}
        <Col>
          <Row className="h-100">
            <Col className="h-100">
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
