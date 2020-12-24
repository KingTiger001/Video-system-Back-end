import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupDeleteContactList = ({ me, onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [loading, setLoading] = useState(false)

  const popup = useSelector(state => state.popup)

  const deleteContactList = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.delete(`/contactLists/${popup.data._id}`, {
          data: {
            ownerId: me._id,
          },
        })
        onDone()
      } catch (err) {
        setLoading(false)
      }
    }
  }

  return (
    <Popup
      title="Delete a list"
    >
      <p>Are you sure you want to delete this list?</p>
      <div className={styles.actions}>
        <Button
          outline={true}
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          onClick={deleteContactList}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  )
}

export default PopupDeleteContactList