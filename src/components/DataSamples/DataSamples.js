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

  {
    name: 'Orchestras by musical instrument',
    category: 'Treemap',
    url: './sample-datasets/Treemap - Orchestra.tsv',
    delimiter: '\t',
  },

  {
    name: 'Animal kingdom classification',
    category: 'Dendogram',
    url: './sample-datasets/Dendogram - animal kingdom.tsv',
    delimiter: '\t',
  },

  {
    name: 'Most populated cities per continent',
    category: 'Circle Packing',
    url: './sample-datasets/CirclePacking - biggest-cities.tsv',
    delimiter: '\t',
  },

  {
    name: 'FIFA playes statistics',
    category: 'Radar Chart',
    url: './sample-datasets/Radar Chart - Fifa players.tsv',
    delimiter: '\t',
  },

  {
    name: 'Premier League and Serie A ranking',
    category: 'Slop Graph',
    url: './sample-datasets/Slope graph - Premier SerieA ranking.tsv',
    delimiter: '\t',
  },

  {
    name: 'Olympics Medals',
    category: 'Streamgraph',
    url: './sample-datasets/Streamgraph - Olympics Medals.tsv',
    delimiter: '\t',
  },

  {
    name: 'Italian Presidents',
    category: 'Gantt chart',
    url: './sample-datasets/Gantt chart - Italian Presidents.tsv',
    delimiter: '\t',
  },

  {
    name: 'Basketball shots',
    category: 'Hexagonal Binning',
    url: './sample-datasets/Hexbin - basketball shots.tsv',
    delimiter: '\t',
  },

]
export default function DataSamples({ onSampleReady, setLoadingError }) {
  const select = async (sample) => {
    const { delimiter, url } = sample
    let response;
    try {
      response = await fetch(url)
    } catch (e) {
      setLoadingError('Loading error. ' + e.message)
      return
    }
    const text = await response.text()
    onSampleReady(text, delimiter)
    setLoadingError(null)
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
