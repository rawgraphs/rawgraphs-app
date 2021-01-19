import React from 'react'
import S from './Modal.module.scss'

export default function Modal({ isOpen, toggle, children }) {
  return (
    <div className={S['background']} onClick={() => toggle()}>
      <div className={S['modal']} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
