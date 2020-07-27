import React, { useCallback } from "react"
import { Dropdown } from 'react-bootstrap';

export default function StackSelector({ title, value, list, onChange, ...props }) {
  
  const handleChange = useCallback(locale => {
    if (onChange) {
      const nextDinemsion = locale
      onChange(nextDinemsion)
    }
  }, [onChange])

  return (
    <div className="option">
      {title}
      <Dropdown className="d-inline-block">
        <Dropdown.Toggle variant="white" className="truncate-160px" disabled={list.length===0}>{value?value:'Select a dimension'}</Dropdown.Toggle>
        <Dropdown.Menu>
        {
          Object.keys(list).map(d=>{
          return <Dropdown.Item key={d} onSelect={ ()=>handleChange(d) }>{d}</Dropdown.Item>
          })
        }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}