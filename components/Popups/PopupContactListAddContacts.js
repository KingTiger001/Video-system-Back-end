import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import FormContact from '../FormContact'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupContactListAddContacts.module.sass'

const PopupContactListAddContact = ({ me, onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const popup = useSelector(state => state.popup)

  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(0)
  const [selectedExistingContacts, setSelectedExistingContacts] = useState([])

  useEffect(() => {
    async function getContacts() {
      const { data: contacts } = await mainAPI.get('/users/me/contacts?pagination=false')
      setContacts(contacts.docs)
    }
    getContacts()
  }, [])

  const addNewContact = async (data) => {
    if (!loading) {
      try {
        setLoading(true)
        const { data: contact } = await mainAPI.post('/contacts', data)
        updateList([contact._id])
      } catch (err) {
        setLoading(false)
      }
    }
  }

  const addExistingContacts = () => updateList(selectedExistingContacts)

  const updateList = async (contactsId) => {
    if (!loading) {
      try {
        setLoading(true)
        await mainAPI.post(`/contactLists/${popup.data._id}/contacts`, { contactsId, ownerId: me._id })
        onDone()
      } catch (err) {
        setLoading(false)
      }
    }
  }

  const handleExistingContactsChange = (e) => {
    const contactId = e.target.value
    if (selectedExistingContacts.includes(contactId)) {
      return setSelectedExistingContacts(selectedExistingContacts.filter(c => c !== contactId))
    }
    setSelectedExistingContacts([
      ...selectedExistingContacts,
      e.target.value,
    ])
  }

  return (
    <Popup
      title="Add contacts in list"
    >
      <ul className={styles.tabs}>
        <li
          className={tab === 0 ? styles.selected : ''}
          onClick={() => setTab(0)}
        >
          Existing contacts
        </li>
        <li
          className={tab === 1 ? styles.selected : ''}
          onClick={() => setTab(1)}
        >
          New contact
        </li>
      </ul>
      { tab === 0 &&
        <div className={styles.existingContacts}>
          <div className={styles.contactsHeader}>
            <div />
            <p>Name</p>
            <p>Email</p>
          </div>
          <div className={styles.contacts}>
            { contacts.map(contact => (
              <div
                className={styles.contact}
                onChange={handleExistingContactsChange}
                key={contact._id}
              >
                { !popup.data.list.find(c => c._id === contact._id) &&
                  <input
                    checked={selectedExistingContacts.includes(contact._id)}
                    type="checkbox"
                    value={contact._id}
                  />
                }
                { popup.data.list.find(c => c._id === contact._id) && <img src="/assets/common/doneSecondary.svg" /> }
                <p>{contact.firstName} {contact.lastName}</p>
                <p>{contact.email}</p>
              </div>
            ))}
          </div>
          <Button
            loading={loading}
            onClick={addExistingContacts}
          >
            Add
          </Button>
          <p
            onClick={hidePopup}
            className={styles.cancel}
          >
            Cancel
          </p>
        </div>
      }
      { tab === 1 &&
        <FormContact
          buttonText="Add"
          loading={loading}
          onSubmit={addNewContact}
        />
      }
    </Popup>
  )
}


export default PopupContactListAddContact