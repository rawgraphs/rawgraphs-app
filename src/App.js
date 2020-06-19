import React, { useState } from "react";
import { Container } from 'react-bootstrap';

import headerItems from './headerItems';
import Header from "./components/Header";
import Section from "./components/Section";

import ChartSelector from "./components/ChartSelector";
import charts from "./charts";

import Footer from "./components/Footer";

// #TODO: i18n

function App() {
  const [currentChart, setCurrentChart] = useState(charts.find(d=>d.name==="Scatter Plot"));
  
  return (
    <div className="App">
      <Header menuItems={headerItems}/>
      <Container fluid>
        <Section title="0. Typography">
          {typography}
        </Section>
        <Section title="1. Load your data">
          Data grid
        </Section>
        <Section title="2. Choose a chart">
          <ChartSelector
            availableCharts={charts}
            currentChart={currentChart}
            setCurrentChart={setCurrentChart}
          />
        </Section>
        <Section title="3. Mapping">
          Data mapping here
        </Section>
        <Section title="4. Customize">
          Customize chart here
        </Section>
        <Section title="5. Export">
          Export here
        </Section>
        <Footer>
          Footer items go here!
        </Footer>
      </Container>
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