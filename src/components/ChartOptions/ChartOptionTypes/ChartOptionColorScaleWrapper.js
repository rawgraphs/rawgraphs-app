import React, { useMemo, useRef } from 'react'
import get from 'lodash/get'
import {
  getTypeName,
} from '@raw-temp/rawgraphs-core'

import ChartOptionColorScale from './ChartOptionColorScale'
import ChartOptionColorScaleDefault from './ChartOptionColorScaleDefault'

const ChartOptionColorScaleWrapper = ({
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
  const mappingValue = useMemo(() => {
    return get(mapping, `[${dimension}].value`)
  }, [dimension, mapping])

  // #TODO: this seems to work with also with multiple color dimensions
  // but it's still very complex, as custom mappings could build
  // color data in many ways.
  // for those cases we should let the chart declare
  // if there are some constraints on color scale types
  const colorDataType = useMemo(() => {

    return dataTypes[mappingValue]
      ? getTypeName(dataTypes[mappingValue])
      : 'string'
  }, [dataTypes, mappingValue])

  const colorDataset = useMemo(() => {
    if (mappedData) {
      return mappedData
        .map((d) => get(d, dimension))
        .filter(
          (item) => item !== undefined && !(Array.isArray(item) && !item.length)
        )
    } else {
      return []
    }
  }, [dimension, mappedData])


  const hasAnyMapping = useMemo(() => {
    return !!mappingValue && mappingValue.length > 0 && colorDataset.length > 0
  }, [mappingValue, colorDataset])

 

  return <>
    {!hasAnyMapping && <ChartOptionColorScaleDefault onChange={onChange} defaultValue={defaultValue} value={value} />}
    <ChartOptionColorScale hasAnyMapping={hasAnyMapping} mappingValue={mappingValue} defaultValue={defaultValue} value={value} colorDataType={colorDataType} colorDataset={colorDataset} onChange={onChange} />
  </>
}

export default ChartOptionColorScaleWrapper
