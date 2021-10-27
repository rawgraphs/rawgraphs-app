/**
 * @typedef {{
 *  name: string
 *  id: string
 *  description: string
 *  code: string
 *  categories: string[]
 *  tutorial?: string
 * }} chartMetadata
 */

/**
 * @type string | null
 */
let prevChartIdRendered = null

/**
 * @param {ChartMetada} chartMetadata
 */
export function onChartRendered(chartMetadata) {
  if (prevChartIdRendered === chartMetadata.id) {
    // Nothing to report the chart still the same
    return
  }
  prevChartIdRendered = chartMetadata.id

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'chart-render', {
      event_category: chartMetadata.id,
    })
  }
}

/**
 * @param {chartMetadata} chartMetadata
 * @param {string} format
 */
export function onChartExported(chartMetadata, format) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'chart-export', {
      event_category: chartMetadata.id,
      event_label: format,
    })
  }
}
