import React from "react"

const ChartOptionColor = ({ value, error, onChange, default: defaultValue, label, ...props }) => {
  return (
    <label className="d-block">
      <b>{label}</b><br />
      <input
        type="color"
        value={value ?? ""}
        step={props.step}
        onChange={e => {
          onChange(e.target.value)
        }}
        placeholder={defaultValue}
      />
      {error && <small><i>{error}</i></small>}
    </label>
  )
}

export default ChartOptionColor