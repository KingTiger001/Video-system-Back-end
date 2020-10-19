import { useRef } from 'react'
import Recorder from 'react-video-recorder'

import { useVideoResize } from '../../hooks'


import Actions from './Actions'

import styles from '../../styles/components/VideoRecorder/index.module.sass'

const VideoRecorder = ({ onClose }) => {
  const ref = useRef();
  const { height } = useVideoResize({ ref, autoHeight: true })

  return (
    <div className={styles.videoRecorder}>
      <div className={styles.videoRecorderBackground} />
      <div
        ref={ref}
        className={styles.videoRecorderContent}
        style={{ height }}
      >
        <Recorder
          isFlipped={false}
          isOnInitially={true}
          onRecordingComplete={videoBlob => {
            // Do something with the video...
            console.log('videoBlob', videoBlob)
          }}
          renderActions={(props) => Actions({ ...props, onClose })}
          timeLimit={90000}
        />
      </div>
    </div>
  )
}


export default VideoRecorder