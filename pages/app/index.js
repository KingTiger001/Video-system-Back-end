import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import AppLayout from '@/layouts/AppLayout'

import Button from '@/components/Button'
import ListHeader from '@/components/ListHeader'
import ListItem from '@/components/ListItem'
import PopupWelcome from '@/components/Popups/PopupWelcome'
import Stat from '@/components/Stat'

import styles from '@/styles/pages/app/dashboard.module.sass'

const Dashboard = ({
  campaignsDraft = [],
  campaignsShared = [],
  contactsCount = 0,
  me,
  stats = {},
}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const createCampaign = async () => {
    const { data: campaign } = await mainAPI.post('/campaigns')
    router.push(`/app/campaigns/${campaign._id}`)
  }

  const displayDuration = (value) => {
    if (!value) {
      return '00:00'
    }
    const t = dayjs.duration(parseInt(value, 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }

  const renderCampaignsHeader = ({ draft = false }) => (
    <ListHeader
      className={`${styles.campaignsHeader} ${draft ? styles.draft : ''}`}
    >
      <p>ID</p>
      <p>Video name</p>
      <p>{draft ? 'Creation date' : 'Sent date'}</p>
      {!draft && <p>Recipients</p>}
      {!draft && <p>Duration</p>}
      <p>Actions</p>
    </ListHeader>
  )
  const renderCampaignsItem = (campaign) => (
    <ListItem
      className={`${styles.campaignsItem} ${campaign.status === 'draft' ? styles.draft : ''}`}
      key={campaign._id}
      renderActions={() => (
        <div>
          { campaign.status === 'draft' &&
            <Link href={`/app/campaigns/${campaign._id}`}>
              <a>Edit</a>
            </Link>
          }
          { campaign.status === 'shared' &&
            <Link href={`/analytics/${campaign._id}`}>
              <a>Report</a>
            </Link>
          }
        </div>
      )}
    >
      <p><b>#{campaign.uniqueId}</b></p>
      <p>{campaign.name}</p>
      <p>{dayjs(campaign.status === 'draft' ? campaign.createdAt : campaign.sentAt).format('MM/DD/YYYY')}</p>
      {campaign.status === 'shared' && <span>{campaign.share.contacts && campaign.share.contacts.length}</span>}
      {campaign.status === 'shared' && <p>{displayDuration(campaign.duration)}</p>}
    </ListItem>
  )

  return (
    <AppLayout>
      <Head>
        <title>Dashboard | FOMO</title>
      </Head>

      { (!me.popups || !me.popups.welcome) && 
        <PopupWelcome
          onClose={() => {
            mainAPI.patch('/users/me', { 'popups.welcome': 1 })
            hidePopup()
          }}
        />
      }

      <div className={styles.container}>
        <h1 className={styles.title}>Hello {me.firstName} 👋</h1>
        <div className={styles.stats}>
          <p className={styles.statsTitle}>Your statistics</p>
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
            text="Reply rate"
            unit="%"
            value={stats.replyRate}
          />
        </div>
        <div className={styles.campaignsAndButtons}>
          <div className={styles.campaigns}>
            <p className={styles.campaignsTitle}>Campaign Drafts</p>
            {renderCampaignsHeader({ draft: true })}
            <div>
              {campaignsDraft.length > 0 && campaignsDraft.map((campaign) => renderCampaignsItem(campaign))}
            </div>
            <div className={styles.campaignsFooter}>
              <Link href="/app/campaigns">
                <a>See all my videos campaigns</a>
              </Link>
            </div>
          </div>
          <div className={styles.createCampaign}>
            <Button
              color="white"
              onClick={createCampaign}
            >
              Create a video campaign
            </Button>
          </div>
          <div className={styles.importContacts}>
            <Button
              href="/app/contacts"
              outline={true}
              type="link"
            >
              Import contacts
            </Button>
          </div>
        </div>
        <div className={styles.campaigns}>
          <p className={styles.campaignsTitle}>My Video Campaigns</p>
          {renderCampaignsHeader({ draft: false })}
          <div>
            {campaignsShared.length > 0 && campaignsShared.map((campaign) => renderCampaignsItem(campaign))}
          </div>
          <div className={styles.campaignsFooter}>
            <Link href="/app/campaigns">
              <a>See all my videos campaigns</a>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard
export const getServerSideProps = withAuthServerSideProps(async () => {
  const CAMPAIGNS_LIMIT = 5
  const { data: campaignsDraft } = await mainAPI.get(`/users/me/campaigns?status=draft&limit=${CAMPAIGNS_LIMIT}`)
  const { data: campaignsShared } = await mainAPI.get(`/users/me/campaigns?status=shared&limit=${CAMPAIGNS_LIMIT}`)
  const { data: contactsCount } = await mainAPI.get('/users/me/contacts/count')
  const { data: stats } = await mainAPI.get('/users/me/analytics/stats')

  return {
    campaignsDraft,
    campaignsShared,
    contactsCount,
    stats
  }
})