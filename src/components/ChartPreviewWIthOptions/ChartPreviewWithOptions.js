import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import ChartOptions from "../ChartOptions";
import ChartPreview from "../ChartPreview";

const ChartPreviewWithOptions = ({
  chart,
  dataset,
  dataTypes,
  mapping,
  visualOptions,
  setVisualOptions,
  setRawViz,
}) => {
  const [error, setError] = useState(null);
  return (
    <Row>
      <Col xs={3}>
        <ChartOptions
          chart={chart}
          dataset={dataset}
          mapping={mapping}
          dataTypes={dataTypes}
          visualOptions={visualOptions}
          setVisualOptions={setVisualOptions}
          error={error}
        />
      </Col>
      <Col>
        <ChartPreview
          chart={chart}
          dataset={dataset}
          dataTypes={dataTypes}
          mapping={mapping}
          visualOptions={visualOptions}
          error={error}
          setError={setError}
          setRawViz={setRawViz}
        />
      </Col>
    </Row>
  );
};

export default ChartPreviewWithOptions;
