import React, { useRef, useState } from 'react'
import useDebounceCallback from '../../hooks/useDebounceCallback'
import Editor from '@monaco-editor/react'

export default function CodeChartEditor({ initialCode, build }) {
  const buildDebounced = useDebounceCallback(build, 350)

  const code = useRef(initialCode)

  const tabs = Object.keys(initialCode).filter((k) => k !== 'index')
  const [activeTab, setActiveTab] = useState('render')

  function handleChange(tabCode) {
    let nextCode = code.current
    nextCode[activeTab] = tabCode
    buildDebounced(nextCode)
  }

  return (
    <div>
      {tabs.map(tab => (
        <button onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>
      ))}
      <Editor
        path={activeTab}
        theme="vs-dark"
        onMount={() => {
          build(initialCode)
        }}
        height={600}
        onChange={handleChange}
        defaultLanguage="javascript"
        defaultValue={initialCode[activeTab]}
      />
    </div>
  )
}
