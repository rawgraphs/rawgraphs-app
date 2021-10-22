/**
 * @typedef {{
 *  name: string
 *  id: string
 *  description: string
 *  code: string
 *  categories: string[]
 *  tutorial?: string
 * }} ChartMetada
 */

/**
 * @type string | null
 */
let prevChartIdRendered = null

/**
 * @param {ChartMetada} chartMetada
 */
export function onChartRendered(chartMetada) {
  if (prevChartIdRendered === chartMetada.id) {
    // Nothing to report the chart still the same
    return
  }
  prevChartIdRendered = chartMetada.id

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'chart-render', {
      'event_category': chartMetada.id,
    })
  }
}

/**
 * @param {ChartMetada} chartMetada
 * @param {string} format
 */
export function onChartExported(chartMetada, format) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'chart-export', {
      'event_category': chartMetada.id,
      'event_label': format,
    })
  }
}
