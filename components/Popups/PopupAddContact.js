import { useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import FormContact from '../FormContact'
import Popup from './Popup'

const PopupAddContact = ({ onDone }) => {
  const [loading, setLoading] = useState(false)

  const addContact = async (data) => {
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.post('/contacts', [data])
        onDone()
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="Add a contact"
    >
      <FormContact
        buttonText="Add"
        loading={loading}
        onSubmit={addContact}
      />
    </Popup>
  )
}


export default PopupAddContact