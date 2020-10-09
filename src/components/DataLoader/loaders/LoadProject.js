import React, { useCallback, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'
import S from './LoadProject.module.scss'
import { get } from 'lodash'
import { deserializeProject as deserializeProjectV1 } from '../../../import_export_v1'

const DESERIALIZERS = {
  "1": deserializeProjectV1
}

export default function LoadProject({ onProjectSelected }) {
  const [error, setError] = useState(null)

  const onDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader()
      reader.addEventListener('load', (e) => {
        const serializedProject = JSON.parse(e.target.result)
        const version = get(serializedProject, "version", "unknown")
        if (DESERIALIZERS[version]) {
          try {
            onProjectSelected(DESERIALIZERS[version](serializedProject))
          } catch (e) {
            setError(e.message)
          }
        } else {
          setError("Invalid file")
        }
      })
      if (acceptedFiles.length) {
        reader.readAsText(acceptedFiles[0])
      }
    },
    [onProjectSelected]
  )
  const {
    getRootProps,
    getInputProps,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop,
    accept:
      '.rawgraphs',
    maxFiles: 1,
  })
  return (
    <div
      className={classNames(S.dropzone, {
        [S.reject]: isDragReject,
        [S.accept]: isDragAccept,
      })}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <span>Drag a file here or </span>
      <Button className={S['browse-button']} color="primary">
        Browse
      </Button>
      <span>a file from your computer</span>
      {isDragAccept && <p>All files will be accepted</p>}
      {isDragReject && <p>Some files will be rejected</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
