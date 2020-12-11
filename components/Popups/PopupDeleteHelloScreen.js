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
        setLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="Delete a start screen"
    >
      <p>Are you sure you want to delete this start screen?</p>
      <div className={styles.actions}>
        <Button
          outline={true}
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