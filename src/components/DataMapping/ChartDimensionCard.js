import React from "react"
import { Col } from 'react-bootstrap'

import { useDrop } from "react-dnd"
import { get } from "lodash"
import classnames from "classnames"

import { DATATYPE_ICONS } from "../../constants"
import { dataTypeIcons } from "../../constants"
import  { BsX } from "react-icons/bs"

import styles from './DataMapping.module.scss'

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
    // <div
    //   className="Xcard Xp-3 Xm-2 "
    //   style={{ minWidth: 250 }}
    // >

      <Col xs={6} lg={4} xl={4}>

        <div className={styles['chart-dimension'] + ' user-select-none'}>
          {/* This is the card header */}
          <div className={`d-flex flex-row justify-content-between align-items-center ${styles['chart-dimension-header']}`}>
            <span className="text-left">
              { dimension.validTypes.map(t => {
                const DataTypeIcon = dataTypeIcons[t];
                return (<span key={t}>
                  < DataTypeIcon className={styles['accepted-type-icon']} />
                </span>)
                } 
              ) }
            </span>
            <span className="text-capitalize text-center">
              {dimension.name}
            </span>
            <span className={styles['dimension-required'] + ' text-right'} style={{opacity: dimension.required?1:0}}>
              {dimension.required && `\u2055`}
            </span>
          </div>
    
          {/* These are the columns that have been dropped on the current dimension */}
          {columnsMappedHere.map((columnId, i) => {
            const columnDataType = dataTypes[columnId]
            const isValid = 
              dimension.validTypes?.length === 0 || dimension.validTypes?.includes(columnDataType)
              ? styles['column-valid']
              : styles['column-invalid']
              const DataTypeIcon = dataTypeIcons[dataTypes[columnId]];
            return (
              <div key={i} className={classnames('assigned-column', styles['column-card'], styles['assigned-column'], isValid)}>
                <span><DataTypeIcon className={styles['data-type-icon']} /></span>
                <span className={styles['column-title']}>{columnId}</span>
                <button className={styles['remove-assigned']} type="button" onClick={() => {
                  setMapping({
                    ...mapping,
                    value: mapping.value.filter(col => col !== columnId)
                  })
                }}>
                  <BsX />
              </button>
              </div>
            )
          })}
    
          {/* This is the dropzone */}
          {(dimension.multiple || columnsMappedHere.length === 0) && (
            <div className={classnames('dropzone', styles['dropzone'], isOver?styles['active']:null )} ref={drop}>
              {!dimension.multiple && ('Drop dimension here')}
              {dimension.multiple && columnsMappedHere.length === 0 && ('Drop dimensions here')}
              {dimension.multiple && columnsMappedHere.length > 0 && ('Drop another dimension here')}
            </div>
          )}
        </div>

      </Col>

    // </div>
  )
}

export default ChartDimensionCard