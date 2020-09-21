import React, { useCallback } from 'react'
import { Row, Col } from 'react-bootstrap'
import { map } from 'lodash'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import ColumnCard from './ColumnCard'
import ChartDimensionCard from './ChartDimensionCard'

function DataMapping({ dataTypes, dimensions, mapping, setMapping }) {
  const updateMapping = useCallback(
    (dimension, mappingConf) => {
      setMapping((prev) => ({
        ...prev,
        [dimension]: mappingConf,
      }))
    },
    [setMapping]
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <Row>
        <Col xs={3}>
          <h5 className="text-uppercase">Dimensions</h5>
          {map(dataTypes, (dataType, columnName) => {
            return (
              <ColumnCard
                key={columnName}
                dimensionName={columnName}
                dimensionType={dataType}
              />
            )
          })}
        </Col>
        <Col>
          <h5 className="text-uppercase">Chart Variables</h5>
          {/* <div className="d-flex flex-row flex-wrap"> */}
          <Row
            className="sticky-top"
            style={{ top: 'calc(var(--header-height) + 16px)' }}
          >
            {dimensions.map((d) => {
              return (
                <ChartDimensionCard
                  key={d.id}
                  dimension={d}
                  dataTypes={dataTypes}
                  mapping={mapping[d.id] || {}}
                  setMapping={(mappingConf) => updateMapping(d.id, mappingConf)}
                />
              )
            })}
          </Row>
          {/* </div> */}
        </Col>
      </Row>
    </DndProvider>
  )
}

export default React.memo(DataMapping)
