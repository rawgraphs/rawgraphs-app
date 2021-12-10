import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import S from './SparqlFetch.module.scss'
import { html, render } from 'lit-html'
import SimpleClient from 'sparql-http-client/SimpleClient'
import { Generator } from 'sparqljs'
import '@rdfjs-elements/sparql-editor/sparql-editor.js'
import { SparqlMarker } from '../../../hooks/useDataLoaderUtils/parser'

const DEFAULT_PREFIXES = {
  wd: 'http://www.wikidata.org/entity/',
  wds: 'http://www.wikidata.org/entity/statement/',
  wdv: 'http://www.wikidata.org/value/',
  wdt: 'http://www.wikidata.org/prop/direct/',
  wikibase: 'http://wikiba.se/ontology#',
  p: 'http://www.wikidata.org/prop/',
  ps: 'http://www.wikidata.org/prop/statement/',
  pq: 'http://www.wikidata.org/prop/qualifier/',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  bd: 'http://www.bigdata.com/rdf#',
  wdref: 'http://www.wikidata.org/reference/',
  psv: 'http://www.wikidata.org/prop/statement/value/',
  psn: 'http://www.wikidata.org/prop/statement/value-normalized/',
  pqv: 'http://www.wikidata.org/prop/qualifier/value/',
  pqn: 'http://www.wikidata.org/prop/qualifier/value-normalized/',
  pr: 'http://www.wikidata.org/prop/reference/',
  prv: 'http://www.wikidata.org/prop/reference/value/',
  prn: 'http://www.wikidata.org/prop/reference/value-normalized/',
  wdno: 'http://www.wikidata.org/prop/novalue/',
  wdata: 'http://www.wikidata.org/wiki/Special:EntityData/',
  schema: 'http://schema.org/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  owl: 'http://www.w3.org/2002/07/owl#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  prov: 'http://www.w3.org/ns/prov#',
  bds: 'http://www.bigdata.com/rdf/search#',
  gas: 'http://www.bigdata.com/rdf/gas#',
  hint: 'http://www.bigdata.com/queryHints#',
}

export async function fetchData(source) {
  const sparqlGenerator = new Generator()
  const client = new SimpleClient({
    endpointUrl: source.url,
  })
  const response = await client.query.select(
    sparqlGenerator.stringify(source.query)
  )
  const results = await response.json()
  const rows = bindingsToJson(results.head.vars, results.results.bindings)
  rows[SparqlMarker] = true
  return rows
}

export default function SparqlFetch({
  userInput,
  setUserInput,
  setLoadingError,
  initialState,
}) {
  const [url, setUrl] = useState(initialState?.url ?? 'https://query.wikidata.org/sparql')
  const [parsedQuery, setParsedQuery] = useState(null)

  const editorDomRef = useRef()

  const initialQuery = useMemo(() => {
    if (initialState?.query) {
      const sparqlGenerator = new Generator()
      return sparqlGenerator.stringify(initialState.query)
    } else {
      return ''
    }
  }, [initialState])

  const onQueryParsed = useCallback((evt) => {
    const { query } = evt.detail
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
        auto-parse
        value=${initialQuery}
        customPrefixes=${JSON.stringify(DEFAULT_PREFIXES)}
        @parsed=${onQueryParsed}
        @parsing-failed=${onParserFailure}
      ></sparql-editor>`,
      node
    )
  }, [onQueryParsed, onParserFailure, initialQuery])

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

function bindingsToJson(varNames, bindings) {
  const result = []
  for (const binding of bindings) {
    const row = {}
    for (const variable of varNames) {
      const term = binding[variable]
      if (!term) {
        row[variable] = ''
      } else {
        row[variable] = term.value
      }
    }
    result.push(row)
  }
  return result
}
