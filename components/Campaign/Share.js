import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI, mediaAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import PopupImportContacts from '@/components/Popups/PopupImportContacts'

import styles from '@/styles/components/Campaign/Share.module.sass'

const Share = ({ campaignId, onClose, me }) => {
  const FROM = `${me.firstName} ${me.lastName} sent you a video message`
  const SUBJECT = `${me.firstName} from ${me.job} sent you a video message`

  const router = useRouter()
  const dispatch = useDispatch()

  
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [campaign, setCampaign] = useState({})
  const [contacts, setContacts] = useState({})
  const [contactsSelected, setContactsSelected] = useState([])
  const [formDetails, setFormDetails] = useState({
    from: FROM,
    message: '',
    subject: SUBJECT,
  })
  const [lists, setLists] = useState({})
  const [listsSelected, setListsSelected] = useState([])
  const [shareLoading, setShareLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [stepOneError, setStepOneError] = useState('')
  const [stepTwoError, setStepTwoError] = useState('')
  const [stepThreeError, setStepThreeError] = useState('')
  const [thumbnailLoading, setThumbnailLoading] = useState(false)

  const refFormDetails = useRef(null)

  // mounted
  useEffect(() => {
    getCampaign()
    getContacts()
    getLists()
  }, []);

  // useEffect(() => {
  //   if (campaign.share && (campaign.share.contacts || campaign.share.lists)) {
  //     setStep(3)
  //   } else if (campaign.share && campaign.share.from && campaign.share.message && campaign.share.subject) {
  //     setStep(2)
  //   }
  // }, [campaign]);

  const getCampaign = async () => {
    const { data: campaign } = await mainAPI.get(`/campaigns/${campaignId}`)
    setCampaign(campaign)
    setFormDetails({
      from: campaign.share ? campaign.share.from : FROM,
      message: campaign.share ? campaign.share.message : '',
      subject: campaign.share ? campaign.share.subject : SUBJECT,
    })
    setContactsSelected(campaign.share && campaign.share.contacts ? campaign.share.contacts : [])
    setListsSelected(campaign.share && campaign.share.lists ? campaign.share.lists : [])
  }
  const getContacts = async () => {
    const { data: contacts } = await mainAPI.get(`/users/me/contacts?pagination=false`)
    setContacts(contacts)
  }
  const searchContacts = async (query) => {
    if (!query) {
      return getContacts()
    }
    const { data } = await mainAPI.get(`/contacts/search?query=${query}`)
    setContacts(data)
  }

  const getLists = async () => {
    const { data: lists } = await mainAPI.get(`/users/me/contactLists?pagination=false`)
    setLists(lists)
  }
  const searchLists = async (query) => {
    if (!query) {
      return getLists()
    }
    const { data } = await mainAPI.get(`/contactLists/search?query=${query}`)
    setLists(data)
  }

  const extractDataFromCSV = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const { data } = await mainAPI.post('/contacts/csv', formData)
    showPopup({ display: 'IMPORT_CONTACTS', data })
  }

  const handleSelectedContact = (e) => {
    const contactId = e.target.value
    if (contactsSelected.includes(contactId)) {
      return setContactsSelected(contactsSelected.filter(c => c !== contactId))
    }
    setContactsSelected([
      ...contactsSelected,
      e.target.value,
    ])
  }

  const handleSelectedList = (e) => {
    const listId = e.target.value
    if (listsSelected.includes(listId)) {
      return setListsSelected(listsSelected.filter(l => l !== listId))
    }
    setListsSelected([
      ...listsSelected,
      e.target.value,
    ])
  }

  const next = async () => {
    try {
      switch (step) {
        case 1:
          await stepOne()
          break
        case 2:
          await stepTwo()
          break
      }
      setStep(step + 1)
    } catch (err) {
      console.log(err)
    }
  }

  const share = async () => {
    try {
      setShareLoading(true)
      await mainAPI.post('/campaigns/share', { campaign })
      router.push('/app/campaigns')
    } catch (err) {
      setStepThreeError('An error has occured.')
    } finally {
      setShareLoading(false)
    }
  }

  const stepOne = async () => {
    if (!refFormDetails.current.checkValidity()) {
      throw refFormDetails.current.reportValidity()
    }
    try {
      const { data: campaignUpdated } = await mainAPI.patch(`/campaigns/${campaignId}`, {
        share: {
          ...campaign.share,
          ...formDetails,
        }
      })
      setCampaign(campaignUpdated)
    } catch (err) {
      throw setStepOneError('An error has occured.')
    }
  }

  const stepTwo = async () => {
    try {
      setStepTwoError('')
      if (contactsSelected.length <= 0 && listsSelected.length <= 0) {
        throw new Error('You need at least one contact or one list selected.')
      }
      const { data: campaignUpdated } = await mainAPI.patch(`/campaigns/${campaignId}`, {
        share: {
          ...campaign.share,
          contacts: contactsSelected,
          lists: listsSelected,
        }
      })
      setCampaign(campaignUpdated)
    } catch (err) {
      console.log(err)
      throw setStepTwoError(err.message || 'An error has occured.')
    }
  }

  const removeThumbnail = async () => {
    await mediaAPI.delete('/', {
      data: {
        url: campaign.share.thumbnail,
      },
    })
    const { data: campaignUpdated } = await mainAPI.patch(`/campaigns/${campaignId}`, {
      share: {
        ...campaign.share,
        thumbnail: null,
      }
    })
    setCampaign(campaignUpdated)
  }

  const uploadThumbnail = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'thumbnails')
    formData.append('height', 720)
    formData.append('width', 1280)
    try {
      setThumbnailLoading(true)
      const { data: url } = await mediaAPI.post('/images', formData)
      if (campaign.share && campaign.share.thumbnail) {
        await mediaAPI.delete('/', {
          data: {
            url: campaign.share.thumbnail,
          },
        })
      }
      const { data: campaignUpdated } = await mainAPI.patch(`/campaigns/${campaignId}`, {
        share: {
          ...campaign.share,
          thumbnail: url,
        }
      })
      setCampaign(campaignUpdated)
    } catch (err) {
      console.log(err)
      const code = err.response && err.response.data
      if (code === 'Upload.incorrectFiletype') {
        setStepOneError('Only .jpg and .png images are accepted.')
      } else {
        setStepOneError('Thumbnail upload failed.')
      }
    } finally {
      setThumbnailLoading(false)
      setTimeout(() => setStepOneError(''), 5000)
    }
  }

  const renderContact = (contact) => (
    contact
      ?
      <div
        className={styles.contactsItem}
        key={contact._id}
      >
        <input
          checked={contactsSelected.includes(contact._id)}
          onChange={handleSelectedContact}
          type="checkbox"
          value={contact._id}
        />
        <p>{contact.firstName}</p>
        <p>{contact.company}</p>
        <p>{contact.job}</p>
        <p>{contact.email}</p>
      </div>
      :
      <div className={`${styles.contactsItem} ${styles.empty}`}>
        <p>No contacts found</p>
      </div>
  )

  const renderList = (list) => (
    list
      ?
      <div
        className={styles.listsItem}
        key={list._id}
      >
        <input
          checked={listsSelected.includes(list._id)}
          onChange={handleSelectedList}
          type="checkbox"
          value={list._id}
        />
        <p>#{list.uniqueId}</p>
        <p>{list.name}</p>
        <p>{list.list.length} contacts</p>
      </div>
      :
      <div className={`${styles.listsItem} ${styles.empty}`}>
        <p>No lists found</p>
      </div>
  )
  
  return (
    <div className={styles.shareCampaign}>

      { popup.display === 'IMPORT_CONTACTS' && 
        <PopupImportContacts
          me={me}
          onDone={() => {
            getContacts()
            hidePopup()
          }}
        />
      }

      <div className={styles.backdrop} />
      <div className={styles.box}>
        <div className={styles.header}>
          <p className={styles.headerTitle}>Your campaign video</p>
          <img
            onClick={onClose}
            src="/assets/common/close.svg"
          />
        </div>
        <div className={styles.steps}>
          <div className={`${styles.step} ${step === 1 ? styles.current : ''} ${step > 1 ? styles.valid : ''}`}>
            <p>Details</p>
            <div className={styles.stepStatus}>
              <img src="/assets/common/doneWhite.svg" />
            </div>
          </div>
          <div className={`${styles.step} ${step === 2 ? styles.current : ''} ${step > 2 ? styles.valid : ''}`}>
            <p>Contacts</p>
            <div className={styles.stepStatus}>
              <img src="/assets/common/doneWhite.svg" />
            </div>
          </div>
          <div className={`${styles.step} ${step === 3 ? styles.current : ''}`}>
            <p>Confirmation</p>
            <div className={styles.stepStatus}>
              <img src="/assets/common/doneWhite.svg" />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          { step === 1 && 
            <form
              className={styles.stepOne}
              ref={refFormDetails}
            >
              <p className={styles.title}>Details</p>
              {/* <div>
                <label>Subject*</label>
                <input
                  onChange={(e) => setFormDetails({
                    ...formDetails,
                    subject: e.target.value,
                  })}
                  required
                  type="text"
                  value={formDetails.subject}
                />
              </div>
              <div>
                <label>From*</label>
                <input
                  onChange={(e) => setFormDetails({
                    ...formDetails,
                    from: e.target.value,
                  })}
                  required
                  type="text"
                  value={formDetails.from}
                />
              </div> */}
              <div>
                <label>Your message*</label>
                <textarea
                  onChange={(e) => setFormDetails({
                    ...formDetails,
                    message: e.target.value,
                  })}
                  required
                  type="text"
                  value={formDetails.message}
                />
              </div>
              <div className={styles.uploadThumbnail}>
                <label>Thumbnail</label>
                <p className={styles.text}>Import an image that previews the content of your video.<br/>If you don't import a thumbnail, a default image will be included.</p>
                <label
                  className={styles.uploadThumbnailArea}
                  htmlFor="thumbnail"
                >
                  <img src="/assets/common/thumbnail.svg" />
                  { !thumbnailLoading && <p>Download image</p> }
                  { thumbnailLoading && <p>Downloading...</p> }
                </label>
                <input
                  accept="image/*"
                  id="thumbnail"
                  type="file"
                  onChange={(e) => uploadThumbnail(e.target.files[0])}
                  className={styles.uploadThumbnailInput}
                />
                <img
                  className={styles.uploadThumbnailPreview}
                  src={campaign.share && campaign.share.thumbnail ? campaign.share.thumbnail : '/assets/video/defaultThumbnail.jpg'}
                />
                { campaign.share && campaign.share.thumbnail &&
                  <p
                    className={styles.removeThumbnail}
                    onClick={removeThumbnail}
                  >
                    Remove thumbnail
                  </p>
                }
                <p className={styles.uploadThumbnailRecoSize}>(Recommended size: 1280x720)</p>
              </div>
              <p className={styles.error}>{stepOneError}</p>
            </form>
          }
          { step === 2 &&
            <div className={styles.stepTwo}>
              <div>
                <div className={styles.sectionHeaderContacts}>
                  <p className={styles.title}>Add from your contacts</p>
                  <div className={styles.search}>
                    <img src="/assets/common/search.svg" />
                    <input
                      placeholder="Search"
                      onChange={(e) => searchContacts(e.target.value)}
                    />
                  </div>
                  <Button
                    color="secondary"
                    onChange={extractDataFromCSV}
                    size="small"
                    type="file"
                  >
                    Import contacts
                  </Button>
                </div>
                <div className={styles.contactsHeader}>
                  <div />
                  <p>First name</p>
                  <p>Company</p>
                  <p>Job</p>
                  <p>Email</p>
                </div>
                <div className={styles.contactsList}>
                  {contacts.totalDocs > 0 && contacts.docs.map(contact => renderContact(contact))}
                  {!contacts.totalDocs && contacts.length > 0 && contacts.map(contact => renderContact(contact))}
                  {(contacts.totalDocs <= 0 || (!contacts.totalDocs && contacts.length <= 0)) && renderContact()}
                </div>
              </div>
              <div>
                <div className={styles.sectionHeaderLists}>
                  <p className={styles.title}>Add from your lists</p>
                  <div className={styles.search}>
                    <img src="/assets/common/search.svg" />
                    <input
                      placeholder="Search"
                      onChange={(e) => searchLists(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.listsHeader}>
                  <div />
                  <p>ID</p>
                  <p>Name</p>
                  <p>Number of contacts</p>
                </div>
                <div className={styles.listsList}>
                  {lists.totalDocs > 0 && lists.docs.map(list => renderList(list))}
                  {!lists.totalDocs && lists.length > 0 && lists.map(list => renderList(list))}
                  {(lists.totalDocs <= 0 || (!lists.totalDocs && lists.length <= 0)) && renderList()}
                </div>
              </div>
              {stepTwoError && <p className={styles.error}>{stepTwoError}</p>}
            </div>
          }
          { step === 3 &&
            <div className={styles.stepThree}>
              <p className={styles.title}>Your video is ready to send.</p>
              <p className={styles.text}>Review the summary below before sending your video.</p>
              <div className={styles.summary}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryItemHeader}>
                    <div className={styles.summaryChecked}>
                      <img src="/assets/common/doneWhite.svg" />
                    </div>
                    <p>Details</p>
                    <span onClick={() => setStep(1)}>Return to this step</span>
                  </div>
                  <div className={styles.summaryItemContent}>
                    <p><b>Subject: </b>{campaign.share.subject}</p>
                    <p><b>From: </b>{campaign.share.from}</p>
                    <p><b>Message: </b>{campaign.share.message}</p>
                    <div>
                      <p><b>Thumbnail: </b></p>
                      <img
                        className={styles.summaryThumbnailPreview}
                        src={campaign.share && campaign.share.thumbnail ? campaign.share.thumbnail : '/assets/video/defaultThumbnail.jpg'}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryItemHeader}>
                    <div className={styles.summaryChecked}>
                      <img src="/assets/common/doneWhite.svg" />
                    </div>
                    <p>Contacts</p>
                    <span onClick={() => setStep(2)}>Return to this step</span>
                  </div>
                  <div className={styles.summaryItemContent}>
                    <p><b>Contacts: </b>{campaign.share.contacts.length} selected</p>
                    <p><b>Lists: </b>{campaign.share.lists.length} selected</p>
                  </div>
                </div>
              </div>
              {stepThreeError && <p className={styles.error}>{stepThreeError}</p>}
            </div>
          }
        </div>
        <div className={styles.footer}>
          <div>
            { step > 1 && <Button outline={true} onClick={() => setStep(step - 1)}>Back</Button> }
          </div>
          <div>
            { step < 3 && <Button onClick={next}>Next</Button> }
            { step === 3 && 
              <Button
                loading={shareLoading}
                onClick={share}
              >
                Share
              </Button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Share