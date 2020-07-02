import React, { useCallback } from "react"

export default function SeparatorSelector({ value, onChange, ...props }) {
  const inputValue = value
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")

  const handleChange = useCallback(e => {
    if (onChange) {
      const nextValue = e.target.value
        .replace(/\\r/g, "\r")
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
      onChange(nextValue)
    }
  }, [onChange])

  return (
    <input
      type="text"
      className="form-control text-field ml-4 px-2 d-inline-block"
      style={{ maxWidth: '48px' }}
      value={inputValue}
      onChange={handleChange} 
      {...props}
    />
  )
}