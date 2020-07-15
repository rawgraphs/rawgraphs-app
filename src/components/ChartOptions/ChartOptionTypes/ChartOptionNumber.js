import React from "react"

const ChartOptionNumber = ({ value, error, onChange, default: defaultValue, label, ...props }) => {
  return (
    <label className="d-block">
      <b>{label}</b><br />
      <input
        type="number"
        value={value ?? ""}
        step={props.step}
        onChange={e => {
          const str = e.target.value
          if (str === "") {
            onChange(undefined)
          } else {
            const n = parseInt(str, 10)
            if (!isNaN(n)) {
              onChange(n)
            } else {
              onChange(undefined)
            }
          }
        }}
        placeholder={defaultValue}
      />
      {error && <small><i>{error}</i></small>}
    </label>
  )
}

export default ChartOptionNumber