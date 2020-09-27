import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { withResizeDetector } from 'react-resize-detector';
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

// #TODO: i18n

function App() {
  const [dataSource, setDataSource] = useState(null)
  const [data, setData] = useState(null)
  const [currentChart, setCurrentChart] = useState(null)
  const [mapping, setMapping] = useState({})
  const [visualOptions, setVisualOptions] = useState({})
  const [rawViz, setRawViz] = useState(null)
  const [loading, setLoading] = useState(false)
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
    setCurrentChart(nextChart)
    setMapping({})
    clearLocalMapping()
    const options = getOptionsConfig(nextChart?.visualOptions)
    setVisualOptions(getDefaultOptionsValues(options))
    setRawViz(null)
  }, [clearLocalMapping])

  //setting initial chart and related options
  useEffect(() => {
    setCurrentChart(charts[0])
    const options = getOptionsConfig(charts[0]?.visualOptions)
    setVisualOptions(getDefaultOptionsValues(options))
  }, [])

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <div className="app-sections">
        <Section title={`1. Load your data ${loading ? '..loading' : ''}`}>
          <DataLoader
            data={data}
            setData={setData}
            dataSource={dataSource}
            setDataSource={setDataSource}
            setLoading={setLoading}
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
          <Section title={`3. Mapping ${mappingLoading ? '..loading' : ''}`}>
            <DataMapping
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
            <Exporter rawViz={rawViz} />
          </Section>
        )}
        <Footer/>
      </div>
      <ScreenSizeAlert />
    </div>
  )
}

export default App
