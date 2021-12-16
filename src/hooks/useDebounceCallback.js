import { useCallback, useEffect, useRef } from 'react'

export default function useDebounceCallback(
  cb,
  delay = 0,
  args,
) {
  const lastTimeoutId = useRef()
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoCb = useCallback(cb, args)

  const callback = useCallback(
    (...params) => {
      if (lastTimeoutId.current) {
        clearTimeout(lastTimeoutId.current)
      }
      lastTimeoutId.current = setTimeout(() => {
        if (mounted.current) {
          memoCb(...params)
        }
      }, delay)
    },
    [memoCb, delay]
  )

  return callback
}