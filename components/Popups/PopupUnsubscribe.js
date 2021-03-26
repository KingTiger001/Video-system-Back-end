import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupUnsubscribe = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [loading, setLoading] = useState(false)

  const unsubscribe = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.delete('/subscriptions')
        onDone()
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="Unsubscribe"
    >
      <p>Are you sure to unsubscribe ?</p>
      <div className={styles.actions}>
        <Button
          outline={true}
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          onClick={unsubscribe}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  )
}

export default PopupUnsubscribe