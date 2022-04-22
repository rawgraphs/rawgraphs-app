import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  getOptionsConfig,
  getDefaultOptionsValues,
  deserializeProject,
} from '@rawgraphs/rawgraphs-core'
import HeaderItems from './HeaderItems'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'
import ScreenSizeAlert from './components/ScreenSizeAlert'
import DataLoader from './components/DataLoader'
import ChartSelector from './components/ChartSelector'
import DataMapping from './components/DataMapping'
import ChartPreviewWithOptions from './components/ChartPreviewWIthOptions'
import Exporter from './components/Exporter'
import get from 'lodash/get'
import find from 'lodash/find'
import usePrevious from './hooks/usePrevious'
import { serializeProject } from '@rawgraphs/rawgraphs-core'
import baseCharts from './charts'
import useSafeCustomCharts from './hooks/useSafeCustomCharts'
import useDataLoader from './hooks/useDataLoader'
import isPlainObject from 'lodash/isPlainObject'
import CookieConsent from 'react-cookie-consent'
import CustomChartLoader from './components/CustomChartLoader'
import CustomChartWarnModal from './components/CustomChartWarnModal'

// #TODO: i18n

function App() {
  const [
    customCharts,
    {
      toConfirmCustomChart,
      confirmCustomChartLoad,
      abortCustomChartLoad,
      uploadCustomCharts,
      loadCustomChartsFromUrl,
      loadCustomChartsFromNpm,
      importCustomChartFromProject,
      removeCustomChart,
      exportCustomChart,
    },
  ] = useSafeCustomCharts()
  const charts = useMemo(() => baseCharts.concat(customCharts), [customCharts])

  const dataLoader = useDataLoader()
  const {
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
    loading,
    hydrateFromSavedProject,
  } = dataLoader

  /* From here on, we deal with viz state */
  const [currentChart, setCurrentChart] = useState(charts[0])
  const [mapping, setMapping] = useState({})
  const [visualOptions, setVisualOptions] = useState(() => {
    const options = getOptionsConfig(charts[0]?.visualOptions)
    return getDefaultOptionsValues(options)
  })
  const [rawViz, setRawViz] = useState(null)
  const [mappingLoading, setMappingLoading] = useState(false)
  const dataMappingRef = useRef(null)

  const columnNames = useMemo(() => {
    if (get(data, 'dataTypes')) {
      return Object.keys(data.dataTypes)
    }
  }, [data])

  const prevColumnNames = usePrevious(columnNames)
  const clearLocalMapping = useCallback(() => {
    if (dataMappingRef.current) {
      dataMappingRef.current.clearLocalMapping()
    }
  }, [])

  // NOTE: When we run the import we want to use the "last"
  // version of importProject callback
  const lasImportProjectRef = useRef()
  useEffect(() => {
    lasImportProjectRef.current = importProject
  })
  useEffect(() => {
    const projectUrlStr = new URLSearchParams(window.location.search).get('url')
    let projectUrl
    try {
      projectUrl = new URL(projectUrlStr)
    } catch (e) {
      // BAD URL
      return
    }
    fetch(projectUrl)
      .then((r) => (r.ok ? r.text() : Promise.reject(r)))
      .then(
        (projectStr) => {
          const project = deserializeProject(projectStr, baseCharts)
          const lastImportProject = lasImportProjectRef.current
          if (lastImportProject) {
            lastImportProject(project, true)
          }
        },
        (err) => {
          console.log(`Can't load ${projectUrl}`, err)
        }
      )
  }, [])

  //resetting mapping when column names changes (ex: separator change in parsing)
  useEffect(() => {
    if (prevColumnNames) {
      if (!columnNames) {
        setMapping({})
        clearLocalMapping()
      } else {
        const prevCols = prevColumnNames.join('.')
        const currentCols = columnNames.join('.')
        if (prevCols !== currentCols) {
          setMapping({})
          clearLocalMapping()
        }
      }
    }
  }, [columnNames, prevColumnNames, clearLocalMapping])

  // update current chart when the related custom charts change under the hood
  // if the related custom chart is removed set the first chart
  useEffect(() => {
    if (currentChart.rawCustomChart) {
      const currentCustom = find(
        customCharts,
        (c) => c.metadata.id === currentChart.metadata.id
      )
      if (!currentCustom) {
        setCurrentChart(baseCharts[0])
        return
      }
      if (
        currentCustom.rawCustomChart.source !==
        currentChart.rawCustomChart.source
      ) {
        setCurrentChart(currentCustom)
      }
    }
  }, [customCharts, currentChart])

  const handleChartChange = useCallback(
    (nextChart) => {
      setMapping({})
      clearLocalMapping()
      setCurrentChart(nextChart)
      const options = getOptionsConfig(nextChart?.visualOptions)
      setVisualOptions(getDefaultOptionsValues(options))
      setRawViz(null)
    },
    [clearLocalMapping]
  )

  const exportProject = useCallback(async () => {
    const customChart = await exportCustomChart(currentChart)
    return serializeProject({
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
      customChart,
    })
  }, [
    currentChart,
    data,
    dataSource,
    decimalsSeparator,
    locale,
    mapping,
    parseError,
    separator,
    stackDimension,
    thousandsSeparator,
    userData,
    userDataType,
    userInput,
    visualOptions,
    unstackedColumns,
    unstackedData,
    exportCustomChart,
  ])

  // project import
  const importProject = useCallback(
    async (project, fromUrl) => {
      let nextCurrentChart
      if (project.currentChart.rawCustomChart) {
        try {
          nextCurrentChart = await importCustomChartFromProject(
            project.currentChart
          )
        } catch (err) {
          if (err.isAbortByUser) {
            if (fromUrl) {
              // NOTE: clean the url when the user abort loading custom js
              window.history.replaceState(null, null, '/')
            }
            return
          }
          throw err
        }
      } else {
        nextCurrentChart = project.currentChart
      }
      hydrateFromSavedProject(project)
      setCurrentChart(nextCurrentChart)
      setMapping(project.mapping)
      // adding "annotations" for color scale:
      // we annotate the incoming options values (complex ones such as color scales)
      // to le the ui know they are coming from a loaded project
      // so we don't have to re-evaluate defaults
      // this is due to the current implementation of the color scale
      const patchedOptions = { ...project.visualOptions }
      Object.keys(patchedOptions).forEach((k) => {
        if (isPlainObject(patchedOptions[k])) {
          patchedOptions[k].__loaded = true
        }
      })
      setVisualOptions(project.visualOptions)
    },
    [hydrateFromSavedProject, importCustomChartFromProject]
  )

  const [isModalCustomChartOpen, setModalCustomChartOpen] = useState(false)
  const toggleModalCustomChart = useCallback(
    () => setModalCustomChartOpen((o) => !o),
    []
  )

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <CustomChartWarnModal
        toConfirmCustomChart={toConfirmCustomChart}
        confirmCustomChartLoad={confirmCustomChartLoad}
        abortCustomChartLoad={abortCustomChartLoad}
      />
      <div className="app-sections">
        <Section title={`1. Load your data`} loading={loading}>
          <DataLoader {...dataLoader} hydrateFromProject={importProject} />
        </Section>
        {data && (
          <Section title="2. Choose a chart">
            <CustomChartLoader
              isOpen={isModalCustomChartOpen}
              onClose={toggleModalCustomChart}
              loadCustomChartsFromNpm={loadCustomChartsFromNpm}
              loadCustomChartsFromUrl={loadCustomChartsFromUrl}
              uploadCustomCharts={uploadCustomCharts}
            />
            <ChartSelector
              onAddChartClick={toggleModalCustomChart}
              onRemoveCustomChart={removeCustomChart}
              availableCharts={charts}
              currentChart={currentChart}
              setCurrentChart={handleChartChange}
            />
          </Section>
        )}
        {data && currentChart && (
          <Section title={`3. Mapping`} loading={mappingLoading}>
            <DataMapping
              ref={dataMappingRef}
              dimensions={currentChart.dimensions}
              dataTypes={data.dataTypes}
              mapping={mapping}
              setMapping={setMapping}
            />
          </Section>
        )}
        {data && currentChart && (
          <Section title="4. Customize">
            <ChartPreviewWithOptions
              chart={currentChart}
              dataset={data.dataset}
              dataTypes={data.dataTypes}
              mapping={mapping}
              visualOptions={visualOptions}
              setVisualOptions={setVisualOptions}
              setRawViz={setRawViz}
              setMappingLoading={setMappingLoading}
            />
          </Section>
        )}
        {data && currentChart && rawViz && (
          <Section title="5. Export">
            <Exporter rawViz={rawViz} exportProject={exportProject} />
          </Section>
        )}
        <Footer />
        <CookieConsent
          location="bottom"
          buttonText="Got it!"
          style={{ background: '#f5f5f5', color: '#646467' }}
          buttonStyle={{
            background: '#646467',
            color: 'white',
            fontSize: '13px',
            borderRadius: '3px',
            padding: '5px 20px',
          }}
          buttonClasses="btn btn-default btn-grey"
          acceptOnScroll={true}
        >
          This website uses Google Analytics to anonymously collect browsing
          data.{' '}
          <a
            href="https://rawgraphs.io/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-body border-bottom border-dark"
          >
            Learn More
          </a>
        </CookieConsent>
      </div>
      <ScreenSizeAlert />
    </div>
  )
}

export default App
