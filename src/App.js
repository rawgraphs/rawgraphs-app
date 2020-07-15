import React, { useState, useCallback } from "react";

import HeaderItems from './HeaderItems';
import Header from "./components/Header";
import Section from "./components/Section";
import Footer from "./components/Footer";

import DataLoader from "./components/DataLoader";
import charts from "./charts";
import ChartSelector from "./components/ChartSelector";
import DataMapping from './components/DataMapping';
import ChartPreviewWithOptions from "./components/ChartPreviewWIthOptions";

// #TODO: i18n

function App() {
  const [data, setData] = useState(null)
  const [currentChart, setCurrentChart] = useState(charts[0])
  const [mapping, setMapping] = useState({})
  const [visualOptions, setVisualOptions] = useState({})

  const handleChartChange = useCallback(nextChart => {
    setCurrentChart(nextChart)
    setMapping({})
  }, [])

  return (
    <div className="App">
      <Header menuItems={HeaderItems} />
      <Section title="1. Load your data">
        <DataLoader
          data={data}
          setData={setData}
        />
      </Section>
      {data && (
        <Section title="2. Choose a chart">
          <ChartSelector
            availableCharts={charts}
            currentChart={currentChart}
            setCurrentChart={handleChartChange}
          />
        </Section>
      )}
      {data && currentChart && (
        <Section title="3. Mapping">
          <DataMapping 
            dimensions={currentChart.dimensions}
            dataTypes={data.dataTypes}
            mapping={mapping} 
            setMapping={setMapping}
          />
        </Section>
      )}
      {data && currentChart && (
        <Section title="4. Customize">
          <ChartPreviewWithOptions
            chart={currentChart}
            dataset={data.dataset}
            dataTypes={data.dataTypes}
            mapping={mapping}
            visualOptions={visualOptions}
            setVisualOptions={setVisualOptions}
          />
        </Section>
      )}
      <Section title="5. Export">
        Export here
        </Section>
      <Section title="0. Typography">
        {typography}
      </Section>
      <Footer>
        Footer items go here!
        </Footer>
    </div>
  );
}

export default App;

const typography = (
  <>
    <h1>h1. Bootstrap heading <small>Secondary text in heading</small></h1>
    <h2>h2. Bootstrap heading <small>Secondary text in heading</small></h2>
    <h3>h3. Bootstrap heading <small>Secondary text in heading</small></h3>
    <h4>h4. Bootstrap heading <small>Secondary text in heading</small></h4>
    <h5>h5. Bootstrap heading <small>Secondary text in heading</small></h5>
    <h6>h6. Bootstrap heading <small>Secondary text in heading</small></h6>
    <p className="lead">Lead Paragraph. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
    <p>An ordinary paragraph.</p>
    <p className="lighter">Paragraph classed "lighter"</p>
    <p className="small">A paragraph classed "small"</p>

  </>
)