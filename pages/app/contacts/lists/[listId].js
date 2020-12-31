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
import PopupContactListAddContacts from '@/components/Popups/PopupContactListAddContacts'
import PopupContactListRemoveContact from '@/components/Popups/PopupContactListRemoveContact'
import PopupEditContact from '@/components/Popups/PopupEditContact'
import PopupImportContacts from '@/components/Popups/PopupImportContacts'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/layouts/Contact.module.sass'

const ContactList = ({ initialContactList, me }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [contactList, setContactList] = useState(initialContactList)

  const getContactList = async () => {
    const { data } = await mainAPI.get(`/contactLists/${router.query.listId}`)
    setContactList(data)
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

      { popup.display === 'CONTACT_LIST_ADD_CONTACTS' && 
        <PopupContactListAddContacts
          me={me}
          onDone={() => {
            getContactList()
            hidePopup()
          }}
        />
      }
      { popup.display === 'CONTACT_LIST_REMOVE_CONTACT' && 
        <PopupContactListRemoveContact
          me={me}
          onDone={() => {
            getContactList()
            hidePopup()
          }}
        />
      }
      { popup.display === 'EDIT_CONTACT' && 
        <PopupEditContact
          me={me}
          onDone={() => {
            getContactList()
            hidePopup()
          }}
        />
      }
      { popup.display === 'IMPORT_CONTACTS' && 
        <PopupImportContacts
          listId={router.query.listId}
          me={me}
          onDone={() => {
            getContactList()
            hidePopup()
          }}
        />
      }

      <ContactLayout>
        <div className={layoutStyles.header}>
          <h1 className={layoutStyles.title}>Lists / {contactList.name}</h1>
          <div className={layoutStyles.headerActions}>
            <Button
              color="lightGrey"
              onClick={() => showPopup({ display: 'CONTACT_LIST_ADD_CONTACTS', data: contactList })}
              size="small"
            >
              Add contacts
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
          { contactList.list.length > 0 && contactList.list.map(contact => (
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
                      display: 'CONTACT_LIST_REMOVE_CONTACT',
                      data: {
                        ...contactList,
                        contactId: contact._id,
                      },
                    })}
                  >
                    <p>Remove</p>
                  </li>
                </ul>
              )}
            />
          ))}
          { contactList.list.length <= 0 && <ContactItem /> }
        </div>
        {/* <Pagination
          pageCount={contacts.totalPages}
          initialPage={router.query.page ? parseInt(router.query.page, 10) - 1 : 0}
          route="/app/contacts"
        /> */}
      </ContactLayout>
    </AppLayout>
  )
}

export default ContactList
export const getServerSideProps = withAuthServerSideProps(async ({ params }) => {
  const { data: initialContactList } = await mainAPI.get(`/contactLists/${params.listId}`)
  return {
    initialContactList
  }
})