import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupDeleteContact = ({ me, onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [loading, setLoading] = useState(false)

  const popup = useSelector(state => state.popup)

  const deleteContacts = async (e) => {
    e.preventDefault()
    if (!loading) {
      try {
        setLoading(true)
        const promises = popup.data.map((id) =>
          mainAPI.delete(`/contacts/${id}`, {
            data: {
              ownerId: me._id,
            },
          })
        )
        Promise.all(promises).then(onDone)
      } catch (err) {
        setLoading(false)
      }
    }
  }

  const title = `Delete ${popup.data.length === 1 ? 'a contact' : 'contacts'}`
  const desc = `Are you sure you want to delete ${
    popup.data.length === 1 ? 'this contact' : 'these contacts'
  }?`
 
  return (
    <Popup
      title={title}
      >
      <p>{desc}</p>
      <div className={styles.actions}>
        <Button
          outline={true}
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          onClick={deleteContacts}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  )
}

export default PopupDeleteContact