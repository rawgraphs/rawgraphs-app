import React, { useCallback } from 'react'

export default function DecimalsSeparatorSelector({
  title,
  value,
  onChange,
  ...props
}) {
  const inputValue = value

  const handleChange = useCallback(
    (e) => {
      if (onChange) {
        const nextValue = e.target.value
        onChange(nextValue)
      }
    },
    [onChange]
  )

  return (
    <div className="option">
      {title}
      <input
        type="text"
        className="form-control text-field d-inline-block"
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}
