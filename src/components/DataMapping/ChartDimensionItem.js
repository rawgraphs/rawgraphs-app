import React, { useRef } from 'react'
import { Col, Dropdown } from 'react-bootstrap'
import classnames from 'classnames'
import styles from './DataMapping.module.scss'
import { BsX } from 'react-icons/bs'
import { useDrag, useDrop } from 'react-dnd'

export default function ChartDimensionItem({
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
}) {
  const ref = useRef(null)

  const [{ isOver }, drop] = useDrop({
    accept: ['column', 'card'],
    // accept: 'card',
    collect: (monitor, x) => {
      // console.log('X', x, monitor.getItem())
      return {
        isOver: monitor.isOver() && monitor.getItem().type === 'column',
      }
    },
    hover(item, monitor) {
      if (item.type === 'column') {
        return
      }
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
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
      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
    drop: (item, monitor) => {
      if (item.type === 'column') {
        onChangeDimension(index, item.id)
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        commitLocalMapping()
        console.log('COMMIT BACK')
      } else {
        rollbackLocalMapping()
        console.log('ROLL BACK')
      }
      // console.log('DID DROP', didDrop)
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
      className={classnames(
        'assigned-column',
        styles['column-card'],
        styles['assigned-column'],
        isValid,
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
          <Dropdown.Toggle variant="primary" className="pr-5">
            {relatedAggregation}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {aggregators.map((aggregatorName) => (
              <Dropdown.Item
                key={aggregatorName}
                onClick={() => onChangeAggregation(index, aggregatorName)}
              >
                {aggregatorName}
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
