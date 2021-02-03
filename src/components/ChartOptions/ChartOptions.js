import React, { useCallback, useState, useMemo } from 'react'
import { Row, Col } from 'react-bootstrap'
import {
  getOptionsConfig,
  getContainerOptions,
  getDefaultOptionsValues,
  getEnabledOptions,
} from '@raw-temp/rawgraphs-core'
import ChartOptionNumber from './ChartOptionTypes/ChartOptionNumber'
import ChartOptionText from './ChartOptionTypes/ChartOptionText'
import ChartOptionColor from './ChartOptionTypes/ChartOptionColor'
import ChartOptionColorScale from './ChartOptionTypes/ChartOptionColorScale'
import ChartOptionBoolean from './ChartOptionTypes/ChartOptionBoolean'
import get from 'lodash/get'
import map from 'lodash/map'

import styles from './ChartOptions.module.scss'

const CHART_OPTION_COMPONENTS = {
  number: ChartOptionNumber,
  text: ChartOptionText,
  color: ChartOptionColor,
  colorScale: ChartOptionColorScale,
  boolean: ChartOptionBoolean,
}

function getPartialMapping(mapping, dimension, repeatIndex) {
  const nv = get(mapping[dimension], `value[${repeatIndex}]`)
  return {
    ...mapping,
    [dimension]: {
      ...mapping[dimension],
      value: [nv]
    }
  }
}

function getPartialMappedData(mappedData, dimension, repeatIndex) {
  return Array.isArray(mappedData) ? mappedData.map(datum => {
    const value = get(datum[dimension], `[${repeatIndex}]`)
    return {
      ...datum,
      [dimension]: value,
    }
  }) : mappedData
}


function getDefaultForRepeat(def, index){
  if(Array.isArray(def.repeatDefault)){
    return get(def.repeatDefault, `[${index}]`, def.default)
  }
  return def.default
}


function WrapControlComponent({ type, optionId, setVisualOptions, label, repeatIndex, ...props }) {
  const Component = CHART_OPTION_COMPONENTS[type]

  const handleControlChange = useCallback(
    (nextValue) => {

      console.log("handleControlChange", nextValue)
      
      setVisualOptions((visualOptions) => {
        let newValue = nextValue
        if(repeatIndex !== undefined){
          newValue = visualOptions[optionId] || []
          newValue[repeatIndex] = nextValue
        }
        return {
        ...visualOptions,
        [optionId]: newValue,
      }})
    },
    [optionId, repeatIndex, setVisualOptions]
  )

  return (
    <Component
      type={type}
      optionId={optionId}
      label={repeatIndex !== undefined ? <React.Fragment>{label} ({repeatIndex+1})</React.Fragment> : label}
      {...props}
      onChange={handleControlChange}
    />
  )
}

const ChartOptions = ({
  chart,
  dataset,
  mapping,
  dataTypes,
  visualOptions,
  setVisualOptions,
  error,
  mappedData,
}) => {
  const optionsConfig = useMemo(() => {
    return getOptionsConfig(chart?.visualOptions)
  }, [chart])

  const [collapseStatus,setCollapseStatus] = useState(
    ()=>{
      const groups = {}
      for (const option in optionsConfig) {
        const group = optionsConfig[option].group;
        if (!groups.hasOwnProperty(group)) {
          groups[group] = true;
        }
      }
      return groups
    }
  )

  const enabledOptions = useMemo(() => {
    return getEnabledOptions(optionsConfig, visualOptions)
  }, [optionsConfig, visualOptions])
  
  const optionsDefinitionsByGroup = useMemo(() => {
    // update "collapseStatus" state
    // add/remove options groups when selected charts changes
    const groups = {}
    for (const option in optionsConfig) {
      const group = optionsConfig[option].group;
      if (!groups.hasOwnProperty(group)) {
        groups[group] = group==='artboard'?false:true;
      }
    }
    setCollapseStatus(groups);
    return Object.keys(optionsConfig).reduce((acc, optionId) => {
      const option = optionsConfig[optionId]
      const group = option?.group || ''
      if (!acc[group]) {
        acc[group] = {}
      }
      acc[group][optionId] = option
      return acc
    }, {})
  }, [optionsConfig])
  
  const containerOptions = useMemo(() => {
    const defaultOptionsValues = getDefaultOptionsValues(optionsConfig, mapping)
    const opts = {
      ...defaultOptionsValues,
      ...visualOptions,
    }
    return getContainerOptions(optionsConfig, opts)
  }, [mapping, optionsConfig, visualOptions])

  return (
    <div className={[styles["chart-options"],'col-3'].join(' ')}>
      {map(optionsDefinitionsByGroup, (options, groupName) => {
        return (
          <div
            key={groupName}
            groupname={groupName}
            className={
              [
                styles["options-group"],
                collapseStatus[groupName]?styles["collapsed"]:''
              ].join(' ')
            }
          >
            <Row className="sticky-top">
              <Col className={`d-flex justify-content-between align-items-center ${styles["group-header"]}`}>
                <h5 className="text-uppercase m-0">{groupName}</h5>
                <span
                  className={[styles["collapse-button"], "cursor-pointer"].join(' ')}
                  onClick={()=>setCollapseStatus({...collapseStatus, [groupName]:!collapseStatus[groupName]})}
                ></span>
              </Col>
            </Row>
            {map(options, (def, optionId) => {

              // repeated options: notice that value is set to a default if undefined
              // this is caused by changes in shapes of the mapping object 
              // (when a new value is dragged to the dimension that repeats the option)
              // the same approach is applied in option validation by the raw core lib
              return def.repeatFor ? (
                get(mapping, `[${def.repeatFor}].value`, []).map((v,repeatIndex) => (
                  <WrapControlComponent
                  className={styles["chart-option"]}
                  key={optionId+repeatIndex}
                  repeatIndex={repeatIndex}
                  {...def}
                  optionId={optionId}
                  error={error?.errors?.[optionId+repeatIndex]}
                  value={visualOptions?.[optionId]?.[repeatIndex] ?? getDefaultForRepeat(def, repeatIndex)}
                  mapping={def.type === 'colorScale' ? getPartialMapping(mapping, def.repeatFor, repeatIndex) : undefined}
                  chart={def.type === 'colorScale' ? chart : undefined}
                  dataset={def.type === 'colorScale' ? dataset : undefined}
                  dataTypes={def.type === 'colorScale' ? dataTypes : undefined}
                  mappedData={getPartialMappedData(mappedData, def.repeatFor, repeatIndex)}
                  setVisualOptions={setVisualOptions}
                  isEnabled={enabledOptions[optionId]}
                />  
                ))
                
              ) : (
                <WrapControlComponent
                  className={styles["chart-option"]}
                  key={optionId}
                  {...def}
                  optionId={optionId}
                  error={error?.errors?.[optionId]}
                  value={visualOptions?.[optionId]}
                  mapping={def.type === 'colorScale' ? mapping : undefined}
                  chart={def.type === 'colorScale' ? chart : undefined}
                  dataset={def.type === 'colorScale' ? dataset : undefined}
                  dataTypes={def.type === 'colorScale' ? dataTypes : undefined}
                  mappedData={mappedData}
                  setVisualOptions={setVisualOptions}
                  isEnabled={enabledOptions[optionId]}
                />
              )
            })}
            {groupName === 'artboard' && (
              <p className="small">
                The final output will be {containerOptions?.width}px * {containerOptions?.height}px including the legend.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChartOptions
