import React, { useRef, useEffect } from "react"
import { chart as rawChart } from "@raw-temp/rawgraphs-core"
import {mapDataInWorker} from "../../worker";
import useDebounce from "../../hooks/useDebounce"
import charts from "../../charts";

const ChartPreview = ({ chart, dataset: data, dataTypes, mapping, visualOptions, error, setError, setRawViz, mappedData }) => {

  const domRef = useRef(null)

  const vizOptionsDebounced = useDebounce(visualOptions, 200)

  useEffect(() => {
    console.info("Updating viz")
    setError(null)
    if(!mappedData){
      setRawViz(null)
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      return
    }
    try {
      
      const viz = rawChart(chart, {
        data,
        mapping: mapping,
        dataTypes,
        visualOptions: vizOptionsDebounced
      })
      try{
        const rawViz = viz.renderToDOM(domRef.current, mappedData)
        setRawViz(rawViz)
      } catch(e){
        setError(e)
        setRawViz(null)
        
      }
      
    } catch (e) {
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      console.log({ e })
      setError(e)
      setRawViz(null)
      
      
    }
  }, [chart, data, mapping, dataTypes, setError, vizOptionsDebounced, setRawViz, mappedData])

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

export default React.memo(ChartPreview)