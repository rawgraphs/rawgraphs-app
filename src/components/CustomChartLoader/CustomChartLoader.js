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
    <div className="d-flex">
      <div>
        <div className="text-primary mb-2">Load from file</div>
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
      </div>
      <div>
        <input
          className="form-control mb-2"
          placeholder="Load UMD or AMD JS File from URL or NPM"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
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
            className="btn btn-primary ml-2"
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
