import React from 'react'

const ColorSchemePreview = ({ label, scale }) => {
  let samples
  if (scale.ticks) {
    samples = scale.ticks()
  } else {
    samples = scale.domain()
  }
  return (
    <div>
      {label && <div>{label}</div>}
      <div className="d-flex">
        {samples.map((sample) => (
          <div
            key={sample}
            style={{ flex: 1, height: 10, background: scale(sample) }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default ColorSchemePreview