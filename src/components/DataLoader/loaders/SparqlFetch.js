import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import S from './SparqlFetch.module.scss'
import { html, render } from 'lit-html'
import SparqlHttpClient from 'sparql-http-client'
import { Generator } from 'sparqljs'
import { fromRdf } from 'rdf-literal'
import { SparqlEditor } from '@rdfjs-elements/sparql-editor/src/SparqlEditor'
import { SparqlMarker } from '../../../hooks/useDataLoaderUtils/parser'

/* 
  SparqlEditor defines a value property that shadows a parent class getter,
  so remove it from property declaration list

  There is a bug in removing the webcomponent when the react component unmounts
  Basically, the this.codeMirror.editor reference becomes null, and the updated
  handler tries to attach some listeners to it. Putting a simple try/catch solves
  the problem.
*/
class RawSparqlEditor extends SparqlEditor {
  async updated(_changedProperties) {
    try {
      await super.updated(_changedProperties)

      let shouldParse = false

      if (_changedProperties.has('value')) {
        shouldParse = true
        await this._updateValue(this.value)
      }

      if (_changedProperties.has('prefixes')) {
        shouldParse = true
      }

      if (shouldParse) {
        this.parse()
      }
    } catch (e) {
      // ignore
    }
  }
}

window.customElements.define('sparql-editor', RawSparqlEditor)

export async function fetchData(source) {
  const sparqlGenerator = new Generator()
  const client = new SparqlHttpClient({
    endpointUrl: source.url,
  })
  const stream = await client.query.select(
    sparqlGenerator.stringify(source.query)
  )
  const rows = await readStream(stream, source.query.variables)
  rows[SparqlMarker] = true
  return rows
}

export default function SparqlFetch({
  userInput,
  setUserInput,
  setLoadingError,
}) {
  const [url, setUrl] = useState('')
  const [parsedQuery, setParsedQuery] = useState(null)

  const editorDomRef = useRef()

  const onQueryParsed = useCallback((evt) => {
    const editor = evt.target
    const query = editor.query
    if (query.queryType === 'SELECT') {
      setParsedQuery(query)
    } else {
      setParsedQuery(null)
    }
  }, [])

  const onParserFailure = useCallback(() => {
    console.log('parser failed')
    setParsedQuery(null)
  }, [])

  const onSubmit = useCallback(() => {
    const source = {
      type: 'sparql',
      url,
      query: parsedQuery,
    }
    fetchData(source)
      .then((result) => {
        setUserInput(result, {
          type: 'sparql',
          url,
          query: parsedQuery,
        })
      })
      .catch((err) => {
        setLoadingError(
          'It was not possible to execute the query on the given endpoint'
        )
      })
  }, [parsedQuery, setLoadingError, setUserInput, url])

  useEffect(() => {
    const node = editorDomRef.current
    render(
      html`<sparql-editor
        ?auto-parse=${true}
        @parsed=${onQueryParsed}
        @parsing-failed=${onParserFailure}
      ></sparql-editor>`,
      node
    )
  }, [onQueryParsed, onParserFailure])

  return (
    <>
      <div className={classNames(S['base-iri-input-here'])}>
        <span>Write your SPARQL Endpoint here</span>
      </div>
      <input
        className={classNames('w-100', S['url-input'])}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
        }}
      />
      <div className={classNames(S['query-input-here'])}>
        <span>Write your query here</span>
      </div>
      <div ref={editorDomRef} />
      <div className="text-right">
        <button
          className="btn btn-sm btn-success mt-3"
          disabled={!parsedQuery || !url}
          onClick={onSubmit}
        >
          Run query
        </button>
      </div>
    </>
  )
}

function readStream(stream, variables) {
  return new Promise((resolve, reject) => {
    const result = []
    stream.on('data', (record) => {
      const row = {}
      for (const variable of variables) {
        const term = record[variable.value]
        if (!term) {
          row[variable.value] = ''
        }

        if (term.termType === 'Literal') {
          row[variable.value] = fromRdf(term)
        }

        if (term.termType === 'NamedNode') {
          row[variable.value] = term.value
        }
      }
      result.push(row)
    })

    stream.on('end', () => {
      resolve(result)
    })

    stream.on('error', (err) => {
      reject(err)
    })
  })
}
