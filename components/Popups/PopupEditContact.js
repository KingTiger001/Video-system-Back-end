import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import FormContact from '../FormContact'
import Popup from './Popup'

const PopupEditContact = ({ me, onDone }) => {
  const popup = useSelector(state => state.popup)

  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  useEffect(() => { 
    async function getList() {
      const { data } = await mainAPI.get(
        `/users/me/contactLists?limit=1000&page=1`
      )  
      setLoading(false)
      setDataList(data.docs)
    }
    getList()
  }, [])

  const editContact = async (form) => {
    const {contact,lists} = form
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.patch(`/contacts/${contact._id}`, {
          ...contact,
          ownerId: me._id,
        })

        const promises = lists.map((list) =>
          mainAPI.post(`/contactLists/${list._id}/contacts`, {
            contactsId: [contact._id],
            ownerId: me._id,
          })
        )
        Promise.all(promises).then(onDone)
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
        data={{ contact: popup.data, lists: dataList }}
        loading={loading}
        onSubmit={editContact}
        includeLists
      />
    </Popup>
  )
}


export default PopupEditContact