import React, { useCallback, useState } from 'react'
import { map } from 'lodash'
import './JsonViewer.scss'

const JsonViewerRecursive = ({
  contextName,
  nestingLevel,
  context,
  selectFilter,
  onSelect,
  path
}) => {
  const isSelectable = selectFilter(context)
  const contextType = typeof context
  const [mouseOver, setMouseOver] = useState(false)

  const classes = [
    'json-nested',
    isSelectable ? 'selectable' : null,
    mouseOver ? 'hover' : null,
  ]
    .filter((i) => i !== null)
    .join(' ')

  const handleSelect = useCallback(
    (e) => {
      if (isSelectable) {
        e.stopPropagation()
        e.preventDefault()
        if (onSelect) onSelect(context, path.join("."))
      }
    },
    [context, isSelectable, onSelect, path]
  )

  const handleMouseOver = useCallback(
    (e) => {
      if (isSelectable) {
        e.stopPropagation()
        e.preventDefault()
        setMouseOver(true)
      }
    },
    [isSelectable]
  )

  const handleMouseOut = useCallback(
    (e) => {
      if (isSelectable) {
        e.stopPropagation()
        e.preventDefault()
        setMouseOver(false)
      }
    },
    [isSelectable]
  )

  if (contextType === 'object' && contextType !== null) {
    return (
      <div
        className={classes}
        onClick={handleSelect}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {contextName && (
          <>
            <span className="property-name">{contextName}</span>
            <span className="colon">{': '}</span>
          </>
        )}
        {!Array.isArray(context) && (
          <span className="curly-bracket open-bracket">{'{'}</span>
        )}
        {Array.isArray(context) && (
          <span className="square-bracket open-bracket">{'['}</span>
        )}
        {map(context, (value, property) => (
          <JsonViewerRecursive
            key={property}
            contextName={Array.isArray(context) ? null : property}
            nestingLevel={nestingLevel + 1}
            context={value}
            selectFilter={selectFilter}
            onSelect={onSelect}
            path={[...path, property]}
          />
        ))}
        {!Array.isArray(context) && (
          <span className="curly-bracket close-bracket">{'}'}</span>
        )}
        {Array.isArray(context) && (
          <span className="square-bracket close-bracket">{']'}</span>
        )}
      </div>
    )
  } else {
    return (
      <div
        className={classes}
        onClick={handleSelect}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {contextName && (
          <>
            <span className="property-name">{contextName}</span>
            <span className="colon">{': '}</span>
          </>
        )}
        {context === null && <span className="scalar-value">null</span>}
        {context !== null && (
          <>
            {(contextType === 'bigint' || contextType === 'number') && (
              <span className="scalar-value scalar-value-numeric">
                {context.toString()}
              </span>
            )}
            {contextType === 'string' && (
              <span className="scalar-value scalar-value-string">
                "{context.toString()}"
              </span>
            )}
            {contextType === 'boolean' && (
              <span className="scalar-value scalar-value-bool">
                "{context ? 'true' : 'false'}"
              </span>
            )}
            {contextType === 'undefined' && (
              <span className="scalar-value scalar-value-undefined">
                undefined
              </span>
            )}
          </>
        )}
      </div>
    )
  }
}

const JsonViewer = ({ context, selectFilter, onSelect }) => {
  return (
    <pre className="json-viewer">
      <JsonViewerRecursive
        contextName={null}
        nestingLevel={0}
        context={context}
        selectFilter={selectFilter}
        onSelect={onSelect}
        path={[]}
      />
    </pre>
  )
}

export default JsonViewer
