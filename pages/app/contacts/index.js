import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'
import ContactLayout from '@/layouts/ContactLayout'

import Button from '@/components/Button'
import ContactItem from '@/components/Contacts/ContactItem'
import Pagination from '@/components/Pagination'
import PopupAddContact from '@/components/Popups/PopupAddContact'
import PopupDeleteContact from '@/components/Popups/PopupDeleteContact'
import PopupEditContact from '@/components/Popups/PopupEditContact'
import PopupImportContacts from '@/components/Popups/PopupImportContacts'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/layouts/Contact.module.sass'

const CONTACTS_LIMIT = 24

const Contacts = ({ initialContacts, me }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [contacts, setContacts] = useState(initialContacts)

  const getContacts = async () => {
    const { data } = await mainAPI.get(`/users/me/contacts?limit=${CONTACTS_LIMIT}&page=${router.query.page ? router.query.page : 1}`)
    setContacts(data)
  }

  const extractDataFromCSV = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const { data } = await mainAPI.post('/contacts/csv', formData)
    showPopup({ display: 'IMPORT_CONTACTS', data })
  }

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
          <h1 className={layoutStyles.title}>Contacts <span>({ contacts.totalDocs })</span></h1>
          <div className={layoutStyles.headerActions}>
            <Button
              color="lightGrey"
              onClick={() => showPopup({ display: 'ADD_CONTACT' })}
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
        <div className={styles.contacts}>
          <div className={styles.contactsHeader}>
            <div>
              <p>First name</p>
            </div>
            <div>
              <p>Last name</p>
            </div>
            <div>
              <p>Company</p>
            </div>
            <div>
              <p>Job</p>
            </div>
            <div>
              <p>Email</p>
            </div>
            <div>
              <p>Phone number</p>
            </div>
          </div>
          { contacts.totalDocs > 0 && contacts.docs.map(contact => (
            <ContactItem
              data={contact}
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
            />
          ))}
          { contacts.totalDocs <= 0 && <ContactItem /> }
        </div>
        <Pagination
          pageCount={contacts.totalPages}
          initialPage={router.query.page ? parseInt(router.query.page, 10) - 1 : 0}
          route="/app/contacts"
        />
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