import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const HOSTS_WHITELIST = [
  'localhost',
]

/**
 * @param {URL} url
 */
function isUrlAllowed(url) {
  if (HOSTS_WHITELIST.includes(url.hostname)) {
    return true
  }
  return false
}

/**
 * @param {string} name
 */
function isNpmPkgAllowed(name) {
  return false
}

function CustomChartLoader({
  uploadCustomCharts,
  loadCustomChartsFromUrl,
  loadCustomChartsFromNpm,
}) {
  const [chartImportStr, setChartImportStr] = useState('')
  const [warnLoad, setWarnLoad] = useState(null)

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0]
          e.target.value = ''
          if (file) {
            setWarnLoad({
              type: 'file',
              value: file,
            })
          }
        }}
      />
      <div>
        <input
          type="text"
          value={chartImportStr}
          onChange={(e) => setChartImportStr(e.target.value)}
        />
        <button
          onClick={() => {
            let url
            try {
              url = new URL(chartImportStr)
            } catch (err) {
              // Invalid url
              return
            }
            if (isUrlAllowed(url)) {
              loadCustomChartsFromUrl(String(url))
              setChartImportStr('')
            } else {
              setWarnLoad({
                type: 'url',
                value: String(url),
              })
            }
          }}
        >
          IMPORT FROM URL
        </button>
        <button
          onClick={() => {
            if (chartImportStr.trim() === '') {
              return
            }
            const name = chartImportStr
            if (isNpmPkgAllowed(name)) {
              loadCustomChartsFromNpm(name)
            } else {
              setWarnLoad({
                type: 'npm',
                value: name,
              })
            }
          }}
        >
          IMPORT FROM NPM
        </button>
      </div>

      <Modal
        show={warnLoad !== null}
        onHide={() => setWarnLoad(null)}
        backdrop="static"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="raw-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>WARN</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            You are about to execute third party JavaScript continue at your own
            risk.
          </p>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="secondary"
            onClick={() => {
              setWarnLoad(null)
            }}
          >
            Close
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              if (warnLoad.type === 'file') {
                uploadCustomCharts(warnLoad.value)
              } else if (warnLoad.type === 'url') {
                loadCustomChartsFromUrl(warnLoad.value)
              } else if (warnLoad.type === 'npm') {
                loadCustomChartsFromNpm(warnLoad.value)
              }
              setWarnLoad(null)
              setChartImportStr('')
            }}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default React.memo(CustomChartLoader)
