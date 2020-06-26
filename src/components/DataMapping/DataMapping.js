import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BsClock, BsHash, BsType } from "react-icons/bs";

const icons = {
  'date': <BsClock />,
  'number': <BsHash />,
  'string': <BsType />
}

export default function DataMapping({currentChart, dimensions}) {
  return (
    <Row>
      <Col xs={3}>
        DIMENSIONS
        {
          dimensions.map(d=>{
            return (
              <div key={d.name}>{icons[d.type]} {d.name}</div>
            )
          })
        }
      </Col>
      <Col>
        CHART VARIABLES
      </Col>
    </Row>
  )
}