import React from "react"
import ChartOptions from "../ChartOptions"
import ChartPreview from "../ChartPreview"

const ChartPreviewWithOptions = ({ chart, dataset, dataTypes, mapping, visualOptions, setVisualOptions }) => {
  return (
    <div>
      <ChartOptions />
      <ChartPreview 
        chart={chart}
        dataset={dataset}
        dataTypes={dataTypes}
        mapping={mapping}
        visualOptions={visualOptions}
      />
    </div>
  )
}

export default ChartPreviewWithOptions