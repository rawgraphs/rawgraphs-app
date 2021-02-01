import { get } from 'lodash'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import {
  BsArrowCounterclockwise,
  BsClipboard,
  BsCloud,
  BsFolder,
  BsGift,
  BsSearch,
  BsUpload,
} from 'react-icons/bs'
import { DATA_LOADER_MODE } from '../../hooks/useDataLoader'
import DataGrid from '../DataGrid/DataGrid'
import DataSamples from '../DataSamples/DataSamples'
import JsonViewer from '../JsonViewer'
import Modal from '../Modal'
import ParsingOptions from '../ParsingOptions'
import styles from './DataLoader.module.scss'
import LoadProject from './loaders/LoadProject'
import Paste from './loaders/Paste'
import UploadFile from './loaders/UploadFile'
import UrlFetch from './loaders/UrlFetch'
import Loading from './loading'
import WarningMessage from '../WarningMessage'

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
  dataLoaderMode,
  startDataReplace,
  cancelDataReplace,
  commitDataReplace,
  replaceRequiresConfirmation,
  hydrateFromProject,
}) {
  const [loadingError, setLoadingError] = useState();
  const options = [
    {
      id: 'paste',
      name: 'Paste your data',
      loader: (
        <Paste
          userInput={userInput}
          setUserInput={(rawInput) => setUserInput(rawInput, { type: 'paste' })}
        />
      ),
      message:
        'Copy and paste your data from other applications or websites. You can use tabular (TSV, CSV, DSV) or JSON data.',
      icon: BsClipboard,
      allowedForReplace: true,
    },
    {
      id: 'upload',
      name: 'Upload your data',
      loader: (
        <UploadFile
          userInput={userInput}
          setUserInput={(rawInput) => setUserInput(rawInput, { type: 'file' })}
        />
      ),
      message: 'You can load tabular (TSV, CSV, DSV) or JSON data.',
      icon: BsUpload,
      allowedForReplace: true,
    },
    {
      id: 'samples',
      name: 'Try our data samples',
      message: '',
      loader: <DataSamples onSampleReady={loadSample} />,
      icon: BsGift,
      allowedForReplace: true,
    },
    {
      id: 'sparql',
      name: 'SPARQL query SOON!',
      message: 'Load data from a query address.',
      loader: <DataSamples onSampleReady={loadSample} />,
      icon: BsCloud,
      disabled: true,
      allowedForReplace: true,
    },
    {
      id: 'url',
      name: 'From URL',
      message:
        'Enter a web address (URL) pointing to the data (e.g. a public Dropbox file, a public API, ...). Please, be sure the server is CORS-enabled.',
      loader: (
        <UrlFetch
          userInput={userInput}
          setUserInput={(rawInput, source) => setUserInput(rawInput, source)}
          setLoadingError={setLoadingError}
        />
      ),
      icon: BsSearch,
      disabled: false,
      allowedForReplace: true,
    },
    {
      id: 'project',
      name: 'Open your project',
      message:
        'Load a .rawgraphs project.',
      loader: <LoadProject onProjectSelected={hydrateFromProject} setLoadingError={setLoadingError} />,
      icon: BsFolder,
      allowedForReplace: false,
    },
  ]
  const [optionIndex, setOptionIndex] = useState(0)
  const selectedOption = options[optionIndex]

  let mainContent
  if (userData && data) {
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

  function parsingErrors(data) {
    const errors = get(data, 'errors', [])
    const successCells = data.dataset.length * Object.keys(data.dataTypes).length - errors.length;
    let message = `Ops, please check row ${errors[0].row + 1} at column "Column Name". `;
    if (errors.length > 1) {
      message += `There are issues in ${errors.length - 1} more cells. `
    }
    message += `The ${successCells} remaining cells look fine.`
    return message
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
            {dataLoaderMode === DATA_LOADER_MODE.REPLACE && (
              <div
                className={`w-100 d-flex justify-content-center align-items-center ${styles['start-over']} user-select-none cursor-pointer mb-3`}
                onClick={() => {
                  cancelDataReplace()
                }}
              >
                <h4 className="m-0 d-inline-block">{'Cancel'}</h4>
              </div>
            )}
            {options
              .filter((opt) => {
                return (
                  dataLoaderMode !== DATA_LOADER_MODE.REPLACE ||
                  opt.allowedForReplace
                )
              })
              .map((d, i) => {
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
                startDataReplace()
              }}
            >
              <BsArrowCounterclockwise className="mr-2" />
              <h4 className="m-0 d-inline-block">{'Change data'}</h4>
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
              onDataRefreshed={(rawInput) => setUserInput(rawInput, dataSource)}
            />
          </Col>
        )}
        <Col>
          <Row className="h-100">
            <Col className="h-100">
              {mainContent}

              {data && !parseError && get(data, 'errors', []).length===0 && (
                <WarningMessage variant="success" message={`${ data.dataset.length * Object.keys(data.dataTypes).length } cells have been successfully parsed, now you can choose a chart!`} />
              )}

              {parseError && (
                <WarningMessage variant="danger" message={parseError} />
              )}

              {get(data, 'errors', []).length > 0 && (
                <WarningMessage variant="warning" message={parsingErrors(data)} />
              )}

              {loadingError && (
                <WarningMessage variant="danger" message={loadingError} />
              )}
              
            </Col>
          </Row>
        </Col>
      </Row>
      {replaceRequiresConfirmation && (
        <Modal isOpen={true} toggle={() => {}}>
          <p className="text-warning text-uppercase">Warning</p>
          <div style={{ height: 150 }}>
            {replaceRequiresConfirmation === 'parse-error' && (
              <p>There was an error while parsing new data.</p>
            )}
            {replaceRequiresConfirmation.startsWith('missing-column:') && (
              <p>{`The project needs the dimension "${
                replaceRequiresConfirmation.split(':')[1]
              }" that we can't find in new data.`}</p>
            )}
            {replaceRequiresConfirmation === 'type-mismatch' && (
              <p>{`There was some error while applying your data types to new data.`}</p>
            )}
          </div>
          <div>
            <button
              className="btn btn-light mr-3"
              onClick={() => {
                commitDataReplace()
              }}
            >
              Use the new data anyway
            </button>
            <button
              className="btn btn-light mr-3"
              onClick={() => {
                cancelDataReplace()
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default React.memo(DataLoader)
