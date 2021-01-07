import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'
import ContactLayout from '@/layouts/ContactLayout'

import Button from '@/components/Button'
import ListItem from '@/components/Contacts/ListItem'
import Pagination from '@/components/Pagination'
import PopupContactListCreate from '@/components/Popups/PopupContactListCreate'
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
  
  const [contactLists, setContactLists] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { setContactLists(initialContactLists) }, [initialContactLists])

  const getContactLists = async () => {
    const { data } = await mainAPI.get(`/users/me/contactLists?limit=${CONTACT_LISTS_LIMIT}&page=${router.query.page ? router.query.page : 1}`)
    setContactLists(data)
  }

  const searchContactLists = async (query) => {
    if (!query) {
      return getContactLists()
    }
    const { data } = await mainAPI.get(`/contactLists/search?query=${query}`)
    setContactLists(data)
  }

  const renderContactList = (contactList) => (
    <ListItem
      data={contactList}
      key={contactList._id}
      renderDropdownActions={() => (
        <ul>
          <li
            onClick={() => showPopup({
              display: 'RENAME_CONTACT_LIST',
              data: contactList,
            })}
          >
            <p>Rename</p>
          </li>
          <li
            onClick={() => showPopup({
              display: 'DELETE_CONTACT_LIST',
              data: contactList,
            })}
          >
            <p>Delete</p>
          </li>
        </ul>
      )}
    />
  )

  return (
    <AppLayout>
      <Head>
        <title>Lists | FOMO</title>
      </Head>

      { popup.display === 'CONTACT_LIST_CREATE' && 
        <PopupContactListCreate
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
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Lists <span>({ searchQuery ? contactLists.length : contactLists.totalDocs })</span></h1>
            <div className={layoutStyles.headerActions}>
              <Button
                color="secondary"
                onClick={() => showPopup({ display: 'CONTACT_LIST_CREATE' })}
                size="small"
              >
                Add new list
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
                  searchContactLists(e.target.value)
                }}
              />
            </div>
          </div>
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
          { contactLists.totalDocs > 0 && contactLists.docs.map(contactList => renderContactList(contactList)) }
          { searchQuery && contactLists.length > 0 && contactLists.map(contactList => renderContactList(contactList)) }
          { (contactLists.totalDocs <= 0 || (searchQuery && contactLists.length <= 0)) && <ListItem /> }
        </div>

        { !searchQuery && 
          <Pagination
            pageCount={contactLists.totalPages}
            initialPage={router.query.page ? parseInt(router.query.page, 10) - 1 : 0}
            route="/app/contacts/lists"
          />
        }
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