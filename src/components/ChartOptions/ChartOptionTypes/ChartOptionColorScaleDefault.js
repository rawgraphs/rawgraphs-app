import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import InilineColorPicker from '../../InlineColorPicker'
import { Row, Col } from 'react-bootstrap'
import get from 'lodash/get'

const ChartOptionColorScaleDefault = ({
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
  mappingValue,
  colorDataType,
  colorDataset,
  ...props
}) => {




  const colorFromValue = useMemo(() => {
    const colorFromDefault = get(defaultValue, 'defaultColor', '#cccccc')
    return get(value, 'defaultColor', colorFromDefault)
  }, [defaultValue, value])

  const [defaultColor, setDefaultColor] = useState(colorFromValue)


  const handleChangeDefaultColor = useCallback(
    (nextDefaultColor) => {
      setDefaultColor(nextDefaultColor)
      const outScaleParams = {
        ...value,
        defaultColor: nextDefaultColor,
      }
      onChange(outScaleParams)
    },
    [value, onChange]
  )

  useEffect(() => {
    if (defaultValue && defaultValue.defaultColor !== defaultColor) {
      handleChangeDefaultColor(defaultValue.defaultColor)
    }
  }, [defaultColor, defaultValue, handleChangeDefaultColor])


  return (
    <>

      <Row>
        <Col xs={6} className="d-flex align-items-center nowrap">
          Default color
        </Col>
        <Col xs={6}>
          <InilineColorPicker
            color={defaultColor}
            onChange={handleChangeDefaultColor}
          />
        </Col>

      </Row>
    </>
  )
}

export default ChartOptionColorScaleDefault
