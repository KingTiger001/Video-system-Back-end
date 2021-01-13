import { useEffect, useRef, useState } from 'react'

import styles from '@/styles/components/Stat.module.sass'

const Stat = ({
  text,
  unit,
  value,
}) => {
  return (
    <div className={styles.stat}>
      <p className={styles.value}>{value}<span>{unit}</span></p>
      <p className={styles.text}>{text}</p>
    </div>
  )
}

export default Stat