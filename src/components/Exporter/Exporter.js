import React, { useCallback, useState } from 'react'
import { InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'

function downloadBlob(url, filename) {
  // Create a new anchor element
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  a.click()
  return a
}

export default function Exporter({ rawViz }) {
  const downloadSvg = useCallback(
    (filename) => {
      var svgString = new XMLSerializer().serializeToString(
        rawViz._node.firstChild
      )
      var DOMURL = window.URL || window.webkitURL || window
      var svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      var url = DOMURL.createObjectURL(svg)
      downloadBlob(url, filename)
      DOMURL.revokeObjectURL(svg)
    },
    [rawViz]
  )

  const downloadImage = useCallback(
    (format, filename) => {
      var svgString = new XMLSerializer().serializeToString(
        rawViz._node.firstChild
      )
      var DOMURL = window.URL || window.webkitURL || window
      var svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      var url = DOMURL.createObjectURL(svg)
      var canvas = document.createElement('canvas')
      canvas.height = rawViz._node.firstChild.clientHeight
      canvas.width = rawViz._node.firstChild.clientWidth
      var ctx = canvas.getContext('2d')
      var img = new Image()
      img.onload = function () {
        ctx.drawImage(img, 0, 0)
        var dataUrl = canvas.toDataURL(format)
        downloadBlob(dataUrl, filename)
        DOMURL.revokeObjectURL(svg)
      }
      img.src = url
    },
    [rawViz]
  )

  const exportFormats = ['svg','png','jpg','rawgraphs'];

  const [currentFormat, setCurrentFormat] = useState('svg')
  const [currentFile, setCurrentFile] = useState('viz')

  const downloadViz = useCallback(() => {
    switch (currentFormat) {
      case 'svg':
        downloadSvg(`${currentFile}.svg`)
        break
      case 'png':
        downloadImage('image/png', `${currentFile}.png`)
        break
      case 'jpg':
        downloadImage('image/jpeg', `${currentFile}.jpg`)
        break

      default:
        break
    }
  }, [currentFile, currentFormat, downloadImage, downloadSvg])

  return (
    <div className="row">
      <div className="col col-sm-3">
        <InputGroup className="mb-3 raw-input-group">
          <input
            type="text"
            className="form-control text-field"
            value={currentFile}
            onChange={(e) => setCurrentFile(e.target.value)}
          ></input>
          <DropdownButton
            as={InputGroup.Append}
            title={`.${currentFormat}`}
            id="input-group-dropdown-1"
            className="raw-dropdown"
          >
            {exportFormats.map(
              (d) => {
                return (
                  <Dropdown.Item key={d} onClick={() => setCurrentFormat(d)} disabled={d==='rawgraphs'}>
                    .{d}
                  </Dropdown.Item>
                )
              }
            )}
          </DropdownButton>
        </InputGroup>
      </div>

      <div className="col col-sm-2">
        <button className="btn btn-primary btn-block raw-btn" onClick={downloadViz}>
          Download
        </button>
      </div>
    </div>
  )
}
