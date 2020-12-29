import { useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import FormContactList from '../FormContactList'
import Popup from './Popup'

const PopupContactListCreate = ({ onDone }) => {
  const [loading, setLoading] = useState(false)

  const addContactList = async (data) => {
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.post('/contactLists', data)
        onDone()
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <Popup
      title="Add new list"
    >
      <FormContactList
        buttonText="Add"
        loading={loading}
        onSubmit={addContactList}
      />
    </Popup>
  )
}


export default PopupContactListCreate