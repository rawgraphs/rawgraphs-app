import React from "react"
import { Col } from "react-bootstrap";
import ChartOptionSelect from './ChartOptionSelect'


const ChartOptionColor = ({ value, error, onChange, default: defaultValue, label, ...props }) => {
  if(props.options){
    return <ChartOptionSelect value={value} error={error} onChange={onChange} default={defaultValue} label={label} {...props} />
  }
  return (
    <label className="row">
      <Col xs={4}>{label}</Col>
      <Col xs={4}>
        <input
          type="color"
          value={value ?? ""}
          step={props.step}
          onChange={e => {
            onChange(e.target.value)
          }}
          placeholder={defaultValue}
        />
      </Col>
      {error && <small><i>{error}</i></small>}
    </label>
  )
}

export default React.memo(ChartOptionColor)