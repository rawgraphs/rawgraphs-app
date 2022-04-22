import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import ChartOptions from '../ChartOptions'
import ChartPreview from '../ChartPreview'
import { chart as rawChart } from '@rawgraphs/rawgraphs-core'
import { mapDataInWorker } from '../../worker'
import { WEBWORKER_ACTIVE } from '../../constants'

const ChartPreviewWithOptions = ({
  chart,
  dataset,
  dataTypes,
  mapping,
  visualOptions,
  setVisualOptions,
  setRawViz,
  setMappingLoading,
}) => {
  const [error, setError] = useState({variant: "secondary", message: "Required chart variables"})
  const [mappedData, setMappedData] = useState(null)

  useEffect(() => {
    // console.info('Updating mapped dataset')
    try {
      setMappingLoading(true)

      if (WEBWORKER_ACTIVE) {
        mapDataInWorker(chart.metadata.name, {
          data: dataset,
          mapping: mapping,
          dataTypes,
        }, chart.rawCustomChart)
          .then((mappedData) => {
            setMappingLoading(false)
            setMappedData(mappedData)
          })
          .catch((err) => {
            console.error(err)
            setMappingLoading(false)
            setMappedData(null)
          })
      } else {
        const viz = rawChart(chart, {
          data: dataset,
          mapping: mapping,
          dataTypes,
        })
        const vizData = viz._getVizData()
        setMappingLoading(false)
        setMappedData(vizData)
      }
    } catch (e) {
      console.error(e)
      setMappingLoading(false)
      setMappedData(null)
    }
  }, [
    chart,
    mapping,
    dataTypes,
    setError,
    setRawViz,
    setMappingLoading,
    dataset,
  ])

  return (
    <Row>
        <ChartOptions
          chart={chart}
          dataset={dataset}
          mapping={mapping}
          dataTypes={dataTypes}
          visualOptions={visualOptions}
          setVisualOptions={setVisualOptions}
          error={error}
          mappedData={mappedData}
        />
        <ChartPreview
          chart={chart}
          dataset={dataset}
          dataTypes={dataTypes}
          mapping={mapping}
          visualOptions={visualOptions}
          error={error}
          setError={setError}
          setRawViz={setRawViz}
          mappedData={mappedData}
        />
    </Row>
  )
}

export default ChartPreviewWithOptions
