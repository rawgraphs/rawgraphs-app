import React, { useState } from 'react'

function CustomChartLoader({
  uploadCustomCharts,
  loadCustomChartsFromUrl,
  loadCustomChartsFromNpm,
}) {
  const [error, setError] = useState(null)
  const [value, setValue] = useState('')

  function handleError(e) {
    if (e.isAbortByUser) {
      return
    }
    console.log(e)
    setError(e)
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0]
          e.target.value = ''
          if (file) {
            setError(null)
            uploadCustomCharts(file).catch(handleError)
          }
        }}
      />
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            setError(null)
            loadCustomChartsFromUrl(value).then(() => {
              setValue('')
            }, handleError)
          }}
        >
          IMPORT FROM URL
        </button>
        <button
          onClick={() => {
            setError(null)
            loadCustomChartsFromNpm(value).then(() => {
              setValue('')
            }, handleError)
          }}
        >
          IMPORT FROM NPM
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error during custom chart import
        </div>
      )}
    </div>
  )
}

export default React.memo(CustomChartLoader)
