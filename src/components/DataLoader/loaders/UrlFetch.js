import React, { useState } from 'react'
import classNames from 'classnames'
import S from './UrlFetch.module.scss'

export async function fetchData(source) {
  const response = await fetch(source.url)
  const text = await response.text()
  return text
}

export default function UrlFetch({ userInput, setUserInput, setLoadingError }) {
  const [url, setUrl] = useState('')

  const fetchUrl = async (url) => {
    const source = { type: 'url', url }
    let data
    try {
      data = fetchData(source)
      setUserInput(data, source)
      setLoadingError(null)
    } catch (e) {
      setLoadingError("Loading error. "+e.message)
    }
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
