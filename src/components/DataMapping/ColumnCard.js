import React from "react"
import { dataTypeIcons } from "../../constants"

import { useDrag } from "react-dnd"

import styles from './DataMapping.module.scss'

const ColumnCard = ({ dimensionName, dimensionType }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id: dimensionName, type: "column" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  })

  const DataTypeIcon = dataTypeIcons[dimensionType];

  return (
    <div
      ref={drag}
      className={`column-card ${styles['column-card']} ${isDragging ? 'is-dragging' : ''}`}
    >
    
    < DataTypeIcon className={styles['data-type-icon']} /> 
    <span className={styles['column-title']}>{dimensionName}</span>
    </div>
  )
}

export default ColumnCard