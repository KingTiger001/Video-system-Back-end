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

  const totalCTA = campaignsShared.map(campaign => campaign.contents.reduce((acc, data) => 
  (data.links.length > 0 ? acc + data.links.length : acc), 0)).reduce((a, b) => a + b, 0) * initialAnalytics.length

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
          className={`${campaign != selectedCampaign ? 
            styles.unactiveCampaignItem : styles.activeCampaignItem}`}
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
      <div className={styles.campaignGlobalAnalytic}>
      <ListItem 
      className={styles.campaignHeader}
      renderActions={() => (
      <div className={styles.displayIcon}>
        <button
          src="/assets/analytics/DashBoard.svg"
          onClick={() => setShowByContact(false)}>Global</button>
        <button
          src="/assets/analytics/byContacts.svg"
          onClick={() => setShowByContact(true)}>Contact</button>
      </div>
      )}>
        <p className={styles.title}>{campaign && campaign.name}</p>
      </ListItem>
      </div>
      )}

  const displayCampaignAnalytics = (campaign) => {

    const totalOpened = analytics.filter(analytic => analytic.openedCount?.length > 0).length
    const totalCTA = analytics.length * campaign.contents.reduce((acc, data) => 
    (data.links.length > 0 ? acc + data.links.length : acc), 0);
    const arrayClickedCTA = analytics.filter(analytic => analytic.clickedLinks?.length > 0)
    .map(a => [...new Set(a.clickedLinks)].length)
    const totalClickedCTA = arrayClickedCTA.reduce((a, b) => a + b, 0)

    return (
        <div className={styles.stats}>
        <Stat
          text="Recipients"
          value="0"
          value={campaign.sentCount}
        />
        <Stat
          text="Video opening rate"
          unit="%"
          value={Math.round(totalOpened / analytics.length * 100)}
        />
        <Stat
          text="Average view duration"
          unit="%"
          value={stats.averageViewDuration ? stats.averageViewDuration * 1000 : 0}
        />
        <Stat
          text="Links click through rate"
          unit="%"
          value={totalCTA > 0 ? 
            totalClickedCTA ? Math.round((totalClickedCTA / totalCTA) * 100) : 0
          : ' - '}
        />
      </div>
    )
  }

  const displayLinkDetails = (analytic, link) => {
    const clicks = analytic.clickedLinks ? analytic.clickedLinks.filter((l) => l === link._id).length : '-';
    return (
      <div className={styles.CTADetail}>
        <p>Clicks <b>{clicks}</b></p>
        <p>{link.url}</p>
      </div>
    )
  }

  const displayAnalyticsByContacts = (analytic) => {

    const displayReport = detailedContacts.includes(analytic.sentTo._id);
    const totalCTA = analytic.campaign.contents.reduce((acc, data) => 
    (data.links.length > 0 ? acc + data.links.length : acc), 0);
    const totalClickedCTA = [...new Set(analytic.clickedLinks)]

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
          {analytic.openedCount.length === 0 ? 
          <p className={styles.badAnalytic}><b>USEEN</b></p> :
          <p className={styles.goodAnalytic}><b>OPEN</b></p>}
          <p>{ analytic.openedCount.length === 0 ? '-' : analytic.viewDuration ? 
           analytic.viewDuration + '%' : '0%'}</p>
          <p>{ totalCTA > 0 ? 
          analytic.openedCount.length !== 0 ? (analytic.clickedLinks?.length > 0 ? totalClickedCTA.length+'/'+totalCTA : '0/'+totalCTA) : '-'
        : 'No Links'}</p>
        </ListItem>
        {displayReport && 
          <ListItem 
            className={styles.analyticDetails}>
            <div></div>
            <div>
              <p>{analytic.sentTo && analytic.sentTo.firstName + ' ' + analytic.sentTo.lastName}</p>
              <p>{analytic.sentTo && analytic.sentTo.company}</p>
            </div>
            <p>Views : <b>{analytic.openedCount.length === 0 ? '-' : analytic.openedCount.length}</b></p>
            <p><b>{analytics.viewDurations ? displayDuration(analytic.viewDurations) : '-'}</b></p>
            <div>
              {totalCTA > 0 ? analytic.campaign.contents.map((content) => 
                content.links.map(link => displayLinkDetails(analytic, link))) : '-'}
            </div>
          </ListItem>}
      </div>
      )
    }

    console.log(stats, totalCTA)
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
          value={stats.videoOpeningRate}
        />
        <Stat
          text="Average view duration"
          unit="%"
          value={stats.averageViewDuration ? stats.averageViewDuration * 1000 : 0}
        />
        <Stat
          text="Links click through rate"
          unit="%"
          value={Math.round((stats.totalLinksClicked / totalCTA) * 100)}
        />
      </div>}
      </div>
      <div className={styles.campaignAnalytics}>
        <div>
          { selectedCampaign && 
          displayCampaignInformations(selectedCampaign)}
        </div>
        <div>
          { selectedCampaign && !showByContact &&
          displayCampaignAnalytics(selectedCampaign)}
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
export const getServerSideProps = withAuthServerSideProps(async () => {
  const { data: campaignsShared } = await mainAPI.get(`/users/me/campaigns?status=shared`)
  const { data: contactsCount } = await mainAPI.get('/users/me/contacts/count')
  const { data: initialAnalytics } = await mainAPI.get('/users/me/analytics')
  const { data: stats } = await mainAPI.get('/users/me/analytics/stats')
  return {
    campaignsShared,
    initialAnalytics,
    contactsCount,
    stats,
  }
})