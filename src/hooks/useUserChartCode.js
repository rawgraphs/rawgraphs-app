import { useCallback, useRef } from 'react'

/**
 * @param {Record<string, string>} initialCode
 * @returns {[Record<string, string>, (code: Record<string, string>): void]}
 */
export default function useUserChartCode(initialCode) {
  const codeRef = useRef(null)
  // NOTE: For now use this stupid implementation simple read and write
  // to local storage no boot lol
  let code = null
  if (codeRef.current === null) {
    try {
      code = JSON.parse(window.localStorage.getItem('userChartCode') ?? 'null')
    } catch (_) {}
    if (code === null) {
      code = initialCode
    }
  } else {
    code = codeRef.current
  }
  return [
    code,
    useCallback((code) => {
      window.localStorage.setItem('userChartCode', JSON.stringify(code))
    }, []),
  ]
}
