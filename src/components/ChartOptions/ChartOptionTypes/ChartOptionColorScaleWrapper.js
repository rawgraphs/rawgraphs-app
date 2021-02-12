import React, { useMemo } from 'react'
import get from 'lodash/get'
import omit from 'lodash/omit'
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
  domainFromChart,
  mappingValue,
  colorDataType,
  colorDataset,

}) => {


  // const remainingOptions = useMemo(() => {
  //   return Object.keys(omit(visualOptions, props.optionId)).map(k => get(visualOptions[k], 'value', '')).join('-')
  // }, [visualOptions, props.optionId])
  

  // const domainFromChart = useMemo(() => {
  //   return domain ? chart[domain](mappedData, mapping, visualOptions) : null
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chart, domain, mappedData, mapping, remainingOptions])

  // const mappingValue = useMemo(() => {
  //   return domainFromChart ? '__custom__' :  get(mapping, `[${dimension}].value`)
  // }, [dimension, domainFromChart, mapping])

  

  // #TODO: this seems to work with also with multiple color dimensions
  // but it's still very complex, as custom mappings could build
  // color data in many ways.
  // for those cases we should let the chart declare
  // if there are some constraints on color scale types
  // const colorDataType = useMemo(() => {
  //   if(domainFromChart){
  //     return domainFromChart.type
  //   }
  //   return dataTypes[mappingValue]
  //     ? getTypeName(dataTypes[mappingValue])
  //     : 'string'
  // }, [dataTypes, domainFromChart, mappingValue])

  // const colorDataset = useMemo(() => {
  //   if(domainFromChart){
  //     return domainFromChart.domain
  //   }

  //   if (mappedData) {
  //     return mappedData
  //       .map((d) => get(d, dimension))
  //       .filter(
  //         (item) => item !== undefined && !(Array.isArray(item) && !item.length)
  //       )
  //   } else {
  //     return []
  //   }
  // }, [dimension, domainFromChart, mappedData])


  const hasAnyMapping = useMemo(() => {
    return colorDataset && colorDataset.length > 0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingValue,  colorDataset])

 

  return <>
    {!hasAnyMapping && <ChartOptionColorScaleDefault onChange={onChange} defaultValue={defaultValue} value={value} />}
    {hasAnyMapping &&  <ChartOptionColorScale hasAnyMapping={hasAnyMapping} mappingValue={mappingValue} defaultValue={defaultValue} value={value} colorDataType={colorDataType} colorDataset={colorDataset} onChange={onChange} />}
  </>
}

export default ChartOptionColorScaleWrapper
