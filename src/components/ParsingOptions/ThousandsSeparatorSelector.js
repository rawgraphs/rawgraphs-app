import React, { useCallback } from 'react'

export default function ThousandsSeparatorSelector({
  title,
  value,
  onChange,
  ...props
}) {
  const inputValue = value
  // // Remove?
  // .replace(/\r/g, "\\r")
  // .replace(/\n/g, "\\n")
  // .replace(/\t/g, "\\t")

  const handleChange = useCallback(
    (e) => {
      if (onChange) {
        const nextValue = e.target.value
        // // Remove?
        // .replace(/\\r/g, "\r")
        // .replace(/\\n/g, "\n")
        // .replace(/\\t/g, "\t")

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
