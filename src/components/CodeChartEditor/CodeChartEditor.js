import React from 'react'

export default function CodeChartEditor({ code, onCodeChange }) {
  return (
    <textarea
      style={{ width: '100%' }}
      value={code}
      onChange={(e) => {
        onCodeChange(e.target.value)
      }}
      rows={20}
    />
  )
}
