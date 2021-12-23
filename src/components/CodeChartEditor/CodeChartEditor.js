import React, { useImperativeHandle, useRef, useState } from 'react'
import useDebounceCallback from '../../hooks/useDebounceCallback'
import Editor from '@monaco-editor/react'
import { Tabs, Tab } from 'react-bootstrap'

function CodeChartEditor({ initialCode, onCodeChange }, ref) {
  const onCodeChangeDebounced = useDebounceCallback(onCodeChange, 350)

  const code = useRef(initialCode)

  const tabs = Object.keys(initialCode).filter((k) => k !== 'index')
  const [activeTab, setActiveTab] = useState('render')

  function handleChange(tabCode) {
    const deCode = code.current
    const nextCode = {
      ...deCode,
      [activeTab]: tabCode,
    }
    code.current = nextCode
    onCodeChangeDebounced(nextCode)
  }

  useImperativeHandle(ref, () => ({
    getCode: () => {
      return code.current
    },
  }))

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
        onMount={(editor, monaco) => {
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

export default React.memo(React.forwardRef(CodeChartEditor))