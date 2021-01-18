import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/layouts/Contact.module.sass'

const CONTACTS_LIMIT = 20

const Contacts = ({ initialContacts, me }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [contacts, setContacts] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

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
              data: contact,
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
      />
      <p>{contact.firstName}</p>
      <p>{contact.lastName}</p>
      <p>{contact.company}</p>
      <p>{contact.job}</p>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
    </ListItem>
  )

  return (
    <AppLayout>
      <Head>
        <title>Contacts | FOMO</title>
      </Head>

      { popup.display === 'ADD_CONTACT' && 
        <PopupAddContact
          onDone={() => {
            getContacts()
            hidePopup()
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
      { popup.display === 'DELETE_CONTACT' && 
        <PopupDeleteContact
          me={me}
          onDone={() => {
            getContacts()
            hidePopup()
          }}
        />
      }
      { popup.display === 'IMPORT_CONTACTS' && 
        <PopupImportContacts
          me={me}
          onDone={() => {
            getContacts()
            hidePopup()
          }}
        />
      }

      <ContactLayout>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Contacts <span>({ searchQuery ? contacts.length : contacts.totalDocs })</span></h1>
            <div className={layoutStyles.headerActions}>
              <Button
                onClick={() => showPopup({ display: 'ADD_CONTACT' })}
                outline={true}
                size="small"
              >
                Add contact
              </Button>
              <Button
                color="secondary"
                onChange={extractDataFromCSV}
                size="small"
                type="file"
              >
                Import contacts
              </Button>
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
          />
          <p>First name</p>
          <p>Last name</p>
          <p>Company</p>
          <p>Job</p>
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