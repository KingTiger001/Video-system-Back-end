import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'

import styles from '@/styles/components/Campaign/Timeline.module.sass'

const Timeline = () => {
  const dispatch = useDispatch()

  const duration = useSelector(state => state.campaign.duration)
  const endScreen = useSelector(state => state.campaign.endScreen)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const preview = useSelector(state => state.campaign.preview)
  const progression = useSelector(state => state.campaign.progression)
  const timelineDraggable = useSelector(state => state.campaign.timelineDraggable)
  const video = useSelector(state => state.campaign.video)
  const videoRef = useSelector(state => state.campaign.videoRef)

  const ref = useRef()

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientX - rect.left
    const progression = position / ref.current.offsetWidth * duration
    dispatch({ type: 'SET_PROGRESSION', data: progression })
    if (Object.keys(videoRef).length > 0) {
      const currentTime = (progression - helloScreen.duration) / 1000
      videoRef.currentTime = currentTime > 0 ? currentTime : 0 
    }
    if (preview.show) {
      dispatch({ type: 'HIDE_PREVIEW' })
    }
  }

  return (
    <div
      className={styles.timeline}
      onClick={(e) => seekTo(e)}
      onMouseDown={(e) => dispatch({ type: 'TIMELINE_DRAGGABLE', data: true })}
      onMouseUp={(e) => dispatch({ type: 'TIMELINE_DRAGGABLE', data: false })}
      onMouseMove={(e) => timelineDraggable && seekTo(e)}
      ref={ref}
      style={{
        gridTemplateColumns: `${helloScreen.duration ? `${(helloScreen.duration / duration) * 100}%` : ''} ${Object.keys(video).length > 0 ? '1fr' : ''} ${endScreen.duration ? `${(endScreen.duration / duration) * 100}%` : ''}`
      }}
    >
      <span
        className={styles.cursor}
        style={{
          left: `${(progression / duration) * 100}%`,
        }}
      />
      { helloScreen.duration > 0 &&
        <div className={styles.helloScreen}>
          <div>
            <img src="/assets/campaign/toolHelloScreen.svg" />
            <p>{helloScreen.name}</p>
          </div>
        </div>
      }
      { Object.keys(video).length > 0 &&
        <div className={styles.videoRecorded}>
          <div>
            <img src="/assets/campaign/toolVideos.svg" />
            <p>{video.name}</p>
          </div>
        </div>
      }
      { endScreen.duration > 0 &&
        <div className={styles.endScreen}>
          <div>
            <img src="/assets/campaign/toolEndScreen.svg" />
            <p>{endScreen.name}</p>
          </div>
        </div>
      }
    </div>
  )
}


export default Timeline