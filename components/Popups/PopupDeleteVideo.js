import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI, mediaAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

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
        if (popup.data.url) {
          await mediaAPI.delete('/', {
            data: {
              url: popup.data.url
            }
          })
        }
        await mainAPI.delete(`/videos/${popup.data._id}`)
        onDone()
      } catch (err) {
        setLoading(false)
        console.log(err)
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
          outline={true}
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