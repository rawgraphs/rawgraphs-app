import React, { useCallback } from 'react'
import { Row, Col } from 'react-bootstrap'
import { map } from 'lodash'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import ColumnCard from "./ColumnCard"
import ChartDimensionCard from "./ChartDimensionCard"

export default function DataMapping({ dataTypes, dimensions, mapping, setMapping }) {

  console.log("MAPPING", mapping)

  const updateMapping = useCallback((dimension, mappingConf) => {
    setMapping(prev => ({
      ...prev,
      [dimension]: mappingConf
    }))
  }, [setMapping])

  return (
    <DndProvider backend={HTML5Backend}>
      <Row>
        <Col xs={3}>
          DIMENSIONS
          {
            map(dataTypes, (dataType, columnName) => {
              return (
                <ColumnCard
                  key={columnName}
                  dimensionName={columnName} 
                  dimensionType={dataType}
                />
              )
            })
          }
        </Col>
        <Col>
          CHART VARIABLES
          <div className="d-flex flex-row flex-wrap">
            {
              dimensions.map(d => {
                return (
                  <ChartDimensionCard 
                    key={d.id} 
                    dimension={d} 
                    dataTypes={dataTypes}
                    mapping={mapping[d.id] || {}}
                    setMapping={mappingConf => updateMapping(d.id, mappingConf)}
                  />
                )
              })
            }
          </div>
        </Col>
      </Row>
    </DndProvider>
  )
}