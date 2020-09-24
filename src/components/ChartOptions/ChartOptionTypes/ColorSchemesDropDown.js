import React from 'react'
import { Dropdown } from 'react-bootstrap'

const ColorSchemesDropDown = ({interpolators, interpolator, setInterpolator}) => {
  return (
    <Dropdown className="d-inline-block raw-dropdown w-100">
      <Dropdown.Toggle variant="white" className="pr-5 w-100">
        {interpolator}
      </Dropdown.Toggle>
      <Dropdown.Menu>
      {interpolators.map(
        (interpolator, i) => {
          return (
            <Dropdown.Item key={interpolator} onClick={()=>setInterpolator(interpolator)}>
              {interpolator}
            </Dropdown.Item>
          )
        }
      )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ColorSchemesDropDown