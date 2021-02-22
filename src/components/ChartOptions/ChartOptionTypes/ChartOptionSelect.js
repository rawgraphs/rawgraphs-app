import React from 'react'
import { Row, Col } from 'react-bootstrap'
import isObject from 'lodash/isObject'

const ChartOptionSelect = ({
  options = [],
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  ...props
}) => {
  return (
    <Row className={props.className}>
      <Col xs={6} className="d-flex align-items-center nowrap">{label}</Col>
      <Col xs={6}>
        <select
          className="custom-select raw-select"
          value={value ?? defaultValue}
          onChange={(e) => {
            const stringValue = e.target.value
            const value =
              props.type === 'number' ? Number(stringValue) : stringValue
            onChange(value)
          }}
        >
          {options.map((option) =>
            isObject(option) ? (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ) : (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
        {error && (
          <small>
            <i>{error}</i>
          </small>
        )}
      </Col>
    </Row>
  )
}

export default React.memo(ChartOptionSelect)
