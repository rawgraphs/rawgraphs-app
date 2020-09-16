import React, { useCallback, useMemo } from 'react'
import { getOptionsConfig } from '@raw-temp/rawgraphs-core'
import ChartOptionNumber from './ChartOptionTypes/ChartOptionNumber'
import ChartOptionText from './ChartOptionTypes/ChartOptionText'
import ChartOptionColor from './ChartOptionTypes/ChartOptionColor'
import ChartOptionColorScale from './ChartOptionTypes/ChartOptionColorScale'
import ChartOptionBoolean from './ChartOptionTypes/ChartOptionBoolean'
import { map } from 'lodash'

const CHART_OPTION_COMPONENTS = {
  number: ChartOptionNumber,
  text: ChartOptionText,
  color: ChartOptionColor,
  colorScale: ChartOptionColorScale,
  boolean: ChartOptionBoolean,
}

function WrapControlComponent({ type, optionId, setVisualOptions, ...props }) {
  const Component = CHART_OPTION_COMPONENTS[type]

  const handleControlChange = useCallback(
    (nextValue) => {
      setVisualOptions((visualOptions) => ({
        ...visualOptions,
        [optionId]: nextValue,
      }))
    },
    [optionId, setVisualOptions]
  )

  return (
    <Component
      type={type}
      optionId={optionId}
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
  const optionsDefinitionsByGroup = useMemo(() => {
    const options = getOptionsConfig(chart?.visualOptions)

    return Object.keys(options).reduce((acc, optionId) => {
      const option = options[optionId]
      const group = option?.group || ''
      if (!acc[group]) {
        acc[group] = {}
      }
      acc[group][optionId] = option
      return acc
    }, {})
  }, [chart])

  return (
    <div>
      {map(optionsDefinitionsByGroup, (options, groupName) => {
        return (
          <div
            key={groupName}
            style={{ borderTop: '1px solid var(--gray-400)' }}
          >
            <h2 className="text-capitalize">{groupName}</h2>
            {map(options, (def, optionId) => {
              return (
                <WrapControlComponent
                  key={optionId}
                  {...def}
                  optionId={optionId}
                  error={error?.errors?.[optionId]}
                  value={visualOptions?.[optionId]}
                  mapping={def.type === 'colorScale' ? mapping : undefined}
                  chart={def.type === 'colorScale' ? chart : undefined}
                  dataset={def.type === 'colorScale' ? dataset : undefined}
                  dataTypes={def.type === 'colorScale' ? dataTypes : undefined}
                  // mappedData={
                  //   def.type === "colorScale" ? mappedData : undefined
                  // }
                  mappedData={mappedData}
                  setVisualOptions={setVisualOptions}
                />
              )
            })}
            {groupName === 'artboard' && (
              <p className="small">
                The final output will be 99999 px * 99999 px
                <br />
                including the legend.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChartOptions
