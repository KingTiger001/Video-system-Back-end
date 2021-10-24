import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'

import ListHeader from '@/components/ListHeader'
import ListItem from '@/components/ListItem'
import Stat from '@/components/Stat'


import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/app/analytics.module.sass'
import Button from '@/components/Button';


const Analytics = ({ initialAnalytics,
  campaignsShared,
  contactsCount= 0,
  stats = {} }) => {
  const router = useRouter()

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignPreviewed, setCampaignPreviewed] = useState(null)
  const [analytics, setAnalytics] = useState(initialAnalytics)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [detailedContacts, setDetailedContacts] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [showByContact, setShowByContact] = useState(false)

  const displayDuration = (value) => {
    if (!value) {
      return '0:00'
    }
    const t = dayjs.duration(parseInt(Math.round(value), 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m}:${s < 10 ? `0${s}` : s}`
  }

  
  useEffect(() => {
    const campaignId = router.query.c
    if (campaignId) {
      setSelectedCampaign(campaignsShared.find((c) => c._id === campaignId))
      setAnalytics(Object.values(initialAnalytics)
      .filter((a) => a.campaign._id === campaignId))
    }
  }, [])

  const refreshSelectedCampaign = (campaign) => {
    setSelectAllChecked(false)
    setDetailedContacts([])
    setSelectedContacts([])
    if (campaign !== selectedCampaign) {
      setAnalytics(Object.values(initialAnalytics)
      .filter((a) => a.campaign._id === campaign._id))
      setSelectedCampaign(campaign)
    } else {
      setAnalytics([])
      setSelectedCampaign(null)
    }
  }

  const selectOne = (e) => {
    const contactId = e.target.value;
    setSelectedContacts(
    e.target.checked
      ? [...selectedContacts, contactId]
      : selectedContacts.filter((c) => c !== contactId)
    );
  };

  const selectAll = (e) => {
    selectAllChecked ? setSelectAllChecked(false) : setSelectAllChecked(true)
    setSelectedContacts(
      e.target.checked ? analytics.map((a) => a.sentTo._id) : []
    );
  };

  const renderCampaigns = (campaign = {}) => {
      
    const empty= Object.keys(campaign).length > 0 ? false : true

    return empty ? 
      <Button
        color={'white'}
        type={'div'}
        className={styles.unactiveCampaignItem}>
          <p>no campaigns yet.</p>
      </Button> :
      <div>
        <Button
          color={'white'}
          type={'div'}
          className={`${campaign != selectedCampaign ? styles.unactiveCampaignItem : styles.activeCampaignItem}`}
          onClick={() => refreshSelectedCampaign(campaign)}>
            <p>{campaign && campaign.name}</p>
        </Button>
        
        {campaignPreviewed && (
          <Preview 
            campaign={campaignPreviewed}
            onClose={() => setCampaignPreviewed(null)} />
        )}
      </div>        
    }
        
  const displayCampaignInformations = (campaign) => {
      
    return (
      <div>
      <ListItem 
      className={styles.campaignInformations}
      renderActions={() => (
      <div className={styles.displayIcon}>
        <button
          src="/assets/analytics/DashBoard.svg"
          onClick={() => setShowByContact(false)}>Genral</button>
        <button
          src="/assets/analytics/byContacts.svg"
          onClick={() => setShowByContact(true)}>Contact</button>
      </div>
      )}>
        <p className={styles.campaignName}>{campaign && campaign.name}</p>
      </ListItem>
      { !showByContact && 
        <div className={styles.stats}>
        <Stat
          text="Contacts"
          value="0"
          value={contactsCount}
        />
        <Stat
          text="Video opening rate"
          unit="%"
          value={stats.openingRate}
        />
        <Stat
          text="Average view duration"
          unit="s"
          value={displayDuration(stats.averageViewDuration * 1000)}
        />
        <Stat
          text="Reply button click through rate"
          unit="%"
          value={stats.replyRate}
        />
      </div>}
      </div>
      )}

  const displayAnalyticsByContacts = (analytic) => {

    const displayReport = detailedContacts.includes(analytic.sentTo._id);
      
    return (
      <div className={styles.analyticItem}>
        <ListItem
        className={styles.analyticItemDetails}
        renderActions={() => 
        <button onClick={() => setDetailedContacts( displayReport ? 
          detailedContacts.filter((c) => c !== analytic.sentTo._id)
          : [...detailedContacts, analytic.sentTo._id])}>
          {displayReport ? 'Close Details' : 'Details'}</button>}>
          <input
            type="checkbox"
            value={analytic.sentTo._id}
            onChange={selectOne}
            checked={selectedContacts.includes(analytic.sentTo._id)}
          />
          <p>{analytic.sentTo && analytic.sentTo.email}</p>
          <p>OPEN</p>
          <p>100%</p>
          <p>2/2</p>
        </ListItem>
        {displayReport && 
          <ListItem 
            className={styles.analyticDetails}>
            <div>
              <p>{analytic.sentTo && analytic.sentTo.firstName + ' ' + analytic.sentTo.lastName}</p>
              <p>{analytic.sentTo && analytic.sentTo.company}</p>
            </div>
          </ListItem>}
      </div>
      )
    }

  return (
    <AppLayout>
      <Head>
        <title>Analytics | FOMO</title>
      </Head>

        <div className={styles.campaignsListContainer}>
          <div className={layoutStyles.container}>
            <div>
              <div className={layoutStyles.header}>
                  <div className={layoutStyles.headerTop}>
                      <h1 className={layoutStyles.headerTitle}>Analytics</h1>
                  </div>
              </div>
              <div className={styles.campaignsList}>
              { Object.values(campaignsShared).length > 0 && Object.values(campaignsShared).map((campaign) => renderCampaigns(campaign)) }
              { Object.values(campaignsShared).length <= 0 && renderCampaigns() }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.generalDashboard}>
        { !selectedCampaign && 
        <div className={styles.stats}>
        <p className={styles.statsTitle}>General analytics</p>
        <Stat
          text="Contacts"
          value="0"
          value={contactsCount}
        />
        <Stat
          text="Video opening rate"
          unit="%"
          value={stats.openingRate}
        />
        <Stat
          text="Average view duration"
          unit="s"
          value={displayDuration(stats.averageViewDuration * 1000)}
        />
        <Stat
          text="Reply button click through rate"
          unit="%"
          value={stats.replyRate}
        />
      </div>}
      </div>
      <div className={styles.campaignAnalytics}>
        <div>
          { selectedCampaign && 
          displayCampaignInformations(selectedCampaign)}
        </div>
        
        <div className={styles.analyticsByContact}>
          {selectedCampaign && showByContact && 
          <ListHeader className={styles.analyticsByContactHeader}>
            <input type="checkbox" onChange={selectAll} checked={selectAllChecked}/>
            <div><p>Email</p></div>
            <div><p>State</p></div>
            <div><p>Watch Time</p></div>
            <div><p>CTA</p></div>
          </ListHeader>}
          {selectedCampaign && showByContact && analytics.map((a) => displayAnalyticsByContacts(a))}
        </div>
      </div>

  
    </AppLayout>
  )
}

export default Analytics
export const getServerSideProps = withAuthServerSideProps(async ({ query }) => {
  const { data: campaignsShared } = await mainAPI.get(`/users/me/campaigns?status=shared`)
  const { data: contactsCount } = await mainAPI.get('/users/me/contacts/count')
  let { data: initialAnalytics } = await mainAPI.get('/users/me/analytics')
  return {
    campaignsShared,
    initialAnalytics,
  }
})