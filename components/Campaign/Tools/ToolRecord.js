import { useEffect, useState, useMemo } from 'react'
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

  const isSafari = useMemo(() => /apple/i.test(navigator.vendor), [])

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
            from: 'recorder',
          })}
        />
      }

      <img
        className={styles.toolRecordImage}
        src="/assets/campaign/record.svg"
      />
      <p className={styles.toolRecordName}>Record</p>
      <p className={styles.toolRecordText}>Start recording your video and personalize it with custom screens</p>
      
      {isSafari ? (
          <div>
            <p className={styles.unsuportedBrowser}>
              Unsupported browser to <br/> record a video
              <br />
              Please use
              <a href="https://www.google.com/intl/fr/chrome/" target="_blank">
                {` Chrome `}
              </a>
              or
              <a
                href="https://www.mozilla.org/fr/firefox/windows/"
                target="_blank"
              >
                {` Firefox `}
              </a>
              to create campaigns
            </p>
          </div>
      ) : (
          <Button onClick={() => showVideoRecorder(true)}>
            Start recording
          </Button>
      )}
      
      <ImportButton
        onChange={(e) => {
          showPopup({
            display: 'UPLOAD_VIDEO',
            data: e.target.files[0],
            from: 'import',
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
