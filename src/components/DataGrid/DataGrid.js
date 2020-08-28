import React, { useMemo, useRef, useState, useCallback } from "react";
import ReactDataGrid from 'react-data-grid';
import { Overlay } from "react-bootstrap";
import classNames from "classnames";

import S from "./DataGrid.module.scss"
import { keyBy } from "lodash";

console.log(S)

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
      <span role="button" className={S["data-type-selector-trigger"]} ref={target} onClick={handleTargetClick}>
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
            <div id="data-type-selector" className={S["data-type-selector"]} {...props}>
              <div
                data-datatype="date"
                onClick={handleTypeChange}
                className={classNames(S["data-type-selector-item"], { [S.selected]: currentType === "date" })}
              >Date</div>
              <div
                data-datatype="string"
                onClick={handleTypeChange}
                className={classNames(S["data-type-selector-item"], { [S.selected]: currentType === "string" })}
              >String</div>
              <div
                data-datatype="number"
                onClick={handleTypeChange}
                className={classNames(S["data-type-selector-item"], { [S.selected]: currentType === "number" })}
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

export default function DataGrid({ userDataset, dataset, errors, dataTypes, coerceTypes }) {
  const [[sortColumn, sortDirection], setSort] = useState(['id', 'NONE']);

  const keyedErrors = useMemo(() => keyBy(errors, "row"), [errors])

  // Make id column just as large as needed
  // Adjust constants to fit cell padding and font size
  // (Math.floor(Math.log10(data.dataset.length)) + 1) is the number 
  //   of digits of the highest id 
  const idColumnWidth = 24 + 8 * (Math.floor(Math.log10(userDataset.length)) + 1)

  const columns = useMemo(() => {
    if (!userDataset || !dataTypes) {
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
      ...Object.keys(dataTypes).map(k => ({
        key: k,
        name: k,
        headerRenderer: HeaderRenderer,
        formatter: ({ row }) => {
          console.log(row)
          return (
            <div className={classNames({ [S["has-error"]]: row?._errors?.[k] })}>
              {row[k]}
            </div>
          )
        },
        _raw_datatype: dataTypes[k],
        _raw_coerceType: nextType => coerceTypes({ ...dataTypes, [k]: nextType }),
        sortable: true,
        width: 180,
      }))
    ]
  }, [coerceTypes, dataTypes, userDataset, idColumnWidth])

  const sortedDataset = useMemo(() => {
    let datasetWithIds = userDataset
      .map((item, i) => ({               // Using .map ensures that we are not mutating a property
        ...item,
        _id: i + 1,                      // Give items some id to populate left-most column
        _stage3: dataset[i],             // The dataset parsed by raw lib basing on data types is needed for sorting!
        _errors: keyedErrors[i]?.error,  // Inject errors to format cells with parsing errors
      }))
    if (sortDirection === "NONE") return datasetWithIds
    const sortColumnType = dataTypes[sortColumn]
    if (sortColumnType === "number") {
      datasetWithIds = datasetWithIds.sort((a, b) => a._stage3[sortColumn] - b._stage3[sortColumn])
    }
    else if (sortColumnType === "date") {
      datasetWithIds = datasetWithIds.sort((a, b) => a._stage3[sortColumn]?.valueOf() ?? 0 - b._stage3[sortColumn]?.valueOf()) ?? 0
    } else {
      datasetWithIds = datasetWithIds.sort((a, b) => a._stage3[sortColumn].toString().localeCompare(b._stage3[sortColumn].toString()))
    }

    return sortDirection === 'DESC' ? datasetWithIds.reverse() : datasetWithIds;
  }, [userDataset, sortDirection, dataTypes, sortColumn, dataset, keyedErrors])

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