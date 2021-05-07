import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'
import ContactLayout from '@/layouts/ContactLayout'

import Button from '@/components/Button'
import ListHeader from '@/components/ListHeader'
import ListItem from '@/components/ListItem'
import Pagination from '@/components/Pagination'
import PopupAddContact from '@/components/Popups/PopupAddContact'
import PopupDeleteContact from '@/components/Popups/PopupDeleteContact'
import PopupEditContact from '@/components/Popups/PopupEditContact'
import PopupImportContacts from '@/components/Popups/PopupImportContacts'
import PopupContactListCreate from '@/components/Popups/PopupContactListCreate'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/layouts/Contact.module.sass'
import PopupContactListSelect from '@/components/Popups/PopupContactListSelect'

const CONTACTS_LIMIT = 20

const Contacts = ({ initialContacts, me }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [contacts, setContacts] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState([])
  const [showContactOptions, setShowContactOptions] = useState(false)
  const [showListOptions, setShowListOptions] = useState(false)

  useEffect(() => { setContacts(initialContacts) }, [initialContacts])

  const extractDataFromCSV = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const { data } = await mainAPI.post('/contacts/csv', formData)
    showPopup({ display: 'IMPORT_CONTACTS', data })
  }

  const getContacts = async () => {
    const { data } = await mainAPI.get(`/users/me/contacts?limit=${CONTACTS_LIMIT}&page=${router.query.page ? router.query.page : 1}`)
    setContacts(data)
  }

  const searchContacts = async (query) => {
    if (!query) {
      return getContacts()
    }
    const { data } = await mainAPI.get(`/contacts/search?query=${query}`)
    setContacts(data)
  }

  const deleteRef= useRef(null);
  const contactRef= useRef(null);
  const listRef= useRef(null);

  const renderContact = (contact = {}) => (
    <ListItem
      className={styles.contactsItem}
      empty={Object.keys(contact).length > 0 ? false : true}
      key={contact._id}
      renderDropdownActions={() => (
        <ul>
          <li
            onClick={() => showPopup({
              display: 'EDIT_CONTACT',
              data: contact,
            })}
          >
            <p>Edit</p>
          </li>
          <li
            onClick={() => showPopup({
              display: 'DELETE_CONTACT',
              data: [contact._id],
            })}
          >
            <p>Delete</p>
          </li>
        </ul>
      )}
      renderEmpty={() => (
        <p>No contacts found.</p>
      )}
    >
      <input
        type="checkbox"
        value={contact._id}
        onChange={selectOne}
        checked={selectedContact.includes(contact._id)}
      />
      <p>{contact.firstName}</p>
      <p>{contact.lastName}</p>
      <p>{contact.job}</p>
      <p>{contact.company}</p>
      <p>{contact.city}</p>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
    </ListItem>
  )

  const selectOne = (e) => {
    const contactId = e.target.value
    setSelectedContact(
      e.target.checked
        ? [...selectedContact, contactId]
        : selectedContact.filter((c) => c !== contactId)
    )
  }
  const selectAll = (e) => {
    setSelectedContact(e.target.checked ? contacts.docs.map((e) => e._id) : [])
  }

  useEffect(() => {
    if (showContactOptions || showListOptions)
      document.body.addEventListener('click', hidePopupButtons)
    else document.body.removeEventListener('click', hidePopupButtons)
    return () => {
      document.body.removeEventListener('click', hidePopupButtons)
    }
  }, [showContactOptions, showListOptions])

  const hidePopupButtons = (e) => {
    if(!contactRef.current.contains(e.target))
      setShowContactOptions(false)
    if(!listRef.current.contains(e.target))
      setShowListOptions(false)
  }

  return (
    <AppLayout>
      <Head>
        <title>Contacts | FOMO</title>
      </Head>
      {popup.display === 'CONTACT_LIST_CREATE' && (
        <PopupContactListCreate
          onDone={(e) => {
            const { data } = e
            mainAPI
              .post(`/contactLists/${data._id}/contacts`, {
                contactsId: selectedContact,
                ownerId: me._id,
              })
              .then(() => {
                hidePopup()
                toast.success('List created.')
              })
          }}
        />
      )}
      {popup.display === 'CONTACT_LIST_SELECT' && (
        <PopupContactListSelect
          onDone={async (selectedLists) => {
            const promises = selectedLists.map((list) =>
              mainAPI.post(`/contactLists/${list._id}/contacts`, {
                contactsId: selectedContact,
                ownerId: me._id,
              })
            )
            await Promise.all(promises)
            hidePopup()
            toast.success('List Saved.')
          }}
        />
      )}

      { popup.display === 'ADD_CONTACT' && 
        <PopupAddContact
          onDone={() => {
            getContacts()
            hidePopup()
            toast.success('Contact added.')
          }}
        />
      }
      { popup.display === 'EDIT_CONTACT' && 
        <PopupEditContact
          me={me}
          onDone={() => {
            getContacts()
            hidePopup()
          }}
        />
      }
       {(popup.display === 'DELETE_CONTACT' ||
        popup.display === 'DELETE_MULTIPLE_CONTACT') && (
        <PopupDeleteContact
          me={me}
          onDone={() => {
            getContacts()
            hidePopup()
            setSelectedContact([])
            toast.success('Contact deleted.')
          }}
        />)
      }
      { popup.display === 'IMPORT_CONTACTS' && 
        <PopupImportContacts
          me={me}
          onDone={() => {
            getContacts()
            hidePopup()
            toast.success('Contacts imported.')
          }}
        />
      }

      <ContactLayout>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Contacts <span>({ searchQuery ? contacts.length : contacts.totalDocs })</span></h1>
            <div className={layoutStyles.headerActions}>
              <div className={layoutStyles.buttonContainer} ref={deleteRef}>
                {selectedContact.length >0 && (
                  <Button
                    onClick={() => showPopup({
                      display: 'DELETE_MULTIPLE_CONTACT',
                      data: selectedContact,
                    })}
                    size="small"
                    color={'danger'}>
                    delete
                  </Button>
                )}
              </div>
              <div className={layoutStyles.buttonContainer} ref={listRef}>
                <Button
                  onClick={() =>
                    selectedContact.length &&
                    setShowListOptions(!showListOptions)
                  }
                  size="small"
                  outline
                  color={selectedContact.length == 0 ? 'grey' : 'primary'}>
                  Add to list
                </Button>
                {showListOptions && selectedContact.length > 0 && (
                  <div className={layoutStyles.buttonPopup}>
                    <Button
                      onClick={() =>
                        showPopup({ display: 'CONTACT_LIST_CREATE' })
                      }
                      size="small"
                      outline={true}
                      color="greyLite"
                      outline>
                      Create new
                    </Button>
                    <div className={layoutStyles.spiler} />
                    <Button
                      onClick={() =>
                        showPopup({ display: 'CONTACT_LIST_SELECT' })
                      }
                      size="small"
                      outline={true}
                      color="greyLite"
                      outline>
                      Add to existing
                    </Button>
                  </div>
                )}
              </div>
              <div className={layoutStyles.buttonContainer} ref={contactRef}>
                <Button
                  onClick={() => 
                    setShowContactOptions(!showContactOptions)
                  }
                  size="small"
                  outline>
                  Add contact
                </Button>
                {showContactOptions && (
                  <div className={layoutStyles.buttonPopup}>
                    <Button
                      size="small"
                      onClick={() => showPopup({ display: 'ADD_CONTACT' })}
                      outline={true}
                      color="greyLite"
                      outline>
                      Create new
                    </Button>
                    <div className={layoutStyles.spiler} />
                    <Button
                      size="small"
                      onChange={extractDataFromCSV}
                      outline={true}
                      color="greyLite"
                      type="file"
                      outline>
                      Import csv
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={layoutStyles.headerBottom}>
            <div className={layoutStyles.headerSearch}>
              <img src="/assets/common/search.svg" />
              <input
                placeholder="Search"
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchContacts(e.target.value)
                }}
              />
            </div>
          </div>
        </div>
        <ListHeader className={styles.contactsHeader}>
          <input
            type="checkbox"
            onChange={selectAll}
          />
          <p>First name</p>
          <p>Last name</p>
          <p>Job Title</p>
          <p>Company</p>
          <p>City</p>
          <p>Email</p>
          <p>Phone number</p>
        </ListHeader>
        <div className={styles.contacts}>
          { contacts.totalDocs > 0 && contacts.docs.map(contact => renderContact(contact)) }
          { searchQuery && contacts.length > 0 && contacts.map(contact => renderContact(contact)) }
          { (contacts.totalDocs <= 0 || (searchQuery && contacts.length <= 0)) && renderContact() }
        </div>
        { !searchQuery && 
          <Pagination
            pageCount={contacts.totalPages}
            initialPage={router.query.page ? parseInt(router.query.page, 10) - 1 : 0}
            route="/app/contacts"
          />
        }
      </ContactLayout>
    </AppLayout>
  )
}

export default Contacts
export const getServerSideProps = withAuthServerSideProps(async ({ query }) => {
  const { data: initialContacts } = await mainAPI.get(`/users/me/contacts?limit=${CONTACTS_LIMIT}&page=${query.page ? query.page : 1}`)
  return {
    initialContacts
  }
})