import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import S from './UrlFetch.module.scss'

export async function fetchData(source) {
  const response = await fetch(source.url)
  const text = await response.text()
  return text
}

export default function UrlFetch({
  userInput,
  setUserInput,
  setLoadingError,
  initialState = null,
}) {
  const [url, setUrl] = useState(initialState?.url)

  const fetchUrl = useCallback(
    async (url) => {
      const source = { type: 'url', url }
      let data
      try {
        data = await fetchData(source)
        setUserInput(data, source)
        setLoadingError(null)
      } catch (e) {
        setLoadingError('Loading error. ' + e.message)
      }
    },
    [setLoadingError, setUserInput]
  )

  const handleSubmit = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      fetchUrl(url)
      return false
    },
    [url, fetchUrl]
  )

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={classNames('w-100', S['url-input'])}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
        }}
      />
      <div className="text-right">
        <button
          className="btn btn-sm btn-success mt-3"
          disabled={!url}
          type="submit"
        >
          Run query
        </button>
      </div>
    </form>
  )
}
