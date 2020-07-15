import React from "react"

const ChartOptionBoolean = ({label, value, error, onChange}) => {
  return <label className="d-block">
  <b>{label}</b><br />
  <input
    type="checkbox"
    checked={value}
    onChange={e => {
      onChange(e.target.checked)
    }}
    
  />
  {error && <small><i>{error}</i></small>}
</label>
}

export default ChartOptionBoolean