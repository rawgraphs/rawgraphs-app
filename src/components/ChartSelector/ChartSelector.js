import React, { useState } from "react";
import { Row, Col, Card, Dropdown } from 'react-bootstrap';

export default function ChartSelector({
    availableCharts,
    currentChart,
    setCurrentChart,
  })
  { 
  
  // make the array longer for testing purposes. To be removed.
  availableCharts = availableCharts.concat(availableCharts, availableCharts, availableCharts, availableCharts, availableCharts, availableCharts, availableCharts, availableCharts);

  const [filter, setFilter] = useState('All charts');
  const charts = filter==='All charts'?availableCharts:availableCharts.filter(d=>d.category===filter);

  return (
    <>
      <Row>
        <Col className="flex-row text-right">
          Show
          <Dropdown className="d-inline-block ml-2">
            <Dropdown.Toggle variant="secondary">{filter}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item key={'All charts'} onClick={()=>setFilter('All charts')}>All charts</Dropdown.Item>
              {
                [...new Set(availableCharts.map(d=>d.category))].map(d=>{
                  return <Dropdown.Item key={d} onClick={()=>setFilter(d)}>{d}</Dropdown.Item>
                })
              }
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col xs={3} className="pt-3">
          <Card>
            <Card.Img variant="top" src={currentChart.thumbnail} />
            <Card.Body>
              <Card.Title className="m-0"><h2 className="m-0">{currentChart.name}</h2></Card.Title>
              <Card.Subtitle className="m-0"><h4 className="mb-2">{currentChart.category}</h4></Card.Subtitle>
              <Card.Text>
                {currentChart.description}
              </Card.Text>
              <Card.Link href={currentChart.code} target="_blank">[icn] Code</Card.Link>
              <Card.Link href={currentChart.tutorial} target="_blank">[icn] Tutorial</Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Row>
            {charts.map((d,i)=>{
              return ( 
                <Col xs={4} key={'chart-'+i} className="p-3 chart-small">
                    <Card onClick={()=>{ setCurrentChart(d) }} className="flex-row overflow-hidden h-100">
                      <div className="thumbnail h-100 w-25" style={{backgroundImage:`url("${d.thumbnail}")`}}></div>
                      <Card.Body className="w-75 px-2 py-3">
                        <Card.Title className="m-0"><h2 className="m-0">{d.name}</h2></Card.Title>
                        <Card.Subtitle className="m-0"><h4 className="m-0">{d.category}</h4></Card.Subtitle>
                      </Card.Body>
                    </Card>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </>
  );
}
