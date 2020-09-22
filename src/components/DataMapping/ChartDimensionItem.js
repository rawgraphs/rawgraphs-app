import React from 'react'
import { Dropdown } from 'react-bootstrap'
import classnames from 'classnames'
import styles from './DataMapping.module.scss'
import { BsX } from 'react-icons/bs'

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
  

}) {
  return (
    <div
      className={classnames(
        'assigned-column',
        styles['column-card'],
        styles['assigned-column'],
        isValid
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
