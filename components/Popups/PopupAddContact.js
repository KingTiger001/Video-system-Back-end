import { useEffect, useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import FormContact from '../FormContact'
import Popup from './Popup'

const PopupAddContact = ({ onDone }) => {
  const [loading, setLoading] = useState(false)

  const addContact = async (form) => {
        const {contact,lists} = form
    if (!loading) {
      try {
        setLoading(true)
        const { data: savedContacts } = await mainAPI.post('/contacts', [
          contact,
        ])

        if (!lists.length || !savedContacts.length) onDone()
        else {
          var counter = lists.length
          const me = savedContacts[0].owner
          lists.forEach((list) => {
            mainAPI
              .post(`/contactLists/${list._id}/contacts`, {
                contactsId: savedContacts.map((c) => c._id),
                ownerId: me,
              })
              .then(() => {
                counter--
                if (counter == 0) {
                  onDone()
                }
              })
          })
        }
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
  }

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

  return (
    <Popup
      title="Add a contact"
    >
      <FormContact
        buttonText="Add"
        loading={loading}
        onSubmit={addContact}
        data={{ lists: dataList }}
        includeLists
      />
    </Popup>
  )
}


export default PopupAddContact