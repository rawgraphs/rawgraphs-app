import React, { useMemo } from "react"
import { baseOptions } from "@raw-temp/rawgraphs-core"
import ChartOptionNumber from "./ChartOptionTypes/ChartOptionNumber"
import ChartOptionText from "./ChartOptionTypes/ChartOptionText"
import ChartOptionColor from "./ChartOptionTypes/ChartOptionColor"
import ChartOptionColorScale from "./ChartOptionTypes/ChartOptionColorScale"
import ChartOptionBoolean from "./ChartOptionTypes/ChartOptionBoolean"
import { map } from "lodash"

const CHART_OPTION_COMPONENTS = {
  'number': ChartOptionNumber,
  'text': ChartOptionText,
  'color': ChartOptionColor,
  'colorScale': ChartOptionColorScale,
  'boolean': ChartOptionBoolean
}

const ChartOptions = ({ chart, visualOptions, setVisualOptions, error }) => {

  const optionsDefinitions = useMemo(() => {
    return {
      ...baseOptions,
      ...chart?.visualOptions
    }
  }, [chart])

  return (
    <div>
      {map(optionsDefinitions, (def, optionId) => {
        const Component = CHART_OPTION_COMPONENTS[def.type]

        return (
          <Component
            key={optionId}
            {...def}
            error={error?.errors?.[optionId]}
            value={visualOptions?.[optionId]}
            onChange={nextValue => {
              setVisualOptions({
                ...visualOptions,
                [optionId]: nextValue
              })
            }}
          />
        )
      })}
    </div>
  )
}

export default ChartOptions