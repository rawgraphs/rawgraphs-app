import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import InilineColorPicker from '../../InlineColorPicker'
import ColorSchemesDropDown from './ColorSchemesDropDown'
import { Row, Col } from 'react-bootstrap'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import { timeParse } from "d3-time-format";
import {
  getInitialScaleValues,
  getColorScale,
  getColorDomain,
  colorPresets,
  getTypeName,
  getAvailableScaleTypes,
  getValueType,
} from '@raw-temp/rawgraphs-core'

import styles from '../ChartOptions.module.scss'

const scaleTypes = Object.keys(colorPresets)

function getDatePickerValue(userValue){
  
  if(userValue.userDomain === 0){
    return 0
  }
  if(!userValue.userDomain){
    return ''
  }

  if(getValueType(userValue.userDomain) === 'date'){
    return userValue.userDomain.toISOString().substring(0, 10)
  }
  
  return userValue.userDomain
}



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
  // console.log("value",value)
  const [scaleType, setScaleType] = useState(get(value, 'scaleType', 'ordinal'))

  const mappingValue = useMemo(() => {
    return get(mapping, `[${dimension}].value`)
  }, [dimension, mapping])

  const mappingAggregation = useMemo(() => {
    return get(mapping, `[${dimension}].config.aggregation`)
  }, [dimension, mapping])

  const colorDataType = useMemo(() => {
    return dataTypes[mappingValue]
      ? getTypeName(dataTypes[mappingValue])
      : undefined
  }, [dataTypes, mappingValue])

  
  const colorDataset = useMemo(() => {
    if (mappedData) {
      return mappedData.map((d) => get(d, dimension))
    } else {
      return []
    }
  }, [dimension, mappedData])

  const maybeSetScaleType = useCallback((availableScaleTypes) => {
    const nextScaleType = availableScaleTypes[0]
    console.log("xx", nextScaleType, availableScaleTypes, scaleType)
    if((availableScaleTypes.indexOf(scaleType) === -1) && nextScaleType !== scaleType){
      setScaleType(nextScaleType)
    }

  }, [scaleType, setScaleType])

  

  const availableScaleTypes = useMemo(() => {
    
    if(!colorDataset.length || !colorDataType){
      return scaleTypes
    }

    const nextTypes = getAvailableScaleTypes(colorDataType, colorDataset)
    console.log("c availableScaleTypes", colorDataType, colorDataset, nextTypes)
    maybeSetScaleType(nextTypes)
    return nextTypes
    // // FOR NOW WE ALLOW ONLY ORDINAL SCALES ON AGGREGATED DIMENSIONS
    // if(mappingAggregation && mappingAggregation[0]){
    //   return ['ordinal']
    // }

    // if (colorDataType === 'number' || colorDataType === 'date') {
    //   return scaleTypes
    // }
    // return ['ordinal']
  }, [colorDataType, colorDataset, maybeSetScaleType])


  const interpolators = useMemo(() => {
    return Object.keys(colorPresets[scaleType])
  }, [scaleType])

  const [interpolator, setInterpolator] = useState(get(value, 'interpolator', interpolators[0]))
  const [userValues, setUserValues] = useState(get(value, 'userScaleValues', []))

  const maybeSetInterpolator = useCallback((nextInterpolator) => {
    if(!interpolator || interpolator !== nextInterpolator){
      console.log("setInterpolator", interpolators[0])
      setInterpolator(nextInterpolator)
    }
  }, [interpolator])


  

  useEffect(() => {
    maybeSetInterpolator(interpolators[0])
  }, [scaleType, interpolators, maybeSetInterpolator])

  // useEffect(() => {
  //   console.log("setScaleType",availableScaleTypes[0])
  //   maybeSetScaleType(availableScaleTypes)
  // }, [availableScaleTypes])

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

  const defaultUserValues = useMemo(() => {
    console.log("updating defaultUserValues")
    if(!colorDataset.length || !colorDataType ||!scaleType){ return []}
    if(!colorPresets[scaleType][interpolator]){
      return []
    }

    const domain = getColorDomain(colorDataset, colorDataType, scaleType)
    
    return getInitialScaleValues(
      domain,
      scaleType,
      interpolator
    ).map((userValue) => ({
      ...userValue,
      userRange: userValue.range,
      userDomain: userValue.domain,
    }))

  }, [colorDataType, colorDataset, interpolator, scaleType])


  // const resetUserValues = useCallback(() => {
  //   const domain = getColorDomain(colorDataset, colorDataType, scaleType)
  //   const nextUserValues = getInitialScaleValues(
  //     domain,
  //     scaleType,
  //     interpolator
  //   ).map((userValue) => ({
  //     ...userValue,
  //     userRange: userValue.range,
  //     userDomain: userValue.domain,
  //   }))
  //   setUserValues(nextUserValues)
  //   return
  //   // console.log("resetUserValues", nextUserValues, userValues)
  //   if(userValues.length !== nextUserValues.length){
  //     setUserValues(nextUserValues)
  //   } else {
  //     // const newValues = nextUserValues.map((v, i) => ({
  //     //   ...v,
  //     //   userRange: userValues[i].userRange,
  //     //   userDomain: userValues[i].userDomain,
  //     // }))
  //     setUserValues(nextUserValues)
  //   }
  // }, [colorDataType, colorDataset, interpolator, scaleType, userValues.length])

  const setInterpolatorAndReset = useCallback(
    (nextInterpolator) => {
      nextInterpolator === interpolator && setUserValues(defaultUserValues)
      setInterpolator(nextInterpolator)
    },
    [defaultUserValues, interpolator]
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
    setUserValues(defaultUserValues)
  }, [scaleType, interpolator, colorDataset, mapping, dimension, dataTypes, mappingValue, colorDataType, defaultUserValues])

  const userValuesForFinalScale = useMemo(() => {
    return userValues.map((value) => ({
      range: value.userRange,
      domain: colorDataType === 'date' ? value.userDomain?.toString() : value.userDomain,
      // domain: value.userDomain,
    }))
  }, [colorDataType, userValues])

  const currentFinalScale = useMemo(() => {
    if (
      // !colorDataset.length ||
      // !colorDataType ||
      !scaleType ||
      !interpolator ||
      // !userValuesForFinalScale || !userValuesForFinalScale.length ||
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
        <Col xs={6} className="d-flex align-items-center nowrap">
          {label}
        </Col>
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
        <Col xs={6} className="d-flex align-items-center nowrap">
          Color scheme
        </Col>
        <Col xs={6}>
          <ColorSchemesDropDown
            interpolators={interpolators}
            interpolator={interpolator}
            setInterpolator={setInterpolatorAndReset}
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
        <div className={styles['color-swatches-list']}>
          {userValues.map((userValue, i) => (
            <Row
              key={i}
              className={[
                styles['chart-option'],
                styles['color-swatch'],
                scaleType !== 'ordinal'
                  ? styles['not-ordinal']
                  : styles['ordinal'],
              ].join(' ')}
            >
              <Col xs={12}>
                <div className={styles['color-scale-item']}>
                  {scaleType === 'ordinal' && get(userValue, 'domain') !== undefined && (
                    <span
                      className="nowrap text-truncate pr-2"
                      title={userValue.domain && userValue.domain.toString()}
                    >
                      {userValue.domain === ''
                        ? '[empty string]'
                        : userValue.domain.toString()}
                    </span>
                  )}
                  {scaleType !== 'ordinal' && (
                    <>
                      <span className="nowrap">
                        {i === 0
                          ? 'Start'
                          : i === userValues.length - 1
                          ? 'End'
                          : 'Middle'}
                      </span>
                      <input
                        type={getValueType(userValue.userDomain)}
                        className="form-control text-field"
                        value={getDatePickerValue(userValue)}
                        onChange={(e) => {
                          if(colorDataType === 'date'){
                            setUserValueDomain(i, new Date(e.target.value))
                          } else {
                            setUserValueDomain(i, e.target.value)
                          }
                          
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
