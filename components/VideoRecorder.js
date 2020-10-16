import { useRef } from 'react'
import Recorder from 'react-video-recorder'

import { useVideoResize } from '../hooks'

import styles from '../styles/components/VideoRecorder.module.sass'

const VideoRecorder = (props) => {
  const ref = useRef();
  const { height } = useVideoResize({ ref, autoHeight: true })
  return (
    <div className={styles.videoRecorder}>
      <div
        onClick={props.onClose}
        className={styles.videoRecorderBackground} 
      />
      <div
        ref={ref}
        className={styles.videoRecorderContent}
        style={{ height }}
      >
        <Recorder
          isFlipped={false}
        />
      </div>
    </div>
  )
}


export default VideoRecorder