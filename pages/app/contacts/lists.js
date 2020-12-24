import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'
import ContactLayout from '@/layouts/ContactLayout'

import Button from '@/components/Button'
import ListItem from '@/components/Contacts/ListItem'
import Pagination from '@/components/Pagination'
import PopupAddContactList from '@/components/Popups/PopupAddContactList'
import PopupDeleteContactList from '@/components/Popups/PopupDeleteContactList'
import PopupRenameContactList from '@/components/Popups/PopupRenameContactList'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/layouts/Contact.module.sass'

const CONTACT_LISTS_LIMIT = 24

const ContactLists = ({ initialContactLists, me }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [contactLists, setContactLists] = useState(initialContactLists)

  const getContactLists = async () => {
    const { data } = await mainAPI.get(`/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${router.query.page ? router.query.page : 1}`)
    setContactLists(data)
  }

  return (
    <AppLayout>
      <Head>
        <title>Lists | FOMO</title>
      </Head>

      { popup.display === 'ADD_CONTACT_LIST' && 
        <PopupAddContactList
          onDone={() => {
            getContactLists()
            hidePopup()
          }}
        />
      }
      { popup.display === 'RENAME_CONTACT_LIST' && 
        <PopupRenameContactList
          me={me}
          onDone={() => {
            getContactLists()
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_CONTACT_LIST' && 
        <PopupDeleteContactList
          me={me}
          onDone={() => {
            getContactLists()
            hidePopup()
          }}
        />
      }

      <ContactLayout>
        <div className={layoutStyles.header}>
          <h1 className={layoutStyles.title}>Lists <span>({ contactLists.totalDocs })</span></h1>
          <Button
            onClick={() => showPopup({ display: 'ADD_CONTACT_LIST' })}
          >
            Add new list
          </Button>
        </div>
        <div className={styles.contactLists}>
          <div className={styles.contactListsHeader}>
            <div>
              <p>Name</p>
            </div>
            <div>
              <p>Number of contacts</p>
            </div>
          </div>
          { contactLists.totalDocs > 0 && contactLists.docs.map(contactList => (
            <ListItem
              data={contactList}
              key={contactList._id}
            />
          ))}
          { contactLists.totalDocs <= 0 && <ListItem /> }
        </div>
      </ContactLayout>
    </AppLayout>
  )
}

export default ContactLists
export const getServerSideProps = withAuthServerSideProps(async ({ query }) => {
  const { data: initialContactLists } = await mainAPI.get(`/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${query.page ? query.page : 1}`)
  return {
    initialContactLists
  }
})