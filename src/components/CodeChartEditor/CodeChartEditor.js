import React, { useState } from 'react'
import useDebounceCallback from '../../hooks/useDebounceCallback'

export default function CodeChartEditor({ initialCode, build }) {
  const [code, setCode] = useState(initialCode)

  const buildDebounced = useDebounceCallback(build, 350)

  return (
    <textarea
      style={{ width: '100%' }}
      value={code}
      onChange={(e) => {
        const nextCode = e.target.value
        setCode(nextCode)
        buildDebounced(nextCode)
      }}
      rows={20}
    />
  )
}
