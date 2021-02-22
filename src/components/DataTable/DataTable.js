import React from 'react'
import { useTable, useBlockLayout, useFlexLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import './DataTable.scss'

export default function DataTable({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      width: 200,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout
    // useFlexLayout
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <tr
          {...row.getRowProps({
            style,
          })}
          className="datatable-row"
        >
          {row.cells.map((cell) => {
            return (
              <td {...cell.getCellProps()} className="datatable-cell">
                {cell.render('Cell')}
              </td>
            )
          })}
        </tr>
      )
    },
    [prepareRow, rows]
  )

  // Render the UI for your table
  return (
    <div className="datatable-container">
      <table {...getTableProps()} className="datatable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="datatable-header-cell"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          <FixedSizeList
            height={400}
            itemCount={rows.length}
            itemSize={35}
            width={totalColumnsWidth}
          >
            {RenderRow}
          </FixedSizeList>
        </tbody>
      </table>
    </div>
  )
}
