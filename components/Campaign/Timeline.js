import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import styles from '@/styles/components/Campaign/Timeline.module.sass'

const Timeline = () => {
  const dispatch = useDispatch()

  const duration = useSelector(state => state.campaign.duration)
  const progression = useSelector(state => state.campaign.progression)

  const ref = useRef()

  const [timelineWidth, setTimelineWidth] = useState(0)
  const [isDraggable, setIsDraggable] = useState(false)

  useEffect(() => {
    if (ref.current) {
      setTimelineWidth(ref.current.offsetWidth)
    }
  }, [ref]);

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientX - rect.left
    dispatch({ type: 'SET_PROGRESSION', data: position / ref.current.offsetWidth * duration })
  }

  return (
    <div
      className={styles.timeline}
      onClick={(e) => seekTo(e)}
      onMouseDown={(e) => setIsDraggable(true)}
      onMouseUp={(e) => setIsDraggable(false)}
      onMouseMove={(e) => isDraggable && seekTo(e)}
      ref={ref}
    >
      <span
        className={styles.cursor}
        style={{
          left: `${(progression / duration) * 100}%`,
        }}
      />
      <div className={styles.helloScreen}>
        <p>Hello Screen</p>
      </div>
      <div className={styles.videoRecorded}>
        <p>Video recorded</p>
      </div>
      <div className={styles.endScreen}>
        <p>End Screen + CTA</p>
      </div>
    </div>
  )
}


export default Timeline