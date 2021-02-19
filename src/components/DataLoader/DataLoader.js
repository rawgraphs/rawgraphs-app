import { get } from 'lodash'
import React, { useCallback, useState } from 'react'
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
import ParsingOptions from '../ParsingOptions'
import styles from './DataLoader.module.scss'
import LoadProject from './loaders/LoadProject'
import Paste from './loaders/Paste'
import UploadFile from './loaders/UploadFile'
import UrlFetch from './loaders/UrlFetch'
import Loading from './loading'
import WarningMessage from '../WarningMessage'
import DataMismatchModal from './DataMismatchModal'

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
  const [loadingError, setLoadingError] = useState()
  const options = [
    {
      id: 'paste',
      name: 'Paste your data',
      loader: (
        <Paste
          userInput={userInput}
          setUserInput={(rawInput) => setUserInput(rawInput, { type: 'paste' })}
          setLoadingError={setLoadingError}
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
          setLoadingError={setLoadingError}
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
      loader: (
        <DataSamples
          onSampleReady={loadSample}
          setLoadingError={setLoadingError}
        />
      ),
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
      message: 'Load a .rawgraphs project.',
      loader: (
        <LoadProject
          onProjectSelected={hydrateFromProject}
          setLoadingError={setLoadingError}
        />
      ),
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

  // #TODO: memoize/move to component?
  function parsingErrors(data) {
    const errors = get(data, 'errors', [])
    const successRows = data.dataset.length - errors.length
    const row = errors[0].row + 1
    const column = Object.keys(errors[0].error)[0]
    return (
      <span>
        Ops, please check <span className="font-weight-bold">row {row}</span> at
        column <span className="font-weight-bold">{column}</span>.{' '}
        {errors.length === 2 && (
          <>
            {' '}
            There's another issue at row{' '}
            <span className="font-weight-bold">{errors[1].row + 1}</span>.{' '}
          </>
        )}
        {errors.length > 2 && (
          <>
            {' '}
            There are issues in{' '}
            <span className="font-weight-bold">{errors.length - 1}</span> more
            rows.{' '}
          </>
        )}
        {successRows > 0 && (
          <>
            The remaining{' '}
            <span className="font-weight-bold">
              {successRows} row{successRows > 1 && <>s</>}
            </span>{' '}
            look{successRows === 1 && <>s</>} fine.
          </>
        )}
      </span>
    )
  }

  const reloadRAW = useCallback(() => {
    window.location.replace(window.location.pathname)
  }, [])

  return (
    <>
      <Row>
        {!userData && (
          <Col
            xs={3}
            lg={2}
            className="d-flex flex-column justify-content-start pl-3 pr-0 options"
          >
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

            {dataLoaderMode === DATA_LOADER_MODE.REPLACE && (
              <>
                <div className="divider mb-3 mt-0" />
                <div
                  className={`w-100 mb-2 d-flex justify-content-center align-items-center ${styles['start-over']} user-select-none cursor-pointer`}
                  onClick={reloadRAW}
                >
                  <BsArrowCounterclockwise className="mr-2" />
                  <h4 className="m-0 d-inline-block">{'Reset'}</h4>
                </div>

                <div
                  className={`w-100 d-flex justify-content-center align-items-center ${styles['start-over']} ${styles['cancel']} user-select-none cursor-pointer mb-3`}
                  onClick={() => {
                    cancelDataReplace()
                  }}
                >
                  <h4 className="m-0 d-inline-block">{'Cancel'}</h4>
                </div>
              </>
            )}
          </Col>
        )}
        {userData && (
          <Col
            xs={3}
            lg={2}
            className="d-flex flex-column justify-content-start pl-3 pr-0 options"
          >
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

            <div className="divider mb-3 mt-0" />

            <div
              className={`w-100 mb-2 d-flex justify-content-center align-items-center ${styles['start-over']} user-select-none cursor-pointer`}
              onClick={reloadRAW}
            >
              <BsArrowCounterclockwise className="mr-2" />
              <h4 className="m-0 d-inline-block">{'Reset'}</h4>
            </div>

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
          </Col>
        )}
        <Col>
          <Row className="h-100">
            <Col className="h-100">
              {mainContent}

              {data && !parseError && get(data, 'errors', []).length === 0 && (
                <WarningMessage
                  variant="success"
                  message={
                    <span>
                      <span className="font-weight-bold">
                        {data.dataset.length} rows
                      </span>{' '}
                      (
                      {data.dataset.length * Object.keys(data.dataTypes).length}{' '}
                      cells) have been successfully parsed, now you can choose a
                      chart!
                    </span>
                  }
                />
              )}

              {parseError && (
                <WarningMessage variant="danger" message={parseError} />
              )}

              {get(data, 'errors', []).length > 0 && (
                <WarningMessage
                  variant="warning"
                  message={parsingErrors(data)}
                />
              )}

              {loadingError && (
                <WarningMessage variant="danger" message={loadingError} />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {replaceRequiresConfirmation && (
        <DataMismatchModal
          replaceRequiresConfirmation={replaceRequiresConfirmation}
          commitDataReplace={commitDataReplace}
          cancelDataReplace={cancelDataReplace}
        />
      )}
    </>
  )
}

export default React.memo(DataLoader)
