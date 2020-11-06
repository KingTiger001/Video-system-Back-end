import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupDeleteHelloScreen = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [loading, setLoading] = useState(false)

  const popup = useSelector(state => state.popup)

  const deleteHelloScreen = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.delete(`/helloScreens/${popup.data._id}`)
        onDone()
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Popup
      title="Delete a hello screen"
    >
      <p>Are you sure you want to delete this hello screen?</p>
      <div className={styles.actions}>
        <Button
          style="outline"
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          onClick={deleteHelloScreen}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  )
}

export default PopupDeleteHelloScreen