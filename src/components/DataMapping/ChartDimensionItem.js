import React, { useRef } from 'react'
import { Dropdown } from 'react-bootstrap'
import classnames from 'classnames'
import styles from './DataMapping.module.scss'
import { BsX } from 'react-icons/bs'
import { useDrag, useDrop } from 'react-dnd'
import get from 'lodash/get'
import { AGGREGATIONS_LABELS } from '../../constants'

export default function ChartDimensionItem({
  draggingColumn,
  index,
  isValid,
  DataTypeIcon,
  columnId,
  dimension,
  aggregators,
  relatedAggregation,
  onMove,

  onChangeAggregation,
  onDeleteItem,
  onChangeDimension,

  commitLocalMapping,
  rollbackLocalMapping,
  onInsertColumn,
  replaceDimension,

  localMappding,
}) {
  const ref = useRef(null)

  const [{ isOver }, drop] = useDrop({
    accept: ['column', 'card'],
    collect: (monitor) => {
      return {
        isOver: monitor.isOver() && monitor.getItem().type === 'column',
      }
    },
    hover(item, monitor) {
      if (!dimension.multiple) {
        return
      }
      if (!ref.current) {
        return
      }

      const hoverIndex = index

      //#TODO: for now we allow only dropping on "drop another dimension here" in case of multiple dimensions
      if (false && item.type === 'column') {
        onInsertColumn(hoverIndex, item)
        item.type = 'card'
        item.dimensionId = dimension.id
        item.index = hoverIndex
        return
      } else if (item.dimensionId === dimension.id) {
        const dragIndex = item.index
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect()
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }
        onMove(dragIndex, hoverIndex)
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
      } else {
        //#TODO: for now we allow only dropping on "drop another dimension here" in case of multiple dimensions

        // replaceDimension(
        //   item.dimensionId,
        //   dimension.id,
        //   item.index,
        //   index,
        //   true
        // )
        // item.dimensionId = dimension.id
        // item.index = hoverIndex
        return
      }
    },
    drop: (item, monitor) => {
      if (!dimension.multiple) {
        if (item.type === 'column') {
          onChangeDimension(index, item.id)
        } else {
          replaceDimension(item.dimensionId, dimension.id, item.index, index)
        }
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', index, id: columnId, dimensionId: dimension.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        commitLocalMapping()
      } else {
        rollbackLocalMapping()
      }
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging || draggingColumn ? 0.5 : 1,
      }}
      className={classnames(
        'assigned-column',
        styles['column-card'],
        styles['assigned-column'],
        isValid ? styles['column-valid'] : styles['column-invalid'],
        {
          'border border-danger': isOver,
          // 'border border-warning': isDragging,
        }
      )}
    >
      <span>
        {!!DataTypeIcon && (
          <DataTypeIcon className={styles['data-type-icon']} />
        )}
      </span>
      <span className={styles['column-title']}>{columnId}</span>
      {dimension.aggregation && (
        <Dropdown className="d-inline-block ml-2 raw-dropdown">
          <Dropdown.Toggle
            variant={isValid ? 'primary' : 'danger'}
            className="pr-5"
          >
            {get(AGGREGATIONS_LABELS, relatedAggregation, relatedAggregation)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {aggregators.map((aggregatorName) => (
              <Dropdown.Item
                key={aggregatorName}
                onClick={() => onChangeAggregation(index, aggregatorName)}
              >
                {get(AGGREGATIONS_LABELS, aggregatorName, aggregatorName)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
      <button
        className={styles['remove-assigned']}
        type="button"
        onClick={() => onDeleteItem(index)}
      >
        <BsX />
      </button>
    </div>
  )
}
