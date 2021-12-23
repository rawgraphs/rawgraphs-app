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
import deepEqual from 'fast-deep-equal'
import usePrevious from './hooks/usePrevious'
import { serializeProject } from '@rawgraphs/rawgraphs-core'
import baseCharts from './charts'
import useSafeCustomCharts from './hooks/useSafeCustomCharts'
import useDataLoader from './hooks/useDataLoader'
import isPlainObject from 'lodash/isPlainObject'
import CookieConsent from 'react-cookie-consent'
import CustomChartLoader from './components/CustomChartLoader'
import CustomChartWarnModal from './components/CustomChartWarnModal'
import useChartBuilder from './hooks/useChartBuilder'
import CodeChartEditor from './components/CodeChartEditor'

// #TODO: i18n

const INITIAL_CODE = `
import uuid from 'uuid/dist/umd/uuidv4.min.js'
import dayjs from 'dayjs'


export default {
  type: 'div',
  metadata: {
    id: 'mini',
    name: 'Mini chart 23',
    categories: [],
  },
  visualOptions: {},
  dimensions: [
    {
      id: 'name',
      name: 'Name',
      validTypes: ['string'],
      required: true,
      operation: 'get',
    },
  ],
  mapData: {
    name: 'get',
  },
  render(node) {
    node.innerHTML = 'Is this the real life? Is this just fantasy? Try to edit me... ' + 'a' + dayjs().format()
  },
}
`

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

  const lastChartRef = useRef(null)
  const syncUIWithChart = useCallback(
    (nextChart) => {
      const prevChart = lastChartRef.current
      // NOTE: This implementation is balanced from time spent
      // to implemente the right diff algo Vs user experience
      // we can avoid for example avoid to reset mappings if only label changes
      // but for now we simply deep compare them =)
      if (
        !prevChart ||
        !deepEqual(prevChart.dimensions, nextChart.dimensions)
      ) {
        setMapping({})
        clearLocalMapping()
      }
      if (
        !prevChart ||
        !deepEqual(prevChart.visualOptions, nextChart.visualOptions)
      ) {
        const options = getOptionsConfig(nextChart?.visualOptions)
        setVisualOptions(getDefaultOptionsValues(options))
      }
      setRawViz(null)
      lastChartRef.current = nextChart
    },
    [clearLocalMapping]
  )
  const [currentChart, buildChart] = useChartBuilder(INITIAL_CODE, {
    onBuilded: syncUIWithChart,
  })
  // // NOTE: When we run the import we want to use the "last"
  // // version of importProject callback
  // const lasImportProjectRef = useRef()
  // useEffect(() => {
  //   lasImportProjectRef.current = importProject
  // })
  // useEffect(() => {
  //   const projectUrlStr = new URLSearchParams(window.location.search).get('url')
  //   let projectUrl
  //   try {
  //     projectUrl = new URL(projectUrlStr)
  //   } catch (e) {
  //     // BAD URL
  //     return
  //   }
  //   fetch(projectUrl)
  //     .then((r) => (r.ok ? r.text() : Promise.reject(r)))
  //     .then(
  //       (projectStr) => {
  //         const project = deserializeProject(projectStr, baseCharts)
  //         const lastImportProject = lasImportProjectRef.current
  //         if (lastImportProject) {
  //           lastImportProject(project, true)
  //         }
  //       },
  //       (err) => {
  //         console.log(`Can't load ${projectUrl}`, err)
  //       }
  //     )
  // }, [])

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
  // useEffect(() => {
  //   if (currentChart.rawCustomChart) {
  //     const currentCustom = find(
  //       customCharts,
  //       (c) => c.metadata.id === currentChart.metadata.id
  //     )
  //     if (!currentCustom) {
  //       setCurrentChart(baseCharts[0])
  //       return
  //     }
  //     if (
  //       currentCustom.rawCustomChart.source !==
  //       currentChart.rawCustomChart.source
  //     ) {
  //       setCurrentChart(currentCustom)
  //     }
  //   }
  // }, [customCharts, currentChart])

  const exportProject = useCallback(async () => {
    const customChart = null
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
  ])

  // project import
  const importProject = useCallback(
    async (project, fromUrl) => {
      let nextCurrentChart = null
      // if (project.currentChart.rawCustomChart) {
      //   try {
      //     nextCurrentChart = await importCustomChartFromProject(
      //       project.currentChart
      //     )
      //   } catch (err) {
      //     if (err.isAbortByUser) {
      //       if (fromUrl) {
      //         // NOTE: clean the url when the user abort loading custom js
      //         window.history.replaceState(null, null, '/')
      //       }
      //       return
      //     }
      //     throw err
      //   }
      // } else {
      //   nextCurrentChart = project.currentChart
      // }
      hydrateFromSavedProject(project)
      // setCurrentChart(nextCurrentChart)
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
    [hydrateFromSavedProject]
  )

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <div className="app-sections">
        <Section title={`1. Load your data`} loading={loading}>
          <DataLoader {...dataLoader} hydrateFromProject={importProject} />
        </Section>
        {data && (
          <Section title="2. Write Your Chart">
            <CodeChartEditor initialCode={INITIAL_CODE} build={buildChart} />
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
