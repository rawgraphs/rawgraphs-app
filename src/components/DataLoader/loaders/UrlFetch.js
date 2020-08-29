import React, { useState } from 'react'
import classNames from "classnames"
import S from "./UrlFetch.module.scss"

export default function UrlFetch({ userInput, setUserInput }) {

  const [url, setUrl] = useState("")

  const fetchUrl = async (url) => {
    const response = await fetch(url)
    const text = await response.text()
    setUserInput(text, { type: "url", url })
  }
  return (
    <input
      className={classNames("w-100", S["url-input"])}
      value={url}
      onChange={e => {
        setUrl(e.target.value)
        fetchUrl(e.target.value)
      }}
    />
  )
}
