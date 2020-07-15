import React, { useState } from "react"
import ChartOptions from "../ChartOptions"
import ChartPreview from "../ChartPreview"

const ChartPreviewWithOptions = ({ chart, dataset, dataTypes, mapping, visualOptions, setVisualOptions }) => {
  const [error, setError] = useState(null)
  return (
    <div>
      <ChartOptions
        chart={chart}
        visualOptions={visualOptions}
        setVisualOptions={setVisualOptions}
        error={error}
      />
      <ChartPreview 
        chart={chart}
        dataset={dataset}
        dataTypes={dataTypes}
        mapping={mapping}
        visualOptions={visualOptions}
        error={error}
        setError={setError}
      />
    </div>
  )
}

export default ChartPreviewWithOptions