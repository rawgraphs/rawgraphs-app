import React, { useState } from "react";
import Menu from "./components/Menu";
import ChartSelector from "./components/ChartSelector";
import charts from "./charts";

// #TODO: i18n

function App() {
  const [currentChart, setCurrentChart] = useState(null);

  return (
    <div className="App">
      <Menu />
      <ChartSelector
        availableCharts={charts}
        currentChart={currentChart}
        setCurrentChart={setCurrentChart}
      />
    </div>
  );
}

export default App;
