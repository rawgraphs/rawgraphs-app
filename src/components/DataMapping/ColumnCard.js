import React from "react"
import { DATATYPE_ICONS } from "../../constants"
import { useDrag } from "react-dnd"

const ColumnCard = ({ dimensionName, dimensionType }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id: dimensionName, type: "column" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  })

  return (
    <div
      ref={drag}
      className={`card p-3 column-card ${isDragging ? 'is-dragging' : ''}`}
    >
      {DATATYPE_ICONS[dimensionType]} {dimensionName}
    </div>
  )
}

export default ColumnCard