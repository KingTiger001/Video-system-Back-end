import { useState } from 'react'
import { useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import FormContact from '../FormContact'
import Popup from './Popup'

const PopupEditContact = ({ me, onDone }) => {
  const popup = useSelector(state => state.popup)

  const [loading, setLoading] = useState(false)

  const editContact = async (data) => {
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.patch(`/contacts/${data._id}`, {
          ...data,
          ownerId: me._id,
        })
        onDone()
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="Edit a contact"
    >
      <FormContact
        buttonText="Save"
        data={popup.data}
        loading={loading}
        onSubmit={editContact}
      />
    </Popup>
  )
}


export default PopupEditContact