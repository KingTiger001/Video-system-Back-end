import { useState } from 'react'
import { useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import FormContactList from '../FormContactList'
import Popup from './Popup'

const PopupRenameContactList = ({ me, onDone }) => {
  const popup = useSelector(state => state.popup)

  const [loading, setLoading] = useState(false)

  const renameList = async (data) => {
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.patch(`/contactLists/${data._id}`, {
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
      title="Rename list"
    >
      <FormContactList
        buttonText="Save"
        data={popup.data}
        loading={loading}
        onSubmit={renameList}
      />
    </Popup>
  )
}


export default PopupRenameContactList