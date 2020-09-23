import React, { useCallback } from 'react'
import { Col } from 'react-bootstrap'
import { useDrop } from 'react-dnd'
import { get } from 'lodash'
import classnames from 'classnames'

// import { DATATYPE_ICONS } from "../../constants"
import { dataTypeIcons } from '../../constants'
import {
  getTypeName,
  getAggregatorNames,
  getDefaultDimensionAggregation,
} from '@raw-temp/rawgraphs-core'
import ChartDimensionItem from './ChartDimensionItem'

import styles from './DataMapping.module.scss'
const aggregators = getAggregatorNames()
const emptyList = []

const ChartDimensionCard = ({ dimension, dataTypes, mapping, setMapping }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'column',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item, monitor) => {
      const defaulAggregation = dimension.aggregation
        ? getDefaultDimensionAggregation(dimension, dataTypes[item.id])
        : null

      setMapping({
        ...mapping,
        value: [...(mapping.value || []), item.id],
        config: dimension.aggregation
          ? {
              aggregation: [
                ...(get(mapping, 'config.aggregation') || []),
                defaulAggregation,
              ],
            }
          : undefined,
      })
    },
  })

  // const [collectedProps, drag] = useDrag({
  //   item: {
  //     type: 'card',

  //   }
  // })

  const setAggregation = useCallback(
    (newAggregations) => {
      setMapping({
        ...mapping,
        config: { aggregation: [...newAggregations] },
      })
    },
    [mapping, setMapping]
  )

  const columnsMappedHere = get(mapping, 'value', emptyList)
  let aggregationsMappedHere = get(mapping, 'config.aggregation', emptyList)

  const onChangeAggregation = useCallback(
    (i, aggregatorName) => {
      const newAggregations = [...aggregationsMappedHere]
      newAggregations[i] = aggregatorName
      setAggregation(newAggregations)
    },
    [aggregationsMappedHere, setAggregation]
  )

  const onDeleteItem = useCallback(
    (i) => {
      let nextConfig
      if (mapping.config) {
        nextConfig = {
          ...mapping.config,
          aggregation: mapping.config.aggregation.filter((col, j) => j !== i),
        }
      }

      setMapping({
        ...mapping,
        value: mapping.value.filter((col, j) => j !== i),
        config: nextConfig,
      })
    },
    [mapping, setMapping]
  )

  return (
    // <div
    //   className="Xcard Xp-3 Xm-2 "
    //   style={{ minWidth: 250 }}
    // >

    <Col xs={6} lg={4} xl={4}>
      <div className={styles['chart-dimension'] + ' user-select-none'}>
        {/* This is the card header */}
        <div
          className={`d-flex flex-row justify-content-between align-items-center ${styles['chart-dimension-header']}`}
        >
          <span className="text-left">
            {dimension.validTypes.map((t) => {
              const DataTypeIcon = dataTypeIcons[t]
              return (
                <span key={t}>
                  <DataTypeIcon className={styles['accepted-type-icon']} />
                </span>
              )
            })}
          </span>
          <span className="text-capitalize text-center">{dimension.name}</span>
          <span
            className={styles['dimension-required'] + ' text-right'}
            style={{ opacity: dimension.required ? 1 : 0 }}
          >
            {dimension.required && `\u2055`}
          </span>
        </div>

        {/* These are the columns that have been dropped on the current dimension */}
        {columnsMappedHere.map((columnId, i) => {
          const columnDataType = getTypeName(dataTypes[columnId])
          const relatedAggregation = dimension.aggregation
            ? aggregationsMappedHere[i] ||
              getDefaultDimensionAggregation(dimension, columnDataType)
            : undefined
          const isValid =
            dimension.validTypes?.length === 0 ||
            dimension.validTypes?.includes(columnDataType)
              ? styles['column-valid']
              : styles['column-invalid']
          const DataTypeIcon = dataTypeIcons[getTypeName(dataTypes[columnId])]

          return (
            <ChartDimensionItem
              key={i}
              index={i}
              onChangeAggregation={onChangeAggregation}
              onDeleteItem={onDeleteItem}
              isValid={isValid}
              DataTypeIcon={DataTypeIcon}
              columnId={columnId}
              dimension={dimension}
              aggregators={aggregators}
              relatedAggregation={relatedAggregation}
            />
          )
        })}

        {/* This is the dropzone */}
        {(dimension.multiple || columnsMappedHere.length === 0) && (
          <div
            className={classnames(
              'dropzone',
              styles['dropzone'],
              isOver ? styles['active'] : null
            )}
            ref={drop}
          >
            {!dimension.multiple && 'Drop dimension here'}
            {dimension.multiple &&
              columnsMappedHere.length === 0 &&
              'Drop dimensions here'}
            {dimension.multiple &&
              columnsMappedHere.length > 0 &&
              'Drop another dimension here'}
          </div>
        )}
      </div>
    </Col>
  )
}

export default ChartDimensionCard
