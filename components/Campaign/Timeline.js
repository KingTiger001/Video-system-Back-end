import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState } from 'react'

import styles from '@/styles/components/Campaign/Timeline.module.sass'

const Timeline = () => {
  const dispatch = useDispatch()

  const duration = useSelector(state => state.campaign.duration)
  const endScreen = useSelector(state => state.campaign.endScreen)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const preview = useSelector(state => state.campaign.preview)
  const progression = useSelector(state => state.campaign.progression)
  const video = useSelector(state => state.campaign.video)
  const videoRef = useSelector(state => state.campaign.videoRef)

  const ref = useRef()

  const [isDraggable, setIsDraggable] = useState(false)

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientX - rect.left
    const progression = position / ref.current.offsetWidth * duration
    dispatch({ type: 'SET_PROGRESSION', data: progression })
    if (videoRef.current) {
      const currentTime = (progression - (helloScreen.duration || 0)) / 1000
      videoRef.current.currentTime = currentTime > 0 ? currentTime : 0 
    }
    if (preview.show) {
      dispatch({ type: 'HIDE_PREVIEW' })
      dispatch({ type: 'SELECT_TOOL', data: 0 })
    }
  }

  return (
    <div
      className={styles.timeline}
      onClick={(e) => seekTo(e)}
      onMouseDown={(e) => setIsDraggable(true)}
      onMouseUp={(e) => setIsDraggable(false)}
      onMouseMove={(e) => isDraggable && seekTo(e)}
      ref={ref}
      style={{
        gridTemplateColumns: `${helloScreen.duration ? `${(helloScreen.duration / duration) * 100}%` : ''} ${Object.keys(video).length > 0 ? '1fr' : ''} ${endScreen.duration ? `${(endScreen.duration / duration) * 100}%` : ''}`
      }}
    >
      {/* {progression}
      {duration} */}
      <span
        className={styles.cursor}
        style={{
          left: `${(progression / duration) * 100}%`,
        }}
      />
      { helloScreen.duration > 0 &&
        <div className={styles.helloScreen}>
          <p>Hello<br/>Screen</p>
        </div>
      }
      { Object.keys(video).length > 0 &&
        <div className={styles.videoRecorded}>
          <p>Video recorded</p>
        </div>
      }
      { endScreen.duration > 0 &&
        <div className={styles.endScreen}>
          <p>End<br/>Screen</p>
        </div>
      }
    </div>
  )
}


export default Timeline