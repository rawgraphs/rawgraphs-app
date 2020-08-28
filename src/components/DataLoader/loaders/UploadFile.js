import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import S from "./UploadFile.module.scss"

export default function UploadFile({ userInput, setUserInput }) {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();
    reader.addEventListener("load", e => {
      setUserInput(e.target.result)
    })
    reader.readAsText(acceptedFiles[0])
  }, [setUserInput])
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  return (
    <div className={S.dropzone} {...getRootProps()}>
      <input {...getInputProps()} />
      <span>Drag a file here or </span>
      <Button className="mx-1" color="primary">Browse</Button>
      <span>a file from your computer</span>
    </div>
  )
}
