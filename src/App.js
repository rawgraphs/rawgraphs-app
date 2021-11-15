import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  getOptionsConfig,
  getDefaultOptionsValues,
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
import usePrevious from './hooks/usePrevious'
import { serializeProject } from '@rawgraphs/rawgraphs-core'
import useCharts from './hooks/useCharts'
import useDataLoader from './hooks/useDataLoader'
import isPlainObject from 'lodash/isPlainObject'
import CookieConsent from 'react-cookie-consent'
import CustomChartLoader from './components/CustomChartLoader'

// #TODO: i18n

function App() {
  const [
    charts,
    {
      uploadCustomCharts,
      loadCustomChartsFromUrl,
      loadCustomChartsFromNpm,
      removeCustomChart,
      exportCustomChart,
      importCustomChartFromProject,
    },
  ] = useCharts()

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
    async (project) => {
      let nextCurrentChart
      if (project.currentChart.rawCustomChart) {
        nextCurrentChart = await importCustomChartFromProject(
          project.currentChart
        )
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

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <div className="app-sections">
        <Section title={`1. Load your data`} loading={loading}>
          <DataLoader {...dataLoader} hydrateFromProject={importProject} />
        </Section>
        {data && (
          <Section title="2. Choose a chart">
            <CustomChartLoader
              loadCustomChartsFromNpm={loadCustomChartsFromNpm}
              loadCustomChartsFromUrl={loadCustomChartsFromUrl}
              uploadCustomCharts={uploadCustomCharts}
            />
            <ChartSelector
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
