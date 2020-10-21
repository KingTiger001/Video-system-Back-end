import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI, videosAPI } from '../../plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '../../styles/components/Popups/Popup.module.sass'

const PopupDeleteVideo = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [loading, setLoading] = useState(false)

  const popup = useSelector(state => state.popup)

  const deleteVideo = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        await videosAPI.post('/delete', { url: popup.data.url })
        await mainAPI.delete(`/videos/${popup.data._id}`)
        onDone()
        hidePopup()
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Popup
      title="Delete a video"
    >
      <p>Are you sure you want to delete this video?</p>
      <div className={styles.actions}>
        <Button
          style="outline"
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          onClick={deleteVideo}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  )
}


export default PopupDeleteVideo