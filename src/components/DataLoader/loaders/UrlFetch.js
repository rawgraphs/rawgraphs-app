import React, { useState } from 'react'
import classNames from 'classnames'
import S from './UrlFetch.module.scss'

export default function UrlFetch({ userInput, setUserInput, setLoadingError }) {
  const [url, setUrl] = useState('')

  const fetchUrl = async (url) => {
    let response;
    try {
      response = await fetch(url)
    } catch (e) {
      setLoadingError("Loading error. "+e.message)
      return
    }
    const text = await response.text()
    setUserInput(text, { type: 'url', url })
  }
  return (
    <input
      className={classNames('w-100', S['url-input'])}
      value={url}
      onChange={(e) => {
        setUrl(e.target.value)
        fetchUrl(e.target.value)
      }}
    />
  )
}
