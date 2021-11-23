import { isRAWLazyT, valueOfRAWLazyT } from '@rawgraphs/rawgraphs-core'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export function useLazyTranslation(...args) {
  const { t: baseT } = useTranslation(...args)
  return useCallback(
    (s) => (isRAWLazyT(s) ? baseT('RAWCharts.' + valueOfRAWLazyT(s)) : s),
    [baseT]
  )
}
