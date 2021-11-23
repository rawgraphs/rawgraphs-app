import { useLazyTranslation } from '../../hooks/useLazyTranslation'

export default function LazyTrans({ children }) {
  const lazyt = useLazyTranslation()
  return lazyt(children)
}
