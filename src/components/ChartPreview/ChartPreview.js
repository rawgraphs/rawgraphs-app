import React, { useRef, useEffect, useState } from "react"
import { chart as rawChart } from "@raw-temp/rawgraphs-core"

const ChartPreview = ({ chart, dataset: data, dataTypes, mapping, visualOptions }) => {

  const domRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      setError(null)
      const viz = rawChart(chart, {
        data,
        mapping: mapping,
        dataTypes,
        visualOptions
      })
      viz.renderToDOM(domRef.current)
    } catch (e) {
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      setError(e)
    }
  }, [chart, data, mapping, dataTypes, visualOptions])

  return (
    <>
      <div ref={domRef}>
        {/* Don't put content in this <div /> */}
      </div>
      {error !== null && (
        <div className="error-message">
          {error.message}
        </div>
      )}
    </>
  )
}

export default ChartPreview