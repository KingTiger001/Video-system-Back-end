import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupContactListRemoveContact = ({ me, onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [loading, setLoading] = useState(false)

  const popup = useSelector(state => state.popup)

  const removeContact = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.delete(`/contactlists/${popup.data._id}/contacts`, {
          data: {
            contactId: popup.data.contactId,
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
      title="Remove contact"
    >
      <p>Are you sure you want to remove this contact form the list?</p>
      <div className={styles.actions}>
        <Button
          outline={true}
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          onClick={removeContact}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  )
}

export default PopupContactListRemoveContact