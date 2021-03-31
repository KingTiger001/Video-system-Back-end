import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI, mediaAPI } from '@/plugins/axios'

import Button from '../Button'
import Input from '../Input'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupUploadVideo.module.sass'

const PopupUploadVideo = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const popup = useSelector(state => state.popup)

  const [error, setError] = useState('')
  const [isFinished, setIsFinished] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoName, setVideoName] = useState(null)

  const upload = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setIsUploading(true)
      // create a video
      const { data: video } = await mainAPI.post('/videos', {
        name: videoName,
        status: 'uploading',
      })

      // upload for encoding
      const formData = new FormData()
      formData.append('file', popup.data)
      formData.append('folder', 'videos')
      formData.append('videoId', video._id)
      await mediaAPI.post(
        '/videos',
        formData,
        {
          onUploadProgress: function (progressEvent) {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            setUploadProgress(Math.round((progressEvent.loaded * 100) / totalLength ))
          },
        },
      )
      await mainAPI.patch(`/videos/${video._id}`, {
        status: 'waiting',
      })
      onDone()
      setIsFinished(true)
    } catch (err) {
      const code = err.response && err.response.data
      if (code === 'Upload.incorrectFiletype') {
        setError('Incorrect file type. You must upload v')
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Popup
      allowBackdropClose={false}
      showCloseIcon={false}
      title="Upload a video"
    >
      { !isUploading && !isFinished &&
        <form
          onSubmit={upload}
          className={styles.form}
        >
          {popup.from === 'recorder' && <p className={styles.message}>You just recorded a video. To save the video give it a name.</p>}
          <Input
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Video name*"
            type="text"
            required
          />
          { error && <p className={styles.error}>{error}</p> }
          <Button>Upload</Button>
          <p
            onClick={() => hidePopup()}
            className={styles.cancel}
          >
            Cancel
          </p>
        </form>
      }
      { isUploading && !isFinished &&
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <span style={{ width: `${uploadProgress}%` }}/>
          </div>
          <p className={styles.progressNumber}>{uploadProgress}%</p>
        </div>
      }
      { !isUploading && isFinished &&
        <div className={styles.finish}>
          <p>You video has been uploaded</p>
          <Button onClick={hidePopup}>
            Ok
          </Button>
        </div>
      } 
    </Popup>
  )
}


export default PopupUploadVideo