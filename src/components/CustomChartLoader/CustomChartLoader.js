import React, { useState } from 'react'

function CustomChartLoader({
  uploadCustomCharts,
  loadCustomChartsFromUrl,
  loadCustomChartsFromNpm,
}) {
  const [chartImportStr, setChartImportStr] = useState('')
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0]
          uploadCustomCharts(file)
          e.target.value = ''
        }}
      />
      <div>
        <input
          type="text"
          value={chartImportStr}
          onChange={(e) => setChartImportStr(e.target.value)}
        />
        <button onClick={() => loadCustomChartsFromUrl(chartImportStr)}>
          IMPORT FROM URL
        </button>
        <button onClick={() => loadCustomChartsFromNpm(chartImportStr)}>
          IMPORT FROM NPM
        </button>
      </div>
    </div>
  )
}

export default React.memo(CustomChartLoader)
