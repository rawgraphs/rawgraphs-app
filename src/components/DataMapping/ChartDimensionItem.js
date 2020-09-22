import React from 'react'
import { Col, Dropdown } from 'react-bootstrap'
import classnames from 'classnames'
import styles from './DataMapping.module.scss'
import { BsX } from 'react-icons/bs'
import { useDrop } from 'react-dnd'

export default function ChartDimensionItem({
  index,
  isValid,
  DataTypeIcon,
  columnId,
  dimension,
  aggregators,
  relatedAggregation,

  onChangeAggregation,
  onDeleteItem,
  onChangeDimension,


}) {
  const [{ isOver }, drop] = useDrop({
    accept: 'column',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item, monitor) => {
      onChangeDimension(index, item.id)
    }
  })

  return (
    <div
      ref={drop}
      className={classnames(
        'assigned-column',
        styles['column-card'],
        styles['assigned-column'],
        isValid,
        {
          'border border-danger': isOver
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
