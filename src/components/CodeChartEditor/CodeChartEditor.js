import React, { useRef, useState } from 'react'
import useDebounceCallback from '../../hooks/useDebounceCallback'
import Editor from '@monaco-editor/react'
import { Tabs, Tab } from 'react-bootstrap'

export default function CodeChartEditor({ initialCode, onCodeChange }) {
  const onCodeChangeDebounced = useDebounceCallback(onCodeChange, 350)

  const code = useRef(initialCode)

  const tabs = Object.keys(initialCode).filter((k) => k !== 'index')
  const [activeTab, setActiveTab] = useState('render')

  function handleChange(tabCode) {
    let nextCode = code.current
    nextCode[activeTab] = tabCode
    onCodeChangeDebounced(nextCode)
  }

  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={setActiveTab}>
        {tabs.map((tab) => (
          <Tab key={tab} eventKey={tab} title={tab} />
        ))}
      </Tabs>
      <Editor
        path={activeTab}
        theme="vs-dark"
        onMount={() => {
          onCodeChange(initialCode)
        }}
        height={600}
        onChange={handleChange}
        defaultLanguage="javascript"
        defaultValue={initialCode[activeTab]}
      />
    </div>
  )
}
