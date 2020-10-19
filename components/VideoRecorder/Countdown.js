import { useEffect, useState } from 'react'

import dayjs from '../../plugins/dayjs'

import styles from '../../styles/components/VideoRecorder/Countdown.module.sass'

const Timer = ({ countdownTime }) => {
  const [time, setTime] = useState(countdownTime)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className={styles.countdown}>{dayjs(time).format('s')}</div>
  )
}

export default Timer