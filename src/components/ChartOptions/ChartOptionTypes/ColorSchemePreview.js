import React from 'react'
import styles from '../ChartOptions.module.scss'
import { COLOR_SCHEMES_LABELS } from '../../../constants'
import get from 'lodash/get'

const ColorSchemePreview = ({ label, scale, numSamples=150 }) => {
  let samples
  if (scale.ticks) {
    samples = scale.ticks(numSamples)
  } else {
    if(scale.domain){
      samples = scale.domain()
    } else {
      samples = []
    }
    
  }
  return (
    <div className={styles['scheme-preview']}>
      {label && <div style={{marginBottom:2}}>{get(COLOR_SCHEMES_LABELS, label, label)}</div>}
      <div className="d-flex">
        {samples.map((sample) => (
          <div
            key={'sample-'+sample}
            style={{ flex: 1, height: 10, background: scale(sample) }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(ColorSchemePreview)