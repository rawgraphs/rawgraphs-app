import React, { useMemo, useRef, useState, useCallback } from 'react'
import ReactDataGrid from 'react-data-grid'
import { Overlay, OverlayTrigger } from 'react-bootstrap'
import classNames from 'classnames'
import { getTypeName, dateFormats } from '@rawgraphs/rawgraphs-core'
import S from './DataGrid.module.scss'
import { keyBy, get, isEqual } from 'lodash'
import {
  dataTypeIcons,
  DateIcon,
  StringIcon,
  NumberIcon,
} from '../../constants'
import { BsFillCaretRightFill } from 'react-icons/bs'

const DATE_FORMATS = Object.keys(dateFormats)

const DateFormatSelector = React.forwardRef(
  ({ currentFormat, onChange, className, ...props }, ref) => {
    return (
      <div
        className={classNames(className, S['date-format-selector'])}
        ref={ref}
        {...props}
      >
        {DATE_FORMATS.map((dateFmt) => (
          <div
            key={dateFmt}
            className={classNames(S['date-format-selector-entry'], {
              [S.selected]: get(currentFormat, 'dateFormat', '') === dateFmt,
            })}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onChange &&
                onChange({
                  type: 'date',
                  dateFormat: dateFmt,
                })
            }}
          >
            {dateFmt}
          </div>
        ))}
      </div>
    )
  }
)

function DataTypeSelector({
  currentType: typeDescriptor,
  onTypeChange,
  currentTypeComplete,
}) {
  const dataTypeIconDomRef = useRef(null)
  const [showPicker, setShowPicker] = useState(false)
  const currentType = get(typeDescriptor, 'type', typeDescriptor)

  const handleTypeChange = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      const newType = e.target.dataset.datatype
      if (
        typeof onTypeChange === 'function' &&
        !isEqual(newType, typeDescriptor)
      ) {
        onTypeChange(newType)
      }
      setShowPicker(false)
    },
    [typeDescriptor, onTypeChange]
  )

  const handleTypeChangeDate = useCallback(
    (newType) => {
      if (
        typeof onTypeChange === 'function' &&
        !isEqual(newType, typeDescriptor)
      ) {
        onTypeChange(newType)
      }
      setShowPicker(false)
    },
    [typeDescriptor, onTypeChange]
  )

  const handleTargetClick = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setShowPicker(!showPicker)
    },
    [showPicker]
  )

  const Icon = dataTypeIcons[currentType]

  return (
    <>
      <span
        role="button"
        className={S['data-type-selector-trigger']}
        ref={dataTypeIconDomRef}
        onClick={handleTargetClick}
      >
        <Icon />
      </span>
      <Overlay
        target={dataTypeIconDomRef.current}
        show={showPicker}
        placement="bottom-start"
        rootClose={true}
        rootCloseEvent="click"
        onHide={() => {
          setShowPicker(false)
        }}
        container={document.body}
      >
        {({
          placement,
          scheduleUpdate,
          arrowProps,
          outOfBoundaries,
          show: _show,
          ...props
        }) => (
          <div
            id="data-type-selector"
            className={S['data-type-selector']}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            <div
              data-datatype="number"
              onClick={handleTypeChange}
              className={classNames(S['data-type-selector-item'], {
                [S.selected]: currentType === 'number',
              })}
            >
              <NumberIcon /> Number
            </div>
            <OverlayTrigger
              placement="right-start"
              overlay={
                <DateFormatSelector
                  currentType={typeDescriptor}
                  onChange={handleTypeChangeDate}
                />
              }
              trigger="click"
            >
              {({ ref, ...triggerHandler }) => (
                <div
                  ref={ref}
                  data-datatype="date"
                  {...triggerHandler}
                  className={classNames(
                    S['data-type-selector-item'],
                    S['parent-type-selector'],
                    { [S.selected]: currentType === 'date' }
                  )}
                >
                  <div>
                    <DateIcon />
                    {'Date'}
                    {currentType === 'date' && (
                      <span className={S['date-format-preview']}>
                        {' (' + (currentTypeComplete.dateFormat) + ')  '}
                      </span>
                    )}
                  </div>
                  <BsFillCaretRightFill
                    style={{ marginRight: 0, fill: 'var(--gray-700)' }}
                  />
                </div>
              )}
            </OverlayTrigger>
            <div
              data-datatype="string"
              onClick={handleTypeChange}
              className={classNames(S['data-type-selector-item'], {
                [S.selected]: currentType === 'string',
              })}
            >
              <StringIcon /> String
            </div>
          </div>
        )}
      </Overlay>
    </>
  )
}

