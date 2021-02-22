import React, { useState } from 'react'
import styles from './InlineColorPicker.module.scss'
import { SketchPicker } from 'react-color'

export default function InlineColorPicker({ color: maybeColor, onChange, disabled }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const color = maybeColor ?? '#000000' // Same as <input type='color' />

  return (
    <>
      <div
        className={styles.swatch}
        onClick={() => setDisplayColorPicker(true)}
      >
        <div className={styles.color} style={{ background: color }} />
        {color.toUpperCase()}
      </div>
      {displayColorPicker && (
        <div className={styles.popover}>
          <div
            className={styles.cover}
            onClick={() => setDisplayColorPicker(false)}
          />
          <SketchPicker
            disabled={disabled}
            disableAlpha
            color={color}
            onChangeComplete={(color) => onChange(color.hex)}
          />
        </div>
      )}
    </>
  )
}
