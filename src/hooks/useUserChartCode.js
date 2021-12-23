import { useCallback, useState } from 'react'

/**
 * @param {Record<string, string>} initialCode
 * @returns {{
 *  code: Record<string, string>,
 *  writeCode(code: Record<string, string>): void
 *  resetCode(code?: Record<string, string>): void
 * }}
 */
export default function useUserChartCode(initialCode) {
  // NOTE: For now use this stupid implementation simple read and write
  // to local storage no boot lol

  const [code, setCode] = useState(() => {
    let storedCode = null
    try {
      storedCode = JSON.parse(
        window.localStorage.getItem('userChartCode') ?? 'null'
      )
    } catch (_) {}
    if (storedCode === null) {
      return initialCode
    } else {
      return storedCode
    }
  })

  return {
    code,
    resetCode: useCallback(
      (newCode = null) => {
        window.localStorage.removeItem('serChartCode')
        setCode(newCode ?? initialCode)
      },
      [initialCode]
    ),
    writeCode: useCallback((code) => {
      window.localStorage.setItem('userChartCode', JSON.stringify(code))
    }, []),
  }
}
