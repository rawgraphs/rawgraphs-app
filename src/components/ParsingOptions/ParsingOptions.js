import React from 'react';
import { Row, Col, Dropdown, FormControl } from 'react-bootstrap';

export default function ParsingOptions(){
  return (
    <Row className="parsing-options align-items-center">
      <Col xs={3}>
          Locale
          <Dropdown className="d-inline-block ml-4 w-50">
              <Dropdown.Toggle variant="white" className="w-100">Locale 1</Dropdown.Toggle>
              <Dropdown.Menu>
              {
                  ['Locale 1', 'Locale 2', 'Locale 3'].map(d=>{
                  return <Dropdown.Item key={d}>{d}</Dropdown.Item>
                  })
              }
              </Dropdown.Menu>
          </Dropdown>
      </Col>
      <Col xs={3}>
          Separator
          <input type="text" className="text-field ml-4 px-2 w-50"/>
      </Col>
      <Col xs={3}>
          Stack data on
          <Dropdown className="d-inline-block ml-2 w-50">
              <Dropdown.Toggle variant="white" className="w-100">Dimension 1</Dropdown.Toggle>
              <Dropdown.Menu>
              {
                  ['Dimension 1', 'Dimension 2', 'Dimension 3'].map(d=>{
                  return <Dropdown.Item key={d}>{d}</Dropdown.Item>
                  })
              }
              </Dropdown.Menu>
          </Dropdown>
      </Col>
      <Col xs={3}>clear</Col>
    </Row>
  )
}