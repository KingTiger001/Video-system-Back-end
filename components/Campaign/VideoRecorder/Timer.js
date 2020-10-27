import { useEffect, useState } from 'react'

import dayjs from '@/plugins/dayjs'

import styles from '@/styles/components/VideoRecorder/Timer.module.sass'

const Timer = ({
  isRecording,
  timeLimit,
}) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTime(time => time + 100);
      }, 100);
    } else if (!isRecording && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, time]);

  return (
    <div className={styles.timer}>
      {dayjs(time).format('mm:ss')}/{dayjs(timeLimit).format('mm:ss')}
    </div>
  )
}

export default Timer