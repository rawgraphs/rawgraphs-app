import React from 'react'
import { Row, Col, Form } from 'react-bootstrap'

const ChartOptionBoolean = ({ optionId, label, value, error, onChange, className, isEnabled }) => {
  return (
    <Row className={className}>
      <Col xs={6} className="d-flex align-items-center nowrap">{label}</Col>
      <Form className="col-6 d-flex align-items-center">
        <Form.Check
          type="switch"
          checked={!!value}
          disabled={!isEnabled}
          onChange={(e) => {
            onChange(e.target.checked)
          }}
          id={optionId}
          label={value ? 'Yes' : 'No'}
        />
      </Form>
      {error && (
        <div className="col-12">
          <small>
            <i>{error}</i>
          </small>
        </div>
      )}
    </Row>
  )
}

export default React.memo(ChartOptionBoolean)
