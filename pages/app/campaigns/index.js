import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuth from '@/hocs/withAuth'
import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import AppLayout from '@/layouts/AppLayout'

import ListHeader from '@/components/ListHeader'
import ListItem from '@/components/ListItem'
import PopupDeleteCampaign from '@/components/Popups/PopupDeleteCampaign'
import PopupDuplicateCampaign from '@/components/Popups/PopupDuplicateCampaign'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/app/campaigns.module.sass'

const Campaigns = ({ initialCampaignsDraft, initialCampaignsShared }) => {
  const router = useRouter()
  
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [campaignsDraft, setCampaignsDraft] = useState(initialCampaignsDraft)
  const [campaignsShared, setCampaignsShared] = useState(initialCampaignsShared)

  const getCampaigns = async () => {
    const { data: campaignsDraftUpdated } = await mainAPI.get('/users/me/campaigns?status=draft')
    const { data: campaignsSharedUpdated } = await mainAPI.get('/users/me/campaigns?status=shared')
    setCampaignsDraft(campaignsDraftUpdated)
    setCampaignsShared(campaignsSharedUpdated)
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

  const renderListHeader = ({ draft = false }) => (
    <ListHeader className={styles.campaignsHeader}>
      <p>ID</p>
      <p>Video name</p>
      <p>{draft ? 'Creation date' : 'Sent date'}</p>
      <p>Recipients</p>
      <p>Duration</p>
      <p>Actions</p>
    </ListHeader>
  )

  const renderCampaign = (campaign = {}) => (
    <ListItem
      className={styles.campaignsItem}
      empty={Object.keys(campaign).length > 0 ? false : true}
      key={campaign._id}
      renderActions={() => (
        <div>
          { campaign.status === 'draft' &&
            <Link href={`/app/campaigns/${campaign._id}`}>
              <a>Edit</a>
            </Link>
          }
          { campaign.status === 'draft' &&
            <Link href={`/app/campaigns/${campaign._id}`}>
              <a>Preview</a>
            </Link>
          }
          { campaign.status === 'draft' &&
            <Link href={`/app/campaigns/${campaign._id}`}>
              <a>Share</a>
            </Link>
          }
          { campaign.status === 'shared' &&
            <Link href={`/analytics/${campaign._id}`}>
              <a>Report</a>
            </Link>
          }
          { campaign.status === 'shared' &&
            <button onClick={() => showPopup({ display: 'DUPLICATE_CAMPAIGN', data: campaign })}>
              Duplicate
            </button>
          }
          { campaign.status === 'shared' &&
            <Link href={`/campaigns/${campaign._id}`}>
              <a>Preview</a>
            </Link>
          }
        </div>
      )}
      renderDropdownActions={() => (
        <ul>
          <li onClick={() => showPopup({ display: 'DELETE_CAMPAIGN', data: campaign })}>
            <p>Delete</p>
          </li>
        </ul>
      )}
      renderEmpty={() => (
        <p>No videos found.</p>
      )}
    >
      <p><b>#{campaign.uniqueId}</b></p>
      <p>{campaign.name}</p>
      <p>{dayjs(campaign.status === 'draft' ? campaign.createdAt : campaign.sentAt).format('MM/DD/YYYY')}</p>
      <p>0</p>
      <p>{displayDuration(campaign.duration)}</p>
    </ListItem>
  )

  return (
    <AppLayout>
      <Head>
        <title>Campaigns | FOMO</title>
      </Head>
      
      { popup.display === 'DELETE_CAMPAIGN' && 
        <PopupDeleteCampaign
          onDone={() => {
            getCampaigns()
            hidePopup()
          }}
        />
      }
      { popup.display === 'DUPLICATE_CAMPAIGN' && 
        <PopupDuplicateCampaign
          onDone={() => {
            getCampaigns()
            hidePopup()
          }}
        />
      }

      <div className={layoutStyles.container}>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>My video campaigns</h1>
          </div>
        </div>
        
        <p className={styles.videosDraftTitle}>Videos drafts</p>

        <div className={styles.campaigns}>
          {renderListHeader({ draft: true })}
          <div className={styles.campaignsList}>
            { campaignsDraft.length > 0 && campaignsDraft.map((campaign) => renderCampaign(campaign)) }
            { campaignsDraft.length <= 0 && renderCampaign() }
          </div>
        </div>
        
        <p className={styles.videosSentTitle}>Videos sent</p>

        <div className={styles.campaigns}>
          {renderListHeader({})}
          <div className={styles.campaignsList}>
            { campaignsShared.length > 0 && campaignsShared.map((campaign) => renderCampaign(campaign)) }
            { campaignsShared.length <= 0 && renderCampaign() }
          </div>
        </div>
      </div>
  
    </AppLayout>
  )
}

export default withAuth(Campaigns)
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
  const { data: initialCampaignsDraft } = await mainAPI.get('/users/me/campaigns?status=draft')
  const { data: initialCampaignsShared } = await mainAPI.get('/users/me/campaigns?status=shared')
  return {
    initialCampaignsDraft,
    initialCampaignsShared,
  }
})