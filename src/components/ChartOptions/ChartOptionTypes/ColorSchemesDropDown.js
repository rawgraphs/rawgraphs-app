import React from 'react'
import { Dropdown } from 'react-bootstrap'
import ColorSchemePreview from './ColorSchemePreview'
import {
  getColorScale,
  colorPresets,
  getColorDomain,
  getInitialScaleValues
} from '@raw-temp/rawgraphs-core'

import styles from '../ChartOptions.module.scss'

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
  return (
    <Dropdown className="d-inline-block raw-dropdown w-100">
      <Dropdown.Toggle variant="white" className="w-100" style={{paddingRight:24}}>
        { colorDataset[0] && colorPresets[scaleType][interpolator] && <ColorSchemePreview
          scale={
            getColorScale(
              colorDataset,
              colorDataType,
              scaleType,
              interpolator,
              userValuesForFinalScale)
          }
          xlabel={interpolator}
        />}
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100" styles={{padding:'4px 0'}}>
      {interpolators.map(
        (intrplr) => {
          return (
            <Dropdown.Item key={intrplr} onClick={()=>setInterpolator(intrplr)} className={styles["color-scheme-dropdown-item"]}>
              { colorDataset[0] && colorPresets[scaleType][interpolator] && 
                <ColorSchemePreview
                  scale={
                    getColorScale(
                      colorDataset,
                      colorDataType,
                      scaleType,
                      intrplr,
                      getInitialScaleValues(
                        getColorDomain(colorDataset, colorDataType, scaleType),
                        scaleType,
                        intrplr
                      )
                    )
                  }
                  label={intrplr}
                />
              }
            </Dropdown.Item>
          )
        }
      )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default React.memo(ColorSchemesDropDown)