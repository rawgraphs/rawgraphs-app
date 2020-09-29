import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

const samplesList = [
  {
    name: 'Highest grossing movies in history',
    category: 'Bubble chart',
    url: './sample-datasets/Bubble Chart - TOP 50 Groossing Movies.tsv',
    delimiter: '\t',
  },

  {
    name: 'US Presidential Elections (1976-2016)',
    category: 'Line Graph',
    url: './sample-datasets/Line Graph - US Presidential Elections.tsv',
    delimiter: '\t',
  },

  {
    name: 'Letter Frequency by Language',
    category: 'Matrix plot (Heatmap)',
    url: './sample-datasets/Matrix Plot - Letters frequencies by language.tsv',
    delimiter: '\t',
  },

  {
    name: 'Aromas of wine and frequency',
    category: 'Sunburst Diagram',
    url: './sample-datasets/Sunburst - Wine Aromas.tsv',
    delimiter: '\t',
  },
]
export default function DataSamples({ onSampleReady }) {
  const select = async (sample) => {
    const { delimiter, url } = sample
    const response = await fetch(url)
    const text = await response.text()
    onSampleReady(text, delimiter)
  }
  return (
    <Row>
      {samplesList.map((d, i) => {
        return (
          <Col xs={6} lg={4} xl={3} key={i} style={{ marginBottom: 15 }}>
            <Card
              onClick={() => {
                select(d)
              }}
              className="cursor-pointer"
            >
              <Card.Body className="">
                <Card.Title className="">
                  <h2 className="">{d.name}</h2>
                </Card.Title>
                <Card.Subtitle className="">
                  <h4 className="m-0">{d.category}</h4>
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}
