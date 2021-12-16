import { useCallback, useEffect, useRef } from 'react'
import useCustomCharts from './useCustomCharts'
import * as rollup from 'rollup'
import virtual from '@rollup/plugin-virtual'

async function createBundle(code) {
  const build = await rollup.rollup({
    input: 'index',
    plugins: [
      virtual({
        chart: code,
        index: `export { default as chart } from './chart'`,
      }),
    ],
  })
  const { output } = await build.generate({ format: 'umd', name: 'devcharts' })
  return output[0].code
}

export default function useDevChart({ onChartLoaded, initialCode }) {
  const [charts, { uploadCustomCharts }] = useCustomCharts({
    storage: false,
  })

  const updateDevChart = useCallback(
    async (code) => {
      const codeBundled = await createBundle(code)
      const file = new File([codeBundled], 'devchart.js', {
        type: 'application/json',
      })
      const nextCharts = await uploadCustomCharts(file)
      if (nextCharts.length > 0) {
        onChartLoaded(nextCharts[0])
      }
    },
    [onChartLoaded, uploadCustomCharts]
  )

  const bootedRef = useRef(false)
  useEffect(() => {
    if (bootedRef.current) {
      return
    }
    bootedRef.current = true
    updateDevChart(initialCode)
  })

  const chart = charts.length > 0 ? charts[0] : null
  return [
    chart,
    {
      updateDevChart,
    },
  ]
}
