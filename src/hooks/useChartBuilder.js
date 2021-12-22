import { useCallback, useEffect, useRef } from 'react'
import * as Comlink from 'comlink'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!../worker/bundler'
import useCustomCharts from './useCustomCharts'
import './chart-types'

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

  const activeWorker = useRef(null)
  useEffect(() => {
    // Good Bye Space Cowboy
    return () => {
      const w = activeWorker.current
      if (w) {
        try {
          w.terminate()
        } catch (e) {}
      }
    }
  }, [])

  const buildChart = useCallback(
    async (code) => {
      if (activeWorker.current === null) {
        activeWorker.current = new Worker()
      }
      const lazyWorker = activeWorker.current
      const remote = Comlink.wrap(lazyWorker)
      const codeBundled = await remote.createBundle(code)
      console.log('Code bundled', codeBundled)
      const file = new File([codeBundled], 'devchart.js', {
        type: 'application/json',
      })
      const nextCharts = await uploadCustomCharts(file, 'replace')
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
  console.log('Chart', chart)
  return [chart, buildChart]
}
