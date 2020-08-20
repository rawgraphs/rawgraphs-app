import React, { useMemo, useRef, useState, useCallback } from "react";
import ReactDataGrid from 'react-data-grid';
import { Overlay } from "react-bootstrap";
import classNames from "classnames";
import { getTypeName, NumberParser } from "@raw-temp/rawgraphs-core"
import dayjs from "dayjs";
import isPlainObject from 'lodash/isPlainObject'


import "./DataGrid.scss"


function Formatter({row, column, ...props}){
  let value = row[column.key]
  if(value && getTypeName(column._raw_datatype) === 'date'){
    value = dayjs(value).format(column._raw_datatype.dateFormat)
  }
  if(value && isPlainObject(column._raw_datatype) && getTypeName(column._raw_datatype) === 'number'){
    //format according to locale
    const { locale, group, decimal, numerals } = column._raw_datatype
    // const formatter = new Intl.NumberFormat( locale, {style: 'decimal'})
    const numberParser = new NumberParser({ locale, group, decimal, numerals })
    value = numberParser.format(value)
  }
  return <div>{value}</div>
}


function DataTypeSelector({ currentType, onTypeChange }) {
  const target = useRef(null)
  const [showPicker, setShowPicker] = useState(false)

  const handleTypeChange = useCallback(e => {
    e.stopPropagation()
    e.preventDefault()
    const newType = e.target.dataset.datatype
    if (typeof onTypeChange === "function" && newType !== currentType) {
      onTypeChange(newType)
    }
    setShowPicker(false)
  }, [currentType, onTypeChange])

  const handleTargetClick = useCallback(e => {
    e.stopPropagation()
    e.preventDefault()
    setShowPicker(!showPicker)
  }, [showPicker])

  return (
    <>
      <span role="button" className="data-type-selector-trigger" ref={target} onClick={handleTargetClick}>
        {/* TODO: use icon based on currentType */}
        #
      </span>
      <Overlay
        target={target.current}
        show={showPicker}
        placement="bottom"
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
            <div id="data-type-selector" className="data-type-selector" {...props}>
              <div
                data-datatype="date"
                onClick={handleTypeChange}
                className={classNames('data-type-selector-item', { selected: getTypeName(currentType) === "date" })}
              >Date</div>
              <div
                data-datatype="string"
                onClick={handleTypeChange}
                className={classNames('data-type-selector-item', { selected: getTypeName(currentType) === "string" })}
              >String</div>
              <div
                data-datatype="number"
                onClick={handleTypeChange}
                className={classNames('data-type-selector-item', { selected: getTypeName(currentType) === "number" })}
              >Number</div>
            </div>
          )}
      </Overlay>
    </>
  )
}

function HeaderRenderer({ column, ...props }) {
  return (
    <div>
      <DataTypeSelector
        currentType={column._raw_datatype}
        onTypeChange={column._raw_coerceType}
      />
      <span>{column.name}</span>
    </div>
  )
}

export default function DataGrid({ data, coerceTypes }) {
  const [[sortColumn, sortDirection], setSort] = useState(['id', 'NONE']);

  // Make id column just as large as needed
  // Adjust constants to fit cell padding and font size
  // (Math.floor(Math.log10(data.dataset.length)) + 1) is the number 
  //   of digits of the highest id 
  const idColumnWidth = 24 + 8 * (Math.floor(Math.log10(data.dataset.length)) + 1)

  const columns = useMemo(() => {
    if (!data) {
      return []
    }
    return [
      {
        key: "_id",
        name: "",
        headerRenderer: () => null,
        frozen: true,
        width: idColumnWidth,
        sortable: true,
      },
      ...Object.keys(data.dataTypes).map(k => ({
        key: k,
        name: k,
        headerRenderer: HeaderRenderer,
        formatter: Formatter,
        _raw_datatype: data.dataTypes[k],
        _raw_coerceType: nextType => coerceTypes({ ...data.dataTypes, [k]: nextType }),
        sortable: true,
        width: 180,
      })) 
    ]
  }, [coerceTypes, data, idColumnWidth])

  const sortedDataset = useMemo(() => {
    let datasetWithIds = data.dataset
      .map((item, i) => ({ 
        ...item, 
        _id: i + 1 
      }))
    if (sortDirection === "NONE") return datasetWithIds
    
    const sortColumnType = getTypeName(data.dataTypes[sortColumn])

    if (sortColumnType === "number") {
      datasetWithIds = datasetWithIds.sort((a, b) => a[sortColumn] || 0 - b[sortColumn] || 0)
    }
    else if (sortColumnType === "date") {
      datasetWithIds = datasetWithIds.sort((a, b) => a[sortColumn]?.valueOf() ?? 0 - b[sortColumn]?.valueOf()) ?? 0
    } else {
      datasetWithIds = datasetWithIds.sort((a, b) => a[sortColumn].toString().localeCompare(b[sortColumn].toString()))
    }

    return sortDirection === 'DESC' ? datasetWithIds.reverse() : datasetWithIds;
  }, [data.dataTypes, data.dataset, sortColumn, sortDirection])

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  return (
    <ReactDataGrid
      minColumnWidth={idColumnWidth}
      columns={columns}
      rows={sortedDataset}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  )

}