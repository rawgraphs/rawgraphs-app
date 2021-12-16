import { useCallback, useEffect, useRef } from 'react'
import useCustomCharts from './useCustomCharts'
import * as rollup from 'rollup'
import virtual from '@rollup/plugin-virtual'
import './chart-types'

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

/**
 * Build a cahrt from code
 *
 * @param initialCode {string}
 * @param options {{ onBuilded?(chart: CustomChartContract): void }}
 * @returns {[CustomChartContract, (code: string): void]}
 */
export default function useChartBuilder(initialCode, { onBuilded }) {
  const [charts, { uploadCustomCharts }] = useCustomCharts({
    storage: false,
  })

  const buildChart = useCallback(
    async (code) => {
      const codeBundled = await createBundle(code)
      const file = new File([codeBundled], 'devchart.js', {
        type: 'application/json',
      })
      const nextCharts = await uploadCustomCharts(file)
      if (nextCharts.length > 0) {
        onBuilded(nextCharts[0])
      }
    },
    [onBuilded, uploadCustomCharts]
  )

  const bootedRef = useRef(false)
  useEffect(() => {
    if (bootedRef.current) {
      return
    }
    bootedRef.current = true
    buildChart(initialCode)
  })

  const chart = charts.length > 0 ? charts[0] : null
  return [chart, buildChart]
}
