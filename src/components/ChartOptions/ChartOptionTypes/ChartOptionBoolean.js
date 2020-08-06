import React from "react"
import { Row, Col, Form } from "react-bootstrap";

const ChartOptionBoolean = ({optionId, label, value, error, onChange}) => {

  console.log(value)

  return <Row>
    <Col xs={6}>{label}</Col>
    <Form className="col-6">
      <Form.Check
        type="switch"
        checked={!!value}
        onChange={e => {
          onChange(e.target.checked)
        }}
        id={optionId}
        label={value?'Yes':'No'}
      />
    </Form>
    {error && <div className="col-12"><small><i>{error}</i></small></div>}
  </Row>

}

export default ChartOptionBoolean