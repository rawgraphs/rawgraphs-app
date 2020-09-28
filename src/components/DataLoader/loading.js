import React from 'react'
import styles from './DataLoader.module.scss'

export default function Loading() {
  return (
    <div className={styles['loading-component']}>
      <h1>Loading...</h1>
    </div>
  )
}