function HeaderRenderer({ ...props }) {
  const { column } = props
  const { key, sortColumn, sortDirection } = column
  return (
    <div
      className={classNames(
        { [S['raw-col-header']]: true },
        {
          [S['unsorted']]:
            key !== sortColumn ||
            (key === sortColumn && sortDirection === 'NONE'),
        },
        { [S['acs']]: key === sortColumn && sortDirection === 'ASC' },
        { [S['desc']]: key === sortColumn && sortDirection === 'DESC' }
      )}
    >
      <DataTypeSelector
        currentType={column._raw_datatype}
        onTypeChange={column._raw_coerceType}
        currentTypeComplete={column._raw_datatype}
      />
      <span
        className={classNames(S['column-name'], 'text-truncate', 'd-block')}
        title={column.name}
      >
        {column.name}
      </span>
    </div>
  )
}

export default function DataGrid({
  userDataset,
  dataset,
  errors,
  dataTypes,
  coerceTypes,
  onDataUpdate,
}) {
  const [[sortColumn, sortDirection], setSort] = useState(['id', 'NONE'])

  const keyedErrors = useMemo(() => keyBy(errors, 'row'), [errors])

  const containerEl = useRef()

  // Make id column just as large as needed
  // Adjust constants to fit cell padding and font size
  // (Math.floor(Math.log10(data.dataset.length)) + 1) is the number
  //   of digits of the highest id
  const idColumnWidth =
    24 + 8 * (Math.floor(Math.log10(userDataset.length)) + 1)
  
  const equalDinstribution = (containerEl.current?.getBoundingClientRect().width - idColumnWidth - 1) / Object.keys(dataTypes).length
  const columnWidth = equalDinstribution ? Math.max(equalDinstribution, 170) : 170;

  const columns = useMemo(() => {
    if (!userDataset || !dataTypes) {
      return []
    }
    return [
      {
        key: '_id',
        name: '',
        headerRenderer: () => null,
        frozen: true,
        width: idColumnWidth,
        sortable: true,
      },
      ...Object.keys(dataTypes).map((k, i) => ({
        key: k,
        name: k,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        headerRenderer: HeaderRenderer,
        editable: true,
        formatter: ({ row }) => {
          return (
            <div
              className={classNames({ [S['has-error']]: row?._errors?.[k] })}
            >
              {row[k]?.toString()}
              {/* {row[k]} */}
            </div>
          )
        },
        _raw_datatype: dataTypes[k],
        _raw_coerceType: (nextType) =>
          coerceTypes({ ...dataTypes, [k]: nextType }),
        sortable: true,
        resizable: true,
        width: columnWidth
      })),
    ]
  }, [
    coerceTypes,
    dataTypes,
    userDataset,
    idColumnWidth,
    columnWidth,
    sortColumn,
    sortDirection,
  ])

  const sortedDataset = useMemo(() => {
    let datasetWithIds = userDataset.map((item, i) => ({
      // Using .map ensures that we are not mutating a property
      ...item,
      _id: i + 1, // Give items some id to populate left-most column
      _stage3: dataset[i], // The dataset parsed by raw lib basing on data types is needed for sorting!
      _errors: keyedErrors[i]?.error, // Inject errors to format cells with parsing errors
    }))
    if (sortDirection === 'NONE') return datasetWithIds

    const sortColumnType = getTypeName(dataTypes[sortColumn])

    if (sortColumnType === 'number') {
      datasetWithIds = datasetWithIds.sort(
        (a, b) => a._stage3[sortColumn] - b._stage3[sortColumn]
      )
    } else if (sortColumnType === 'date') {
      datasetWithIds =
        datasetWithIds.sort(
          (a, b) =>
            a._stage3[sortColumn]?.valueOf() ??
            0 - b._stage3[sortColumn]?.valueOf()
        ) ?? 0
    } else {
      datasetWithIds = datasetWithIds.sort((a, b) =>
        a._stage3[sortColumn]
          ?.toString()
          .localeCompare(b._stage3[sortColumn].toString())
      )
    }

    return sortDirection === 'DESC' ? datasetWithIds.reverse() : datasetWithIds
  }, [userDataset, sortDirection, dataTypes, sortColumn, dataset, keyedErrors])

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction])
  }, [])

  return (
    <div ref={containerEl}>
      <ReactDataGrid
        minColumnWidth={idColumnWidth}
        columns={columns}
        rows={sortedDataset}
        rowHeight={48}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        height={432}
        onColumnResize={() => {
          
        }}
        onRowsUpdate={(update) => {
          if (update.action === 'CELL_UPDATE') {
            const newDataset = [...userDataset]
            newDataset[update.fromRow] = {
              ...newDataset[update.fromRow],
              [update.cellKey]: update.updated[update.cellKey],
            }
            onDataUpdate && onDataUpdate(newDataset)
          }
        }}
      />
    </div>
  )
}
