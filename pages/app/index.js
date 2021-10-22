import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import AppLayout from '@/layouts/AppLayout'

import Button from '@/components/Button'
import ListHeader from '@/components/ListHeader'
import ListItem from '@/components/ListItem'
import Preview from '@/components/Campaign/Preview'
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

  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [campaignPreviewed, setCampaignPreviewed] = useState(null)

  const displayDuration = (value) => {
    if (!value) {
      return '0:00'
    }
    const t = dayjs.duration(parseInt(Math.round(value), 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m}:${s < 10 ? `0${s}` : s}`
  }

  const sendEmailConfirmation = async () => {
    if (!me.emailConfirmationExpires || dayjs(me.emailConfirmationExpires).diff(dayjs(), 'minute') > 5) {
      await mainAPI.post('/auth/email/confirmation/new', { userId: me._id })
    } 
    toast.success('Email sent.')
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
          { campaign.status === 'draft' &&
            <button onClick={() => setCampaignPreviewed(campaign)}>Preview</button>
          }
          { campaign.status === 'shared' &&
            <Link href={`/app/analytics?c=${campaign._id}`}>
              <a>Analytics</a>
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

      <div className={styles.container}>
        <h1 className={styles.title}>Hello {me.firstName}</h1>
        { (!me.emailConfirmed || contactsCount <= 0) && 
          <div className={styles.welcome}>
            <p className={styles.welcomeTitle}>Welcome to your dasboard !</p>
            <p className={styles.welcomeSubtitle}>To send your first video campaign, you will have to:</p>
            <ul className={styles.welcomeList}>
              { !me.emailConfirmed && 
                <li className={styles.welcomeListItem}>
                  <div ><span/></div>
                  <p className={styles.welcomeVerify}>Verify your email address</p>
                  <span>We sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click on the confirmation link. If you didn't receive it, <a onClick={sendEmailConfirmation}>click here to resend activation link</a></span>
                </li>
              }
              { contactsCount <= 0 &&
                <li className={styles.welcomeListItem}>
                  <div ><span/></div>
                  <Link href="/app/contacts">
                    <p className={styles.welcomeContact}>Import your first contacts</p>
                  </Link>
                  <span>You can import your contacts now or later.</span>
                </li>
              }
            </ul>
          </div>
        }
        <div className={styles.stats}>
          <p className={styles.statsTitle}>Your analytics</p>
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
              onClick={() => showPopup({ display: 'CREATE_CAMPAIGN' })}
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


        { campaignPreviewed &&
          <Preview
            campaign={campaignPreviewed}
            onClose={() => setCampaignPreviewed(null)}
          />
        }
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
/*   const { data: stats } = await mainAPI.get('/users/me/analytics/stats')
 */
  return {
    campaignsDraft,
    campaignsShared,
    contactsCount,
    /* stats */
  }
})