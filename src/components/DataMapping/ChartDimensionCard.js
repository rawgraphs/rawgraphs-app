import React, { useCallback } from 'react'
import DataTypeIcon from './DataTypeIcon'
import RequiredIcon from './RequiredIcon'
import { Col } from 'react-bootstrap'
import { useDrop } from 'react-dnd'
import get from 'lodash/get'
import uniqueId from 'lodash/uniqueId'
import classnames from 'classnames'
import arrayMove from 'array-move'
import arrayInsert from 'array-insert'

// import { DATATYPE_ICONS } from "../../constants"
import { dataTypeIcons } from '../../constants'
import {
  getTypeName,
  getAggregatorNames,
  getDefaultDimensionAggregation,
} from '@rawgraphs/rawgraphs-core'
import ChartDimensionItem from './ChartDimensionItem'

import styles from './DataMapping.module.scss'
const aggregators = getAggregatorNames()
const emptyList = []

const ChartDimensionCard = ({
  dimension,
  dataTypes,
  mapping,
  setMapping,
  commitLocalMapping,
  rollbackLocalMapping,
  draggingId,
  setDraggingId,
  replaceDimension,
  localMappding,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['column', 'card'],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item, monitor) => {
      if (item.type === 'column') {
        const defaulAggregation = dimension.aggregation
          ? getDefaultDimensionAggregation(dimension, dataTypes[item.id])
          : null

        const columnDataType = getTypeName(dataTypes[item.id]);
        const isValid =
          dimension.validTypes?.length === 0 ||
          dimension.validTypes?.includes(columnDataType)

        setMapping({
          ...mapping,
          ids: (mapping.ids || []).concat(uniqueId()),
          value: [...(mapping.value || []), item.id],
          isValid: isValid,
          mappedType: columnDataType,
          config: dimension.aggregation
            ? {
                aggregation: [
                  ...(get(mapping, 'config.aggregation') || []),
                  defaulAggregation,
                ],
              }
            : undefined,
        })
      } else if (item.dimensionId !== dimension.id) {
        replaceDimension(
          item.dimensionId,
          dimension.id,
          item.index,
          mapping.value ? mapping.value.length : 0,
          true
        )
      }
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

  const idsMappedHere = get(mapping, 'ids', emptyList)
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
        ids: mapping.ids.filter((col, j) => j !== i),
        value: mapping.value.filter((col, j) => j !== i),
        config: nextConfig,
      })
    },
    [mapping, setMapping]
  )

  const onChangeDimension = useCallback(
    (i, newCol) => {
      setMapping({
        ...mapping,
        value: mapping.value.map((col, j) => (j === i ? newCol : col)),
      })
    },
    [mapping, setMapping]
  )

  const onMove = useCallback(
    (dragIndex, hoverIndex) => {
      let nextConfig
      if (mapping.config) {
        nextConfig = {
          ...mapping.config,
          aggregation: arrayMove(
            mapping.config.aggregation,
            dragIndex,
            hoverIndex
          ),
        }
      }

      setMapping(
        {
          ...mapping,
          ids: arrayMove(mapping.ids, dragIndex, hoverIndex),
          value: arrayMove(mapping.value, dragIndex, hoverIndex),
          config: nextConfig,
        },
        true
      )
    },
    [mapping, setMapping]
  )

  const onInsertColumn = useCallback(
    (index, item) => {
      const defaulAggregation = dimension.aggregation
        ? getDefaultDimensionAggregation(dimension, dataTypes[item.id])
        : null

      const nextId = uniqueId()
      setDraggingId(nextId)
      setMapping(
        {
          ...mapping,
          ids: arrayInsert(mapping.ids ?? [], index, nextId),
          value: arrayInsert(mapping.value ?? [], index, item.id),
          config: dimension.aggregation
            ? {
                aggregation: arrayInsert(
                  get(mapping, 'config.aggregation', []),
                  index,
                  defaulAggregation
                ),
              }
            : undefined,
        },
        true
      )
    },
    [dataTypes, dimension, mapping, setDraggingId, setMapping]
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
              return <DataTypeIcon key={t} type={t} />
              // const DataTypeIcon = dataTypeIcons[t]
              // return (
              //   <span key={t}>
              //     <DataTypeIcon className={styles['accepted-type-icon']} />
              //   </span>
              // )
            })}
          </span>
          <span className="text-capitalize text-center">{dimension.name}</span>
          <span
            className={styles['dimension-required'] + ' text-right'}
            style={{ opacity: dimension.required ? 1 : 0 }}
          >
            {dimension.required && <RequiredIcon />}
          </span>
        </div>

        {/* These are the columns that have been dropped on the current dimension */}
        {idsMappedHere.map((renderId, i) => {
          const columnId = columnsMappedHere[i]
          const columnDataType = getTypeName(dataTypes[columnId])
          const relatedAggregation = dimension.aggregation
            ? aggregationsMappedHere[i] ||
              getDefaultDimensionAggregation(dimension, columnDataType)
            : undefined
          const isValid =
            dimension.validTypes?.length === 0 ||
            dimension.validTypes?.includes(columnDataType)

          const DataTypeIcon = dataTypeIcons[getTypeName(dataTypes[columnId])]

          return (
            <ChartDimensionItem
              id={renderId}
              key={renderId}
              index={i}
              onMove={onMove}
              onChangeDimension={onChangeDimension}
              onChangeAggregation={onChangeAggregation}
              onDeleteItem={onDeleteItem}
              isValid={isValid}
              DataTypeIcon={DataTypeIcon}
              columnId={columnId}
              dimension={dimension}
              aggregators={aggregators}
              relatedAggregation={relatedAggregation}
              commitLocalMapping={commitLocalMapping}
              rollbackLocalMapping={rollbackLocalMapping}
              onInsertColumn={onInsertColumn}
              draggingColumn={draggingId === renderId}
              replaceDimension={replaceDimension}
              localMappding={localMappding}
            />
          )
        })}

        {/* This is the dropzone */}
        {(dimension.multiple || columnsMappedHere.length === 0) && (
          <div
            className={classnames('dropzone', styles['dropzone'], {
              [styles['active']]: isOver,
            })}
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
