import React from "react"
import { DATATYPE_ICONS } from "../../constants"
import { useDrop } from "react-dnd"
import { get } from "lodash"
import classnames from "classnames"

const ChartDimensionCard = ({ dimension, dataTypes, mapping, setMapping }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "column",
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    drop: (item, monitor) => {
      setMapping({
        ...mapping,
        value: [...(mapping.value || []), item.id]
      })
    }
  })

  const columnsMappedHere = get(mapping, "value", [])

  return (
    <div
      className="card p-3 m-2 "
      style={{ minWidth: 250 }}
    >
      {/* This is the card header */}
      <div className="d-flex flex-row justify-content-between align-items-center">
        <span>
          {dimension.validTypes.map(t => (
            <span key={t}>
              {DATATYPE_ICONS[t]}
            </span>
          ))}
        </span>
        <span className="ml-3">
          {dimension.name}
        </span>
        <span>
          {dimension.required && <i>required</i>}
        </span>
      </div>
      {/* These are the columns that have been dropped on the current dimension */}
      {columnsMappedHere.map((columnId, i) => {
        const columnDataType = dataTypes[columnId]
        const isValid = 
          dimension.validTypes?.length === 0 || dimension.validTypes?.includes(columnDataType)
          ? 'column-valid'
          : 'column-invalid'
        return (
          <div key={i} className={classnames('assigned-column', isValid)}>
            <span>{DATATYPE_ICONS[dataTypes[columnId]]}</span>
            {columnId}
            <button type="button" onClick={() => {
              setMapping({
                ...mapping,
                value: mapping.value.filter(col => col !== columnId)
              })
            }}>
              X
          </button>
          </div>
        )
      })}
      {/* This is the dropzone */}
      {(dimension.multiple || columnsMappedHere.length === 0) && (
        <div className={classnames('p-3 border border-light dropzone', { 'bg-light': isOver, })} ref={drop}>
          {!dimension.multiple && (<i>Drop dimension here</i>)}
          {dimension.multiple && columnsMappedHere.length === 0 && (<i>Drop dimensions here</i>)}
          {dimension.multiple && columnsMappedHere.length > 0 && (<i>Drop another dimension here</i>)}
        </div>
      )}
    </div>
  )
}

export default ChartDimensionCard