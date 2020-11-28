import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  getOptionsConfig,
  getDefaultOptionsValues,
} from '@raw-temp/rawgraphs-core'

import HeaderItems from './HeaderItems'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'
import ScreenSizeAlert from './components/ScreenSizeAlert'

import DataLoader from './components/DataLoader'
import charts from './charts'
import ChartSelector from './components/ChartSelector'
import DataMapping from './components/DataMapping'
import ChartPreviewWithOptions from './components/ChartPreviewWIthOptions'
import Exporter from './components/Exporter'
import get from 'lodash/get'
import usePrevious from './hooks/usePrevious'
import { serializeProject as serializeProjectV1 } from './import_export_v1'
import useDataLoader from './hooks/useDataLoader'

// #TODO: i18n

function App() {
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
  const [currentChart, setCurrentChart] = useState(null)
  const [mapping, setMapping] = useState({})
  const [visualOptions, setVisualOptions] = useState({})
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

  const handleChartChange = useCallback((nextChart) => {
    setMapping({})
    clearLocalMapping()
    setCurrentChart(nextChart)
    const options = getOptionsConfig(nextChart?.visualOptions)
    setVisualOptions(getDefaultOptionsValues(options))
    setRawViz(null)
  }, [clearLocalMapping])

  const exportProject = useCallback(() => {
    return serializeProjectV1(
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
    )
  }, [
    currentChart, data, dataSource, decimalsSeparator, locale, mapping,
    parseError, separator, stackDimension, thousandsSeparator, userData,
    userDataType, userInput, visualOptions, unstackedColumns, unstackedData
  ])

  const importProject = useCallback(project => {
    
    hydrateFromSavedProject(project)
    setCurrentChart(project.currentChart)
    setMapping(project.mapping)
    setVisualOptions(project.visualOptions)
  }, [hydrateFromSavedProject])

  //setting initial chart and related options
  useEffect(() => {
    setCurrentChart(charts[0])
    const options = getOptionsConfig(charts[0]?.visualOptions)
    setVisualOptions(getDefaultOptionsValues(options))
  }, [])

  //when mapping changes
  useEffect(() => {
    const cfg = getOptionsConfig(currentChart?.visualOptions)
    const options = getDefaultOptionsValues(cfg, mapping)
    const allOptions = Object.keys(cfg)
    const xOptions = allOptions.filter(id => !!cfg[id].repeatFor)
    const optsFixed = []
    const newOpts = {...visualOptions}
    xOptions.forEach(opt => {
      const vOpt = get(visualOptions, opt)
      const nOpt = get(options, opt, [])
      if(!vOpt || !Array.isArray(vOpt) || vOpt.length < nOpt.length){
        newOpts[opt] = newOpts[opt] || []
        newOpts[opt].push(cfg[opt].default)
        optsFixed.push(opt)
      }
      if(optsFixed.length){
        setVisualOptions(newOpts)
      }
    })
    
  }, [mapping])

  

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <div className="app-sections">
        <Section title={`1. Load your data`} loading={loading}>
          <DataLoader
            {...dataLoader}
            hydrateFromProject={importProject}
          />
        </Section>
        {data && <Section title="2. Choose a chart">
          <ChartSelector
            availableCharts={charts}
            currentChart={currentChart}
            setCurrentChart={handleChartChange}
          />
        </Section>}
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
      </div>
      <ScreenSizeAlert />
    </div>
  )
}

export default App
