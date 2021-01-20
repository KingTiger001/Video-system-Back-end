import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@/components/Button'
import ImportButton from '@/components/Campaign/ImportButton'
import VideoRecorder from '@/components/Campaign/VideoRecorder/index'

import styles from '@/styles/components/Campaign/Tools.module.sass'

const ToolRecord = () => {
  const dispatch = useDispatch()
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const tool = useSelector(state => state.campaign.tool)

  const preview = useSelector(state => state.campaign.preview)

  const [displayVideoRecorder, showVideoRecorder] = useState(false)

  return tool === 1 && (
    <div
      className={styles.toolRecord}
      onClick={() => {
        if (!preview.show) {
          dispatch({ type: 'SHOW_PREVIEW' })
        }
      }}
    >

      { displayVideoRecorder &&
        <VideoRecorder
          onClose={() => showVideoRecorder(false)}
          onDone={(file) => showPopup({
            display: 'UPLOAD_VIDEO',
            data: file,
          })}
        />
      }

      <img
        className={styles.toolRecordImage}
        src="/assets/campaign/record.svg"
      />
      <p className={styles.toolRecordName}>Record</p>
      <p className={styles.toolRecordText}>Start recording your video and personalize it with custom screens</p>
      <Button onClick={() => showVideoRecorder(true)}>
        Start recording
      </Button>
      <ImportButton
        onChange={(e) => {
          showPopup({
            display: 'UPLOAD_VIDEO',
            data: e.target.files[0],
          })
          e.target.value = null
        }}
      >
        Import video
      </ImportButton>
    </div>
  )
}

export default ToolRecord