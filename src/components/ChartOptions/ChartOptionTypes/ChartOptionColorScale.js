import React, { useState, useMemo, useEffect, useCallback } from 'react'
import InilineColorPicker from '../../InlineColorPicker'
import ColorSchemesDropDown from './ColorSchemesDropDown'
import { Row, Col } from 'react-bootstrap'
import get from 'lodash/get'
import {
  getInitialScaleValues,
  getColorScale,
  getColorDomain,
  colorPresets,
  getTypeName,
} from '@raw-temp/rawgraphs-core'

import styles from '../ChartOptions.module.scss'

const scaleTypes = Object.keys(colorPresets)

const ChartOptionColorScale = ({
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  dimension,
  dataset,
  mapping,
  dataTypes,
  chart,
  mappedData,
  ...props
}) => {
  // const mappedDataset = useMemo(() => {
  //   try {

  //     const viz = rawChart(chart, {
  //       data: dataset,
  //       mapping,
  //       dataTypes,
  //       visualOptions: {},
  //     })
  //     return viz.mapData()
  //   } catch (e) {
  //     return undefined

  //   }
  // }, [chart, mapping, dataTypes, dataset])

  const [scaleType, setScaleType] = useState('ordinal')

  const mappingValue = useMemo(() => {
    return get(mapping, `[${dimension}].value`)
  }, [dimension, mapping])

  const colorDataType = useMemo(() => {
    return dataTypes[mappingValue]
      ? getTypeName(dataTypes[mappingValue])
      : undefined
  }, [dataTypes, mappingValue])

  const availableScaleTypes = useMemo(() => {
    if (colorDataType === 'number' || colorDataType === 'date') {
      return scaleTypes
    }
    return ['ordinal']
  }, [colorDataType])

  const colorDataset = useMemo(() => {
    if (mappedData) {
      return mappedData.map((d) => get(d, dimension))
    } else {
      return []
    }
  }, [dimension, mappedData])

  const interpolators = useMemo(() => {
    return Object.keys(colorPresets[scaleType])
  }, [scaleType])

  const [interpolator, setInterpolator] = useState(interpolators[0])

  const [userValues, setUserValues] = useState([])

  useEffect(() => {
    setInterpolator(interpolators[0])
  }, [scaleType, interpolators])

  useEffect(() => {
    setScaleType(availableScaleTypes[0])
  }, [availableScaleTypes])

  const setUserValueRange = useCallback(
    (index, value) => {
      const newUserValues = [...userValues]
      newUserValues[index].userRange = value
      setUserValues(newUserValues)
    },
    [userValues]
  )

  const setUserValueDomain = useCallback(
    (index, value) => {
      const newUserValues = [...userValues]
      newUserValues[index].userDomain = value
      setUserValues(newUserValues)
    },
    [userValues]
  )

  useEffect(() => {
    if (
      !colorDataset ||
      !interpolator ||
      !colorPresets[scaleType][interpolator]
    ) {
      return
    }
    if (!mappingValue) {
      return
    }
    if (!colorDataType) {
      return
    }

    const domain = getColorDomain(colorDataset, colorDataType, scaleType)
    const userValues = getInitialScaleValues(
      domain,
      scaleType,
      interpolator
    ).map((userValue) => ({
      ...userValue,
      userRange: userValue.range,
      userDomain: userValue.domain,
    }))
    setUserValues(userValues)
  }, [
    scaleType,
    interpolator,
    colorDataset,
    mapping,
    dimension,
    dataTypes,
    mappingValue,
    colorDataType,
  ])

  const userValuesForFinalScale = useMemo(() => {
    return userValues.map((value) => ({
      range: value.userRange,
      domain: value.userDomain,
    }))
  }, [userValues])

  const currentFinalScale = useMemo(() => {
    if (
      // !colorDataset.length ||
      // !colorDataType ||
      !scaleType ||
      !interpolator ||
      // !userValuesForFinalScale ||
      !colorPresets[scaleType][interpolator]
    ) {
      return
    }

    const previewScale = getColorScale(
      colorDataset, //the array of values of the dataset mapped on the color dimension
      colorDataType,
      scaleType, //
      interpolator,
      userValuesForFinalScale
    )

    return previewScale
  }, [
    colorDataType,
    colorDataset,
    interpolator,
    scaleType,
    userValuesForFinalScale,
  ])

  useEffect(() => {
    const outScaleParams = {
      scaleType,
      interpolator,
      userScaleValues: userValuesForFinalScale,
    }
    onChange(outScaleParams)
  }, [interpolator, scaleType, userValuesForFinalScale, onChange])

  return (
    <>
      <Row className={[props.className].join(' ')}>
        <Col xs={6} className="d-flex align-items-center nowrap">{label}</Col>
        <Col xs={6}>
          <select
            disabled={!colorDataType}
            className="custom-select raw-select"
            value={scaleType}
            onChange={(e) => {
              setScaleType(e.target.value)
            }}
          >
            {availableScaleTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      
      {/* Color scheme */}
      <Row className={[props.className].join(' ')}>
        <Col xs={6} className="d-flex align-items-center nowrap">Color scheme</Col>
        <Col xs={6}>
          <ColorSchemesDropDown
            interpolators={interpolators}
            interpolator={interpolator}
            setInterpolator={setInterpolator}
            // To display color-scale preview
            colorDataset={colorDataset}
            colorDataType={colorDataType}
            scaleType={scaleType}
            currentFinalScale={currentFinalScale}
          />
        </Col>
      </Row>
      
      {/* Scale preview */}
      {/* {currentFinalScale && (
        <Row className={[props.className].join(' ')}>
          <Col xs={12}>
            <ColorSchemePreview
              scale={currentFinalScale}
              label={['Scale preview',scaleType,interpolator].join('-')}
            />
          </Col>
        </Row>
      )} */}

      {/* Scale color swatches */}
      {colorDataType && userValues && (
        <div className={styles["color-swatches-list"]}>
          {userValues.map((userValue, i) => (
            <Row key={i} className={[
                styles["chart-option"],
                styles["color-swatch"],
                scaleType!=='ordinal'?styles["not-ordinal"]:styles["ordinal"]
              ].join(' ')}
            >
              <Col xs={12}>
                <div className={styles["color-scale-item"]}>
                  {scaleType === 'ordinal' && 
                    <span className="nowrap text-truncate pr-2" title={userValue.domain}>{userValue.domain===""?'[empty string]':userValue.domain}</span>
                  }
                  {scaleType !== 'ordinal' && (
                    <>
                      <span className="nowrap">{
                        i===0?'Start':i===(userValues.length-1)?'End':'Middle'
                      }</span>
                      <input
                        type="number"
                        className="form-control text-field"
                        value={userValue.userDomain || ''}
                        onChange={(e) => {
                          setUserValueDomain(i, e.target.value)
                        }}
                      ></input>
                    </>
                  )}
                  <InilineColorPicker
                    color={userValue.userRange}
                    onChange={(color) => {
                      setUserValueRange(i, color)
                    }}
                  />
                </div>
              </Col>
            </Row>
          ))}
        </div>
      )}
    </>
  )
}

export default React.memo(ChartOptionColorScale)
