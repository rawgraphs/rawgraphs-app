import React, { useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'
import ColorSchemePreview from './ColorSchemePreview'
import {
  getColorScale
} from '@raw-temp/rawgraphs-core'

const ColorSchemesDropDown = ({
    interpolators,
    interpolator,
    setInterpolator,
    // To display color-scale preview
    colorDataset,
    colorDataType,
    scaleType,
    userValuesForFinalScale
}) => {

  // const scale = getColorScale(
  //   colorDataset,
  //   colorDataType,
  //   scaleType,
  //   interpolator,
  //   userValuesForFinalScale
  // )

  useEffect(()=>{
    console.log(
      colorDataset,
      colorDataType,
      scaleType,
      interpolator,
      userValuesForFinalScale)
  })

  let mainPreview;
  if (colorDataset && colorDataType && scaleType && interpolator && userValuesForFinalScale && false) {
    mainPreview = <ColorSchemePreview
                    scale={
                      getColorScale(
                        colorDataset,
                        colorDataType,
                        scaleType,
                        interpolator,
                        userValuesForFinalScale
                        )
                    }
                    // label={interpolator}
                  />
  } else {
    <p>Problem</p>
  }

  return (
    <Dropdown className="d-inline-block raw-dropdown w-100">
      <Dropdown.Toggle variant="white" className="pr-5 w-100">
        { mainPreview }
      </Dropdown.Toggle>
      <Dropdown.Menu>
      {interpolators.map(
        (interpolator, i) => {
          {console.log(interpolator)}
          return (
            <Dropdown.Item key={interpolator} onClick={()=>setInterpolator(interpolator)}>
              {/* <ColorSchemePreview
                scale={
                  getColorScale(
                    [1939, 2009, 1997, 1977, 2019, 1965, 1982, 1956, 1965, 2015, 1937, 1993, 1975, 2018, 1973, 1961, 1994, 2015, 1967, 1999, 1959, 2012, 2003, 1980, 1996, 2019, 2015, 2001, 1950, 2011, 1965, 1942, 2006, 2015, 1964, 1978, 1994, 2002, 2001, 2013, 2019, 2003, 2002, 2004, 2018, 2017, 1983, 2013, 2018, 1972],
                    "number",
                    "ordinal",
                    interpolator,
                    userValuesForFinalScale)
                }
                label={interpolator}
              /> */}
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