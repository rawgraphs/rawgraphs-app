import React from 'react'
import styles from './DataLoader.module.scss'

export default function Loading() {
  return (
    <div className={styles['loading-component']}>
      <div className={styles['bg-animated']}/>
      <p>loading...</p>
    </div>
  )
}