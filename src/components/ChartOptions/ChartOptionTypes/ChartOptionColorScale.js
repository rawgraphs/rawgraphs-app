import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import InilineColorPicker from '../../InlineColorPicker'
import ColorSchemesDropDown from './ColorSchemesDropDown'
import { Row, Col, Dropdown } from 'react-bootstrap'
import { ResetBtn, InvertBtn, LockBtn } from './ColorScaleUtils'
import { SCALES_LABELS } from '../../../constants'
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'
import {
  getInitialScaleValues,
  getColorScale,
  getDefaultColorScale,
  getColorDomain,
  colorPresets,
  getAvailableScaleTypes,
  getValueType,
} from '@rawgraphs/rawgraphs-core'
import styles from '../ChartOptions.module.scss'
import usePrevious from '../../../hooks/usePrevious'

function getDatePickerValue(userValue) {
  if (userValue.userDomain === 0) {
    return 0
  }
  if (!userValue.userDomain) {
    return ''
  }

  if (getValueType(userValue.userDomain) === 'date') {
    return userValue.userDomain.toISOString().substring(0, 10)
  }

  return userValue.userDomain
}

const ChartOptionColorScale = ({
  value,
  error,
  onChange,
  defaultValue,
  label,
  dimension,
  dataset,
  mapping,
  dataTypes,
  chart,
  mappedData,
  mappingValue,
  colorDataset,
  colorDataType,
  hasAnyMapping,
  ...props
}) => {

  // here we leverage injection of the __loaded prop in the color scale, see App.js
  const initialValue = useRef(!!value.__loaded)
  
  const [scaleType, setScaleType] = useState(get(value, 'scaleType'))

  const defaultColor = useMemo(() => {
    const colorFromDefault = get(defaultValue, 'defaultColor', '#cccccc')
    return get(value, 'defaultColor', colorFromDefault)
  }, [defaultValue, value])

  const [locked, setLocked] = useState(get(value, 'locked'))

  const availableScaleTypes = useMemo(() => {
    const nextTypes = getAvailableScaleTypes(colorDataType, colorDataset)
    return nextTypes
  }, [colorDataType, colorDataset])

  const [interpolators, setInterpolators] = useState(
    get(value, 'scaleType')
      ? Object.keys(colorPresets[get(value, 'scaleType')])
      : []
  )

  const [interpolator, setInterpolator] = useState(get(value, 'interpolator'))
  const [userValues, setUserValues] = useState(
    get(value, 'userScaleValues', []).map((userValue) => ({
      ...userValue,
      userDomain: userValue.domain,
      userRange: userValue.range,
    }))
  )

  const getCurrentFinalScale = useCallback(
    (interpolator, scaleType, userValuesForFinalScale, defaultColor) => {
      if (
        !scaleType ||
        !interpolator ||
        !colorPresets[scaleType][interpolator] ||
        !userValuesForFinalScale ||
        !userValuesForFinalScale.length
      ) {
        return
      }

      const domains = userValuesForFinalScale
        .map((x) => x.domain)
        .filter((x) => x !== undefined)
      if (!domains.length) {
        return
      }

      const previewScale = getColorScale(
        colorDataset, //the array of values of the dataset mapped on the color dimension
        colorDataType,
        scaleType, //
        interpolator,
        userValuesForFinalScale,
      )

      return previewScale
    },
    [colorDataType, colorDataset]
  )

  const getDefaultUserValues = useCallback(
    (interpolator, scaleType) => {
      if (!colorDataset.length || !colorDataType || !scaleType) {
        return []
      }
      if (!colorPresets[scaleType][interpolator]) {
        return []
      }

      const domain = getColorDomain(colorDataset, colorDataType, scaleType)

      return getInitialScaleValues(domain, scaleType, interpolator).map(
        (userValue) => ({
          ...userValue,
          userRange: userValue.range,
          userDomain: userValue.domain,
        })
      )
    },
    [colorDataType, colorDataset]
  )

  const getUserValuesForFinalScale = useCallback(
    (values) => {
      return values.map((value) => ({
        range: value.userRange,
        domain:
          colorDataType === 'date'
            ? value.userDomain?.toString()
            : value.userDomain,
        // domain: value.userDomain,
      }))
    },
    [colorDataType]
  )

  const currentFinalScale = useMemo(() => {

    if (scaleType && interpolator) {
      const currentUserValues =
        userValues && userValues.length
          ? userValues
          : getDefaultUserValues(interpolator, scaleType)
      const valuesForFinalScale = getUserValuesForFinalScale(currentUserValues)
      return getCurrentFinalScale(interpolator, scaleType, valuesForFinalScale)
    }
    return getDefaultColorScale()
  }, [
    getCurrentFinalScale,
    getDefaultUserValues,
    getUserValuesForFinalScale,
    interpolator,
    scaleType,
    userValues,
  ])

  const handleChangeValues = useCallback(
    (nextUserValues) => {
      let valuesForFinalScale = getUserValuesForFinalScale(nextUserValues)

      //notify ui
      const outScaleParams = {
        scaleType,
        interpolator: interpolator,
        userScaleValues: valuesForFinalScale,
        defaultColor,
        locked,
      }
      onChange(outScaleParams)
    },
    [getUserValuesForFinalScale, scaleType, interpolator, defaultColor, locked, onChange]
  )

  const setUserValueRange = useCallback(
    (index, value) => {
      const newUserValues = [...userValues]
      newUserValues[index].userRange = value
      setUserValues(newUserValues)
      handleChangeValues(newUserValues)
    },
    [handleChangeValues, userValues]
  )

  const setUserValueDomain = useCallback(
    (index, value) => {
      const newUserValues = [...userValues]
      newUserValues[index].userDomain = value
      setUserValues(newUserValues)
      handleChangeValues(newUserValues)
    },
    [handleChangeValues, userValues]
  )


  const handleChangeScaleType = useCallback(
    (nextScaleType) => {

      setScaleType(nextScaleType)

      //update interpolators
      const nextInterpolators = colorPresets[nextScaleType]
        ? Object.keys(colorPresets[nextScaleType])
        : []
      setInterpolators(nextInterpolators)

      //set first interpolator
      const nextInterpolator = nextInterpolators[0]
      setInterpolator(nextInterpolator)

      //user values
      const nextUserValues = getDefaultUserValues(
        nextInterpolator,
        nextScaleType,
      )
      setUserValues(nextUserValues)
      const valuesForFinalScale = getUserValuesForFinalScale(nextUserValues)

      //notify ui
      const outScaleParams = {
        scaleType: nextScaleType,
        interpolator: nextInterpolator,
        userScaleValues: valuesForFinalScale,
        defaultColor,
        locked,
      }
      onChange(outScaleParams)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getDefaultUserValues, getUserValuesForFinalScale, defaultColor, onChange, locked]
  )

  const handleSetInterpolator = useCallback(
    (nextInterpolator, customUserValues) => {
      setInterpolator(nextInterpolator)

      //user values
      const nextUserValues = getDefaultUserValues(nextInterpolator, scaleType)
      setUserValues(nextUserValues)
      let valuesForFinalScale = getUserValuesForFinalScale(nextUserValues)
      
      if(customUserValues){
        const byDomain = keyBy(customUserValues, 'domain')
        valuesForFinalScale = valuesForFinalScale.map(v => ({
          ...v,
          range: byDomain[v.domain.toString()] ? byDomain[v.domain.toString()].userRange : v.range
        }))
      }
      //notify ui
      const outScaleParams = {
        scaleType,
        interpolator: nextInterpolator,
        userScaleValues: valuesForFinalScale,
        defaultColor,
        locked,
      }
      onChange(outScaleParams)
    },
    [getDefaultUserValues, getUserValuesForFinalScale, onChange, scaleType, defaultColor, locked,]
  )

  const handleChangeLocked = useCallback(
    (nextLocked) => {
      setLocked(nextLocked)
      //this is needed for disabiling automatic scale reset
      initialValue.current = true

      const outScaleParams = {
        scaleType,
        interpolator,
        userScaleValues: userValues,
        defaultColor,
        locked: nextLocked,
      }
      onChange(outScaleParams)
    },
    [scaleType, interpolator, userValues, defaultColor, onChange]
  )



  const resetScale = useCallback(() => {
    handleSetInterpolator(interpolator, userValues)
  }, [handleSetInterpolator, interpolator, userValues])

  const invertScale = useCallback(() => {

    let reversedValues = [...userValues]
    reversedValues.reverse()

    const invertedValues = userValues.map((v, i) => ({
      ...v,
      userRange: reversedValues[i].userRange,
      range: reversedValues[i].range,

    }))

    setUserValues(invertedValues)
    handleChangeValues(invertedValues)
  }, [handleChangeValues, userValues])



  const prevMappingValue = usePrevious(mappingValue)

  useEffect(() => {
    if (prevMappingValue && mappingValue !== prevMappingValue) {
      initialValue.current = false
    }
  }, [mappingValue, prevMappingValue])

  useEffect(() => {
    if (!initialValue.current && !locked) {
      const nextScaleType = availableScaleTypes[0]
      handleChangeScaleType(nextScaleType)
    }

  }, [availableScaleTypes, handleChangeScaleType, locked])

  // update scale on dataset update.
  // #TODO: fixme

  // const prevDataset = usePrevious(colorDataset)
  // const prevScaleType = usePrevious(colorDataset)

  // useEffect(() => {
  //   if (!locked && colorDataset !== prevDataset && prevScaleType === scaleType) {
  //     console.info("dddd resetting scope")
  //     const nextUserValues = getDefaultUserValues(
  //       interpolator,
  //       scaleType,
  //     )
  //     setUserValues(nextUserValues)
  //     const valuesForFinalScale = getUserValuesForFinalScale(nextUserValues)
  //     //notify ui
  //     const outScaleParams = {
  //       scaleType,
  //       interpolator,
  //       userScaleValues: valuesForFinalScale,
  //       defaultColor,
  //       locked,
  //     }
  //     onChange(outScaleParams)
  //   }
  // }, [colorDataset, defaultColor, getDefaultUserValues, getUserValuesForFinalScale, interpolator, locked, onChange, prevDataset, prevScaleType, scaleType])


  return hasAnyMapping ? (
    <>
      <Row className={props.className} style={{marginTop:'8px', marginBottom:'8px'}}>
        <Col xs={5} className="d-flex align-items-center nowrap">
          Color scale
        </Col>
        <Col xs={7}>
          <Dropdown className="d-inline-block raw-dropdown w-100">
            <Dropdown.Toggle variant="white" className="w-100" style={{paddingRight:24}} disabled={!colorDataType}>
              {get(SCALES_LABELS, scaleType, scaleType)}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
            {availableScaleTypes.map(
              (s) => {
                return (
                  <Dropdown.Item key={s} onClick={()=>handleChangeScaleType(s)}>
                    {get(SCALES_LABELS, s, s)}
                  </Dropdown.Item>
                )
              }
            )}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Color scheme */}
      <Row className={[props.className].join(' ')} style={{marginTop:'8px', marginBottom:'8px'}}>
        <Col xs={5} className="d-flex align-items-center nowrap">
          Color scheme
        </Col>
        <Col xs={7}>
          <ColorSchemesDropDown
            interpolators={interpolators}
            interpolator={interpolator}
            setInterpolator={handleSetInterpolator}
            // To display color-scale preview
            colorDataset={colorDataset}
            colorDataType={colorDataType}
            scaleType={scaleType}
            currentFinalScale={currentFinalScale}
          />
        </Col>
      </Row>

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
                  {scaleType === 'ordinal' &&
                    get(userValue, 'domain') !== undefined && (
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
                        disabled={locked}
                        type={getValueType(userValue.userDomain)}
                        className="form-control text-field"
                        value={getDatePickerValue(userValue)}
                        onChange={(e) => {
                          if (colorDataType === 'date') {
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
          <Row>
            <Col className="d-flex justify-content-end">
              <ResetBtn resetScale={resetScale} />
              <InvertBtn invertScale={invertScale} />
              {
                scaleType !== 'ordinal' && (
                  <LockBtn locked={locked} handleChangeLocked={handleChangeLocked} />
                )
              }

            </Col>
          </Row>

        </div>
      )}

    </>
  ) : null
}

export default ChartOptionColorScale
