import React from 'react'
import ChartOptionSelect from './ChartOptionSelect'

const ChartOptionText = ({
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  isEnabled,
  ...props
}) => {
  if (props.options) {
    return (
      <ChartOptionSelect
        value={value}
        error={error}
        onChange={onChange}
        default={defaultValue}
        label={label}
        {...props}
      />
    )
  }
  return (
    <label className="d-block">
      <b>{label}</b>
      <br />
      <input
        type="text"
        value={value ?? ''}
        step={props.step}
        disabled={!isEnabled}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={defaultValue}
      />
      {error && (
        <small>
          <i>{error}</i>
        </small>
      )}
    </label>
  )
}

export default React.memo(ChartOptionText)
