import React from 'react';
import { Row, Col, Dropdown, FormControl } from 'react-bootstrap';

export default function ParsingOptions(props){
  return (
    <Row className="parsing-options align-items-center">
      <Col xs={7} lg={5} className="pr-0">
          Locale
          <Dropdown className="d-inline-block ml-4 mr-4">
              <Dropdown.Toggle variant="white" className="pr-5">{props.locale}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>from <a href="https://github.com/d3/d3-format/tree/master/locale" target="_blank" rel="noopener noreferrer">d3-format</a></Dropdown.Header>
                {
                  Object.keys(props.localeList).map(d=>{
                    return <Dropdown.Item key={d} onSelect={(eventKey)=>props.setLocale(d)}>{d}</Dropdown.Item>
                  })
                }
              </Dropdown.Menu>
          </Dropdown>
      {/* </Col>
      <Col xs={4} md={3} ld={2}> */}
          Separator
          <input type="text" className="text-field ml-4 px-2" style={{maxWidth:'48px'}} value={props.separator} onChange={(event)=>props.setSeparator(event.target.value)}/>
      </Col>
      <Col xs={5} lg={7} className="text-right pl-0">
          Stack data on
          <Dropdown className="d-inline-block ml-4">
              <Dropdown.Toggle variant="white" className="pr-5">Dimension 1</Dropdown.Toggle>
              <Dropdown.Menu>
              {
                  props.dimensions.map(d=>{
                  return <Dropdown.Item key={d}>{d}</Dropdown.Item>
                  })
              }
              </Dropdown.Menu>
          </Dropdown>
      </Col>
    </Row>
  )
}